<!-- File: c:/userdata/ex-programming/oura_dashboard/assets/svelte/Dashboard.svelte -->
<script>
    import DatePicker from "./DatePicker.svelte";
    import Sidebar from "./Sidebar.svelte";
    import Visualizations from "./Visualizations.svelte";

    export let live;
    export let chartItemsTrends;
    export let chartItemsComposition;
    export let chartsData;
    export let startDate;

    let isSidebarOpen = false;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }
</script>

<div class="min-h-screen flex">
    <div
        id="tooltip-wrapper"
        class="fixed top-8 left-[50%] transform translate-x-[-50%] z-10 w-[80%] h-[50vh] pointer-events-none"
    ></div>

    <div class="md:hidden">
        <button
            class="fixed top-[50%] left-1 z-50 p-1 bg-white dark:bg-gray-800 rounded-none shadow-md focus:outline-none"
            on:click={toggleSidebar}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6 transition-transform duration-300"
                class:rotate-180={isSidebarOpen}
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                />
            </svg>
        </button>
    </div>

    <div
        class="fixed md:static overflow-y-auto inset-0 z-10 bg-white dark:bg-gray-800 w-64 md:w-64 shadow-lg transform {isSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'} md:translate-x-0 transition duration-300 ease-in-out"
    >
        <Sidebar {chartItemsTrends} {chartItemsComposition} />
    </div>

    <div class="flex-1 transition duration-300 ease-in-out">
        <div class="p-1 md:p-8">
            <DatePicker {live} {startDate} />
        </div>
        <Visualizations {chartsData} />
    </div>
</div>
