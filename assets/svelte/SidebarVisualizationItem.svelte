<script>
    import { highlightedItem } from "./stores.js";

    export let item;

    let existingTimeout;

    function onClickHandler() {
        let itemId = item.toLowerCase().replace(/ /g, "-");
        let element = document.getElementById(itemId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            highlightedItem.set(itemId);

            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }

            existingTimeout = setTimeout(() => {
                highlightedItem.set(null);
            }, 3000);
        }
    }
</script>

<li>
    <span
        class="block px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 neon:hover:bg-gray-900 neon:text-white hover:text-gray-900 dark:hover:text-white cursor-pointer rounded-md"
        on:click={onClickHandler}
    >
        {item}
    </span>
</li>
