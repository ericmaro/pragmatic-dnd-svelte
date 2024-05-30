<script lang="ts">
	import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
	import Item from '../components/Item.svelte';

	let ref = null;
	const items = Array.from({ length: 10 }, (_, i) => ({
		id: i,
		text: `Item ${i}`,

	}));

	$: if (ref) {
		monitorForElements({
			canMonitor: ({ source }) => true,
			onDrop: console.log,
		});
	}
</script>

<div bind:this={ref} id="dnd-test">
	{#each items as item, index}
		<Item
			{index}
			{item}
			level={0}
		/>
	{/each}
</div>

<div>
	SOME FAKE BOX
</div>