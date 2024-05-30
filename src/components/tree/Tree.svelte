<script lang="ts">

  import {
    getInitialTreeState,
    tree,
    type TreeItem as TreeItemType,
  } from "./data/tree";

  import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";

  import * as liveRegion from "@atlaskit/pragmatic-drag-and-drop-live-region";
  import { onMount } from "svelte";
  import {
    extractInstruction,
    type Instruction,
    type ItemMode,
  } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";

  import invariant from "tiny-invariant";
  import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
  import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
  import TreeItem from "./TreeItem.svelte";
  type CleanupFn = () => void;
  function createTreeItemRegistry() {
    const registry = new Map<
      string,
      { element: HTMLElement; actionMenuTrigger: HTMLElement }
    >();

    const registerTreeItem = ({
      itemId,
      element,
      actionMenuTrigger,
    }: {
      itemId: string;
      element: HTMLElement;
      actionMenuTrigger: HTMLElement;
    }): CleanupFn => {
      registry.set(itemId, { element, actionMenuTrigger });
      return () => {
        registry.delete(itemId);
      };
    };

    return { registry, registerTreeItem };
  }

  let state = getInitialTreeState();
  let ref: HTMLDivElement | null = null;

  const { registry, registerTreeItem } = createTreeItemRegistry();

  const { data, lastAction } = state;

  let lastStateRef: TreeItemType[] = data;

  let uniqueContextId = Symbol('unique-id');

  $: lastStateRef = data;

  $: if (lastAction !== null) {
    if (lastAction.type === "modal-move") {
      const parentName =
        lastAction.targetId === "" ? "the root" : `Item ${lastAction.targetId}`;

      liveRegion.announce(
        `You've moved Item ${lastAction.itemId} to position ${
          lastAction.index + 1
        } in ${parentName}.`,
      );

      const { element, actionMenuTrigger } =
        registry.get(lastAction.itemId) ?? {};
      if (element) {
        triggerPostMoveFlash(element);
      }

      /**
       * Only moves triggered by the modal will result in focus being
       * returned to the trigger.
       */
      actionMenuTrigger?.focus();
    }
    if (lastAction.type === "instruction") {
      const { element } = registry.get(lastAction.itemId) ?? {};
      if (element) {
        triggerPostMoveFlash(element);
      }

 
    }
  }

  /**
   * Returns the items that the item with `itemId` can be moved to.
   *
   * Uses a depth-first search (DFS) to compile a list of possible targets.
   */
  const getMoveTargets = ({ itemId }: { itemId: string }) => {
    const data = lastStateRef;

    const targets = [];

    const searchStack = Array.from(data);
    while (searchStack.length > 0) {
      const node = searchStack.pop();

      if (!node) {
        continue;
      }

      /**
       * If the current node is the item we want to move, then it is not a valid
       * move target and neither are its children.
       */
      if (node.id === itemId) {
        continue;
      }

      /**
       * Draft items cannot have children.
       */
      if (node.isDraft) {
        continue;
      }

      targets.push(node);

      node.children.forEach((childNode) => searchStack.push(childNode));
    }

    return targets;
  };

  const getChildrenOfItem = (itemId: string) => {
    const data = lastStateRef;

    /**
     * An empty string is representing the root
     */
    if (itemId === "") {
      return data;
    }

    const item = tree.find(data, itemId);
    invariant(item);
    return item.children;
  };

  onMount(() => {
    liveRegion.cleanup();
    invariant(ref);

    combine(
      monitorForElements({
        canMonitor: ({ source }) =>
          source.data.uniqueContextId === uniqueContextId,
        onDrop(args) {
          const { location, source } = args;
          // didn't drop on anything
          if (!location.current.dropTargets.length) {
            return;
          }

          if (source.data.type === "tree-item") {
            const itemId = source.data.id as string;

            const target = location.current.dropTargets[0];
            const targetId = target.data.id as string;

            const instruction: Instruction | null = extractInstruction(
              target.data,
            );

            if (instruction !== null) {
              // state = {
              //   type: "instruction",
              //   instruction,
              //   itemId,
              //   targetId,
              // };
            }
          }
        },
      }),
    );
  });
</script>

<div  class="flex  box-content  p-4 flex-col" id="tree" bind:this={ref}>
  {#each data as item, index}
    <TreeItem
  
      item={item}
      mode={"expanded"}
      level={0}
   {index}
   

      uniqueContextId={uniqueContextId.toString()}
    />
  {/each}

</div>
