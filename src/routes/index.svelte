<script lang="ts">
	import * as signalR from '@microsoft/signalr';
	import Streetview from '../lib/components/Streetview.svelte';
	import Map from '../lib/components/Map.svelte';
	import Scoreboard from '../lib/components/Scoreboard.svelte';

	import type { Response } from '../types/Game';
	import { browser } from '$app/env';

	let pano: Response.RoundLocation;

	let gameRes: Promise<Response.Game>;
	import { page } from '$app/stores';
	if (browser) {
		const id = $page.url.searchParams.get('id');
		const connection = new signalR.HubConnectionBuilder()
			.withUrl('https://dev.geochatter.tv/guess/geoChatterHub')
			.build();
		const startRes = connection.start();
		const getGameSummary = async (gameId: string) => {
			await startRes;
			const res: Response.Game = await connection.invoke('GetSummary', gameId);

			console.log(res);
			return res;
		};
		if (id) {
			gameRes = getGameSummary(id);
		}
	}

	//
</script>

<div class="">
	<div class="navbar rounded bg-base-100 w-full">
		<a href="https://geochatter.tv" class="btn btn-ghost normal-case text-xl">GeoChatter.tv</a>
	</div>
</div>
{#if gameRes}
	{#await gameRes then game}
		<div class="flex flex-col  h-full space-y-2 pt-2">
			<div class="relative w-full h-96 ">
				<Map
					callback={(p) => {
						pano = p;
						pano = pano;
					}}
					{game}
				/>
			</div>

			<Streetview bind:pano />
			<div>
				<Scoreboard {game} />
			</div>
		</div>
	{/await}
{/if}
