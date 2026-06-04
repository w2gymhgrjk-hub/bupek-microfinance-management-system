export const ErrorMessages = {
  // Auth errors
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_INACTIVE: 'User account is inactive',
  UNAUTHORIZED: 'Unauthorized access',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token',

  // Validation errors
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PHONE: 'Invalid phone number',
  DUPLICATE_EMAIL: 'Email already exists',
  DUPLICATE_ID_NUMBER: 'ID number already exists',
  MISSING_REQUIRED_FIELD: 'Missing required field',

  // Business logic errors
  BORROWER_NOT_FOUND: 'Borrower not found',
  LOAN_NOT_FOUND: 'Loan not found',
  REPAYMENT_NOT_FOUND: 'Repayment not found',
  BRANCH_NOT_FOUND: 'Branch not found',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  INVALID_LOAN_STATUS: 'Invalid loan status for this operation',
  INVALID_AMOUNT: 'Invalid amount',
  OVERPAYMENT: 'Payment amount exceeds outstanding balance',

  // Server errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  DATABASE_ERROR: 'Database error',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};
