<script lang="ts">
    import type { TreeItem as TreeItemType } from "../data/tree";
    import ChildIcon from "./ChildIcon.svelte";
    import GroupIcon from "./GroupIcon.svelte";
    export let item: TreeItemType;
</script>

{#if item.children.length}
    <ChildIcon />
{:else}
    <GroupIcon isOpen={item.isOpen ?? false} />
{/if}
