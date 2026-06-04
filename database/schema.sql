-- BUPEK Microfinance Management System - PostgreSQL Schema
-- Version: 1.0.0
-- Created: 2026-06-04

-- ============================================
-- ROLES AND PERMISSIONS
-- ============================================

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  module VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

-- ============================================
-- USER MANAGEMENT
-- ============================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role_id INTEGER NOT NULL REFERENCES roles(id),
  branch_id INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_branch_id ON users(branch_id);
CREATE INDEX idx_users_is_active ON users(is_active);

-- ============================================
-- BRANCH MANAGEMENT
-- ============================================

CREATE TABLE branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(255),
  branch_manager_id INTEGER REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_branches_code ON branches(code);
CREATE INDEX idx_branches_is_active ON branches(is_active);

CREATE TABLE staff_branch_assignments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  branch_id INTEGER NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  removed_date TIMESTAMP,
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, branch_id, is_current)
);

CREATE INDEX idx_staff_branch_user ON staff_branch_assignments(user_id);
CREATE INDEX idx_staff_branch_branch ON staff_branch_assignments(branch_id);
CREATE INDEX idx_staff_branch_is_current ON staff_branch_assignments(is_current);

-- ============================================
-- CLIENT/BORROWER MANAGEMENT
-- ============================================

CREATE TABLE borrowers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  id_type VARCHAR(50),
  id_number VARCHAR(50) UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(10),
  marital_status VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  postal_code VARCHAR(10),
  occupation VARCHAR(100),
  monthly_income DECIMAL(15, 2),
  photo_url VARCHAR(255),
  branch_id INTEGER NOT NULL REFERENCES branches(id),
  loan_officer_id INTEGER REFERENCES users(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_borrowers_email ON borrowers(email);
CREATE INDEX idx_borrowers_phone ON borrowers(phone);
CREATE INDEX idx_borrowers_id_number ON borrowers(id_number);
CREATE INDEX idx_borrowers_branch_id ON borrowers(branch_id);
CREATE INDEX idx_borrowers_is_active ON borrowers(is_active);

CREATE TABLE guarantors (
  id SERIAL PRIMARY KEY,
  borrower_id INTEGER NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  id_type VARCHAR(50),
  id_number VARCHAR(50),
  relationship VARCHAR(50),
  address TEXT,
  occupation VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guarantors_borrower_id ON guarantors(borrower_id);

CREATE TABLE borrower_documents (
  id SERIAL PRIMARY KEY,
  borrower_id INTEGER NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
  document_type VARCHAR(50),
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  file_size BIGINT,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_borrower_documents_borrower_id ON borrower_documents(borrower_id);

CREATE TABLE borrower_business_info (
  id SERIAL PRIMARY KEY,
  borrower_id INTEGER NOT NULL UNIQUE REFERENCES borrowers(id) ON DELETE CASCADE,
  business_name VARCHAR(100),
  business_type VARCHAR(50),
  business_registration_number VARCHAR(50),
  business_address TEXT,
  monthly_business_revenue DECIMAL(15, 2),
  number_of_employees INTEGER,
  years_in_operation INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_business_info_borrower_id ON borrower_business_info(borrower_id);

-- ============================================
-- LOAN MANAGEMENT
-- ============================================

CREATE TABLE loans (
  id SERIAL PRIMARY KEY,
  loan_number VARCHAR(50) UNIQUE NOT NULL,
  borrower_id INTEGER NOT NULL REFERENCES borrowers(id),
  branch_id INTEGER NOT NULL REFERENCES branches(id),
  loan_officer_id INTEGER REFERENCES users(id),
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  loan_term_months INTEGER NOT NULL,
  disbursement_date DATE,
  maturity_date DATE,
  status VARCHAR(20) DEFAULT 'PENDING',
  loan_purpose VARCHAR(255),
  repayment_frequency VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id),
  updated_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_loans_loan_number ON loans(loan_number);
CREATE INDEX idx_loans_borrower_id ON loans(borrower_id);
CREATE INDEX idx_loans_branch_id ON loans(branch_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_disbursement_date ON loans(disbursement_date);

CREATE TABLE loan_appraisals (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL UNIQUE REFERENCES loans(id) ON DELETE CASCADE,
  appraisal_date DATE,
  appraised_by INTEGER REFERENCES users(id),
  recommendation VARCHAR(50),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_appraisals_loan_id ON loan_appraisals(loan_id);

CREATE TABLE loan_approvals (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL UNIQUE REFERENCES loans(id) ON DELETE CASCADE,
  approval_date DATE,
  approved_by INTEGER REFERENCES users(id),
  approval_amount DECIMAL(15, 2),
  approval_status VARCHAR(20),
  approval_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_approvals_loan_id ON loan_approvals(loan_id);

CREATE TABLE loan_disbursements (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  disbursement_date DATE NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  disbursement_method VARCHAR(50),
  reference_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_loan_disbursements_loan_id ON loan_disbursements(loan_id);
CREATE INDEX idx_loan_disbursements_date ON loan_disbursements(disbursement_date);

CREATE TABLE loan_schedules (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  schedule_number INTEGER,
  due_date DATE NOT NULL,
  principal_amount DECIMAL(15, 2),
  interest_amount DECIMAL(15, 2),
  total_amount DECIMAL(15, 2),
  balance_after_payment DECIMAL(15, 2),
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(loan_id, schedule_number)
);

CREATE INDEX idx_loan_schedules_loan_id ON loan_schedules(loan_id);
CREATE INDEX idx_loan_schedules_due_date ON loan_schedules(due_date);
CREATE INDEX idx_loan_schedules_is_paid ON loan_schedules(is_paid);

CREATE TABLE loan_charges (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  charge_type VARCHAR(50),
  charge_amount DECIMAL(15, 2),
  charge_percentage DECIMAL(5, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_charges_loan_id ON loan_charges(loan_id);

-- ============================================
-- REPAYMENT MANAGEMENT
-- ============================================

CREATE TABLE repayments (
  id SERIAL PRIMARY KEY,
  repayment_number VARCHAR(50) UNIQUE NOT NULL,
  loan_id INTEGER NOT NULL REFERENCES loans(id),
  loan_schedule_id INTEGER REFERENCES loan_schedules(id),
  repayment_date DATE NOT NULL,
  amount PAID DECIMAL(15, 2) NOT NULL,
  principal_paid DECIMAL(15, 2),
  interest_paid DECIMAL(15, 2),
  charges_paid DECIMAL(15, 2),
  balance_after_payment DECIMAL(15, 2),
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  created_by INTEGER REFERENCES users(id),
  receipt_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_repayments_loan_id ON repayments(loan_id);
CREATE INDEX idx_repayments_repayment_date ON repayments(repayment_date);
CREATE INDEX idx_repayments_repayment_number ON repayments(repayment_number);

CREATE TABLE repayment_receipts (
  id SERIAL PRIMARY KEY,
  repayment_id INTEGER NOT NULL UNIQUE REFERENCES repayments(id),
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  receipt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_path VARCHAR(500),
  generated_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_repayment_receipts_repayment_id ON repayment_receipts(repayment_id);

-- ============================================
-- COLLECTION MANAGEMENT
-- ============================================

CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL REFERENCES loans(id),
  collection_date DATE NOT NULL,
  amount_collected DECIMAL(15, 2),
  collection_officer_id INTEGER REFERENCES users(id),
  collection_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_collections_loan_id ON collections(loan_id);
CREATE INDEX idx_collections_collection_date ON collections(collection_date);
CREATE INDEX idx_collections_collection_officer_id ON collections(collection_officer_id);

CREATE TABLE overdue_loans (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL UNIQUE REFERENCES loans(id),
  days_overdue INTEGER,
  total_overdue_amount DECIMAL(15, 2),
  last_payment_date DATE,
  first_overdue_date DATE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_overdue_loans_loan_id ON overdue_loans(loan_id);
CREATE INDEX idx_overdue_loans_days_overdue ON overdue_loans(days_overdue);
CREATE INDEX idx_overdue_loans_status ON overdue_loans(status);

CREATE TABLE follow_up_notes (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER NOT NULL REFERENCES loans(id),
  collection_officer_id INTEGER REFERENCES users(id),
  follow_up_date DATE,
  promise_to_pay_date DATE,
  notes TEXT,
  follow_up_status VARCHAR(50),
  recovery_amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_follow_up_notes_loan_id ON follow_up_notes(loan_id);
CREATE INDEX idx_follow_up_notes_collection_officer_id ON follow_up_notes(collection_officer_id);
CREATE INDEX idx_follow_up_notes_follow_up_date ON follow_up_notes(follow_up_date);

-- ============================================
-- SMS NOTIFICATION MANAGEMENT
-- ============================================

CREATE TABLE sms_providers (
  id SERIAL PRIMARY KEY,
  provider_name VARCHAR(100) NOT NULL,
  api_key VARCHAR(255),
  api_url VARCHAR(255),
  sender_id VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER REFERENCES users(id)
);

CREATE TABLE sms_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  template_type VARCHAR(50),
  message_content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sms_logs (
  id SERIAL PRIMARY KEY,
  loan_id INTEGER REFERENCES loans(id),
  borrower_id INTEGER REFERENCES borrowers(id),
  phone_number VARCHAR(20),
  message TEXT,
  sms_type VARCHAR(50),
  status VARCHAR(50),
  sent_at TIMESTAMP,
  delivery_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sms_logs_borrower_id ON sms_logs(borrower_id);
CREATE INDEX idx_sms_logs_loan_id ON sms_logs(loan_id);
CREATE INDEX idx_sms_logs_sent_at ON sms_logs(sent_at);
CREATE INDEX idx_sms_logs_status ON sms_logs(status);

-- ============================================
-- AUDIT AND ACTIVITY LOGS
-- ============================================

CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  description TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- ============================================
-- BRANCH FOREIGN KEY (deferred from users)
-- ============================================

ALTER TABLE users ADD CONSTRAINT fk_users_branch_id 
  FOREIGN KEY (branch_id) REFERENCES branches(id);

-- ============================================
-- INSERT DEFAULT ROLES
-- ============================================

INSERT INTO roles (name, description) VALUES
('CEO_ADMIN', 'Chief Executive Officer with full system access'),
('OPERATIONS_MANAGER', 'Operations Manager with oversight access'),
('BRANCH_MANAGER', 'Branch Manager with branch-specific access'),
('LOAN_OFFICER', 'Loan Officer for loan processing'),
('COLLECTION_OFFICER', 'Collection Officer for collections and follow-ups'),
('ACCOUNTANT', 'Accountant with financial reporting access')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- INSERT DEFAULT PERMISSIONS
-- ============================================

INSERT INTO permissions (name, description, module) VALUES
-- User Management
('CREATE_USER', 'Create new users', 'USER_MANAGEMENT'),
('VIEW_USERS', 'View user list', 'USER_MANAGEMENT'),
('EDIT_USER', 'Edit user details', 'USER_MANAGEMENT'),
('DELETE_USER', 'Delete users', 'USER_MANAGEMENT'),
('RESET_PASSWORD', 'Reset user passwords', 'USER_MANAGEMENT'),

-- Branch Management
('CREATE_BRANCH', 'Create new branches', 'BRANCH_MANAGEMENT'),
('VIEW_BRANCHES', 'View branch list', 'BRANCH_MANAGEMENT'),
('EDIT_BRANCH', 'Edit branch details', 'BRANCH_MANAGEMENT'),
('VIEW_BRANCH_PERFORMANCE', 'View branch performance metrics', 'BRANCH_MANAGEMENT'),

-- Client Management
('CREATE_CLIENT', 'Register new borrowers', 'CLIENT_MANAGEMENT'),
('VIEW_CLIENTS', 'View client list', 'CLIENT_MANAGEMENT'),
('EDIT_CLIENT', 'Edit client details', 'CLIENT_MANAGEMENT'),
('UPLOAD_CLIENT_DOCUMENTS', 'Upload client documents', 'CLIENT_MANAGEMENT'),
('VIEW_CLIENT_HISTORY', 'View client loan history', 'CLIENT_MANAGEMENT'),

-- Loan Management
('CREATE_LOAN', 'Create loan applications', 'LOAN_MANAGEMENT'),
('VIEW_LOANS', 'View loan list', 'LOAN_MANAGEMENT'),
('APPRAISE_LOAN', 'Appraise loans', 'LOAN_MANAGEMENT'),
('APPROVE_LOAN', 'Approve loans', 'LOAN_MANAGEMENT'),
('DISBURSE_LOAN', 'Disburse loans', 'LOAN_MANAGEMENT'),
('VIEW_LOAN_SCHEDULE', 'View loan repayment schedule', 'LOAN_MANAGEMENT'),

-- Repayment Management
('RECORD_REPAYMENT', 'Record loan repayments', 'REPAYMENT_MANAGEMENT'),
('VIEW_REPAYMENTS', 'View repayment history', 'REPAYMENT_MANAGEMENT'),
('GENERATE_RECEIPT', 'Generate repayment receipts', 'REPAYMENT_MANAGEMENT'),
('VIEW_COLLECTION_SUMMARY', 'View daily collection summary', 'REPAYMENT_MANAGEMENT'),

-- Collection Management
('VIEW_OVERDUE', 'View overdue loans', 'COLLECTION_MANAGEMENT'),
('RECORD_COLLECTION', 'Record collections', 'COLLECTION_MANAGEMENT'),
('ADD_FOLLOW_UP_NOTE', 'Add follow-up notes', 'COLLECTION_MANAGEMENT'),
('VIEW_RECOVERY_STATUS', 'View recovery status', 'COLLECTION_MANAGEMENT'),

-- Reports
('VIEW_REPORTS', 'View reports', 'REPORTS'),
('GENERATE_PAR_REPORT', 'Generate PAR report', 'REPORTS'),
('GENERATE_COLLECTION_REPORT', 'Generate collection report', 'REPORTS'),
('GENERATE_PERFORMANCE_REPORT', 'Generate performance report', 'REPORTS'),
('VIEW_DASHBOARD', 'View dashboard', 'REPORTS'),

-- SMS Management
('SEND_SMS', 'Send SMS notifications', 'SMS_MANAGEMENT'),
('SEND_BULK_SMS', 'Send bulk SMS', 'SMS_MANAGEMENT'),
('VIEW_SMS_LOGS', 'View SMS logs', 'SMS_MANAGEMENT'),
('CONFIGURE_SMS_PROVIDER', 'Configure SMS provider', 'SMS_MANAGEMENT')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- ASSIGN PERMISSIONS TO ROLES
-- ============================================

-- CEO/Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'CEO_ADMIN'
ON CONFLICT (role_id, permission_id) DO NOTHING;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for branches table
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for borrowers table
CREATE TRIGGER update_borrowers_updated_at BEFORE UPDATE ON borrowers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for loans table
CREATE TRIGGER update_loans_updated_at BEFORE UPDATE ON loans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for repayments table
CREATE TRIGGER update_repayments_updated_at BEFORE UPDATE ON repayments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for collections table
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
