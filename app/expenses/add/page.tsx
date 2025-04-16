'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addExpense } from '@/utils/expenses';

export default function AddExpensePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const expense = {
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
      };

      const result = await addExpense(expense);
      
      if (result) {
        router.push('/expenses');
      } else {
        setError('Failed to add expense. Please try again.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      setError('An error occurred while adding the expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Expense</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter amount"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border bg-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Shopping">Shopping</option>
            <option value="Shopping">Internet</option>
            <option value="Shopping">Telephone</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter description (optional)"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 