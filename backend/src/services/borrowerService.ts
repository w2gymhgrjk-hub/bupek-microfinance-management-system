import { query } from '../db/connection';
import { Borrower, Guarantor } from '../types';
import { validateEmail, validatePhone } from '../utils/helpers';

export class BorrowerService {
  async createBorrower(borrowerData: any): Promise<Borrower> {
    if (!validateEmail(borrowerData.email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePhone(borrowerData.phone)) {
      throw new Error('Invalid phone number');
    }

    const result = await query(
      `INSERT INTO borrowers (
        first_name, last_name, email, phone, id_type, id_number,
        date_of_birth, gender, marital_status, address, city, province,
        postal_code, occupation, monthly_income, branch_id, loan_officer_id,
        kyc_verified, is_active, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        borrowerData.first_name,
        borrowerData.last_name,
        borrowerData.email,
        borrowerData.phone,
        borrowerData.id_type,
        borrowerData.id_number,
        borrowerData.date_of_birth,
        borrowerData.gender,
        borrowerData.marital_status,
        borrowerData.address,
        borrowerData.city,
        borrowerData.province,
        borrowerData.postal_code,
        borrowerData.occupation,
        borrowerData.monthly_income,
        borrowerData.branch_id,
        borrowerData.loan_officer_id,
        borrowerData.kyc_verified || false,
        true,
        borrowerData.created_by,
      ]
    );

    return result.rows[0];
  }

  async getBorrowerById(id: number): Promise<Borrower> {
    const result = await query('SELECT * FROM borrowers WHERE id = $1 AND is_active = TRUE', [id]);
    if (result.rows.length === 0) {
      throw new Error('Borrower not found');
    }
    return result.rows[0];
  }

  async getAllBorrowers(branchId?: number, limit: number = 50, offset: number = 0): Promise<Borrower[]> {
    let sql = 'SELECT * FROM borrowers WHERE is_active = TRUE';
    const params: any[] = [];

    if (branchId) {
      sql += ' AND branch_id = $1';
      params.push(branchId);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
  }

  async updateBorrower(id: number, updates: any): Promise<Borrower> {
    const fields = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(updates);
    values.push(id);

    const result = await query(
      `UPDATE borrowers SET ${fields}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Borrower not found');
    }

    return result.rows[0];
  }

  async addGuarantor(guarantorData: any): Promise<Guarantor> {
    const result = await query(
      `INSERT INTO guarantors (
        borrower_id, first_name, last_name, phone, id_type, id_number,
        relationship, address, occupation, is_primary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        guarantorData.borrower_id,
        guarantorData.first_name,
        guarantorData.last_name,
        guarantorData.phone,
        guarantorData.id_type,
        guarantorData.id_number,
        guarantorData.relationship,
        guarantorData.address,
        guarantorData.occupation,
        guarantorData.is_primary || false,
      ]
    );

    return result.rows[0];
  }

  async getGuarantors(borrowerId: number): Promise<Guarantor[]> {
    const result = await query('SELECT * FROM guarantors WHERE borrower_id = $1 ORDER BY is_primary DESC', [
      borrowerId,
    ]);
    return result.rows;
  }

  async verifyKYC(borrowerId: number): Promise<Borrower> {
    const result = await query(
      'UPDATE borrowers SET kyc_verified = TRUE, kyc_verified_at = NOW(), updated_at = NOW() WHERE id = $1 RETURNING *',
      [borrowerId]
    );

    if (result.rows.length === 0) {
      throw new Error('Borrower not found');
    }

    return result.rows[0];
  }
}
