/**
 * Helper utility functions
 */

import bcrypt from 'bcryptjs';

/**
 * Hash a password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate unique loan number
 */
export const generateLoanNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `LOAN-${timestamp}-${random}`;
};

/**
 * Generate unique repayment number
 */
export const generateRepaymentNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REP-${timestamp}-${random}`;
};

/**
 * Generate unique branch code
 */
export const generateBranchCode = (): string => {
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BR-${random}`;
};

/**
 * Format currency
 */
export const formatCurrency = (amount: number, currency: string = 'TZS'): string => {
  return `${currency} ${amount.toFixed(2)}`;
};

/**
 * Calculate days between two dates
 */
export const daysBetween = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

/**
 * Check if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if phone is valid (Tanzania format)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?255\d{9}$|^0\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Paginate array
 */
export const paginate = <T>(array: T[], page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    pagination: {
      page,
      limit,
      total: array.length,
      pages: Math.ceil(array.length / limit),
    },
  };
};
