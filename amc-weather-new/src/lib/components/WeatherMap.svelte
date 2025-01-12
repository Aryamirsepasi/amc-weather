<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import type { Coordinates } from '$lib/types';
  
    export let coordinates: Coordinates;
    const apiKey = import.meta.env.VITE_HERE_API_KEY;
  
    let mapContainer: HTMLElement;
    let map: H.Map;
    let platform: H.service.Platform;
    let currentMarker: H.map.Marker;
    
    // Keeping the layer selection to preserve UI, but it no longer toggles any tile layers.
    let selectedLayer: 'temperature' | 'precipitation' | 'wind' = 'temperature';
  
    function initializeMap() {
      // Initialize the HERE platform object
      platform = new H.service.Platform({ apikey: apiKey });
  
      // Get the default map types (vector, raster, etc.)
      const defaultLayers = platform.createDefaultLayers();
  
      // Initialize the map
      map = new H.Map(
        mapContainer,
        defaultLayers.vector.normal.map,
        {
          zoom: 10,
          center: { lat: coordinates.lat, lng: coordinates.lon },
          pixelRatio: window.devicePixelRatio || 1
        }
      );
  
      // Add map controls (UI) & interactions
      const ui = H.ui.UI.createDefault(map, defaultLayers);
      const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  
      // Make sure map resizes with the window
      window.addEventListener('resize', () => map.getViewPort().resize());
  
      // Add marker at the current location
      addCurrentLocationMarker();
    }
  
    function addCurrentLocationMarker() {
      // Remove existing marker if it exists
      if (currentMarker) {
        map.removeObject(currentMarker);
      }
  
      const markerElement = document.createElement('div');
      markerElement.className = 'location-marker';
      markerElement.innerHTML = `
        <div class="w-4 h-4 bg-weather-accent rounded-full border-2 border-white shadow-lg">
          <div class="absolute w-12 h-12 bg-weather-accent/30 rounded-full -top-4 -left-4 animate-ping"></div>
        </div>
      `;
  
      currentMarker = new H.map.DomMarker(
        { lat: coordinates.lat, lng: coordinates.lon },
        { icon: new H.map.DomIcon(markerElement) }
      );
  
      map.addObject(currentMarker);
      // Optionally recenter map
      map.setCenter({ lat: coordinates.lat, lng: coordinates.lon });
    }
  
    // Whenever coordinates change, move the marker
    $: if (map && coordinates) {
      addCurrentLocationMarker();
    }
  
    // The following reactivity once toggled OpenWeather tile layers,
    // but we have removed that code. The UI remains, no more tile overlays.
    $: if (map && selectedLayer) {
      // No tile layer to update anymore—just placeholder logic.
      // If you want to add a custom HERE layer later, do it here.
    }
  
    onMount(() => {
      // Dynamically load the HERE Maps scripts
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js';
      script.async = true;
      document.body.appendChild(script);
  
      const scripts = [
        'https://js.api.here.com/v3/3.1/mapsjs-service.js',
        'https://js.api.here.com/v3/3.1/mapsjs-ui.js',
        'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'
      ];
  
      Promise.all(
        scripts.map(src =>
          new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = src;
            s.async = true;
            s.onload = resolve;
            s.onerror = reject;
            document.body.appendChild(s);
          })
        )
      ).then(() => {
        // Initialize map after scripts load
        initializeMap();
      });
  
      // Load HERE Maps UI CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css';
      document.head.appendChild(link);
    });
  
    onDestroy(() => {
      if (map) {
        map.dispose();
      }
    });
  </script>
  
  <div class="glass-card p-0 relative">
    <!-- Map Controls -->
    <!-- You can remove these buttons if you don't need them anymore -->
    <div class="absolute top-4 right-4 z-10 glass p-2 flex space-x-2">
      <button
        class="px-3 py-1 rounded-lg text-sm {selectedLayer === 'temperature' ? 'bg-weather-accent' : 'hover:bg-weather-secondary/30'}"
        on:click={() => selectedLayer = 'temperature'}
      >
        Temperature
      </button>
      <button
        class="px-3 py-1 rounded-lg text-sm {selectedLayer === 'precipitation' ? 'bg-weather-accent' : 'hover:bg-weather-secondary/30'}"
        on:click={() => selectedLayer = 'precipitation'}
      >
        Precipitation
      </button>
      <button
        class="px-3 py-1 rounded-lg text-sm {selectedLayer === 'wind' ? 'bg-weather-accent' : 'hover:bg-weather-secondary/30'}"
        on:click={() => selectedLayer = 'wind'}
      >
        Wind
      </button>
    </div>
  
    <!-- Map Container -->
    <div
      bind:this={mapContainer}
      class="w-full h-96 rounded-2xl overflow-hidden"
    ></div>
  </div>
  
  <style>
    :global(.location-marker) {
      position: relative;
      width: 16px;
      height: 16px;
      margin-left: -8px;
      margin-top: -8px;
    }
  
    :global(.H_ui) {
      z-index: 20;
    }
  
    :global(.H_base) {
      /* Adjust if you want color filters, etc. */
      filter: brightness(0.9);
    }
  </style>
  