import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export const generateUniqueReference = (prefix: string = ''): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${randomStr}`.toUpperCase();
};

export const generateLoanNumber = (): string => {
  return generateUniqueReference('LN');
};

export const generateRepaymentNumber = (): string => {
  return generateUniqueReference('RP');
};

export const generateReceiptNumber = (): string => {
  return generateUniqueReference('RC');
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
  }).format(amount);
};

export const calculateDaysOverdue = (dueDate: Date): number => {
  const today = new Date();
  const diffTime = today.getTime() - new Date(dueDate).getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const calculateLoanSchedule = (
  principal: number,
  annualRate: number,
  months: number
): Array<{
  schedule_number: number;
  principal_amount: number;
  interest_amount: number;
  total_amount: number;
  due_date: Date;
}> => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const schedule = [];
  let remainingBalance = principal;
  const today = new Date();

  for (let i = 1; i <= months; i++) {
    const interestAmount = remainingBalance * monthlyRate;
    const principalAmount = monthlyPayment - interestAmount;
    remainingBalance -= principalAmount;

    const dueDate = new Date(today);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      schedule_number: i,
      principal_amount: Math.round(principalAmount * 100) / 100,
      interest_amount: Math.round(interestAmount * 100) / 100,
      total_amount: Math.round(monthlyPayment * 100) / 100,
      due_date: dueDate,
    });
  }

  return schedule;
};

export const calculateInterest = (
  principal: number,
  annualRate: number,
  months: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = monthlyPayment * months;
  return Math.round((totalPayment - principal) * 100) / 100;
};

export const calculatePAR = (
  totalPortfolio: number,
  arrearsAmount: number
): number => {
  if (totalPortfolio === 0) return 0;
  return Math.round((arrearsAmount / totalPortfolio) * 100 * 100) / 100;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s+()-]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};
