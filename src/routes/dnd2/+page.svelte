<script lang="ts">
	import {
		monitorForElements,
		dropTargetForElements,
	} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
	import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
	import Item from "../components/Item.svelte";
	import { text } from "@sveltejs/kit";

	let ref: any = null;
	let itemsFromDb = [
		{
			id: '1',
			text: "Item 1",
			parentId: null,
		},
		{
			id: '2',
			text: "Item 2",
			parentId: null,
		},
		{
			id: '3',
			text: "Item 3",
			parentId: null,
		},
		{
			id: '4',
			text: "Item 4",
			parentId: '1',
		},
		{
			id: '5',
			text: "Item 5",
			parentId: '1',
		},
		{
			id: '6',
			text: "Item 6",
			parentId: '4',
		},
	];
	$: console.log("itemsFromDb", itemsFromDb);
	$: items = convertToTree(itemsFromDb);
	$: if (ref) {
		combine(
			dropTargetForElements({
				element: ref,
			}),
			monitorForElements({
				canMonitor: ({ source }) => true,
				onDrop: handleDrop,
			}),
		);
	}
	function convertToTree(data) {
		const map = {};
		for (const item of data) {
			map[item.id] = item;
			item.children = [];
		}

		for (const item of data) {
			if (item.parentId !== null) {
				const parent = map[item.parentId];
				if (parent) {
					parent.children.push(item);
				}
			}
		}

		const roots = [];
		for (const item of data) {
			if (item.parentId === null) {
				roots.push(item);
			}
		}

		return roots;
	}
	function handleDrop(e: any) {
		if (
			!e ||
			!e?.source?.element ||
			!e?.location?.current?.dropTargets?.[0]?.element
		)
			return;
		const elementBeingDropped = e.source.element;
		const dropTarget = e.location.current.dropTargets[0].element;

		itemsFromDb = itemsFromDb.map((item) => {
			if (item.id === elementBeingDropped?.dataset?.testid) {
				return {
					...item,
					parentId: dropTarget?.dataset?.testid || null,
				};
			}
			return item;
		});
	}
</script>

<div bind:this={ref} id="dnd-test" style="background-color: blue;">
	{#each items as item, index}
		<Item {index} {item} level={0} />
	{/each}
</div>

<div>SOME FAKE BOX</div>
