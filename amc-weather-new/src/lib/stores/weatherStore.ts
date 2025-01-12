// src/lib/stores/weatherStore.ts
import { writable } from 'svelte/store';

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  weathercode: number;
  weather_description: string;
  sunrise: string;
  sunset: string;
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  precipitation_probability: number;
  weathercode: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation_probability: number;
  wind_speed: number;
}

export interface WeatherState {
  current: CurrentWeather | null;
  forecast: ForecastDay[] | null;
  hourly: HourlyForecast[] | null;
}

const initialState: WeatherState = {
  current: null,
  forecast: null,
  hourly: null
};

function createWeatherStore() {
  const { subscribe, set, update } = writable<WeatherState>(initialState);

  return {
    subscribe,
    set,
    update,
    reset: () => set(initialState)
  };
}

export const weatherStore = createWeatherStore();

// Weather code mappings
export const weatherDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};