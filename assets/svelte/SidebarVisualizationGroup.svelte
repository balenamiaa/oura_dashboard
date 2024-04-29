<script>
    import { openGroups } from "./stores.js";
    import SidebarVisualizationItem from "./SidebarVisualizationItem.svelte";

    export let title;
    export let items;

    $: isOpen = $openGroups.includes(title);

    function toggleGroup() {
        openGroups.update((groups) => {
            if (groups.includes(title)) {
                return groups.filter((g) => g !== title);
            } else {
                return [...groups, title];
            }
        });
    }
</script>

<li>
    <div
        class="flex items-center justify-between px-1 py-1 cursor-pointer hover:bg-gray-100"
        on:click={toggleGroup}
    >
        <span class="text-gray-800 select-none w-[80%]">{title}</span>
        <svg
            class="w-[20%] h-6 transition duration-200 ease-in-out transform {isOpen
                ? 'rotate-180'
                : ''}"
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fill-rule="evenodd"
                d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
            />
        </svg>
    </div>
    {#if isOpen}
        <ul class="ml-4 space-y-1">
            {#each items as item}
                <SidebarVisualizationItem {item} />
            {/each}
        </ul>
    {/if}
</li>
