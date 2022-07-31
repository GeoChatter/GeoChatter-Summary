<script lang="ts">
	import type { Response } from 'src/types/Game';
	import { getPlayerNameFromPlayer } from '../js/helpers';

	export let game: Response.Game;
	export let callback: (pano: Response.RoundLocation & { text?: string }) => void;

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

			const renderGame = (game: Response.Game, roundsBefore = 1) => {
				game.source.rounds.forEach((round, i) => {
					i = i + roundsBefore - 1;
					// if (round.panoId) {
					// 	const panoId = processGGPanoId2GooglePanoId(round.panoId);
					// 	round.panoId = panoId;
					// }
					if (typeof round.lat !== 'number' || typeof round.lng !== 'number') return;
					const marker = L.marker([round.lat, round.lng])
						.addTo(map)
						.bindTooltip(`Round ${i + 1}`)
						.openTooltip()
						.on('click', (e) => {
							round.text = `Correct location in round ${i + 1}`;
							callback(round);
						});
				});
				game.rounds.forEach((round, i) => {
					i = i + roundsBefore - 1;
					round.guesses.forEach((guess) => {
						let avatar = L.icon({
							iconUrl: guess.player.profilePictureUrl,
							iconSize: [30, 30],
							className: 'mask mask-squircle'
						});
						L.marker([guess.guessLocation.latitude, guess.guessLocation.longitude], {
							icon: avatar
						})
							.on('click', () => {
								let pano = {
									panoId: guess.pano,
									heading: 0,
									pitch: 0,
									lat: guess.guessLocation.latitude,
									lng: guess.guessLocation.longitude,
									// place in results not implmented yet
									text: `${getPlayerNameFromPlayer(guess.player)}'s guess in round ${i + 1}`
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
			};

			// normal game
			if (!game.next) {
				renderGame(game);
			} else {
				let currentGame = game;
				let counter = 1;
				while (currentGame) {
					renderGame(currentGame, counter);
					counter = counter + 5;
					currentGame = currentGame.next;
				}
			}
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

<div class="absolute top-0 bottom-0 w-full rounded-md" use:initMap />
