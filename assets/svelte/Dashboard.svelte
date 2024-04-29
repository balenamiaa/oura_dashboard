<script>
    import DatePicker from "./DatePicker.svelte";
    import Sidebar from "./Sidebar.svelte";
    import Visualizations from "./Visualizations.svelte";

    export let live;
    export let chartItemsTrends;
    export let chartItemsComposition;
    export let chartsData;
    export let startDate;
</script>

<div class="min-h-screen bg-gray-100 flex">
    <Sidebar {chartItemsTrends} {chartItemsComposition} />

    <div class="w-full">
        <div class="p-8">
            <DatePicker {live} {startDate} />
        </div>
        <Visualizations {chartsData} />
    </div>
</div>
