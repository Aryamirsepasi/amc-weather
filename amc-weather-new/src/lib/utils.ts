// src/lib/utils.ts
export interface Coordinates {
    lat: number;
    lon: number;
  }
  
  export function formatTemperature(temp: number, unit: 'C' | 'F' = 'C'): string {
    const temperature = unit === 'F' ? (temp * 9/5) + 32 : temp;
    return `${Math.round(temperature)}°${unit}`;
  }
  
  export function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }
  
  export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }
  
  export function getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }