/**
 * Repayments page
 */

'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function RepaymentsPage() {
  const [repayments, setRepayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const response = await apiClient.get(`/repayments?page=${page}`);
        setRepayments(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch repayments');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepayments();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Repayments</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Record Repayment
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      ) : repayments.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Repayment Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {repayments.map((repayment) => (
                <tr key={repayment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-mono">{repayment.repayment_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{repayment.loan_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(repayment.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">TZS {repayment.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 py-12">No repayments found</div>
      )}
    </div>
  );
}
