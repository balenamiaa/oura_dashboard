<!-- File: c:/userdata/ex-programming/oura_dashboard/assets/svelte/Visualization.svelte -->
<script>
    import * as echarts from "echarts";
    import { onMount, onDestroy } from "svelte";
    import { DEFAULT_LOADING_OPTIONS } from "./chartOptions";

    export let options;

    let chartInstance;
    let chartContainer;
    let theme = "vintage";

    onMount(() => {
        chartInstance = echarts.init(chartContainer, theme);
        chartInstance.setOption(options, true, true);

        window.addEventListener("resize", handleResize);
        document.addEventListener("setOptionsToNull", () => {
            chartInstance.setOption(DEFAULT_LOADING_OPTIONS, true, false);
        });
        document.addEventListener("themeChanged", handleThemeChange);

        return () => {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener("themeChanged", handleThemeChange);
        };
    });

    function handleResize() {
        if (chartInstance) {
            chartInstance.resize();
        }
    }

    function handleThemeChange(event) {
        theme = event.detail;
        if (chartInstance) {
            chartInstance.dispose();
            if (theme === "dark") {
                chartInstance = echarts.init(chartContainer, "dark");
            } else {
                chartInstance = echarts.init(chartContainer, "vintage");
            }
            chartInstance = echarts.init(chartContainer, theme);
            chartInstance.setOption(options, true, true);
        }
    }

    $: {
        if (chartInstance) {
            chartInstance.setOption(options, true, true);
        }
    }

    onDestroy(() => {
        if (chartInstance) {
            chartInstance.dispose();
        }
    });
</script>

<div
    bind:this={chartContainer}
    class="w-full h-[500px] bg-white dark:bg-gray-800 rounded-lg p-4 neon:shadow-neon"
></div>
