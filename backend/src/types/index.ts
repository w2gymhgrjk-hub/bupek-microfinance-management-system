// Type definitions for BUPEK Microfinance System

export interface User {
  id: number;
  email: string;
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

export interface AuthPayload {
  id: number;
  email: string;
  role_id: number;
  branch_id?: number;
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
  id_type?: string;
  id_number: string;
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
  kyc_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Guarantor {
  id: number;
  borrower_id: number;
  first_name: string;
  last_name: string;
  phone: string;
  id_number?: string;
  relationship?: string;
  address?: string;
  occupation?: string;
  is_primary: boolean;
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
  status: 'PENDING' | 'APPROVED' | 'DISBURSED' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'WRITTEN_OFF';
  loan_purpose?: string;
  repayment_frequency?: string;
  total_interest: number;
  total_charges: number;
  total_amount_due: number;
  created_at: Date;
  updated_at: Date;
}

export interface LoanSchedule {
  id: number;
  loan_id: number;
  schedule_number: number;
  due_date: Date;
  principal_amount: number;
  interest_amount: number;
  total_amount: number;
  balance_after_payment: number;
  is_paid: boolean;
  paid_date?: Date;
  paid_amount: number;
  status: string;
  created_at: Date;
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
  charges_paid?: number;
  balance_after_payment?: number;
  payment_method?: string;
  reference_number?: string;
  collection_officer_id?: number;
  status: string;
  receipt_number?: string;
  receipt_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Collection {
  id: number;
  loan_id: number;
  borrower_id: number;
  collection_date: Date;
  amount_collected?: number;
  outstanding_amount?: number;
  collection_officer_id?: number;
  collection_method?: string;
  notes?: string;
  status: string;
  days_overdue: number;
  days_in_arrears: number;
  recovery_amount: number;
  recovery_date?: Date;
  last_follow_up_date?: Date;
  next_follow_up_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ActivityLog {
  id: number;
  user_id: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  description?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  status?: string;
  error_message?: string;
  created_at: Date;
}

export interface SMSLog {
  id: number;
  loan_id?: number;
  borrower_id?: number;
  phone_number: string;
  message: string;
  sms_type?: string;
  status: string;
  sent_at?: Date;
  delivery_status?: string;
  failed_reason?: string;
  created_at: Date;
}
