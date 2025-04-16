'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProperty } from '@/utils/properties';

export default function AddPropertyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    value: '',
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
      const purchaseDate = new Date(formData.date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - purchaseDate.getTime());
      const usedtime = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1); // prevent division by zero
      const value = Number(formData.value);
      const worth = value / usedtime;
  
      const property = {
        name: formData.name,
        value,
        date: formData.date,
        usedtime,
        worth,
        description: formData.description,
      };
  
      const result = await addProperty(property);
  
      if (result) {
        router.push('/properties');
      } else {
        setError('Failed to add property. Please try again.');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      setError('An error occurred while adding the property.');
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
      <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Property Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter property name"
          />
        </div>

        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Property Value
          </label>
          <input
            type="number"
            id="value"
            name="value"
            required
            min="0"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter property value"
          />
        </div>

        {/* <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select property type</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
            <option value="Land">Land</option>
            <option value="Other">Other</option>
          </select>
        </div> */}

        {/* <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter property location"
          />
        </div> */}

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
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
            placeholder="Enter property description (optional)"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Property'}
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