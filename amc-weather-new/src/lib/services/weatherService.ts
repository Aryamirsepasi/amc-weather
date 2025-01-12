// src/lib/services/weatherService.ts
import type { CurrentWeather, ForecastDay, HourlyForecast } from '../stores/weatherStore';
import { weatherDescriptions } from '../stores/weatherStore';

export class OpenMeteoService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';

  /**
   * Get the current weather for the given latitude, longitude
   */
  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('latitude', lat.toString());
    url.searchParams.set('longitude', lon.toString());
    // To get current weather, we must set current_weather=true
    url.searchParams.set('current_weather', 'true');
    // For sunrise/sunset, request daily=sunrise,sunset
    url.searchParams.set('daily', 'sunrise,sunset');
    // Auto timezone
    url.searchParams.set('timezone', 'auto');

    console.log('Fetching current weather from:', url.toString());

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error('Failed to fetch current weather data');
    }

    const data = await res.json();
    // "current_weather" object typically looks like:
    // {
    //   temperature: 12.3,
    //   windspeed: 10.7,
    //   winddirection: 223.0,
    //   weathercode: 3,
    //   is_day: 1,
    //   time: "2022-09-25T14:00"
    // }
    if (!data.current_weather) {
      throw new Error('No current_weather field returned by API');
    }

    // daily.sunrise and daily.sunset are arrays (one entry per day).
    if (!data.daily?.sunrise || !data.daily?.sunset) {
      throw new Error('No sunrise/sunset data returned by API');
    }

    const weathercode = data.current_weather.weathercode;
    return {
      temperature: data.current_weather.temperature,
      // 'feels_like' is not returned by default from current_weather;
      // you would need extra endpoints or a premium plan for that data.
      feels_like: data.current_weather.temperature, 
      humidity: 0,  // Not provided by default in current_weather
      pressure: 0,  // Not provided by default in current_weather
      wind_speed: data.current_weather.windspeed,
      wind_direction: data.current_weather.winddirection,
      weathercode,
      weather_description: weatherDescriptions[weathercode],
      // The sunrise & sunset in Open-Meteo daily arrays come as ISO date strings already:
      sunrise: data.daily.sunrise[0],
      sunset: data.daily.sunset[0]
    };
  }

  /**
   * Get daily forecast for the next `days` days
   */
  async getForecast(lat: number, lon: number, days: number): Promise<ForecastDay[]> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('latitude', lat.toString());
    url.searchParams.set('longitude', lon.toString());
    // For daily forecasts, we list whichever daily fields we need:
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode');
    url.searchParams.set('timezone', 'auto');
    // Optionally specify how many days you want. 
    // Alternatively you can pass `start_date`, `end_date`, etc.
    // If you do not specify, Open-Meteo defaults to 7 days
    // so let's do `days` days from today:
    // NOTE: only works up to 16 days max for the free plan
    // but let's keep it simpler for demonstration:
    //
    // const today = new Date();
    // const end = new Date();
    // end.setDate(today.getDate() + days - 1);
    // const dateFormat = (d: Date) => d.toISOString().split('T')[0];
    // url.searchParams.set('start_date', dateFormat(today));
    // url.searchParams.set('end_date', dateFormat(end));

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error('Failed to fetch daily forecast');
    }
    const data = await res.json();

    // daily/time is an array of date strings, e.g. "2022-09-25"
    if (!data.daily?.time) {
      throw new Error('No daily forecast data returned by API');
    }

    // We now have arrays: time, temperature_2m_max, temperature_2m_min, ...
    const time = data.daily.time as string[];
    const maxTemp = data.daily.temperature_2m_max as number[];
    const minTemp = data.daily.temperature_2m_min as number[];
    const precip = data.daily.precipitation_probability_max as number[];
    const weathercodes = data.daily.weathercode as number[];

    // Slice them to the number of `days` you requested
    return time.slice(0, days).map((dateStr, i) => {
      const code = weathercodes[i];
      return {
        date: dateStr,
        temp_max: maxTemp[i],
        temp_min: minTemp[i],
        precipitation_probability: precip[i],
        weathercode: code
      };
    });
  }

  /**
   * Get hourly forecast for the next `hours` hours
   */
  async getHourlyForecast(lat: number, lon: number, hours: number): Promise<HourlyForecast[]> {
    const url = new URL(this.baseUrl);
    url.searchParams.set('latitude', lat.toString());
    url.searchParams.set('longitude', lon.toString());
    // For hourly forecasts, specify which hourly fields we need:
    url.searchParams.set('hourly', 'temperature_2m,precipitation_probability,wind_speed_10m');
    url.searchParams.set('timezone', 'auto');

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error('Failed to fetch hourly forecast');
    }
    const data = await res.json();

    if (!data.hourly?.time) {
      throw new Error('No hourly forecast data returned by API');
    }

    const time = data.hourly.time as string[];
    const temperature = data.hourly.temperature_2m as number[];
    const precipitation = data.hourly.precipitation_probability as number[];
    const windSpeed = data.hourly.wind_speed_10m as number[];

    return time.slice(0, hours).map((t, i) => ({
      time: t,
      temperature: temperature[i],
      precipitation_probability: precipitation[i],
      wind_speed: windSpeed[i]
    }));
  }
}

export const weatherService = new OpenMeteoService();
