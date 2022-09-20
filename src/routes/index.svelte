<script lang="ts">
	import * as signalR from '@microsoft/signalr';
	import Streetview from '../lib/components/Streetview.svelte';
	import Map from '../lib/components/Map.svelte';
	import Scoreboard from '../lib/components/Scoreboard.svelte';

	import type { Response } from '../types/Game';
	import { browser, dev } from '$app/env';

	let pano: Response.RoundLocation;

	import { page } from '$app/stores';
	import fakeInfiniteGame from '$lib/js/fakeInfiniteGame';
	import type { setResponse } from '@sveltejs/kit/node';
	import fakeStreakGame from '$lib/js/fakeStreakGame';

	let streamerName: string | undefined;

	function fixGGPicture(game: Response.Game) {
		game.rounds.forEach((round) => {
			round.guesses.map((guess) => {
				guess.player;
				if (guess.player.profilePictureUrl.startsWith('pin')) {
					guess.player.profilePictureUrl = `https://www.geoguessr.com/images/auto/30/30/ce/0/plain/${guess.player.profilePictureUrl}`;
				}
				return guess;
			});
		});

		game.results.map((result) => {
			if (result.player.profilePictureUrl.startsWith('pin')) {
				result.player.profilePictureUrl = `https://www.geoguessr.com/images/auto/48/48/ce/0/plain/${result.player.profilePictureUrl}`;
			}
			return result;
		});
		return game;
	}

	const getGameSummary = async (id: string): Promise<Response.Game> => {
		let gameRes: Response.Game;
		if (dev) {
			gameRes = await fakeInfiniteGame();
			// console.log(gameRes);
		} else {
			const connection = new signalR.HubConnectionBuilder()
				.withUrl(import.meta.env.VITE_GEOCHATTERURL as string)
				.build();
			const startRes = connection.start();
			await startRes;
			gameRes = await connection.invoke('GetSummary', id);
		}
		if (!gameRes) {
			throw 'no game found';
		}

		let game = gameRes;
		if (!game.next) {
			fixGGPicture(game);
		} else {
			let currentGame = game;
			while (currentGame.next) {
				fixGGPicture(currentGame);
				currentGame = currentGame?.next;
			}
			streamerName =currentGame.players.find((player) => player?.platformId === game.channel)?.displayName;
			fixGGPicture(currentGame);
			currentGame = currentGame?.next;
		}

		console.log(game);
		return game;
	};

	let gameRes: Promise<Response.Game> | undefined;
	if (browser) {
		const id = $page.url.searchParams.get('id');
		gameRes = getGameSummary(id as string);
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
							>{streamerName}</span
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
