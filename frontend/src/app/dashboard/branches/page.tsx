/**
 * Branches page
 */

'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

export default function BranchesPage() {
  const [branches, setBranches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await apiClient.get(`/branches?page=${page}`);
        setBranches(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch branches');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, [page]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Branches</h1>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
          Add Branch
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
        </div>
      ) : branches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
              <p className="text-sm text-gray-600 mt-1">Code: {branch.code}</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span> {branch.city}, {branch.province}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {branch.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {branch.email}
                </p>
              </div>
              <div className="mt-6 space-x-2">
                <button className="px-3 py-1 text-sm text-primary-600 hover:text-primary-900">Edit</button>
                <button className="px-3 py-1 text-sm text-danger-600 hover:text-danger-900">Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-12">No branches found</div>
      )}
    </div>
  );
}
