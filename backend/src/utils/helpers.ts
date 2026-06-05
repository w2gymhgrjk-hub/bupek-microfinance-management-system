import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T
) => {
  const response: ApiResponse<T> = {
    success,
    message,
    statusCode,
    ...(data && { data }),
  };
  return res.status(statusCode).json(response);
};

export const generateUniqueNumber = (prefix: string): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

export const calculateLoanSchedule = (
  principalAmount: number,
  interestRate: number,
  loanTermMonths: number,
  startDate: Date
) => {
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (principalAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1);

  const schedule = [];
  let remainingBalance = principalAmount;

  for (let i = 1; i <= loanTermMonths; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    const interestPayment = remainingBalance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    remainingBalance -= principalPayment;

    schedule.push({
      schedule_number: i,
      due_date: dueDate,
      principal_amount: Math.round(principalPayment * 100) / 100,
      interest_amount: Math.round(interestPayment * 100) / 100,
      total_amount: Math.round(monthlyPayment * 100) / 100,
      balance_after_payment: Math.round(Math.max(remainingBalance, 0) * 100) / 100,
    });
  }

  return schedule;
};

export const calculateDaysInArrears = (dueDate: Date): number => {
  const today = new Date();
  const timeDifference = today.getTime() - dueDate.getTime();
  const daysInArrears = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return Math.max(0, daysInArrears);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: 'TZS',
  }).format(amount);
};