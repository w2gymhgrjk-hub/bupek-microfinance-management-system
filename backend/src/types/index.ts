export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role_id: number;
  branch_id?: number;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Permission {
  id: number;
  name: string;
  description?: string;
  module: string;
  created_at: Date;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;
  branch_manager_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Borrower {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  id_number?: string;
  date_of_birth?: Date;
  gender?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  occupation?: string;
  monthly_income?: number;
  photo_url?: string;
  branch_id: number;
  loan_officer_id?: number;
  kyc_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Loan {
  id: number;
  loan_number: string;
  borrower_id: number;
  branch_id: number;
  loan_officer_id?: number;
  principal_amount: number;
  interest_rate: number;
  loan_term_months: number;
  disbursement_date?: Date;
  maturity_date?: Date;
  status: string;
  loan_purpose?: string;
  repayment_frequency?: string;
  total_interest: number;
  total_charges: number;
  total_amount_due: number;
  created_at: Date;
  updated_at: Date;
}

export interface Repayment {
  id: number;
  repayment_number: string;
  loan_id: number;
  loan_schedule_id?: number;
  repayment_date: Date;
  amount_paid: number;
  principal_paid?: number;
  interest_paid?: number;
  payment_method?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
  branch_id?: number;
  iat: number;
  exp: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}