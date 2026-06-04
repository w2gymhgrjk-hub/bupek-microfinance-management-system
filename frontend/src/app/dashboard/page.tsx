/**
 * Dashboard home page
 */

'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { DashboardMetrics } from '@/types';
import MetricsCard from '@/components/dashboard/MetricsCard';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiClient.get('/dashboard');
        setMetrics(response.data.data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to BUPEK Microfinance Management System</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      ) : metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total Portfolio"
            value={`TZS ${metrics.total_portfolio.toLocaleString()}`}
            icon="💰"
          />
          <MetricsCard
            title="Total Clients"
            value={metrics.total_clients.toLocaleString()}
            icon="👥"
          />
          <MetricsCard
            title="Active Loans"
            value={metrics.total_active_loans.toLocaleString()}
            icon="📊"
          />
          <MetricsCard
            title="Total Arrears"
            value={`TZS ${metrics.total_arrears.toLocaleString()}`}
            icon="⚠️"
          />
        </div>
      ) : (
        <div className="text-center text-gray-600">Failed to load metrics</div>
      )}
    </div>
  );
}
