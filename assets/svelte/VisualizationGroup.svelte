<script>
    export let title;
    let isOpen = true;

    function toggleOpen() {
        isOpen = !isOpen;
    }
</script>

<div class="mb-12 border border-gray-200 rounded-lg shadow-md">
    <div
        class="flex items-center justify-between px-6 py-4 bg-gray-100 rounded-t-lg cursor-pointer transition duration-200 ease-in-out hover:bg-gray-200"
        on:click={toggleOpen}
    >
        <h2 class="text-xl font-bold select-none">{title}</h2>
        <svg
            class="w-5 h-5 transition duration-200 ease-in-out transform {isOpen
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
        <div class="flex flex-wrap -mx-4 p-4">
            <slot />
        </div>
    {/if}
</div>
