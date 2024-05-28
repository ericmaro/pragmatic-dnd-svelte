<script lang="ts">
    import { ChevronDown, ChevronUp } from "lucide-svelte";
    export let isOpen: boolean = false;
</script>

{#if isOpen}
    <ChevronDown />
{:else}
    <ChevronUp />
{/if}
