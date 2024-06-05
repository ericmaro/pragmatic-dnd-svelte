<script lang="ts">
    import {
        draggable,
        dropTargetForElements,
    } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

    export let item: {
        id: number;
        text: string;
        children?: any[];
    };
    export let index: number;
    export let level: number;

    let toggleOpen = false;
    let buttonRef: any = null;
    const indentPerLevel = 32;

    $: if (buttonRef) {
        combine(
            draggable({
                element: buttonRef,
                // onDragStart(e) {
                //     console.log("draggable:onDragStart", e);
                // },
                onDrop(e) {
                    // console.log("draggable:onDrop", e);
                },
            }),
            dropTargetForElements({
                element: buttonRef,
                // onDragStart(e) {
                //     console.log("dropTargetForElements:onDragStart", e);
                // },
                onDrop(e) {
                    // console.log("dropTargetForElements:onDrop", e);
                },
                // getData: ({ input, element }) => {
                //     // your base data you want to attach to the drop target
                //     const data = {
                //     itemId: 'A',
                //     };
                //     // this will 'attach' the closest edge to your `data` object
                //     return attachClosestEdge(data, {
                //         input,
                //         element,
                //         // you can specify what edges you want to allow the user to be closest to
                //         allowedEdges: ['top', 'bottom'],
                //     });
                // },
            }),
        );
    }
</script>

<button
    id={item.id + ''}
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
        <svelte:self item={child} {index} level={level + 1} />
    {/each}
</button>
