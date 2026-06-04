import { query } from '../db/connection';
import { Repayment } from '../types';
import { generateRepaymentNumber, generateReceiptNumber } from '../utils/helpers';

export class RepaymentService {
  async recordRepayment(repaymentData: any): Promise<Repayment> {
    const repaymentNumber = generateRepaymentNumber();
    const receiptNumber = generateReceiptNumber();

    // Get loan details
    const loanResult = await query('SELECT * FROM loans WHERE id = $1', [repaymentData.loan_id]);
    if (loanResult.rows.length === 0) {
      throw new Error('Loan not found');
    }

    const loan = loanResult.rows[0];

    // Calculate payment breakdown
    const scheduleResult = await query(
      `SELECT * FROM loan_schedules WHERE loan_id = $1 AND is_paid = FALSE
       ORDER BY due_date ASC LIMIT 1`,
      [repaymentData.loan_id]
    );

    let principalPaid = repaymentData.principal_paid || 0;
    let interestPaid = repaymentData.interest_paid || 0;
    let chargesPaid = repaymentData.charges_paid || 0;

    if (scheduleResult.rows.length > 0 && !principalPaid) {
      const schedule = scheduleResult.rows[0];
      principalPaid = Math.min(repaymentData.amount_paid * 0.7, schedule.principal_amount);
      interestPaid = Math.min(repaymentData.amount_paid * 0.3, schedule.interest_amount);
    }

    // Calculate outstanding balance
    const outstandingResult = await query(
      `SELECT principal_amount - COALESCE(SUM(amount_paid), 0) as outstanding
       FROM loans LEFT JOIN repayments ON loans.id = repayments.loan_id
       WHERE loans.id = $1 GROUP BY loans.principal_amount`,
      [repaymentData.loan_id]
    );

    const balanceAfterPayment =
      (outstandingResult.rows[0]?.outstanding || loan.principal_amount) - repaymentData.amount_paid;

    const result = await query(
      `INSERT INTO repayments (
        repayment_number, loan_id, loan_schedule_id, repayment_date, amount_paid,
        principal_paid, interest_paid, charges_paid, balance_after_payment,
        payment_method, reference_number, collection_officer_id, status,
        receipt_number, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        repaymentNumber,
        repaymentData.loan_id,
        scheduleResult.rows[0]?.id || null,
        repaymentData.repayment_date,
        repaymentData.amount_paid,
        principalPaid,
        interestPaid,
        chargesPaid,
        Math.max(0, balanceAfterPayment),
        repaymentData.payment_method || 'CASH',
        repaymentData.reference_number,
        repaymentData.collection_officer_id,
        'PAID',
        receiptNumber,
        repaymentData.created_by,
      ]
    );

    // Update loan schedule if applicable
    if (scheduleResult.rows.length > 0) {
      await query(
        `UPDATE loan_schedules SET is_paid = TRUE, paid_date = $1, paid_amount = $2, status = 'PAID'
         WHERE id = $3`,
        [repaymentData.repayment_date, repaymentData.amount_paid, scheduleResult.rows[0].id]
      );
    }

    // Generate receipt
    await query(
      `INSERT INTO repayment_receipts (repayment_id, receipt_number, generated_by)
       VALUES ($1, $2, $3)`,
      [result.rows[0].id, receiptNumber, repaymentData.created_by]
    );

    return result.rows[0];
  }

  async getRepaymentHistory(loanId: number): Promise<Repayment[]> {
    const result = await query(
      'SELECT * FROM repayments WHERE loan_id = $1 ORDER BY repayment_date DESC',
      [loanId]
    );
    return result.rows;
  }

  async getRepaymentById(id: number): Promise<Repayment> {
    const result = await query('SELECT * FROM repayments WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Repayment not found');
    }
    return result.rows[0];
  }

  async getDailyCollectionSummary(branchId: number, date: Date): Promise<any> {
    const result = await query(
      `SELECT
        COUNT(DISTINCT r.loan_id) as num_transactions,
        SUM(r.amount_paid) as total_collected,
        SUM(r.principal_paid) as principal_collected,
        SUM(r.interest_paid) as interest_collected,
        COUNT(DISTINCT r.collection_officer_id) as num_collectors
       FROM repayments r
       JOIN loans l ON r.loan_id = l.id
       WHERE l.branch_id = $1 AND DATE(r.repayment_date) = $2`,
      [branchId, date]
    );

    return result.rows[0] || {};
  }
}
