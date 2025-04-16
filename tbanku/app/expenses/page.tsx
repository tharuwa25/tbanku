'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllExpenses, Expense } from '@/utils/expenses';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllExpenses();
        setExpenses(data || []);
      } catch (error) {
        console.error('Error loading expenses:', error);
        setError('Failed to load expenses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const calculateTotalExpenses = () => {
    if (!Array.isArray(expenses)) return 0;
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateLastMonthExpenses = () => {
    if (!Array.isArray(expenses)) return 0;
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return expenses
      .filter(expense => new Date(expense.date) >= lastMonth)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const calculateLastYearExpenses = () => {
    if (!Array.isArray(expenses)) return 0;
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return expenses
      .filter(expense => new Date(expense.date) >= lastYear)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-medium">Loading expenses data...</div>
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
      <h1 className="text-3xl font-bold mb-8">Expenses Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Total Expenses Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Total Expenses</span>
            <span className="text-3xl font-bold mt-2">{formatCurrency(calculateTotalExpenses())}</span>
            <span className="text-sm mt-2 opacity-80">All time</span>
          </div>
        </div>

        {/* Last Month Expenses Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Last Month</span>
            <span className="text-3xl font-bold mt-2">{formatCurrency(calculateLastMonthExpenses())}</span>
            <span className="text-sm mt-2 opacity-80">30 days period</span>
          </div>
        </div>

        {/* Last Year Expenses Card */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Last Year</span>
            <span className="text-3xl font-bold mt-2">{formatCurrency(calculateLastYearExpenses())}</span>
            <span className="text-sm mt-2 opacity-80">12 months period</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
        <Link 
          href="/expenses/add"
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xl font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          Add Expense
        </Link>
        <Link 
          href="/expenses/view"
          className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-xl font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          View Expenses
        </Link>
      </div>
    </div>
  );
} 