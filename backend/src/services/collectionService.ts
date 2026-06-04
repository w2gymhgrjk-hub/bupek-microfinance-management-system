import { query } from '../db/connection';
import { Collection } from '../types';
import { calculateDaysOverdue } from '../utils/helpers';

export class CollectionService {
  async identifyOverdueLoans(): Promise<void> {
    // Find loans with unpaid schedules past due date
    const result = await query(`
      SELECT DISTINCT
        l.id,
        (CURRENT_DATE - MIN(ls.due_date)) as days_overdue,
        SUM(CASE WHEN ls.is_paid = FALSE THEN ls.total_amount ELSE 0 END) as total_overdue
      FROM loans l
      JOIN loan_schedules ls ON l.id = ls.loan_id
      WHERE l.status IN ('ACTIVE', 'DISBURSED')
      AND ls.is_paid = FALSE
      AND ls.due_date < CURRENT_DATE
      GROUP BY l.id
    `);

    // Insert or update overdue_loans records
    for (const loan of result.rows) {
      await query(
        `INSERT INTO overdue_loans (loan_id, days_overdue, total_overdue_amount, first_overdue_date, status)
         VALUES ($1, $2, $3, CURRENT_DATE, 'ACTIVE')
         ON CONFLICT (loan_id) DO UPDATE SET
         days_overdue = $2,
         total_overdue_amount = $3,
         updated_at = NOW()`,
        [loan.id, loan.days_overdue, loan.total_overdue]
      );
    }
  }

  async getOverdueLoans(branchId?: number): Promise<any[]> {
    let sql = `
      SELECT
        ol.*,
        l.loan_number,
        b.first_name || ' ' || b.last_name as borrower_name,
        b.phone as borrower_phone,
        l.principal_amount,
        l.branch_id
      FROM overdue_loans ol
      JOIN loans l ON ol.loan_id = l.id
      JOIN borrowers b ON l.borrower_id = b.id
      WHERE ol.status = 'ACTIVE'
    `;

    const params: any[] = [];

    if (branchId) {
      sql += ` AND l.branch_id = $${params.length + 1}`;
      params.push(branchId);
    }

    sql += ' ORDER BY ol.days_overdue DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  async createCollection(collectionData: any): Promise<Collection> {
    const result = await query(
      `INSERT INTO collections (
        loan_id, borrower_id, collection_date, amount_collected, outstanding_amount,
        collection_officer_id, collection_method, notes, status, days_overdue, days_in_arrears
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9, $10)
      RETURNING *`,
      [
        collectionData.loan_id,
        collectionData.borrower_id,
        collectionData.collection_date,
        collectionData.amount_collected,
        collectionData.outstanding_amount,
        collectionData.collection_officer_id,
        collectionData.collection_method,
        collectionData.notes,
        collectionData.days_overdue || 0,
        collectionData.days_in_arrears || 0,
      ]
    );

    return result.rows[0];
  }

  async addFollowUpNote(noteData: any): Promise<any> {
    const result = await query(
      `INSERT INTO follow_up_notes (
        collection_id, loan_id, collection_officer_id, follow_up_date,
        promise_to_pay_date, amount_promised, notes, note_type, follow_up_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        noteData.collection_id,
        noteData.loan_id,
        noteData.collection_officer_id,
        noteData.follow_up_date,
        noteData.promise_to_pay_date,
        noteData.amount_promised,
        noteData.notes,
        noteData.note_type || 'FOLLOW_UP',
        noteData.follow_up_status || 'PENDING',
      ]
    );

    return result.rows[0];
  }

  async getFollowUpNotes(collectionId: number): Promise<any[]> {
    const result = await query(
      `SELECT * FROM follow_up_notes WHERE collection_id = $1 ORDER BY created_at DESC`,
      [collectionId]
    );
    return result.rows;
  }

  async updatePromiseToPayStatus(noteId: number, isKept: boolean): Promise<void> {
    await query(
      `UPDATE follow_up_notes SET is_promise_kept = $1, updated_at = NOW() WHERE id = $2`,
      [isKept, noteId]
    );
  }

  async getDaysInArrears(loanId: number): Promise<number> {
    const result = await query(
      `SELECT COALESCE((CURRENT_DATE - MIN(due_date))::INTEGER, 0) as days_in_arrears
       FROM loan_schedules
       WHERE loan_id = $1 AND is_paid = FALSE AND due_date < CURRENT_DATE`,
      [loanId]
    );

    return result.rows[0]?.days_in_arrears || 0;
  }
}
