<script>
    import Visualization from "./Visualization.svelte";
    import VisualizationsLayout from "./VisualizationsLayout.svelte";
    import VisualizationGroup from "./VisualizationGroup.svelte";
    import VisualizationItem from "./VisualizationItem.svelte";
    import {
        generateHeartrateOptions,
        generateHrvOptions,
        generateMetOptions,
        generateSleepScoreOptions,
        generateSleepDebtOptions,
        generateCalorieOptions,
        generateReadinessOptions,
        generateSleepPhasesOptions,
        generateActivityContributorsOptions,
        generateReadinessContributorsOptions,
        generateHeartRateZonesOptions,
        generateActivityTimeBreakdownOptions,
        generateSleepProportionOptions,
    } from "./chartOptions.js";

    export let chartsData;
</script>

<VisualizationsLayout>
    <VisualizationGroup title="Time Series and Trends">
        <VisualizationItem span="large" id="heart-rate">
            <Visualization options={generateHeartrateOptions(chartsData)} />
        </VisualizationItem>

        <VisualizationItem span="large" id="hrv">
            <Visualization options={generateHrvOptions(chartsData)} />
        </VisualizationItem>

        <VisualizationItem span="large" id="met">
            <Visualization options={generateMetOptions(chartsData)} />
        </VisualizationItem>

        <VisualizationItem span="small" id="sleep-score">
            <Visualization options={generateSleepScoreOptions(chartsData)} />
        </VisualizationItem>

        <VisualizationItem span="small" id="sleep-debt">
            <Visualization options={generateSleepDebtOptions(chartsData)} />
        </VisualizationItem>

        <VisualizationItem span="small" id="calories">
            <Visualization options={generateCalorieOptions(chartsData)} />
        </VisualizationItem>

        <VisualizationItem span="small" id="readiness">
            <Visualization options={generateReadinessOptions(chartsData)} />
        </VisualizationItem>
    </VisualizationGroup>

    <VisualizationGroup title="Composition and Proportions">
        <VisualizationItem span="large" id="sleep-phases">
            <Visualization options={generateSleepPhasesOptions(chartsData)} />
        </VisualizationItem>

        <VisualizationItem span="large" id="activity-contributors">
            <Visualization
                options={generateActivityContributorsOptions(chartsData)}
            />
        </VisualizationItem>

        <VisualizationItem span="large" id="readiness-contributors">
            <Visualization
                options={generateReadinessContributorsOptions(chartsData)}
            />
        </VisualizationItem>

        <VisualizationItem span="large" id="heart-rate-zones">
            <Visualization
                options={generateHeartRateZonesOptions(chartsData)}
            />
        </VisualizationItem>

        <VisualizationItem span="large" id="activity-time-proportions">
            <Visualization
                options={generateActivityTimeBreakdownOptions(chartsData)}
            />
        </VisualizationItem>

        <VisualizationItem span="large" id="sleep-type-proportions">
            <Visualization
                options={generateSleepProportionOptions(chartsData)}
            />
        </VisualizationItem>
    </VisualizationGroup>
</VisualizationsLayout>
