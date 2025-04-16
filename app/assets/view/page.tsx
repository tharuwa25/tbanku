'use client';

import { useState, useEffect } from 'react';
import { getAllAssets, Asset } from '@/utils/assets';

export default function ViewAssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllAssets();
        console.log('Fetched assets:', data);
        setAssets(data);
      } catch (err) {
        console.error('Error loading assets:', err);
        setError('Failed to load assets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const assetDate = new Date(asset.date);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    const typeMatch = !filters.type || asset.source === filters.type;
    const dateMatch =
      (!startDate || assetDate >= startDate) &&
      (!endDate || assetDate <= endDate);

    return typeMatch && dateMatch;
  });

  const totalAmount = filteredAssets.reduce((sum, asset) => sum + asset.currentValue, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          Loading assets...
        </div>
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
      <h1 className="text-4xl font-bold mb-8">View Your Assets</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select
          value={filters.type}
          onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sources</option>
          <option value="Salary">Salary</option>
          <option value="Bonus">Bonus</option>
          <option value="Freelance">Freelance</option>
          <option value="Investment">Investment</option>
          <option value="Rental">Rental</option>
          <option value="Business">Business</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Start Date"
        />

        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="End Date"
        />
      </div>

      {/* Total Amount */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg mb-8">
        <div className="flex flex-col">
          <span className="text-sm font-medium opacity-80">Total Asset Value</span>
          <span className="text-2xl font-bold mt-2">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => {
                  const valueChange = asset.currentValue - asset.originalValue;
                  const valueChangePercentage = (valueChange / asset.originalValue) * 100;

                  return (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(asset.originalValue)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(asset.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(asset.currentValue)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${valueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(valueChange)} ({valueChangePercentage.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
