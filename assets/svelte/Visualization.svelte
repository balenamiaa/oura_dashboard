<script>
    import * as echarts from "echarts";
    import { onMount, onDestroy } from "svelte";
    import { DEFAULT_LOADING_OPTIONS } from "./chartOptions";
    import { theme } from "./stores.js";

    export let options;

    let chartInstance;
    let chartContainer;
    let resizeObserver;

    onMount(() => {
        chartInstance = echarts.init(chartContainer, theme);
        chartInstance.setOption(options, true, true);

        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(chartContainer);
        document.addEventListener("setOptionsToNull", () => {
            chartInstance.setOption(DEFAULT_LOADING_OPTIONS, true, false);
        });

        theme.subscribe((value) => {
            if (chartInstance) {
                chartInstance.dispose();
                if (value === "dark") {
                    chartInstance = echarts.init(chartContainer, "dark");
                } else {
                    chartInstance = echarts.init(chartContainer, "vintage");
                }
                chartInstance.setOption(options, true, true);
            }
        });

        return () => {
            resizeObserver.disconnect();
        };
    });

    function handleResize() {
        if (chartInstance) {
            chartInstance.resize();
        }
    }

    $: {
        if (chartInstance) {
            chartInstance.setOption(options, true, true);
        }
    }
</script>

<div
    bind:this={chartContainer}
    class="w-full h-[32rem] bg-white dark:bg-gray-800 rounded-lg neon:shadow-neon"
></div>
