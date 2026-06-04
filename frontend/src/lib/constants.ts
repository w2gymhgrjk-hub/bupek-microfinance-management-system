/**
 * Application constants
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'BUPEK Microfinance';
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const USER_ROLES = {
  CEO_ADMIN: 'CEO_ADMIN',
  OPERATIONS_MANAGER: 'OPERATIONS_MANAGER',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  LOAN_OFFICER: 'LOAN_OFFICER',
  COLLECTION_OFFICER: 'COLLECTION_OFFICER',
  ACCOUNTANT: 'ACCOUNTANT',
};

export const ROLE_LABELS = {
  CEO_ADMIN: 'CEO / Admin',
  OPERATIONS_MANAGER: 'Operations Manager',
  BRANCH_MANAGER: 'Branch Manager',
  LOAN_OFFICER: 'Loan Officer',
  COLLECTION_OFFICER: 'Collection Officer',
  ACCOUNTANT: 'Accountant',
};

export const LOAN_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  DISBURSED: 'DISBURSED',
  ACTIVE: 'ACTIVE',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  WRITTEN_OFF: 'WRITTEN_OFF',
};

export const PAGINATION_LIMITS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
