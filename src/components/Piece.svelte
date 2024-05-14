<script lang="ts">
    import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import type { Coord } from "../types";
    import { onMount } from "svelte";

    export let location: Coord | number[];
    export let pieceType: string;

    let ref: HTMLDivElement | null = null;
    let dragging = false;

onMount(()=>{
    if (ref && pieceType && location) {
        draggable({
            element: ref,
            getInitialData: () => ({ location, pieceType }),
            onDragStart: () => (dragging = true),
            onDrop: () => (dragging = false),
        });
    }
})


</script>

<div bind:this={ref} >
    {pieceType}
</div>

<style scoped>
    div {
        width: 45px;
        height: 45px;
        padding: 4px;
        text-align: center;
        display: flex;
        align-items: center;
        color: white;
        font-size: 20px;
        justify-content: center;
        border-radius: 6px;
        background-color: red;
        box-shadow: 1px 3px 3px rgba(9, 30, 66, 0.25), 0px 0px 1px rgba(9, 30, 66, 0.31);
        
    }
    div:hover {
        background-color: red;
    }
</style>
