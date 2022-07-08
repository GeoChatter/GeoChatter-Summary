<script lang="ts">
	import * as signalR from '@microsoft/signalr';
	export let id: string;

	const connection = new signalR.HubConnectionBuilder()
		.withUrl('https://dev.geochatter.tv/guess/geoChatterHub')
		.build();
	const startRes = connection.start();
	const getGameSummary = async (gameId: string) => {
		await startRes;
		const res: ScoreBoard.Row[] = await connection.invoke('GetGameSummary', gameId);

		console.log(res);
		return res;
	};
</script>

<table class="table w-full h-full">
	<thead>
		<tr>
			<th />
			<th>Name</th>
			<th>Distance</th>
			<th>Time</th>
			<th>Score</th>
		</tr>
	</thead>
	{#await getGameSummary(id) then rows}
		{#each rows.sort((row1, row2) => row2.score - row1.score) as row, i}
			<tbody>
				<tr>
					<th>{i}</th>
					<th>
						<div class="flex items-center space-x-2">
							<div class="mask mask-squircle w-12 h-12">
								<!-- svelte-ignore a11y-img-redundant-alt -->
								<img src={row.player.profilePictureUrl} alt="profile picture" />
							</div>
							<div>
								<div class="font-bold">{row.player.displayName}</div>
							</div>
						</div>
					</th>
					<th>{row.distance}</th>
					<th>{row.time}</th>
					<th>{row.score}</th>
				</tr>
			</tbody>
		{/each}
	{/await}
</table>
