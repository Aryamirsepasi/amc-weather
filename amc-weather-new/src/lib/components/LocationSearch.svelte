<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { debounce } from '$lib/utils';
  import type { Coordinates } from '$lib/utils';
  import { slide } from 'svelte/transition';

  const dispatch = createEventDispatcher<{
    locationSelected: Coordinates;
    getCurrentLocation: void;
  }>();

  let searchInput = '';
  let suggestions: Array<{
    name: string;
    country: string;
    lat: number;
    lon: number;
  }> = [];
  let showSuggestions = false;
  let isLoading = false;
  let inputElement: HTMLInputElement;

  const geocodingApiUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  const searchLocations = debounce(async (query: string) => {
    if (query.length < 2) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    isLoading = true;
    try {
      const response = await fetch(
        `${geocodingApiUrl}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      suggestions = data.results?.map((result: any) => ({
        name: result.name,
        country: result.country,
        lat: result.latitude,
        lon: result.longitude
      })) || [];
      
      showSuggestions = true;
    } catch (error) {
      console.error('Error searching locations:', error);
      suggestions = [];
    } finally {
      isLoading = false;
    }
  }, 300);

  function handleInput() {
    searchLocations(searchInput);
  }

  function handleLocationSelect(location: typeof suggestions[number]) {
    searchInput = `${location.name}, ${location.country}`;
    showSuggestions = false;
    
    const coordinates: Coordinates = {
      lat: location.lat,
      lon: location.lon
    };
    dispatch('locationSelected', coordinates);
  }

  function handleCurrentLocation() {
    searchInput = '';
    showSuggestions = false;
    dispatch('getCurrentLocation');
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      inputElement &&
      !inputElement.contains(event.target as Node)
    ) {
      showSuggestions = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<div class="relative flex items-center space-x-2">
  <div class="flex items-center space-x-2">
    <input
      bind:this={inputElement}
      bind:value={searchInput}
      on:input={handleInput}
      type="text"
      placeholder="Search location..."
      class="glass w-64 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-weather-accent/50 placeholder-gray-400"
    />
    {#if isLoading}
      <div class="animate-spin rounded-full h-5 w-5 border-2 border-weather-accent border-t-transparent"></div>
    {/if}
  </div>

  <button
    on:click={handleCurrentLocation}
    class="glass px-4 py-2 rounded-lg hover:bg-weather-secondary/30 flex items-center space-x-2"
    title="Get current location"
  >
    <span class="material-icons-outlined">my_location</span>
  </button>

  {#if showSuggestions && suggestions.length > 0}
    <div
      class="absolute top-full left-0 z-50 w-64 mt-2 glass-card divide-y divide-gray-700"
      transition:slide
    >
      {#each suggestions as location}
        <button
          class="w-full px-4 py-2 text-left hover:bg-weather-secondary/30 flex flex-col"
          on:click={() => handleLocationSelect(location)}
        >
          <span>{location.name}</span>
          <span class="text-sm text-gray-400">{location.country}</span>
        </button>
      {/each}
    </div>
  {:else if showSuggestions && searchInput.length >= 2}
    <div class="absolute top-full left-0 z-50 w-64 mt-2 glass-card p-4 text-center text-gray-400">
      No locations found
    </div>
  {/if}
</div>