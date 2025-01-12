// src/lib/stores/mapStore.ts
import { writable } from 'svelte/store';
import type { Coordinates } from '$lib/types';

export interface MapState {
  center: Coordinates;
  zoom: number;
  selectedLayer: 'temperature' | 'precipitation' | 'wind';
  mapReady: boolean;
}

const initialState: MapState = {
  center: { lat: 0, lon: 0 },
  zoom: 10,
  selectedLayer: 'temperature',
  mapReady: false
};

function createMapStore() {
  const { subscribe, set, update } = writable<MapState>(initialState);

  return {
    subscribe,
    setCenter: (coordinates: Coordinates) =>
      update(state => ({ ...state, center: coordinates })),
    setZoom: (zoom: number) =>
      update(state => ({ ...state, zoom })),
    setLayer: (layer: MapState['selectedLayer']) =>
      update(state => ({ ...state, selectedLayer: layer })),
    setMapReady: (ready: boolean) =>
      update(state => ({ ...state, mapReady: ready })),
    reset: () => set(initialState)
  };
}

export const mapStore = createMapStore();

// Helper functions for map interactions
export function calculateBounds(coordinates: Coordinates[], padding = 50) {
  if (!coordinates.length) return null;

  const lats = coordinates.map(coord => coord.lat);
  const lons = coordinates.map(coord => coord.lon);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  return {
    north: maxLat + padding * 0.001,
    south: minLat - padding * 0.001,
    east: maxLon + padding * 0.001,
    west: minLon - padding * 0.001
  };
}

export function calculateZoomLevel(bounds: ReturnType<typeof calculateBounds>) {
  if (!bounds) return 10;

  const latDiff = bounds.north - bounds.south;
  const lonDiff = bounds.east - bounds.west;
  const maxDiff = Math.max(latDiff, lonDiff);

  // Approximate zoom level calculation
  return Math.floor(14 - Math.log2(maxDiff * 111)); // 111km is approximately 1 degree
}