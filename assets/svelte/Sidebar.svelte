<!-- File: c:/userdata/ex-programming/oura_dashboard/assets/svelte/Sidebar.svelte -->
<script>
    import { searchQuery, openGroups } from "./stores.js";
    import SidebarVisualizationGroup from "./SidebarVisualizationGroup.svelte";

    export let chartItemsTrends;
    export let chartItemsComposition;

    $: filteredItemsTrends = filterItems(chartItemsTrends, $searchQuery);
    $: filteredItemsComposition = filterItems(
        chartItemsComposition,
        $searchQuery,
    );

    function filterItems(items, query) {
        if (!query) return items;
        return items.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase()),
        );
    }

    let theme = "light";

    function toggleTheme() {
        theme = theme === "light" ? "dark" : "light";
        document.documentElement.classList.toggle("dark");
        document.dispatchEvent(
            new CustomEvent("themeChanged", { detail: theme }),
        );
    }
</script>

<div
    class="w-64 bg-white dark:bg-gray-800 shadow-md p-4 flex-none neon:border-r neon:border-pink-500"
>
    <div class="mb-8">
        <h1
            class="text-2xl font-bold mb-4 select-none dark:text-white neon:text-pink-500"
        >
            Oura Comparison Dashboard
        </h1>
        <div class="relative">
            <input
                type="text"
                placeholder="Search"
                class="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-800 neon:focus:ring-pink-500"
                bind:value={$searchQuery}
            />
            <span
                class="absolute right-0 top-0 bottom-0 px-4 py-2 text-gray-400 dark:text-gray-500"
            >
                <i class="fas fa-search"></i>
            </span>
        </div>
    </div>
    <ul class="space-y-2">
        <SidebarVisualizationGroup
            title="Time Series and Trends"
            items={filteredItemsTrends}
        />
        <SidebarVisualizationGroup
            title="Composition and Proportions"
            items={filteredItemsComposition}
        />
    </ul>

    <div class="mt-4">
        <button
            class="w-full py-2 px-4 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-800 neon:focus:ring-pink-500"
            on:click={toggleTheme}
        >
            {#if theme === "light"}
                <i class="fas fa-moon mr-2"></i> Dark Mode
            {:else}
                <i class="fas fa-sun mr-2"></i> Light Mode
            {/if}
        </button>
    </div>
</div>
