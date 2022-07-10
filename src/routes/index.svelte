<script lang="ts">
	import { goto } from '$app/navigation';
	function routeToPage(route: string, replaceState: boolean) {
		goto(`/results/${route}`, { replaceState });
	}
	let value = '';
</script>

<div class="flex justify-center items-centerh-screen">
	<div>
		<span class="text-white p-2">enter results id</span><input
			class="input "
			type="text"
			bind:value
		/>
		<button
			class="btn"
			on:click={() => {
				routeToPage(value, true);
			}}>go</button
		>
	</div>
</div>
