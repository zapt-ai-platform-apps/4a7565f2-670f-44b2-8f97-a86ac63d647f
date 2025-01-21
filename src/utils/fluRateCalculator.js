export const FACTOR_WEIGHTS = {
  temperature: 0.3,
  humidity: 0.25,
  populationDensity: 0.2,
  sunExposure: 0.15,
  airPollution: 0.1
};

export const calculateSpreadRate = (baseRate, factors) => {
  let rate = baseRate;
  
  if (factors.temperature < 15) rate += (15 - factors.temperature) * 0.5;
  if (factors.temperature > 25) rate += (factors.temperature - 25) * 0.7;
  
  if (factors.humidity < 40) rate += (40 - factors.humidity) * 0.3;
  if (factors.humidity > 60) rate += (factors.humidity - 60) * 0.4;
  
  rate += factors.populationDensity * 0.2;
  rate -= factors.sunExposure * 0.15;
  rate += factors.airPollution * 0.1;

  return Math.min(Math.max(rate, 0), 100);
};