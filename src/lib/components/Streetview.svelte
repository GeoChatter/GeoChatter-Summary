<script lang="ts">
	import type { Response } from '../../types/Game';

	export let pano: Response.RoundLocation;

	function processGGPanoId2GooglePanoId(pano: string): string {
		console.log(pano);
		const len = pano.length / 2;
		let realPano = '';

		for (let i = 0; i < len; i++) {
			realPano += String.fromCharCode(parseInt(pano.substr(i * 2, 2), 16));
		}
		console.log(realPano);
		return realPano;
	}

	const createUrl = (pano: Response.RoundLocation) => {
		let url: string | undefined;
		console.log(pano);

		if (pano?.panoId && pano?.heading && pano?.zoom && pano?.pitch) {
			let zoom = 1;
			pano.pitch *= -1; // For some reason used reversed

			url = `https://maps.google.com/maps?layer=c&panoid=${processGGPanoId2GooglePanoId(
				pano.panoId
			)}&source=embed&output=svembed&ie=UTF8&cbp=,${pano.heading + 0.0001},,,
			`;
			console.log(url);
			return url;
		} else if (pano?.lat && pano?.lng) {
			let coordstr =
				pano.lat.toString().replace(',', '.') + ',' + pano.lng.toString().replace(',', '.');

			url = `https://maps.google.com/maps?layer=c&source=embed&output=svembed&ie=UTF8&cbll=${coordstr}`;
			console.log(url);
			return url;
		}
		console.log('not working', pano);
		url = undefined;

		// throw 'url not created';
	};
	$: url = createUrl(pano);
</script>

{#if typeof url !== 'undefined'}
	<iframe class="w-full h-96 " src={url} />
{/if}
