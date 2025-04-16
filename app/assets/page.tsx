'use client';

import { useState, useEffect } from 'react';

interface Asset {
  name: string;
  value: number;
  date: string;
  type: string;
  originalValue: number;  // Add this property
  currentValue: number;   // Add this property
}


export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const res = await fetch('/api/assets'); // Make sure this route matches your actual API route
        const data = await res.json();
        setAssets(data);
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadAssets();
  }, []);

  const calculateTotalOriginalValue = () => {
    return assets.reduce((total, asset) => total + (asset.originalValue || 0), 0);
  };
  
  const calculateTotalCurrentValue = () => {
    return assets.reduce((total, asset) => total + (asset.currentValue || 0), 0);
  };
  
  const calculateThisYearCurrentValue = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
  
    return assets
      .filter(asset => new Date(asset.date).getFullYear() === currentYear)
      .reduce((total, asset) => total + (asset.currentValue || 0), 0);
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
          Loading asset records...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Assets Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
  {/* Total Assets (original value) */}
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
    <div className="flex flex-col">
      <span className="text-sm font-medium opacity-80">Total Assets</span>
      <span className="text-3xl font-bold mt-2">{formatCurrency(calculateTotalOriginalValue())}</span>
      <span className="text-sm mt-2 opacity-80">Original value</span>
    </div>
  </div>

  {/* Total Current Value */}
  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
    <div className="flex flex-col">
      <span className="text-sm font-medium opacity-80">Total Value</span>
      <span className="text-3xl font-bold mt-2">{formatCurrency(calculateTotalCurrentValue())}</span>
      <span className="text-sm mt-2 opacity-80">Current market value</span>
    </div>
  </div>

  {/* Current Year Assets Worth */}
  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
    <div className="flex flex-col">
      <span className="text-sm font-medium opacity-80">This Year Asset Worth</span>
      <span className="text-3xl font-bold mt-2">{formatCurrency(calculateThisYearCurrentValue())}</span>
      <span className="text-sm mt-2 opacity-80">2025 current value</span>
    </div>
  </div>
</div>


      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
        <button
          onClick={() => window.location.href = '/assets/add'}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-xl font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          Add Asset
        </button>
        <button
          onClick={() => window.location.href = '/assets/view'}
          className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-xl font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 min-w-[200px]"
        >
          View Assets
        </button>
      </div>
    </div>
  );
} 