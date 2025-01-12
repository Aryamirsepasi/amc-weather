<script lang="ts">
  export let name: string;
  
  const iconMap: Record<string, string> = {
    thermometer: "thermostat",
    wind: "air",
    droplet: "water_drop",
    gauge: "speed",
    wb_sunny: "wb_sunny",
    wb_twilight: "nights_stay"
  };
</script>

<span class="material-icons-outlined text-weather-accent">
  {iconMap[name] || name}
</span>