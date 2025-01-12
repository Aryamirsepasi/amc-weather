<script lang="ts">
  export let code: number;
  export let size: 'small' | 'medium' | 'large' = 'medium';

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  // Map weather codes to icon names
  function getIconName(code: number): string {
    // Clear and partly cloudy
    if (code === 0) return 'clear-day';
    if (code === 1 || code === 2) return 'partly-cloudy-day';
    if (code === 3) return 'cloudy';
    
    // Fog
    if (code >= 45 && code <= 48) return 'fog';
    
    // Drizzle
    if (code >= 51 && code <= 55) return 'drizzle';
    if (code >= 56 && code <= 57) return 'drizzle';
    
    // Rain
    if (code >= 61 && code <= 65) return 'rain';
    if (code >= 66 && code <= 67) return 'rain';
    if (code >= 80 && code <= 82) return 'rain';
    
    // Snow
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 85 && code <= 86) return 'snow';
    
    // Thunderstorm
    if (code >= 95 && code <= 99) return 'thunderstorm';
    
    return 'clear-day'; // Default icon
  }

  $: iconName = getIconName(code);
  $: isNight = new Date().getHours() > 18 || new Date().getHours() < 6;
</script>

<div class={`${sizeClasses[size]} relative`}>
  <svg 
    class="w-full h-full"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {#if iconName === 'clear-day'}
      {#if isNight}
        <!-- Moon -->
        <path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          stroke="currentColor"
          class="text-blue-400"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      {:else}
        <!-- Sun -->
        <circle
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          class="text-yellow-400"
        />
        <path
          d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke="currentColor"
          class="text-yellow-400"
          stroke-width="2"
          stroke-linecap="round"
        />
      {/if}
    {:else if iconName === 'partly-cloudy-day' || iconName === 'cloudy'}
      <!-- Cloud -->
      <path
        d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
        fill="none"
        stroke="currentColor"
        class="text-gray-400"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    {:else if iconName === 'rain' || iconName === 'drizzle'}
      <!-- Rain -->
      <g>
        <path
          d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"
          fill="none"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 16v4m8-4v4m-4-3v3"
          stroke="currentColor"
          class="text-blue-400"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    {:else if iconName === 'thunderstorm'}
      <!-- Thunderstorm -->
      <g>
        <path
          d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"
          fill="none"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M13 11l-4 6h6l-4 6"
          fill="none"
          stroke="currentColor"
          class="text-yellow-400"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    {:else if iconName === 'snow'}
      <!-- Snow -->
      <g>
        <path
          d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"
          fill="none"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01"
          stroke="currentColor"
          class="text-blue-200"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    {:else if iconName === 'fog'}
      <!-- Fog -->
      <g>
        <path
          d="M5 5h14M5 9h14M5 13h14M5 17h14"
          stroke="currentColor"
          class="text-gray-400"
          stroke-width="2"
          stroke-linecap="round"
        />
      </g>
    {/if}
  </svg>
</div>