import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {

			colors: {
	  
			  'weather-primary': '#1E213A',
	  
			  'weather-secondary': '#100E1D',
			  'weather-accent': '#3B82F6' 

	  
			}
		  },
		},

	plugins: [typography, forms, containerQueries]
} satisfies Config;
