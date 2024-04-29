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
        class="block px-4 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800 select-none"
        on:click={onClickHandler}
    >
        {item}
    </span>
</li>
