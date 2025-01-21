export const getChartData = (fluRates) => ({
  labels: fluRates?.map(city => city.city) || [],
  datasets: [
    {
      label: 'معدل الانتشار (%)',
      data: fluRates?.map(city => city.rate) || [],
      backgroundColor: 'rgba(54, 162, 235, 0.7)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'التأثير التراكمي للعوامل',
      data: fluRates?.map(city => 
        (city.rate - 15) * 1.5 // Normalize factor impact
      ) || [],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      type: 'line'
    }
  ]
});

export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      rtl: true
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const data = fluRates[context.dataIndex];
          return [
            `المدينة: ${data.city}`,
            `معدل الانتشار: ${data.rate.toFixed(1)}%`,
            `الحرارة: ${data.factors.temperature}°C`,
            `الرطوبة: ${data.factors.humidity}%`,
            `الكثافة: ${data.factors.populationDensity}`,
            `التعرض للشمس: ${data.factors.sunExposure}h`,
            `التلوث: ${data.factors.airPollution}μg/m³`
          ];
        }
      }
    }
  },
  indexAxis: 'y',
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
      title: {
        display: true,
        text: 'النسبة المئوية (%)'
      }
    },
    y: {
      title: {
        display: true,
        text: 'المدن'
      }
    }
  }
};