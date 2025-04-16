'use client';

import { useState, useEffect } from 'react';

interface Property {
  name: string;
  currentValue: number;
  originalValue: number;
  date: string;
  location: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const res = await fetch('/api/properties'); // Adjust the route if needed
        const data = await res.json();
        setProperties(data.properties || []);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadProperties();
  }, []);

  // Total Properties based on unique `value` amounts
  const calculateTotalUniqueValues = () => {
    const uniqueValues = new Set(properties.map(p => p.value));
    return uniqueValues.size;
  };

  // Total current value (value field)
  const calculateTotalPropertyWorth = () => {
    return properties.reduce((sum, p) => sum + (p.value || 0), 0);
  };

  // Total original worth (worth field)
  const calculateOriginalPropertyWorth = () => {
    return properties.reduce((sum, p) => sum + (p.worth || 0), 0);
  };


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          Loading property records...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Properties Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
  {/* Total Properties (unique values) */}
  <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg">
    <div className="flex flex-col">
      <span className="text-sm font-medium opacity-80">Total Properties</span>
      <span className="text-3xl font-bold mt-2">{calculateTotalUniqueValues()}</span>
      <span className="text-sm mt-2 opacity-80">Unique property entries</span>
    </div>
  </div>

  {/* Total Properties Worth (value sum) */}
  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg">
    <div className="flex flex-col">
      <span className="text-sm font-medium opacity-80">Total Properties Worth</span>
      <span className="text-3xl font-bold mt-2">{formatCurrency(calculateTotalPropertyWorth())}</span>
      <span className="text-sm mt-2 opacity-80">Current market value</span>
    </div>
  </div>

  {/* Original Properties Worth (worth sum) */}
  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
    <div className="flex flex-col">
      <span className="text-sm font-medium opacity-80">Original Properties Worth</span>
      <span className="text-3xl font-bold mt-2">{formatCurrency(calculateOriginalPropertyWorth())}</span>
      <span className="text-sm mt-2 opacity-80">Purchase value</span>
    </div>
  </div>
</div>


      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
        <button
          onClick={() => window.location.href = '/properties/add'}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xl font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          Add Property
        </button>
        <button
          onClick={() => window.location.href = '/properties/view'}
          className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-xl font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          View Properties
        </button>
      </div>
    </div>
  );
} 