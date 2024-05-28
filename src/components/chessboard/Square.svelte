<script lang="ts">
    import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import type { Coord, PieceRecord } from "../../types";
    import { nanoid } from 'nanoid'
    import { onMount } from "svelte";

    export let pieces:PieceRecord[];
    export let location: Coord | number[];

    let entered = false;

    let el: HTMLDivElement | null = null;

    const isDark = (location[0] + location[1]) % 2 === 1;

    const randomId = nanoid()

onMount(()=>{

     //get element div
     el = document.querySelector(`#${CSS.escape(randomId)}`);
        if (el && pieces && location) {
            dropTargetForElements({
                element: el,
                getData: () => ({ location }),
                onDragEnter: () => (entered = true),
                onDragLeave: () => (entered = false),
                onDrop: () => (entered = false),
            });
        }

})
       

</script>

<div
id={randomId}
    style="background-color:{entered
        ? 'lightgreen'
        : isDark
          ? 'lightgrey'
          : 'white'}"
    bind:this={el}
>
    <slot />
</div>

<style scoped>
    div {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
