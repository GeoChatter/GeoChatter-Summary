<script lang="ts">
	import * as signalR from '@microsoft/signalr';
	import Streetview from '../lib/components/Streetview.svelte';
	import Map from '../lib/components/Map.svelte';
	import Scoreboard from '../lib/components/Scoreboard.svelte';

	import type { Response } from '../types/Game';
	import { browser, dev } from '$app/env';

	let pano: Response.RoundLocation;

	let gameRes: Promise<Response.Game> | undefined;
	import { page } from '$app/stores';
	import fakeStreakGame from '$lib/js/fakeStreakGame';
	// import fakeStreakGame from '$lib/js/fakeStreakGame';
	if (browser) {
		const id = $page.url.searchParams.get('id');
		if (id) {
			if (dev) {
				gameRes = fakeStreakGame();
				// console.log(gameRes);
			} else {
				const connection = new signalR.HubConnectionBuilder()
					.withUrl(import.meta.env.VITE_GEOCHATTERURL as string)
					.build();
				const startRes = connection.start();
				const getGameSummary = async (gameId: string) => {
					await startRes;
					const res: Response.Game = await connection.invoke('GetSummary', gameId);

					res.rounds.forEach((round) => {
						round.guesses.map((guess) => {
							guess.player;
							if (guess.player.profilePictureUrl.startsWith('pin')) {
								guess.player.profilePictureUrl = `https://www.geoguessr.com/images/auto/30/30/ce/0/plain/${guess.player.profilePictureUrl}`;
							}
							return guess;
						});
					});

					res.results.map((result) => {
							if (result.player.profilePictureUrl.startsWith('pin')) {
								result.player.profilePictureUrl = `https://www.geoguessr.com/images/auto/48/48/ce/0/plain/${result.player.profilePictureUrl}`;
							}
							return result;
					});
					console.log(res);
					return res;
				};
				gameRes = getGameSummary(id);
			}
		}
	}

	//
</script>

<div class="xl:p-12">
	<div class="">
		<div class="navbar rounded bg-base-100 w-full">
			<img class="h-8" src="https://geochatter.tv/icon_smaller.ico" /><a
				href="https://geochatter.tv"
				class="btn btn-ghost normal-case text-xl">GeoChatter.tv</a
			>
		</div>
	</div>
	{#if gameRes}
		{#await gameRes}
			<div
				class="btn mt-2 loading w-full h-screen flex justify-center items-center text-center text-white "
			>
				loading
			</div>
		{:then game}
			<div class="flex flex-col  h-full space-y-2 xl:space-y-12 pt-2 xl:pt-12 ">
				<div
					class="flex items-end justify-center flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 xl:space-x-12"
				>
					<div class="w-full h-full text-white">
						Summary of <span class="font-extrabold">{game.source.mapName}</span> hosted by
						<span class="font-extrabold"
							>{game.players.find((player) => player?.platformId === game.channel)
								?.displayName}</span
						>
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
		{:catch error}
			<div class="w-full h-screen text-center flex items-center justify-center">
				<p style="color: red">{error.message}</p>
			</div>
		{/await}
	{/if}
</div>
