'use client'

import { TooltipItem } from "chart.js";

  export const useChartOptions = (theme: string | undefined) => {

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color:
            theme === 'custom'
              ? '#1f2937'
              : theme === 'light'
              ? '#1f2937'
              : '#e5e7eb',
        },
      },
      tooltip: {
        backgroundColor:
          theme === 'custom'
            ? '#f8fafc'
            : theme === 'light'
            ? '#ffffff'
            : '#0f172a',
        borderColor: theme === 'custom' ? '#60a5fa' : '#00f2ff',
        borderWidth: 1,
        titleColor: theme === 'custom' ? '#60a5fa' : '#00f2ff',
        bodyColor:
          theme === 'custom'
            ? '#1f2937'
            : theme === 'light'
            ? '#1f2937'
            : '#e5e7eb',
        // callbacks: {'{:?}
        //   label: context => `${context.parsed.y.toFixed(2)}%`,
        // },
        callback: (value: number | string,) =>
          `${value}%`,
      },
    },
    scales: {
      x: {
        ticks: {
          color:
            theme === 'custom'
              ? '#1f2937'
              : theme === 'light'
              ? '#1f2937'
              : '#e5e7eb',
        },
        grid: {
          color:
            theme === 'custom'
              ? '#e5e7eb'
              : theme === 'light'
              ? '#e5e7eb'
              : '#1e293b',
        },
      },
      y: {
        ticks: {
          color:
            theme === 'custom'
              ? '#1f2937'
              : theme === 'light'
              ? '#1f2937'
              : '#e5e7eb',
          callbacks: {
            // 👇 context explicitly typed
            label: (context: TooltipItem<'line'>): string =>
              `${context.parsed.y?.toFixed(2) ?? '0.00'}%`,
          },
        },
        grid: {
          color:
            theme === 'custom'
              ? '#e5e7eb'
              : theme === 'light'
              ? '#e5e7eb'
              : '#1e293b',
        },
        suggestedMax: 100,
        suggestedMin: 0,
      },
    },
  };


  return {chartOptions}
  }
  
 