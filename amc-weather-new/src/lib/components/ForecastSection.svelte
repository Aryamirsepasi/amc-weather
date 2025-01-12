<script lang="ts">
  import { weatherStore } from '$lib/stores/weatherStore';
  import { formatDate, formatTemperature } from '$lib/utils';
  import WeatherIcon from './WeatherIcon.svelte';
  import LineChart from './LineChart.svelte';
  import { slide } from 'svelte/transition';
  
  export let showHourly = false;

  $: forecast = $weatherStore?.forecast || [];
  $: hourly = $weatherStore?.hourly || [];

  function toggleView() {
    showHourly = !showHourly;
  }

  // Format data for the chart.js hourly chart
  $: chartData = {
    labels: hourly.map(hour => new Date(hour.time).getHours() + ':00'),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: hourly.map(hour => hour.temperature),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: false
      },
      {
        label: 'Precipitation (%)',
        data: hourly.map(hour => hour.precipitation_probability),
        borderColor: '#60A5FA',
        backgroundColor: '#60A5FA',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0,
        fill: false,
        yAxisID: 'precipitation'
      }
    ]
  };

  $: chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...hourly.map(h => h.temperature)) + 5,
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: '#9CA3AF'
        }
      },
      precipitation: {
        type: 'linear' as const,
        position: 'right' as const,
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Precipitation (%)',
          color: '#9CA3AF'
        },
        grid: {
          display: false
        }
      }
    }
  };
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h2 class="text-xl font-semibold">Forecast</h2>
    <button
      class="glass-card px-4 py-2 text-sm hover:bg-weather-secondary/30"
      on:click={toggleView}
    >
      {showHourly ? '7-Day Forecast' : 'Hourly Forecast'}
    </button>
  </div>

  {#if showHourly}
    <div class="glass-card p-6" transition:slide>
      <div class="h-64">
        <LineChart data={chartData} options={chartOptions} />
      </div>
    </div>
  {:else}
    <div 
      class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4"
      transition:slide
    >
      {#each forecast as day}
        <div class="glass-card p-4 flex flex-col items-center space-y-3">
          <p class="text-sm text-gray-300">
            {formatDate(day.date)}
          </p>
          <WeatherIcon code={day.weathercode} size="medium" />
          <div class="flex justify-between w-full text-sm">
            <span>{formatTemperature(day.temp_min)}</span>
            <span class="text-weather-accent">
              {formatTemperature(day.temp_max)}
            </span>
          </div>
          <div class="flex items-center space-x-1 text-xs text-blue-400">
            <span class="material-icons-outlined text-sm">water_drop</span>
            <span>{day.precipitation_probability}%</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>