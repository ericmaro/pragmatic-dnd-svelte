<script lang="ts">
    import { token } from "@atlaskit/tokens";
    import { onMount } from "svelte";
    import type { ItemMode, TreeItem as TreeItemType } from "./data/tree";
    import type { Instruction } from "@atlaskit/pragmatic-drag-and-drop-hitbox/tree-item";
    import { indentPerLevel } from "$lib/constants";
    export let item: TreeItemType;
    export let mode: ItemMode;
    export let level: number;
    export let index: number;


    let state: "idle" | "dragging" | "preview" | "parent-of-instruction" =
        "idle";

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
      'aria-expanded': item.isOpen,
      'aria-controls': `tree-item-${item.id}--subtree`,
    };
  })();

  let buttonRef: HTMLDivElement | null = null;

  let btnColor=token('color.text', 'currentColor')

  onMount(()=>{
    buttonRef = document.querySelector(`#tree-item-${CSS.escape(item.id)}`);
  })

  const toggleOpen =()=>{

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
style='--grid:8px; color:{btnColor}; border:0; width:100%; position:relative; background:transparent; margin:0; padding:0; border-radius:3; cursor:pointer; padding-left:{level * indentPerLevel}'
id={`tree-item-${item.id}`}
on:click={toggleOpen}
type="button"
data-index={index}
data-level={level}
data-testid={`tree-item-${item.id}`}
>
</button>



</div>
