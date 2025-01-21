import React, { useState } from 'react';
import Select from 'react-select';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { saudiCities } from '../constants/cities';
import { getChartData, chartOptions } from '../utils/chartConfig';
import { calculateSpreadRate } from '../utils/fluRateCalculator';
import { baseRates } from '../constants/fluRates';

export default function FluRateForm() {
  const [selectedCities, setSelectedCities] = useState([]);
  const [populationDensity, setPopulationDensity] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [sunExposure, setSunExposure] = useState(30);
  const [airPollution, setAirPollution] = useState(20);
  const [fluRates, setFluRates] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRates = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const calculatedRates = selectedCities.map(city => {
        const factors = {
          temperature: Number(temperature),
          humidity: Number(humidity),
          populationDensity: Number(populationDensity),
          sunExposure: Number(sunExposure),
          airPollution: Number(airPollution)
        };

        return {
          city: city.label,
          rate: calculateSpreadRate(baseRates[city.value], factors),
          factors
        };
      });

      setFluRates(calculatedRates);
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

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              الرطوبة النسبية (%):
              <span className="ml-2 text-blue-600">{humidity}</span>
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value)}
              className="w-full mt-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              التعرض للشمس (ساعات/يوم):
              <span className="ml-2 text-blue-600">{sunExposure}</span>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              value={sunExposure}
              onChange={(e) => setSunExposure(e.target.value)}
              className="w-full mt-2 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              تلوث الهواء (PM2.5 μg/m³):
              <span className="ml-2 text-blue-600">{airPollution}</span>
            </label>
            <input
              type="range"
              min="0"
              max="500"
              value={airPollution}
              onChange={(e) => setAirPollution(e.target.value)}
              className="w-full mt-2 cursor-pointer"
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
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              {fluRates.map((city, index) => (
                <div key={index} className="p-4 bg-white rounded shadow">
                  <h3 className="font-bold mb-2">{city.city}</h3>
                  <p>معدل الانتشار: {city.rate.toFixed(1)}%</p>
                  <p className="text-gray-600 text-xs mt-2">
                    العوامل المؤثرة:<br />
                    الحرارة: {city.factors.temperature}°C<br />
                    الرطوبة: {city.factors.humidity}%<br />
                    الكثافة: {city.factors.populationDensity}<br />
                    الشمس: {city.factors.sunExposure}h<br />
                    التلوث: {city.factors.airPollution}μg
                  </p>
                </div>
              ))}
            </div>
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