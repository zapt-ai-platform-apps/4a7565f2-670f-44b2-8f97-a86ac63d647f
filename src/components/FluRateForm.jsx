import React, { useState } from 'react';
import Select from 'react-select';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { saudiCities } from '../constants/cities';
import { getChartData, chartOptions } from '../utils/chartConfig';

export default function FluRateForm() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [populationDensity, setPopulationDensity] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [fluRates, setFluRates] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRates = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const mockRates = selectedCities.map(city => ({
        city: city.label,
        rate: Math.floor(Math.random() * (30 - 10 + 1)) + 10 + 
              (populationDensity/100 * 20) + 
              (temperature > 25 ? 15 : 5)
      }));
      
      setFluRates(mockRates);
    } catch (error) {
      console.error('Calculation error:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={calculateRates} className="space-y-6 mb-8">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            اختر المدن:
          </label>
          <Select
            isMulti
            options={saudiCities}
            value={selectedCities}
            onChange={setSelectedCities}
            className="basic-multi-select"
            classNamePrefix="select"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الكثافة السكانية (نسمة/كم²):
              <span className="ml-2 text-blue-600">{populationDensity}</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={populationDensity}
              onChange={(e) => setPopulationDensity(e.target.value)}
              className="w-full mt-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              درجة الحرارة الحالية (°C):
            </label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full p-2 border rounded-md box-border"
              min="10"
              max="45"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors cursor-pointer disabled:opacity-50"
        >
          {loading ? 'جاري الحساب...' : 'احسب معدل الانتشار'}
        </button>
      </form>

      {fluRates && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">النتائج:</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Bar 
              data={getChartData(fluRates)}
              options={chartOptions}
            />
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        <a 
          href="https://www.zapt.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          Made on ZAPT
        </a>
      </div>
    </div>
  );
}