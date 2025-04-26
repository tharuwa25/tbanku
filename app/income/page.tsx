'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllIncome } from '@/utils/income';

export default function IncomePage() {
  const [incomeData, setIncomeData] = useState({
    totalIncome: 0,
    lastMonthIncome: 0,
    lastYearIncome: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadIncomeData = async () => {
      try {
        setLoading(true);
        setError('');
        const incomes = await getAllIncome();
        
        // Calculate total income
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        
        // Calculate last month's income
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthIncome = incomes
          .filter(income => new Date(income.date) >= lastMonth)
          .reduce((sum, income) => sum + income.amount, 0);
        
        // Calculate last year's income
        const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const lastYearIncome = incomes
          .filter(income => new Date(income.date) >= lastYear)
          .reduce((sum, income) => sum + income.amount, 0);
        
        setIncomeData({
          totalIncome,
          lastMonthIncome,
          lastYearIncome,
        });
      } catch (error) {
        console.error('Error loading income data:', error);
        setError('Failed to load income data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadIncomeData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium">Loading income data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Income Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Total Income Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Total Income</span>
            <span className="text-3xl font-bold mt-2">{formatCurrency(incomeData.totalIncome)}</span>
            <span className="text-sm mt-2 opacity-80">All time</span>
          </div>
        </div>

        {/* Last Month Income Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Last Month</span>
            <span className="text-3xl font-bold mt-2">{formatCurrency(incomeData.lastMonthIncome)}</span>
            <span className="text-sm mt-2 opacity-80">30 days period</span>
          </div>
        </div>

        {/* Last Year Income Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Last Year</span>
            <span className="text-3xl font-bold mt-2">{formatCurrency(incomeData.lastYearIncome)}</span>
            <span className="text-sm mt-2 opacity-80">12 months period</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
        <Link 
          href="/income/add"
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xl font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          Add Income
        </Link>
        <Link 
          href="/income/view"
          className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-xl font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          View Income
        </Link>
      </div>
    </div>
  );
} 