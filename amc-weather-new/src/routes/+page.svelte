<script lang="ts">
	import { onMount } from 'svelte';
	import WeatherCard from '../lib/components/WeatherCard.svelte';
	import ForecastSection from '$lib/components/ForecastSection.svelte';
	import LocationSearch from '$lib/components/LocationSearch.svelte';
	import WeatherMap from '$lib/components/WeatherMap.svelte';
	import { weatherStore } from '$lib/stores/weatherStore';
	import type { Coordinates } from '$lib/types';
	import { OpenMeteoService } from '$lib/services/weatherService';

	let coordinates: Coordinates = { lat: 0, lon: 0 };
	let loading = true;
	let error: string | null = null;

	const weatherService = new OpenMeteoService();

	async function getUserLocation(): Promise<void> {
		try {
			const position = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject);
			});

			coordinates = {
				lat: position.coords.latitude,
				lon: position.coords.longitude
			};

			await fetchWeatherData();
		} catch (err) {
			error = 'Unable to get your location. Please search for a city manually.';
			loading = false;
		}
	}

	async function fetchWeatherData(): Promise<void> {
		try {
			loading = true;
			error = null;

			console.log('Fetching weather data for:', coordinates);

			const [current, forecast, hourly] = await Promise.all([
				weatherService.getCurrentWeather(coordinates.lat, coordinates.lon),
				weatherService.getForecast(coordinates.lat, coordinates.lon, 7),
				weatherService.getHourlyForecast(coordinates.lat, coordinates.lon, 24)
			]);

			console.log('Weather data received:', { current, forecast, hourly });

			weatherStore.set({
				current,
				forecast,
				hourly
			});
		} catch (err) {
			console.error('Error fetching weather data:', err);
			error =
				err instanceof Error
					? err.message
					: 'Failed to fetch weather data. Please try again later.';
		} finally {
			loading = false;
		}
	}

	function handleLocationSelected(event: CustomEvent<Coordinates>) {
		coordinates = event.detail;
		fetchWeatherData();
	}

	onMount(() => {
		getUserLocation();
	});
</script>

<div class="min-h-screen bg-weather-primary text-white">
	<header class="glass-card sticky top-0 z-50">
		<div class="container mx-auto flex items-center justify-between px-4 py-3">
			<h1 class="text-2xl font-bold">AMC Weather App</h1>
			<LocationSearch
				on:locationSelected={handleLocationSelected}
				on:getCurrentLocation={getUserLocation}
			/>
		</div>
	</header>

	<main class="container mx-auto px-4 py-8">
		{#if loading}
			<div class="glass-card animate-pulse">
				<div class="h-64 rounded-xl bg-weather-secondary/20"></div>
			</div>
		{:else if error}
			<div class="glass-card bg-red-500/20">
				<p class="py-4 text-center">{error}</p>
			</div>
		{:else}
			<div class="space-y-8">
				<WeatherCard />
				<ForecastSection />
				<WeatherMap {coordinates} />
			</div>
		{/if}
	</main>
</div>

<style lang="postcss">
	:global(body) {
		@apply bg-gradient-to-br from-weather-primary to-weather-secondary;
	}
</style>
