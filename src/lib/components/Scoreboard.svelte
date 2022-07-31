<script lang="ts">
	import type { Response } from '../../types/Game';
	import { getPlayerNameFromPlayer } from '../js/helpers';
	export let game: Response.Game;

	// different ways to sort it
	const sortScore = (row1: Response.Result, row2: Response.Result) => row2.score - row1.score;
	const sortTime = (row1: Response.Result, row2: Response.Result) => row1.time - row2.time;
	const sortDistance = (row1: Response.Result, row2: Response.Result) =>
		row1.distance - row2.distance;

	let currSort = sortScore;

	const getLastGame = (game: Response.Game) => {
		let lastGame = game;
		while (lastGame.next) {
			lastGame = lastGame.next;
		}
		return lastGame;
	};
	game = getLastGame(game);
</script>

<table class="table w-full h-full">
	<thead>
		<tr>
			<th />
			<th>Name</th>
			<th class="cursor-pointer" on:click={() => (currSort = sortDistance)}>Distance</th>
			<th class="cursor-pointer" on:click={() => (currSort = sortScore)}>Score</th>
			<th class="cursor-pointer" on:click={() => (currSort = sortTime)}>Time</th>
		</tr>
	</thead>
	{#each game.results.filter((row) => typeof row.player !== 'undefined').sort(currSort) as row, i}
		<tbody>
			<tr>
				<th>{i + 1}</th>
				<th>
					<a
						href={'https://twitch.tv/' + row.player?.displayName ?? row.player?.playerName}
						target="_blank"
					>
						<div class="flex items-center space-x-2">
							{#if row.player}
								<div class="mask mask-squircle w-12 h-12">
									<!-- svelte-ignore a11y-img-redundant-alt -->
									<img src={row.player?.profilePictureUrl} alt="profile picture" />
								</div>
								<div>
									<div class="font-bold">
										{getPlayerNameFromPlayer(row.player)}
									</div>
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
				<th>{Math.round(row.distance)} km</th>
				<th>{row.score} </th><th
					>{Math.round(row.time / 1000 / 60)} min {Math.round((row.time / 1000) % 60)} s</th
				>
			</tr>
		</tbody>
	{/each}
</table>
