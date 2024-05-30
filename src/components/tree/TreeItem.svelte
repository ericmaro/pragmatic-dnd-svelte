<script lang="ts">
  import { token } from "@atlaskit/tokens";
  import { onMount } from "svelte";
  import type { ItemMode, TreeItem as TreeItemType } from "./data/tree";
  import {
    extractInstruction,
    type Instruction,
  } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
  import type { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/types";
  import { indentPerLevel } from "$lib/constants";
  import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
  import {
    draggable,
    dropTargetForElements,
    monitorForElements,
  } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

  export let item: TreeItemType;
  export let mode: ItemMode;
  export let level: number;
  export let index: number;
  export let uniqueContextId: string;
  export let getPathToItem: (value: string) => any | undefined;
  export let attachInstruction: (
    data: {
      id: string;
    },
    value: any,
  ) => any | undefined;

  let state: "idle" | "dragging" | "preview" | "parent-of-instruction" = "idle";

  let instruction: Instruction | null = null;

  const bg = token(
    "color.background.neutral.subtle.hovered",
    "rgba(9, 30, 66, 0.06)",
  );

  const aria = (() => {
    if (!item.children.length) {
      return undefined;
    }
    return {
      "aria-expanded": item.isOpen,
      "aria-controls": `tree-item-${item.id}--subtree`,
    };
  })();

  let buttonRef: HTMLDivElement | null = null;

  let btnColor = token("color.text", "currentColor");
  import invariant from "tiny-invariant";

  function getParentLevelOfInstruction(instruction: Instruction): number {
    if (instruction.type === "instruction-blocked") {
      return getParentLevelOfInstruction(instruction.desired);
    }
    if (instruction.type === "reparent") {
      return instruction.desiredLevel - 1;
    }
    return instruction.currentLevel - 1;
  }

  function delay({
    waitMs: timeMs,
    fn,
  }: {
    waitMs: number;
    fn: () => void;
  }): () => void {
    let timeoutId: number | null = window.setTimeout(() => {
      timeoutId = null;
      fn();
    }, timeMs);
    return function cancel() {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }
  const shouldHighlightParent = (location: DragLocationHistory): boolean => {
    const target = location.current.dropTargets[0];

    if (!target) {
      return false;
    }

    const instruction = extractInstruction(target.data);

    if (!instruction) {
      return false;
    }

    const targetId = target.data.id;
    invariant(typeof targetId === "string");

    const path = getPathToItem?.(targetId);
    const parentLevel: number = getParentLevelOfInstruction(instruction);
    const parentId = path[parentLevel];
    return parentId === item.id;
  };

  const clearParentOfInstructionState = () => {
    state = state === "parent-of-instruction" ? "idle" : state;
  };

  onMount(() => {
    buttonRef = document.querySelector(`#tree-item-${CSS.escape(item.id)}`);
  });

  const toggleOpen = () => {};

  $: if (item || mode || level || uniqueContextId) {
    if (buttonRef) {
      //   invariant(buttonRef);
      function updateIsParentOfInstruction({
        location,
      }: {
        location: DragLocationHistory;
      }) {
        if (shouldHighlightParent(location)) {
          state = "parent-of-instruction";
          return;
        }
        clearParentOfInstructionState();
      }

      combine(
        draggable({
          element: buttonRef,
          getInitialData: () => ({
            id: item.id,
            type: "tree-item",
            isOpenOnDragStart: item.isOpen,
            uniqueContextId,
          }),
          // onGenerateDragPreview: ({ nativeSetDragImage }) => {
          //   setCustomNativeDragPreview({
          //     getOffset: pointerOutsideOfPreview({ x: '16px', y: '8px' }),
          //     render: ({ container }) => {
          //       ReactDOM.render(<Preview item={item} />, container);
          //       return () => ReactDOM.unmountComponentAtNode(container);
          //     },
          //     nativeSetDragImage,
          //   });
          // },
          onDragStart: ({ source }) => {
            state = "dragging";
            // // collapse open items during a drag
            // if (source.data.isOpenOnDragStart) {
            //   dispatch({ type: 'collapse', itemId: item.id });
            // }
          },
          onDrop: ({ source }) => {
            state = "idle";
            // if (source.data.isOpenOnDragStart) {
            //   dispatch({ type: 'expand', itemId: item.id });
            // }
          },
        }),
        dropTargetForElements({
          element: buttonRef,
          getData: ({ input, element }) => {
            const data = { id: item.id };

            return attachInstruction?.(data, {
              input,
              element,
              indentPerLevel,
              currentLevel: level,
              mode,
              block: item.isDraft ? ["make-child"] : [],
            });
          },
          canDrop: ({ source }) =>
            source.data.type === "tree-item" &&
            source.data.uniqueContextId === uniqueContextId,
          getIsSticky: () => true,
          onDrag: ({ self, source }) => {
            const _instruction = extractInstruction(self.data);

            if (source.data.id !== item.id) {
              // expand after 500ms if still merging
              // if (
              //   instruction?.type === 'make-child' &&
              //   item.children.length &&
              //   !item.isOpen &&
              //   !cancelExpandRef.current
              // ) {
              //   cancelExpandRef.current = delay({
              //     waitMs: 500,
              //     fn: () => dispatch({ type: 'expand', itemId: item.id }),
              //   });
              // }
              // if (instruction?.type !== 'make-child' && cancelExpandRef) {
              //   cancelExpand();
              // }
              instruction = _instruction;

              return;
            }
            if (_instruction?.type === "reparent") {
              instruction = _instruction;
              return;
            }
            instruction = null;
          },
          onDragLeave: () => {
            // cancelExpand();
            instruction = null;
          },
          onDrop: () => {
            // cancelExpand();
            instruction = null;
          },
        }),
        monitorForElements({
          canMonitor: ({ source }) =>
            source.data.uniqueContextId === uniqueContextId,
          onDragStart: updateIsParentOfInstruction,
          onDrag: updateIsParentOfInstruction,
          onDrop() {
            clearParentOfInstructionState();
          },
        }),
      );
    }
  }
</script>

<div
  style="
        position:relative;
        {state === 'idle'
    ? `border-radius:3; cursor: pointer; ':hover':{ background: ${bg}}`
    : ''}
        "
>
  <button
    {...aria}
    style="--grid:8px; color:{btnColor}; border:0; width:100%; position:relative; background:transparent; margin:0; padding:0; border-radius:3; cursor:pointer; padding-left:{level *
      indentPerLevel}"
    id={`tree-item-${item.id}`}
    type="button"
    data-index={index}
    data-level={level}
    data-testid={`tree-item-${item.id}`}
    class="text-left"
  >
    Item {item.id}
    {#each item.children as child}
      <svelte:self
        item={child}
        key={child.id}
        level={level + 1}
        mode={"expanded"}
        {index}
      />
    {/each}
  </button>
</div>
