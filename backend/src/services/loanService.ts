import { query } from '../db/connection';
import { Loan, LoanSchedule } from '../types';
import { generateLoanNumber, calculateLoanSchedule, calculateInterest } from '../utils/helpers';

export class LoanService {
  async createLoan(loanData: any): Promise<Loan> {
    const loanNumber = generateLoanNumber();
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + loanData.loan_term_months);

    const totalInterest = calculateInterest(loanData.principal_amount, loanData.interest_rate, loanData.loan_term_months);
    const totalAmountDue = loanData.principal_amount + totalInterest + (loanData.total_charges || 0);

    const result = await query(
      `INSERT INTO loans (
        loan_number, borrower_id, branch_id, loan_officer_id, principal_amount,
        interest_rate, loan_term_months, maturity_date, status, loan_purpose,
        repayment_frequency, total_interest, total_charges, total_amount_due, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *`,
      [
        loanNumber,
        loanData.borrower_id,
        loanData.branch_id,
        loanData.loan_officer_id,
        loanData.principal_amount,
        loanData.interest_rate,
        loanData.loan_term_months,
        maturityDate,
        'PENDING',
        loanData.loan_purpose,
        loanData.repayment_frequency || 'MONTHLY',
        totalInterest,
        loanData.total_charges || 0,
        totalAmountDue,
        loanData.created_by,
      ]
    );

    return result.rows[0];
  }

  async getLoanById(id: number): Promise<Loan> {
    const result = await query('SELECT * FROM loans WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new Error('Loan not found');
    }
    return result.rows[0];
  }

  async getLoansByBorrower(borrowerId: number): Promise<Loan[]> {
    const result = await query('SELECT * FROM loans WHERE borrower_id = $1 ORDER BY created_at DESC', [borrowerId]);
    return result.rows;
  }

  async getAllLoans(status?: string, branchId?: number): Promise<Loan[]> {
    let sql = 'SELECT * FROM loans WHERE 1=1';
    const params: any[] = [];

    if (status) {
      sql += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    if (branchId) {
      sql += ` AND branch_id = $${params.length + 1}`;
      params.push(branchId);
    }

    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    return result.rows;
  }

  async approveLoan(loanId: number, approvedAmount: number, approvalComments: string, userId: number): Promise<Loan> {
    // Insert approval record
    await query(
      `INSERT INTO loan_approvals (loan_id, approval_date, approved_by, approval_amount, approval_status, approval_comments)
       VALUES ($1, CURRENT_DATE, $2, $3, 'APPROVED', $4)`,
      [loanId, userId, approvedAmount, approvalComments]
    );

    // Update loan status
    const result = await query(
      'UPDATE loans SET status = $1, updated_at = NOW(), updated_by = $2 WHERE id = $3 RETURNING *',
      ['APPROVED', userId, loanId]
    );

    return result.rows[0];
  }

  async disburseLoan(loanId: number, disbursementDate: Date, userId: number): Promise<Loan> {
    // Insert disbursement record
    const loan = await this.getLoanById(loanId);

    await query(
      `INSERT INTO loan_disbursements (loan_id, disbursement_date, amount, created_by)
       VALUES ($1, $2, $3, $4)`,
      [loanId, disbursementDate, loan.principal_amount, userId]
    );

    // Create loan schedule
    const schedule = calculateLoanSchedule(loan.principal_amount, loan.interest_rate, loan.loan_term_months);

    for (const item of schedule) {
      await query(
        `INSERT INTO loan_schedules (
          loan_id, schedule_number, due_date, principal_amount,
          interest_amount, total_amount, balance_after_payment, is_paid
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, FALSE)`,
        [
          loanId,
          item.schedule_number,
          item.due_date,
          item.principal_amount,
          item.interest_amount,
          item.total_amount,
          item.total_amount,
        ]
      );
    }

    // Update loan status
    const result = await query(
      'UPDATE loans SET status = $1, disbursement_date = $2, updated_at = NOW(), updated_by = $3 WHERE id = $4 RETURNING *',
      ['DISBURSED', disbursementDate, userId, loanId]
    );

    return result.rows[0];
  }

  async getLoanSchedule(loanId: number): Promise<LoanSchedule[]> {
    const result = await query(
      'SELECT * FROM loan_schedules WHERE loan_id = $1 ORDER BY schedule_number ASC',
      [loanId]
    );
    return result.rows;
  }

  async updateLoanStatus(loanId: number, status: string, userId: number): Promise<Loan> {
    const result = await query(
      'UPDATE loans SET status = $1, updated_at = NOW(), updated_by = $2 WHERE id = $3 RETURNING *',
      [status, userId, loanId]
    );

    if (result.rows.length === 0) {
      throw new Error('Loan not found');
    }

    return result.rows[0];
  }
}
