/**
 * Reports page
 */

'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

const reportTypes = [
  { id: 'portfolio', name: 'Portfolio Summary', icon: '📊' },
  { id: 'par', name: 'Portfolio at Risk', icon: '⚠️' },
  { id: 'officer', name: 'Loan Officer Performance', icon: '👤' },
  { id: 'branch', name: 'Branch Performance', icon: '🏢' },
  { id: 'collections', name: 'Collections Report', icon: '💰' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (reportId: string) => {
    setSelectedReport(reportId);
    setIsLoading(true);

    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      setReportData(response.data.data);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {reportTypes.map((report) => (
          <button
            key={report.id}
            onClick={() => handleGenerateReport(report.id)}
            className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:shadow-lg transition-all"
          >
            <div className="text-3xl mb-2">{report.icon}</div>
            <p className="font-medium text-gray-900">{report.name}</p>
          </button>
        ))}
      </div>

      {selectedReport && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">
            {reportTypes.find((r) => r.id === selectedReport)?.name}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="spinner"></div>
            </div>
          ) : reportData ? (
            <div>
              <pre className="bg-gray-50 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(reportData, null, 2)}
              </pre>
              <div className="mt-4 space-x-2">
                <button className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">
                  Download PDF
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300">
                  Print
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
