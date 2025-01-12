<script lang="ts">
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';
  import type { ChartData, ChartOptions, ChartType } from 'chart.js';

  export let data: ChartData<'line'>;
  export let options: ChartOptions<'line'> = {};

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  const defaultOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#9CA3AF',
        bodyColor: '#E5E7EB',
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          color: '#374151',
          drawOnChartArea: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: '#374151',
          drawOnChartArea: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12
          }
        }
      }
    }
  };

  $: mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins
    },
    scales: {
      ...defaultOptions.scales,
      ...options.scales
    }
  } as ChartOptions<'line'>;

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'line',
      data,
      options: mergedOptions
    });

    return () => {
      chart.destroy();
    };
  });

  $: if (chart) {
    chart.data = data;
    chart.options = mergedOptions;
    chart.update();
  }
</script>

<canvas bind:this={canvas}></canvas>