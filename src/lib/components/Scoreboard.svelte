<script lang="ts">
	import type { Response } from '../../types/Game';
	import { getPlayerNameFromPlayer } from '../js/helpers';
	export let game: Response.Game;
	export let correctAndWrong: any;

	// different ways to sort it
	const sortScore = (row1: Response.Result, row2: Response.Result) => row2.score - row1.score;
	const sortTime = (row1: Response.Result, row2: Response.Result) => row1.time - row2.time;
	const sortDistance = (row1: Response.Result, row2: Response.Result) =>
		row1.distance - row2.distance;
	const sortNumberOfGuessDividedByNoGuesses = (row1: Response.Result, row2: Response.Result) =>
		row2?.player?.correctCountries / row2?.player?.noOfGuesses -
		row1?.player?.correctCountries / row1?.player?.noOfGuesses;
	const sortStreak = (row1: Response.Result, row2: Response.Result) =>
		(row2?.player?.bestStreak ?? 0) - (row1?.player?.bestStreak ?? 0);

	const getLastGame = (game: Response.Game) => {
		let lastGame = game;
		while (lastGame.next) {
			lastGame = lastGame.next;
		}
		return lastGame;
	};
	game = getLastGame(game);
	let currSort: (row1: Response.Result, row2: Response.Result) => void;

	if (game.mode === 1) {
		currSort = sortNumberOfGuessDividedByNoGuesses;
	} else {
		currSort = sortScore;

	}

	function generateLink(player: Response.Player): string {
			if (player.sourcePlatform === 3 ){
				return "https://www.geoguessr.com/user/" + player.platformId
			}
			if (player.sourcePlatform === 1 ){
				return 'https://twitch.tv/' + player?.displayName ?? player?.playerName
			}

			if (player.sourcePlatform === 2 ){
				return "http://www.youtube.com/results?search_query=" + player.displayName
			}
			throw "unknown sourcePlatform"
		}

</script>

<table class="table w-full h-full">
	<thead>
		<tr>
			<th />
			<th>Name</th>
			<th class="cursor-pointer" on:click={() => (currSort = sortDistance)}>Distance</th>
			{#if game.mode !== 1}
				<th class="cursor-pointer" on:click={() => (currSort = sortScore)}>Score</th>
			{/if}
			<th class="cursor-pointer" on:click={() => (currSort = sortTime)}>Time</th>
			<!-- <th class="cursor-pointer" on:click={() => (currSort = sortStreak)}>Best Streak</th> -->
			<th class="cursor-pointer" on:click={() => (currSort = sortNumberOfGuessDividedByNoGuesses)}
				>Correct Countries / Total Guesses</th
			>
		</tr>
	</thead>
	{#each game.results.filter((row) => typeof row.player !== 'undefined').sort(currSort) as row, i}
		<tbody>
			<tr>
				<th>{i + 1}</th>
				<th>

					<a
						href={generateLink(row.player)}
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

				<!-- not showing score in streaks game  -->
				{#if game.mode !== 1}
					<th>{row.score} </th>
				{/if}<th>{Math.round(row.time / 1000 / 60)} min {Math.round((row.time / 1000) % 60)} s</th>
				<!-- <th>{row?.player?.bestStreak ?? 0} </th> -->
				<th> {correctAndWrong[row?.player?.platformId].right}/{correctAndWrong[row?.player?.platformId].total}</th>
			</tr>
		</tbody>
	{/each}
</table>
