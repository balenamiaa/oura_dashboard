<script>
    import { highlightedItem } from "./stores.js";

    export let id;
    export let span;

    $: itemClasses = `px-2 mb-8 ${span === "small" ? "w-full lg:w-1/2" : "w-full"}`;
    $: isHighlighted = $highlightedItem === id;
</script>

<div
    {id}
    class={itemClasses}
    class:outline={isHighlighted}
    class:outline-2={isHighlighted}
    class:outline-amber-500={isHighlighted}
    class:animate-highlight-pop={isHighlighted}
>
    <div
        class="bg-white shadow-md rounded-lg p-6 transition duration-500 ease-in-out transform"
    >
        <slot />
    </div>
</div>
