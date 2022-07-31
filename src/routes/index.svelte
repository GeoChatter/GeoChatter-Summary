<script lang="ts">
	import * as signalR from '@microsoft/signalr';
	import Streetview from '../lib/components/Streetview.svelte';
	import Map from '../lib/components/Map.svelte';
	import Scoreboard from '../lib/components/Scoreboard.svelte';

	import type { Response } from '../types/Game';
	import { browser } from '$app/env';

	let pano: Response.RoundLocation;

	let gameRes: Promise<Response.Game> | undefined;
	import { page } from '$app/stores';
	import fakeInfiniteGame from '$lib/js/fakeInfiniteGame';
	if (browser) {
		const id = $page.url.searchParams.get('id');
		const connection = new signalR.HubConnectionBuilder()
			.withUrl('https://api.geochatter.tv/guess/geoChatterHub')
			.build();
		const startRes = connection.start();
		const getGameSummary = async (gameId: string) => {
			await startRes;
			const res: Response.Game = await connection.invoke('GetSummary', gameId);

			console.log(res);
			return res;
		};
		if (id) {
			// gameRes = getGameSummary(id);
			gameRes = fakeInfiniteGame();
		}
	}

	//
</script>

<div class="xl:p-12">
	<div class="">
		<div class="navbar rounded bg-base-100 w-full">
			<a href="https://geochatter.tv" class="btn btn-ghost normal-case text-xl">GeoChatter.tv</a>
		</div>
	</div>
	{#if gameRes}
		{#await gameRes then game}
			<div class="flex flex-col  h-full space-y-2 xl:space-y-12 pt-2 xl:pt-12 ">
				<div
					class="flex items-end justify-center flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 xl:space-x-12"
				>
					<div class="w-full h-full text-white">
						{`Summary of ${game.source.mapName} hosted by ${game.channel}`}
						<!-- for round amount -->
						<!--  of ${game.rounds.length} rounds -->
						<div class="relative w-full h-96 text-white">
							<Map
								callback={(p) => {
									pano = p;
									pano = pano;
								}}
								{game}
							/>
						</div>
					</div>

					{#if pano?.text}
						<div class="text-white w-full h-full">
							{pano?.text}
							<Streetview bind:pano />
						</div>
					{/if}
				</div>
				<div>
					<Scoreboard {game} />
				</div>
			</div>
		{/await}
	{/if}
</div>
