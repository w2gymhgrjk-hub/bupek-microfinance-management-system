/**
 * Type definitions for the frontend
 */

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  branch_id?: number;
  phone?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
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

export interface Branch {
  id: number;
  name: string;
  code: string;
  address?: string;
  city?: string;
  province?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface DashboardMetrics {
  total_portfolio: number;
  total_clients: number;
  total_active_loans: number;
  total_arrears: number;
  portfolio_at_risk: number;
  par_percentage: number;
}
