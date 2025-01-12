<script lang="ts">
    import { weatherStore } from '$lib/stores/weatherStore';
    import { fade } from 'svelte/transition';
    import WeatherIcon from './WeatherIcon.svelte';
    import MetricIcon from './MetricIcon.svelte';
    import { formatTime, formatTemperature } from '$lib/utils';
  
    $: weather = $weatherStore?.current;
    $: metrics = weather ? [
      {
        label: 'Feels Like',
        value: formatTemperature(weather.feels_like),
        icon: 'thermometer'
      },
      {
        label: 'Wind',
        value: `${weather.wind_speed} km/h`,
        icon: 'wind'
      },
      {
        label: 'Humidity',
        value: `${weather.humidity}%`,
        icon: 'droplet'
      },
      {
        label: 'Pressure',
        value: `${weather.pressure} hPa`,
        icon: 'gauge'
      }
    ] : [];
  </script>
  
  <div class="glass-card" transition:fade>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="flex flex-col justify-center items-center md:items-start space-y-4">
        <div class="flex items-center space-x-4">
          <WeatherIcon code={weather!.weathercode} size="large" />
          <div>
            <h2 class="text-4xl font-bold">
              {formatTemperature(weather!.temperature)}
            </h2>
            <p class="text-lg text-gray-300">
              {weather!.weather_description}
            </p>
          </div>
        </div>
        
        <div class="flex space-x-4 text-sm text-gray-300">
          <div class="flex items-center space-x-1">
            <MetricIcon name="wb_sunny" />
            <span>Sunrise: {formatTime(weather!.sunrise)}</span>
          </div>
          <div class="flex items-center space-x-1">
            <MetricIcon name="wb_twilight" />
            <span>Sunset: {formatTime(weather!.sunset)}</span>
          </div>
        </div>
      </div>
  
      <div class="grid grid-cols-2 gap-4">
        {#each metrics as metric}
          <div class="glass p-4 rounded-xl flex items-center space-x-3">
            <MetricIcon name={metric.icon} />
            <div>
              <p class="text-sm text-gray-300">{metric.label}</p>
              <p class="text-lg font-semibold">{metric.value}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>