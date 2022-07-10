<script lang="ts">
	import type { Response } from 'src/types/Game';
	import { getPlayerNameFromPlayer, processGGPanoId2GooglePanoId } from '../js/helpers';

	export let game: Response.Game;
	export let callback: (pano: Response.RoundLocation) => void;

	const initMap = (node: HTMLDivElement) => {
		import('leaflet').then((L) => {
			const map = L.map(node, {
				center: [0, 0],
				zoom: 2
			});
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);

			game.source.rounds.forEach((round, i) => {
				const marker = L.marker([round.lat, round.lng])
					.addTo(map)
					.bindTooltip(`Round ${i + 1}`)
					.openTooltip()
					.on('click', (e) => {
						if (round.panoId) {
							const panoId = processGGPanoId2GooglePanoId(round.panoId);
							round.panoId = panoId;
						}
						callback(round);
					});
			});
			game.rounds.forEach((round, i) => {
				round.guesses.forEach((guess) => {
					let avatar = L.icon({
						iconUrl: guess.player.profilePictureUrl,
						iconSize: [30, 30],
						className: 'mask mask-squircle'
					});
					L.marker([guess.guessLocation.latitude, guess.guessLocation.longitude], {
						icon: avatar
					})
						.on('click', (e) => {
							let pano: any = {
								panoId: guess.pano,
								heading: 0,
								pitch: 0
							};
							callback(pano);
						})
						.bindTooltip(
							`${getPlayerNameFromPlayer(guess.player)} <br> Round ${i + 1}  <br> Score ${
								guess.score
							}`
						)

						.addTo(map);
				});
			});
		});
	};
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
		integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
		crossorigin=""
	/>
</svelte:head>

<div class="absolute top-0 bottom-0 w-full" use:initMap />
