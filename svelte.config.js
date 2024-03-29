import adapter from '@sveltejs/adapter-static';

import preprocess from "svelte-preprocess";
const dev = process.env.NODE_ENV === 'development';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],

	kit: {
		prerender: { enabled: true, default: true },
		paths: {
			base: dev ? "": process.env.BASE_PATH

		},
		adapter: adapter({
			// default options are shown
			pages: 'build',
			assets: 'build',
			fallback: null,
			precompress: false

		}
		)
	}
};

export default config;
