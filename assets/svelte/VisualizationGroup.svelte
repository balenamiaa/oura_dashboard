<script>
    export let title;
    let isOpen = true;

    function toggleOpen() {
        isOpen = !isOpen;
    }
</script>

<div
    class="mb-8 bg-white dark:bg-gray-800 md:rounded-lg shadow-md neon:shadow-neon"
>
    <div
        class="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 neon:bg-gray-900 md:rounded-t-lg cursor-pointer"
        on:click={toggleOpen}
    >
        <h2
            class="text-xl font-bold text-gray-800 dark:text-white neon:text-pink-500"
        >
            {title}
        </h2>
        <svg
            class="w-6 h-6 text-gray-600 dark:text-gray-400 transition duration-200 ease-in-out transform {isOpen
                ? 'rotate-180'
                : ''}"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
            ></path>
        </svg>
    </div>
    {#if isOpen}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-1 md:p-4">
            <slot />
        </div>
    {/if}
</div>
