<script lang="ts">


    import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import Square from "./Square.svelte";
    import Piece from "./Piece.svelte";
    import type { Coord, PieceRecord } from "../../types";
    import { onMount } from "svelte";

    let pieces: PieceRecord[] = [
        {
            type: "S",
            location: [3, 3],
        },
        {
            type: "B",
            location: [4, 4],
        },
        {
            type: "U",
            location: [3, 4],
        },
    ];

onMount(()=>{
    monitorForElements({
        onDrop({ source, location }) {
            const destination = location.current.dropTargets[0];
            console.log(destination)
            if (!destination) return;
            const destinationLocation = destination.data.location as Coord;
            const sourceLocation = source.data.location as Coord;

            const piece = pieces.find(
                (piece) =>
                    piece.location[0] === sourceLocation[0] &&
                    piece.location[1] === sourceLocation[1],
            );

            const restOfPieces = pieces.filter((p) => p !== piece);

       

            if (piece !== undefined) {
                pieces = [
                    { type: piece.type, location: destinationLocation },
                    ...restOfPieces,
                ];
            }
        },
    });
})
</script>

<div>
    {#each { length: 8 } as _, row}
        {#each { length: 8 } as __, col}
            {@const squareCoord = [row, col]}
            {@const piece = pieces.find(
                (p) =>{
                    return  p.location[0] === squareCoord[0] &&
                    p.location[1] === squareCoord[1];
                }
                   
            )}
            <Square {pieces} location={squareCoord}>
                {#if piece}
                    <Piece location={squareCoord} pieceType={piece.type} />
                {/if}
            </Square>
        {/each}
    {/each}
</div>

<style scoped>
    div {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        grid-template-rows: repeat(8, 1fr);
        width: 500px;
        height: 500px;
        border: 3px solid lightgrey;
    }
</style>
