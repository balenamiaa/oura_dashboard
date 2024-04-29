<script>
    import * as echarts from "echarts";
    import { onMount, onDestroy } from "svelte";
    import { DEFAULT_LOADING_OPTIONS } from "./chartOptions";

    export let options;

    let chartInstance;
    let chartContainer;

    onMount(() => {
        chartInstance = echarts.init(chartContainer);
        chartInstance.setOption(options, true, true);

        window.addEventListener("resize", () => {
            chartInstance.resize();
        });

        document.addEventListener("setOptionsToNull", () => {
            chartInstance.setOption(DEFAULT_LOADING_OPTIONS, true, false);
        });
    });

    $: chartInstance?.setOption(options, true, true);

    onDestroy(() => {
        chartInstance?.dispose();
    });
</script>

<div bind:this={chartContainer} class="chart-container w-full h-96"></div>
