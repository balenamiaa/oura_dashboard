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

<div class="min-h-screen flex bg-gray-100 dark:bg-gray-900 neon:bg-black">
    <div
        id="tooltip-wrapper"
        class="fixed top-8 left-[50%] transform translate-x-[-50%] z-10 w-[80%] h-[50vh] pointer-events-none"
    ></div>

    <div class="md:hidden">
        <button
            class="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-md shadow-md focus:outline-none"
            on:click={toggleSidebar}
        >
            <svg
                class="w-6 h-6 text-gray-700 dark:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                ></path>
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
        <div class="md:p-8">
            <DatePicker {live} {startDate} />
        </div>
        <Visualizations {chartsData} />
    </div>
</div>
