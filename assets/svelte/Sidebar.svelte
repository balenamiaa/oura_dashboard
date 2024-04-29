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
</script>

<div class="w-48 bg-white shadow-md p-4 flex-none">
    <div class="mb-8">
        <h1 class="text-2xl font-bold mb-4select-none">
            Oura Comparison Dashboard
        </h1>
        <div class="relative">
            <input
                type="text"
                placeholder="Search"
                class="w-full px-4 py-2 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                bind:value={$searchQuery}
            />
            <span
                class="absolute right-0 top-0 bottom-0 px-4 py-2 text-gray-400"
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
</div>
