export const getChartData = (fluRates) => ({
  labels: fluRates?.map(city => city.city) || [],
  datasets: [{
    label: 'معدل الانتشار (%)',
    data: fluRates?.map(city => city.rate) || [],
    backgroundColor: 'rgba(54, 162, 235, 0.7)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1
  }]
});

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      rtl: true
    }
  },
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true,
      max: 100
    }
  }
};