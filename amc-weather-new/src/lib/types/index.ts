// src/lib/types/index.ts

// Location related types
export interface Coordinates {
    lat: number;
    lon: number;
  }
  
  export interface Location {
    name: string;
    country: string;
    coordinates: Coordinates;
  }
  
  // Weather related types
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
  
  export interface WeatherData {
    current: CurrentWeather;
    forecast: ForecastDay[];
    hourly: HourlyForecast[];
  }
  
  // Chart related types
  export interface ChartDataPoint {
    time: string;
    value: number;
    [key: string]: any;
  }
  
  export interface ChartConfig {
    title: string;
    dataKey: string;
    stroke: string;
    formatter?: (value: number) => string;
    domain?: [number, number];
  }
  
  // Settings and preferences
  export interface UserPreferences {
    temperatureUnit: 'C' | 'F';
    windSpeedUnit: 'km/h' | 'mph';
    pressureUnit: 'hPa' | 'inHg';
    theme: 'dark' | 'light';
    recentLocations: Location[];
    favoriteLocations: Location[];
  }
  
  // API response types
  export interface GeocodingResult {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }
  
  export interface WeatherAPIResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    current_weather: {
      temperature: number;
      windspeed: number;
      winddirection: number;
      weathercode: number;
      time: string;
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
      precipitation_probability: number[];
      windspeed_10m: number[];
    };
    daily: {
      time: string[];
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: number[];
      weathercode: number[];
      sunrise: string[];
      sunset: string[];
    };
  }
  
  // Error handling types
  export interface WeatherError {
    code: string;
    message: string;
    details?: string;
  }
  
  // Component prop types
  export interface WeatherCardProps {
    data: CurrentWeather;
    loading?: boolean;
    error?: WeatherError | null;
    onRefresh?: () => void;
  }
  
  export interface ForecastSectionProps {
    forecast: ForecastDay[];
    hourly: HourlyForecast[];
    showHourly?: boolean;
    onViewChange?: (view: 'daily' | 'hourly') => void;
  }
  
  export interface LocationSearchProps {
    onLocationSelect: (location: Location) => void;
    placeholder?: string;
    initialValue?: string;
  }
  
  export interface WeatherIconProps {
    code: number;
    size?: 'small' | 'medium' | 'large';
    className?: string;
  }
  
  // Store related types
  export interface WeatherState {
    data: WeatherData | null;
    loading: boolean;
    error: WeatherError | null;
    selectedLocation: Location | null;
    preferences: UserPreferences;
  }
  
  export type WeatherAction =
    | { type: 'SET_WEATHER_DATA'; payload: WeatherData }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: WeatherError | null }
    | { type: 'SET_LOCATION'; payload: Location }
    | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> };
  
  // Theme types
  export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  }
  
  export interface Theme {
    colors: ThemeColors;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    typography: Record<string, string>;
  }