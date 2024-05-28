<script lang="ts">
	import { token } from '@atlaskit/tokens';
      import type { TreeItem as TreeItemType } from "./data/tree";
    export let item: TreeItemType;
    const bg = token('elevation.surface.raised', 'red')

</script>

<div>Item {item.id}</div>

<style scoped>
    div{
        --grid: '8px';
        background: bg;
        padding: 'var(--grid)';
        border-radius: 3;

    }
</style>