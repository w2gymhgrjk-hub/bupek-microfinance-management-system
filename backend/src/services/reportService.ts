import { query } from '../db/connection';
import { calculatePAR } from '../utils/helpers';

export class ReportService {
  async getPARReport(branchId?: number, asOfDate?: Date): Promise<any> {
    const date = asOfDate ? new Date(asOfDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    let sql = `
      SELECT
        b.id,
        b.name as branch_name,
        COUNT(DISTINCT l.id) as total_loans,
        SUM(CASE WHEN l.status IN ('ACTIVE', 'DISBURSED') THEN l.principal_amount ELSE 0 END) as active_portfolio,
        COALESCE(SUM(ol.total_overdue_amount), 0) as arrears_amount,
        COUNT(DISTINCT CASE WHEN ol.id IS NOT NULL THEN l.id END) as loans_in_arrears
      FROM branches b
      LEFT JOIN loans l ON b.id = l.branch_id AND l.status IN ('ACTIVE', 'DISBURSED')
      LEFT JOIN overdue_loans ol ON l.id = ol.loan_id AND ol.status = 'ACTIVE'
    `;

    const params: any[] = [];

    if (branchId) {
      sql += ` WHERE b.id = $${params.length + 1}`;
      params.push(branchId);
    }

    sql += ' GROUP BY b.id, b.name ORDER BY b.name';

    const result = await query(sql, params);

    return result.rows.map((row: any) => ({
      ...row,
      par_percentage: calculatePAR(row.active_portfolio || 0, row.arrears_amount || 0),
    }));
  }

  async getDailyCollectionReport(branchId?: number, date?: Date): Promise<any> {
    const reportDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    let sql = `
      SELECT
        b.id,
        b.name as branch_name,
        COUNT(DISTINCT r.id) as num_transactions,
        COUNT(DISTINCT r.collection_officer_id) as num_collectors,
        SUM(r.amount_paid) as total_collected,
        SUM(r.principal_paid) as principal_collected,
        SUM(r.interest_paid) as interest_collected,
        SUM(r.charges_paid) as charges_collected
      FROM branches b
      LEFT JOIN loans l ON b.id = l.branch_id
      LEFT JOIN repayments r ON l.id = r.loan_id AND DATE(r.repayment_date) = $1
    `;

    const params: any[] = [reportDate];

    if (branchId) {
      sql += ` WHERE b.id = $${params.length + 1}`;
      params.push(branchId);
    } else {
      sql += ' WHERE 1=1';
    }

    sql += ' GROUP BY b.id, b.name ORDER BY b.name';

    const result = await query(sql, params);
    return result.rows;
  }

  async getBranchPerformanceReport(branchId?: number): Promise<any> {
    let sql = `
      SELECT
        b.id,
        b.name as branch_name,
        b.code,
        COUNT(DISTINCT borrow.id) as total_borrowers,
        COUNT(DISTINCT l.id) as total_loans,
        COUNT(DISTINCT CASE WHEN l.status IN ('ACTIVE', 'DISBURSED') THEN l.id END) as active_loans,
        SUM(CASE WHEN l.status IN ('ACTIVE', 'DISBURSED') THEN l.principal_amount ELSE 0 END) as total_portfolio,
        COALESCE(SUM(r.amount_paid), 0) as total_repaid,
        COALESCE(SUM(ol.total_overdue_amount), 0) as total_arrears,
        COUNT(DISTINCT CASE WHEN ol.id IS NOT NULL THEN l.id END) as defaulted_loans,
        COALESCE(SUM(CASE WHEN ol.id IS NOT NULL THEN ol.total_overdue_amount ELSE 0 END), 0) as par_amount
      FROM branches b
      LEFT JOIN borrowers borrow ON b.id = borrow.branch_id AND borrow.is_active = TRUE
      LEFT JOIN loans l ON b.id = l.branch_id
      LEFT JOIN repayments r ON l.id = r.loan_id
      LEFT JOIN overdue_loans ol ON l.id = ol.loan_id AND ol.status = 'ACTIVE'
    `;

    const params: any[] = [];

    if (branchId) {
      sql += ` WHERE b.id = $${params.length + 1}`;
      params.push(branchId);
    }

    sql += ' GROUP BY b.id, b.name, b.code ORDER BY b.name';

    const result = await query(sql, params);

    return result.rows.map((row: any) => ({
      ...row,
      par_percentage: calculatePAR(row.total_portfolio || 0, row.total_arrears || 0),
      collection_efficiency: row.total_portfolio > 0 ? ((row.total_repaid / row.total_portfolio) * 100).toFixed(2) : 0,
    }));
  }

  async getLoanOfficerPerformanceReport(branchId?: number): Promise<any> {
    let sql = `
      SELECT
        u.id,
        u.first_name || ' ' || u.last_name as officer_name,
        u.email,
        COUNT(DISTINCT l.id) as total_loans_created,
        COUNT(DISTINCT CASE WHEN l.status IN ('ACTIVE', 'DISBURSED') THEN l.id END) as active_loans,
        SUM(CASE WHEN l.status IN ('ACTIVE', 'DISBURSED') THEN l.principal_amount ELSE 0 END) as portfolio_managed,
        COALESCE(SUM(ol.total_overdue_amount), 0) as total_arrears,
        COUNT(DISTINCT CASE WHEN ol.id IS NOT NULL THEN l.id END) as defaulted_loans
      FROM users u
      LEFT JOIN loans l ON u.id = l.loan_officer_id
      LEFT JOIN overdue_loans ol ON l.id = ol.loan_id
      WHERE u.is_active = TRUE
    `;

    const params: any[] = [];

    if (branchId) {
      sql += ` AND u.branch_id = $${params.length + 1}`;
      params.push(branchId);
    }

    sql += ' GROUP BY u.id, u.first_name, u.last_name, u.email ORDER BY total_loans_created DESC';

    const result = await query(sql, params);
    return result.rows;
  }

  async getRecoveryReport(branchId?: number, status?: string): Promise<any> {
    let sql = `
      SELECT
        c.id,
        l.loan_number,
        b.first_name || ' ' || b.last_name as borrower_name,
        b.phone,
        c.outstanding_amount,
        c.recovery_amount,
        c.recovery_date,
        c.days_in_arrears,
        c.status,
        u.first_name || ' ' || u.last_name as collection_officer_name
      FROM collections c
      JOIN loans l ON c.loan_id = l.id
      JOIN borrowers b ON c.borrower_id = b.id
      LEFT JOIN users u ON c.collection_officer_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (branchId) {
      sql += ` AND l.branch_id = $${params.length + 1}`;
      params.push(branchId);
    }

    if (status) {
      sql += ` AND c.status = $${params.length + 1}`;
      params.push(status);
    }

    sql += ' ORDER BY c.updated_at DESC';

    const result = await query(sql, params);
    return result.rows;
  }
}
