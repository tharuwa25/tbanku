'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addAssets } from '@/utils/assets';

export default function AddAssetsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    originalValue: '',
    date: '',
    description: '',
    location: '',
    currentValue: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const assets = {
        name: formData.name,
        originalValue: Number(formData.originalValue),
        date: formData.date,
        description: formData.description,
        location: formData.location,
        currentValue: Number(formData.currentValue)
      };

      await addAssets(assets);
      router.push('/assets/view');

    } catch (error) {
      setError('Failed to add assets. Please try again.');
      console.error('Error adding income:', error);
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
      <h1 className="text-3xl font-bold mb-8">Add New Assets</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
      <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="originalValue" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="originalValue"
              name="originalValue"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter amount"
              value={formData.originalValue}
              onChange={handleChange}
            />
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add any additional details"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <textarea
              id="location"
              name="location"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          

          

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Income'}
            </button>
          </div>
        </form>
        </div>
    </div>
  );
} 