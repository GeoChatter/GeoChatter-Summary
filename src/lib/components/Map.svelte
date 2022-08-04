<script lang="ts">
import type { Map, Marker } from 'leaflet';

	import type { Response } from 'src/types/Game';
	import { getPlayerNameFromPlayer } from '../js/helpers';

	export let game: Response.Game;
	export let callback: (pano: Response.RoundLocation & { text?: string }) => void;

let map: Map
	let markers: {[key: number]: Marker<any>[]} = {}
	let currentSelectedIndex: undefined | number = undefined
	const initMap = (node: HTMLDivElement) => {
		import('leaflet').then((L) => {
			map = L.map(node, {
				center: [0, 0],
				zoom: 2
			});
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);


			const renderGame = (game: Response.Game, roundsBefore = 1) => {

				game.rounds.forEach((round, i) => {
					i = i + roundsBefore - 1;

					if (typeof markers[i] === "undefined"){
						markers[i] = []
					}
					round.guesses.forEach((guess) => {
						let avatar = L.icon({
							iconUrl: guess?.player?.profilePictureUrl ?? "no pfp",
							iconSize: [30, 30],
							className: 'mask mask-squircle'
						});
						markers[i].push(L.marker([guess.guessLocation.latitude, guess.guessLocation.longitude], {
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
							).addTo(map)
							)
					});
				});

				game.source.rounds.forEach((round, i) => {
					i = i + roundsBefore - 1;
					// if (round.panoId) {
					// 	const panoId = processGGPanoId2GooglePanoId(round.panoId);
					// 	round.panoId = panoId;
					// }
					if (typeof round.lat !== 'number' || typeof round.lng !== 'number') {
						console.warn({round})
						return;

					}

					let icon = L.icon({
						iconUrl: '/results/marker.svg',
						iconSize: [30, 30],
						iconAnchor: [15,30],
						className: 'z-50'
					});
					const marker = L.marker([round.lat, round.lng], { icon })
						.addTo(map)
						.bindTooltip(`${i + 1}`, {
							permanent: true,
							direction: 'top',
							offset: [0,-25],
						})
						// .openTooltip()
						.on('click', (e) => {
							round.text = `Correct location in round ${i + 1}`;
							markers[i].forEach(marker => marker.addTo(map))
							currentSelectedIndex = i
							Object.keys(markers).forEach( (key:any) =>{
								if (Number(key) !== i ){
									markers[key].forEach((marker:any) => marker.remove(map))
								}}
							)
							callback(round);
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
<div class="flex items-center justify-center w-full absolute bottom-2 btn-group z-[5000]">

	{#each Object.keys(markers) as key }
		
  	<button on:click={()=> {
							markers[key].forEach((marker) => marker.addTo(map))
							currentSelectedIndex = Number(key)
							Object.keys(markers).forEach(k =>{
								if (Number(k) !== Number(key) ){
									markers[k].forEach(marker => marker.remove(map))
								}}
							)}
  	} class={`btn btn-xs ${Number(key) === currentSelectedIndex ? "btn-active": ""}`}>{Number(key)+1}</button>
  {/each}
</div>

<div class="absolute top-0 bottom-0 w-full rounded-md" use:initMap />
