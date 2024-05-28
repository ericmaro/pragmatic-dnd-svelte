<script lang="ts">
    import { onMount } from "svelte";
    // Core Packages
    import Portal from "svelte-portal";
    import {
        draggable,
        dropTargetForElements,
    } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
    import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
    import {
        attachClosestEdge,
        extractClosestEdge,
        type Edge,
    } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
    import { token } from "@atlaskit/tokens";
    import invariant from "tiny-invariant";
    import {
        itemKey,
        type CleanupFn,
        type Item,
        type ItemData,
        type ItemEntry,
        type ListState,
    } from "$lib/constants";

    export let item;
    export let index: number;
    export let instanceId: symbol;
    export let listState: ListState;
    export let registerItem: (entry: ItemEntry) => CleanupFn;
    export let reorderItem: (args: {
        startIndex: number;
        indexOfTarget: number;
        closestEdgeOfTarget: Edge | null;
    }) => void;
    let ref: HTMLDivElement | null = null;
    let dragHandleRef: HTMLButtonElement | null = null;
    const idleState = { type: "idle" };
    const draggingState = { type: "dragging" };

    let setClosestEdge: Edge | null = null;
    let draggableState = idleState;

    function isItemData(data: any) {
        return data[itemKey] === true;
    }

    function getItemData({
        item,
        index,
        instanceId,
    }: {
        item: Item;
        index: number;
        instanceId: symbol;
    }): ItemData {
        return {
            [itemKey]: true,
            item,
            index,
            instanceId,
        };
    }

    $:console.log()

    onMount(() => {
        if (dragHandleRef && ref) {
            invariant(ref);
            invariant(dragHandleRef);
            const data = getItemData({ item, index, instanceId });

            registerItem({ itemId: item.id, element: ref });

            draggable({
                element: dragHandleRef,
                getInitialData: () => data,
                onGenerateDragPreview({ nativeSetDragImage }) {
                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        getOffset: pointerOutsideOfPreview({
                            x: token("space.200", "16px"),
                            y: token("space.100", "8px"),
                        }),
                        render({ container }) {
                            draggableState = { type: "preview", container };
                            return () => (draggableState = draggableState);
                        },
                    });
                },
                onDragStart() {
                    draggableState = draggingState;
                },
                onDrop() {
                    draggableState = idleState;
                },
            });

            dropTargetForElements({
                element: ref,
                canDrop({ source }) {
                    return (
                        isItemData(source.data) &&
                        source.data.instanceId === instanceId
                    );
                },
                getData({ input }) {
                    return attachClosestEdge(data, {
                        element: ref!,
                        input,
                        allowedEdges: ["top", "bottom"],
                    });
                },
                onDrag({ self, source }) {
                    const isSource = source.element === ref;
                    if (isSource) {
                        setClosestEdge = null;
                        return;
                    }

                    const closestEdge = extractClosestEdge(self.data);

                    const sourceIndex = source.data.index;
                    invariant(typeof sourceIndex === "number");

                    const isItemBeforeSource = index === sourceIndex - 1;
                    const isItemAfterSource = index === sourceIndex + 1;

                    const isDropIndicatorHidden =
                        (isItemBeforeSource && closestEdge === "bottom") ||
                        (isItemAfterSource && closestEdge === "top");

                    if (isDropIndicatorHidden) {
                        
                        setClosestEdge = null;
                        return;
                    }

                    setClosestEdge = closestEdge;
                },
                onDragLeave() {
                    setClosestEdge = null;
                },
                onDrop() {
                    setClosestEdge = null;
                },
            });
        }
    });
</script>

<div
    bind:this={ref}
    class="relative {draggableState.type === 'dragging'
        ? 'opacity-20'
        : ''}"
>
 
    <div class="flex">
        <button
            bind:this={dragHandleRef}
            type="button"
            class="bg-sky-500 hover:bg-sky-700 p-2"
        >
            +
        </button>
        <div class=" flex-1">{item.id}: {item.label}</div>
    </div>
   
    {#if setClosestEdge}
        <hr />
    {/if}
</div>
{#if draggableState.type === "preview"}
<div >{item.label}</div>
{/if}