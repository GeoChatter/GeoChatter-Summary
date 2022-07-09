<script lang="ts">
	import { browser } from '$app/env';

	import * as signalR from '@microsoft/signalr';

	export let id: string;
	import type { Game, Result } from './Game';

	const connection = new signalR.HubConnectionBuilder()
		.withUrl('https://dev.geochatter.tv/guess/geoChatterHub')
		.build();
	const startRes = connection.start();
	const getGameSummary = async (gameId: string) => {
		await startRes;
		const res: Game = await connection.invoke('GetSummary', gameId);

		console.log(res);
		return res;
	};

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
		});
	};

	const sortScore = (row1: Result, row2: Result) => row2.score - row1.score;
	const sortTime = (row1: Result, row2: Result) => row1.time - row2.time;
	const sortDistance = (row1: Result, row2: Result) => row1.distance - row2.distance;

	let currSort = sortScore;
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
		integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
		crossorigin=""
	/>
</svelte:head>
<div class="">
	<div class="navbar rounded bg-base-100 w-full">
		<a href="https://geochatter.tv" class="btn btn-ghost normal-case text-xl">GeoChatter.tv</a>
	</div>
</div>

<div class="flex flex-col  h-full space-y-2 pt-2">
	<div class="relative w-full h-96 ">
		<div class="absolute top-0 bottom-0 w-full" use:initMap />
	</div>
	<div>
		<table class="table w-full h-full">
			<thead>
				<tr>
					<th />
					<th>Name</th>
					<th class="cursor-pointer" on:click={() => (currSort = sortDistance)}>Distance (in ?)</th>
					<th class="cursor-pointer" on:click={() => (currSort = sortTime)}>Time</th>
					<th class="cursor-pointer" on:click={() => (currSort = sortScore)}>Score</th>
				</tr>
			</thead>
			{#await getGameSummary(id) then game}
				{#each game.results
					.filter((row) => typeof row.player !== 'undefined')
					.sort(currSort) as row, i}
					<tbody>
						<tr>
							<th>{i + 1}</th>
							<th>
								<a href={'https://twitch.tv/' + row.player?.displayName} target="_blank">
									<div class="flex items-center space-x-2">
										{#if row.player}
											<div class="mask mask-squircle w-12 h-12">
												<!-- svelte-ignore a11y-img-redundant-alt -->
												<img src={row.player?.profilePictureUrl} alt="profile picture" />
											</div>
											<div>
												<div class="font-bold">{row.player.displayName}</div>
											</div>
										{:else}
											<div>
												<div class="font-bold">
													{game.players.find((player) => player.id === row.id)}
												</div>
											</div>
										{/if}
									</div>
								</a>
							</th>
							<th>{row.distance}</th>
							<th>{row.time}</th>
							<th>{row.score}</th>
						</tr>
					</tbody>
				{/each}
			{/await}
		</table>
	</div>
</div>
