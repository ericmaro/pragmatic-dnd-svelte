<script lang="ts">
    import { onMount } from "svelte";
    import ListItem from "./ListItem.svelte";
    import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
    import {
        extractClosestEdge,
        type Edge,
    } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
    import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
    import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
    import {
        itemKey,
        type Item,
        type ItemData,
        type ItemEntry,
        type ListState,
    } from "$lib/constants";
    import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";

    const defaultItems: Item[] = [
        {
            id: "task-1",
            label: "Organize a team-building event",
        },
        {
            id: "task-2",
            label: "Create and maintain office inventory",
        },
        {
            id: "task-3",
            label: "Update company website content",
        },
        {
            id: "task-4",
            label: "Plan and execute marketing campaigns",
        },
        {
            id: "task-5",
            label: "Coordinate employee training sessions",
        },
        {
            id: "task-6",
            label: "Manage facility maintenance",
        },
        {
            id: "task-7",
            label: "Organize customer feedback surveys",
        },
        {
            id: "task-8",
            label: "Coordinate travel arrangements",
        },
    ];

    function isItemData(
        data: Record<string | symbol, unknown>,
    ): data is ItemData {
        return data[itemKey] === true;
    }

    let listState: ListState = {
        items: defaultItems,
        lastCardMoved: null,
    };

    let instanceId = Symbol("instance-id");
    let registry = getItemRegistry();

    function getItemRegistry() {
        const registry = new Map<string, HTMLElement>();

        function register({ itemId, element }: ItemEntry) {
            registry.set(itemId, element);

            return function unregister() {
                registry.delete(itemId);
            };
        }

        function getElement(itemId: string): HTMLElement | null {
            return registry.get(itemId) ?? null;
        }

        return { register, getElement };
    }

    const reorderItem = ({
        startIndex,
        indexOfTarget,
        closestEdgeOfTarget,
    }: {
        startIndex: number;
        indexOfTarget: number;
        closestEdgeOfTarget: Edge | null;
    }) => {
        const finishIndex = getReorderDestinationIndex({
            startIndex,
            closestEdgeOfTarget,
            indexOfTarget,
            axis: "vertical",
        });

        if (finishIndex === startIndex) {
            // If there would be no change, we skip the update
            return;
        }

        listState = {
            items: reorder({
                list: listState.items,
                startIndex,
                finishIndex,
            }),
            lastCardMoved: {
                item: listState.items[startIndex],
                previousIndex: startIndex,
                currentIndex: finishIndex,
                numberOfItems: listState.items.length,
            },
        };

        console.log(listState.lastCardMoved?.item.id);
    };
    //rective

    $: lastCardMoved = listState.lastCardMoved;
    $: if (lastCardMoved && registry) {
        if (lastCardMoved !== null) {
            const { item, previousIndex, currentIndex, numberOfItems } =
            lastCardMoved;
        const element = registry.getElement(item.id);
        if (element) {
            triggerPostMoveFlash(element);
        }
        }

       
    }

    onMount(() => {
        monitorForElements({
            canMonitor({ source }) {
                return (
                    isItemData(source.data) &&
                    source.data.instanceId === instanceId
                );
            },
            onDrop({ location, source }) {
                const target = location.current.dropTargets[0];
                if (!target) {
                    return;
                }

                const sourceData = source.data;
                const targetData = target.data;
                if (!isItemData(sourceData) || !isItemData(targetData)) {
                    return;
                }

                const indexOfTarget = listState.items.findIndex(
                    (item) => item.id === targetData.item.id,
                );
                if (indexOfTarget < 0) {
                    return;
                }

                const closestEdgeOfTarget = extractClosestEdge(targetData);

                reorderItem({
                    startIndex: sourceData.index,
                    indexOfTarget,
                    closestEdgeOfTarget,
                });
            },
        });
    });
    const registryRef = new Map<string, HTMLElement>();
    const registerItem = 
    ({ id, element }: { id: string; element: HTMLElement }) => {
      const registry = registryRef.current;
      if (!registry) {
        return () => {};
      }
      registry.set(id, element);

      return function unregisterItem() {
        registry.delete(id);
      };
    }
    
</script>

<div>
    {#each listState.items as item, i}
        <ListItem
            index={i}
            {item}
            {instanceId}
            {listState}
            registerItem={registerItem}
            {reorderItem}
        />
    {/each}
</div>
