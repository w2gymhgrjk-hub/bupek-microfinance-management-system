-- Migration: Seed Initial Data
-- Version: 002
-- Date: 2026-06-04
-- Description: Insert default users, branches, and configuration data

-- Insert default admin user
-- Email: admin@bupek.com
-- Password: Admin@123456 (hashed with bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name, phone, role_id, is_active)
SELECT 
  'admin@bupek.com',
  '$2b$10$YourHashedPasswordHere', -- Replace with actual bcrypt hash
  'System',
  'Administrator',
  '+255700000000',
  r.id,
  TRUE
FROM roles r WHERE r.name = 'CEO_ADMIN'
ON CONFLICT (email) DO NOTHING;

-- Insert sample branch
INSERT INTO branches (name, code, address, city, province, phone, email, is_active)
VALUES (
  'Head Office',
  'HQ-001',
  '123 Main Street',
  'Dar es Salaam',
  'Dar es Salaam',
  '+255700000001',
  'hq@bupek.com',
  TRUE
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO sms_templates (template_name, template_type, message_content, is_active)
VALUES
  ('LOAN_REMINDER', 'REMINDER', 'Dear Customer, Your loan payment of TZS {amount} is due on {due_date}. Please ensure timely payment.', TRUE),
  ('OVERDUE_NOTICE', 'NOTICE', 'Dear Customer, Your loan payment is overdue. Please contact our office immediately.', TRUE),
  ('PAYMENT_CONFIRMATION', 'CONFIRMATION', 'Thank you! We have received your payment of TZS {amount}. Reference: {reference}', TRUE)
ON CONFLICT DO NOTHING;
