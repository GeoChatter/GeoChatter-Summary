<script lang="ts">
	import type { Response } from '../../types/Game';

	export let pano: Response.RoundLocation;

	const createUrl = (pano: Response.RoundLocation) => {
		let url: string | undefined;
		console.log(pano);

		if (pano?.panoId && typeof pano?.heading !== 'undefined') {
			let zoom = 1;
			pano.pitch *= -1; // For some reason used reversed

			url = `https://maps.google.com/maps?layer=c&panoid=${
				pano.panoId
			}&source=embed&output=svembed&ie=UTF8&cbp=,${pano.heading ? pano.heading : ''},,,
			`;
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
	<iframe class="w-full h-96  rounded-md" src={url} />
{:else}
	<div
		class="w-full text-white h-96  rounded-md text-center flex flex-col space-y-4 justify-center items-center"
	>
		<div>no street view :(</div>
		<a target="_blank" href={`https://www.google.com/maps/@${pano.lat},${pano.lng},8z`}
			><button class="btn">open location in google maps</button></a
		>
	</div>
{/if}
