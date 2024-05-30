<script lang="ts">
    import {
        draggable,
        dropTargetForElements,
    } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';

	export let item = null;
    export let index = null;
    export let level = null;

    let toggleOpen = false;
    let buttonRef = null;
    const indentPerLevel = 32;

    $: if (buttonRef) {
        combine(
            draggable({
                element: buttonRef,
                // onDragStart(e) {
                //     console.log("draggable:onDragStart", e);
                // },
                onDrop(e) {
                    console.log("draggable:onDrop", e);
                },
            }),
            dropTargetForElements({
                element: buttonRef,
                // onDragStart(e) {
                //     console.log("dropTargetForElements:onDragStart", e);
                // },
                onDrop(e) {
                    console.log("dropTargetForElements:onDrop", e);
                },
            })
        )
    }
</script>

<button
    id={item.id}
    data-testid={item.id}
    data-index={index}
    data-level={level}
    bind:this={buttonRef}
    type="button"
    style={`padding-left: ${level * indentPerLevel}; display: block; margin-bottom: 10px;`}
>
    <div>
        {item.text}
    </div>
    {#each item.children || [] as child, index}
        <svelte:self
            {child}
            {index}
            level={level + 1}
        />
    {/each}
</button>