import Joi from 'joi';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone: Joi.string().optional(),
  role_id: Joi.number().required(),
  branch_id: Joi.number().optional(),
});

export const createBranchSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  province: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
});

export const createBorrowerSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().required(),
  id_number: Joi.string().optional(),
  date_of_birth: Joi.date().optional(),
  gender: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  province: Joi.string().optional(),
  occupation: Joi.string().optional(),
  monthly_income: Joi.number().optional(),
  branch_id: Joi.number().required(),
});

export const createLoanSchema = Joi.object({
  borrower_id: Joi.number().required(),
  principal_amount: Joi.number().min(0).required(),
  interest_rate: Joi.number().min(0).required(),
  loan_term_months: Joi.number().min(1).required(),
  loan_purpose: Joi.string().optional(),
  repayment_frequency: Joi.string().optional(),
});

export const recordRepaymentSchema = Joi.object({
  loan_id: Joi.number().required(),
  repayment_date: Joi.date().required(),
  amount_paid: Joi.number().min(0).required(),
  payment_method: Joi.string().optional(),
});