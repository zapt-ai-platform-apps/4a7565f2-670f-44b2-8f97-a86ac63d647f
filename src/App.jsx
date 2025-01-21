import React from 'react';
import FluRateForm from './components/FluRateForm';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          نظام تتبع انتشار الإنفلونزا الموسمية
        </h1>
        <p className="text-gray-600">
          قم باختيار المدن والمعايير لمعرفة معدلات الانتشار المتوقعة
        </p>
      </header>
      
      <FluRateForm />
    </div>
  );
}