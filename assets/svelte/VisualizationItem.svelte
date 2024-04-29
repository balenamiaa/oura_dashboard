<script>
    import { highlightedItem } from "./stores.js";

    export let id;
    export let span;

    $: itemClasses = `
        p-2 md:p-4 
        ${span === "small" ? "col-span-1 md:col-span-1" : "col-span-1 md:col-span-2"}
        bg-white dark:bg-gray-800 rounded-lg shadow-md
        neon:shadow-neon
        transition duration-500 ease-in-out transform
        ${$highlightedItem === id ? "animate-highlight-pop neon:shadow-xl neon:shadow-pink-500" : ""}
    `;
</script>

<div {id} class={itemClasses}>
    <slot />
</div>
