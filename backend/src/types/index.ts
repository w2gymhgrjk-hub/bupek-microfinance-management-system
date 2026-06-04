/**
 * Type definitions for the BUPEK Microfinance Management System
 */

// User Types
export interface IUser {
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
  created_by?: number;
  updated_by?: number;
}

export interface IRole {
  id: number;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPermission {
  id: number;
  name: string;
  description?: string;
  module?: string;
  created_at: Date;
}

// JWT Types
export interface IJWTPayload {
  userId: number;
  email: string;
  roleId: number;
  branchId?: number;
  permissions?: string[];
  iat: number;
  exp: number;
}

// Branch Types
export interface IBranch {
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
  created_by?: number;
  updated_by?: number;
}

// Borrower Types
export interface IBorrower {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  id_type?: string;
  id_number?: string;
  date_of_birth?: Date;
  gender?: string;
  marital_status?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  occupation?: string;
  monthly_income?: number;
  photo_url?: string;
  branch_id: number;
  loan_officer_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Loan Types
export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DISBURSED = 'DISBURSED',
  ACTIVE = 'ACTIVE',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  WRITTEN_OFF = 'WRITTEN_OFF'
}

export interface ILoan {
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
  status: LoanStatus;
  loan_purpose?: string;
  repayment_frequency?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}

// Repayment Types
export interface IRepayment {
  id: number;
  repayment_number: string;
  loan_id: number;
  loan_schedule_id?: number;
  repayment_date: Date;
  amount_paid: number;
  principal_paid?: number;
  interest_paid?: number;
  charges_paid?: number;
  balance_after_payment?: number;
  payment_method?: string;
  reference_number?: string;
  created_by?: number;
  receipt_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

// Collection Types
export interface ICollection {
  id: number;
  loan_id: number;
  collection_date: Date;
  amount_collected?: number;
  collection_officer_id?: number;
  collection_method?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Response Types
export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: Date;
}

// Error Types
export interface IErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: Date;
}

// Request Types
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    branch_id?: number;
  };
}

export interface ICreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role_id: number;
  branch_id?: number;
}

export interface ICreateBranchRequest {
  name: string;
  code: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;
  branch_manager_id?: number;
}

export interface ICreateBorrowerRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  id_type?: string;
  id_number?: string;
  date_of_birth?: Date;
  gender?: string;
  marital_status?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  occupation?: string;
  monthly_income?: number;
  branch_id: number;
  loan_officer_id?: number;
}

export interface ICreateLoanRequest {
  borrower_id: number;
  branch_id: number;
  principal_amount: number;
  interest_rate: number;
  loan_term_months: number;
  loan_purpose?: string;
  repayment_frequency?: string;
}

// Dashboard Types
export interface IDashboardMetrics {
  total_portfolio: number;
  total_clients: number;
  total_active_loans: number;
  total_arrears: number;
  portfolio_at_risk: number;
  par_percentage: number;
}

// Activity Log Types
export interface IActivityLog {
  id: number;
  user_id: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  description?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}
