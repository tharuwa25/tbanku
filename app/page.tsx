'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    totalAssets: 0,
    totalMoney: 0,
    totalProperties:0
  });

  // Fetch and calculate total income
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incomeRes, expenseRes, propertyRes, assetRes] = await Promise.all([
          fetch('tharuwane.pythonanywhere.com/income'),
          fetch('tharuwane.pythonanywhere.com/expenses'),
          fetch('tharuwane.pythonanywhere.com/properties'),
          fetch('tharuwane.pythonanywhere.com/assets')
        ]);
  
        const incomeData = await incomeRes.json();
        const expenseData = await expenseRes.json();
        const propertyData = await propertyRes.json();
        const assetData = await assetRes.json();
  
        const totalIncome = incomeData.reduce(
          (acc: number, income: { amount: number }) => acc + income.amount,
          0
        );
  
        const totalExpenses = expenseData.expenses.reduce(
          (acc: number, expense: { amount: number }) => acc + expense.amount,
          0
        );
  
        const totalProperties = propertyData.properties.reduce(
          (acc: number, property: { worth: number }) => acc + property.worth,
          0
        );
  
        const totalAssets = assetData.reduce(
          (acc: number, asset: { currentValue: number }) => acc + asset.currentValue,
          0
        );
  
        setSummary({
          totalIncome,
          totalExpenses,
          totalAssets,
          totalProperties,
          totalMoney: totalIncome - totalExpenses + totalAssets + totalProperties
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  

  const buttons = [
    {
      title: 'Income',
      href: '/tbanku/income',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Expenses',
      href: '/expenses',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Assets',
      href: '/assets',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: 'Properties',
      href: '/properties',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-12">TbankU</h1>

      {/* Navigation Buttons */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-12">
        {buttons.map((button, index) => (
          <a
            key={index}
            href={button.href}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-800 font-medium"
          >
            {button.icon}
            {button.title}
          </a>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-12">
        {/* Total Income Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Total Income</span>
            <span className="text-2xl font-bold mt-2">{formatCurrency(summary.totalIncome)}</span>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Total Expenses</span>
            <span className="text-2xl font-bold mt-2">{formatCurrency(summary.totalExpenses)}</span>
          </div>
        </div>

        {/* Total Assets Card */}
        {/* Total Assets Card */}
<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
  <div className="flex flex-col">
    <span className="text-sm font-medium opacity-80">Total Assets</span>
    <span className="text-2xl font-bold mt-2">{formatCurrency(summary.totalAssets)}</span>
  </div>
</div>


        {/* Total Money Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col">
            <span className="text-sm font-medium opacity-80">Total Properties</span>
            <span className="text-2xl font-bold mt-2">{formatCurrency(summary.totalProperties)}</span>
          </div>
        </div>
      </div>

      {/* Cards Link */}
      {/* <div className="grid grid-cols-2 gap-6 w-full max-w-md mb-12">
        <a
          href='/cards'
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-800 font-medium"
        >
          CARDS
        </a>
      </div> */}
    </div>
  );
}
