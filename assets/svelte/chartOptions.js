const COLOR_ZIN = "#FFB6C1";
const COLOR_BALEN = "#73d1d1";
const SLEEP_PHASES_COLORS = ["#FFC100", "#FF6500", "#C40C0C"];
const ACTIVITY_CONTRIBUTORS_COLORS = ["#D6DAC8", "#FBF3D5", "#FDAF7B", "#BE7B72", "#824D74", "#401F71"];
const READINESS_CONTRIBUTORS_COLORS = ["#EFECEC", "#F6FDC3", "#CDFADB", "#FFB0B0", "#FF8080", "#FFCF96", "#FC6736", "#0C2D57"];
const ACTIVITY_TIME_BREAKDOWN_COLORS = ["#1C1678", "#8576FF", "#7BC9FF", "#A3FFD6"];
const SLEEP_TYPE_PROPORTIONS_COLORS = ["#D20062", "#D6589F", "#D895DA"];



export const DEFAULT_LOADING_OPTIONS = (() => {
    const columns = [];
    for (let i = 0; i <= 6; i++) {
        columns.push({
            type: "rect",
            x: i * 20,
            shape: { x: 0, y: -40, width: 10, height: 80 },
            style: { fill: "#5470c6" },
            keyframeAnimation: {
                duration: 1000,
                delay: i * 200,
                loop: true,
                keyframes: [
                    { percent: 0.5, scaleY: 0.1, easing: "cubicIn" },
                    { percent: 1, scaleY: 1, easing: "cubicOut" }
                ]
            }
        });
    }

    return {
        graphic: {
            elements: [
                {
                    type: "group",
                    left: "center",
                    top: "center",
                    children: columns
                }
            ]
        }
    };
})();

function getBaseLineChartOptions(title) {
    return {
        title: { left: "center", text: title },
        tooltip: { trigger: "axis" },
        legend: { top: "5%", type: "scroll", data: ["Zin", "Balen"] },
        grid: { left: "4%", top: "12%", right: "12%", bottom: "10%", containLabel: true },
        xAxis: { type: "time", boundaryGap: false },
        yAxis: { type: "value" },
        series: [],
        dataZoom: [
            {
                type: "slider",
                show: true,
                start: 0,
                end: 100,
                xAxisIndex: [0]
            },
            {
                type: "slider",
                show: true,
                start: 0,
                end: 100,
                yAxisIndex: [0]
            }
        ],
        responsive: true,
        maintainAspectRatio: false
    };
}

function getBaseAreaStackChartOptions(title, legendData) {
    return {
        title: { left: "center", text: title },
        tooltip: { trigger: "axis" },
        legend: { top: "5%", type: "scroll", data: legendData },
        grid: { left: "4%", top: "12%", right: "12%", bottom: "10%", containLabel: true },
        xAxis: { type: "time", boundaryGap: false },
        yAxis: { type: "value" },
        series: [],
        dataZoom: [
            {
                type: "slider",
                show: true,
                start: 0,
                end: 100,
                xAxisIndex: [0]
            },
            {
                type: "slider",
                show: true,
                start: 0,
                end: 100,
                yAxisIndex: [0]
            }
        ],
        responsive: true,
        maintainAspectRatio: false,
        media: [
            {
                query: {
                    maxWidth: 768
                },
                option: {
                    tooltip: {
                        className: "visualization-tooltip-center w-full",
                        appendTo: function (_chartContainer) {
                            return document.getElementById('tooltip-wrapper');
                        },
                    }
                }
            }
        ]
    };
}

function getBasePieChartOptions(title) {
    return {
        title: { left: "center", text: title },
        tooltip: { trigger: "item" },
        legend: {
            top: "5%",
            orient: "horizontal",
            top: "bottom",
            left: "center",
            type: "scroll",
            padding: [20, 0, 20, 0]
        },
        series: [],
        responsive: true,
        maintainAspectRatio: false,
        media: [
            {
                query: {
                    maxWidth: 768
                },
                option: {
                    series: [
                        {
                            radius: ['20%', '40%'],
                        },
                        {
                            radius: ['20%', '40%'],
                        }
                    ]
                }
            }
        ]
    };
}

export function generateHeartrateOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseLineChartOptions("Heart Rate");

    options.series = [
        {
            name: "Zin",
            type: "line",
            itemStyle: { color: COLOR_ZIN },
            data: chartsData.heart_rate_data_zin.map((d) => [d.timestamp * 1000, d.bpm]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1 }
        },
        {
            name: "Balen",
            type: "line",
            itemStyle: { color: COLOR_BALEN },
            data: chartsData.heart_rate_data_balen.map((d) => [d.timestamp * 1000, d.bpm]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 1 }
        }
    ];

    options.yAxis.axisLabel = { formatter: '{value} bpm' };
    options.tooltip.valueFormatter = (value) => `${value} bpm`;

    return options;
}

export function generateHrvOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseLineChartOptions("HRV");

    options.series = [
        {
            name: "Zin",
            type: "line",
            itemStyle: { color: COLOR_ZIN },
            data: chartsData.hrv_data_zin.map((d) => [d.timestamp * 1000, d.ms]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "line",
            itemStyle: { color: COLOR_BALEN },
            data: chartsData.hrv_data_balen.map((d) => [d.timestamp * 1000, d.ms]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    options.yAxis.axisLabel = { formatter: '{value} ms' };
    options.tooltip.valueFormatter = (value) => `${value.toFixed(2)} ms`;

    return options;
}

export function generateMetOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseLineChartOptions("MET");

    options.series = [
        {
            name: "Zin",
            type: "line",
            itemStyle: { color: COLOR_ZIN },
            data: chartsData.met_data_zin.map((d) => [d.timestamp * 1000, d.met_value]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "line",
            itemStyle: { color: COLOR_BALEN },
            data: chartsData.met_data_balen.map((d) => [d.timestamp * 1000, d.met_value]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    options.tooltip.valueFormatter = (value) => `${value.toFixed(2)} MET`;

    return options;
}

export function generateSleepScoreOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseLineChartOptions("Sleep Score");

    options.series = [
        {
            name: "Zin",
            type: "line",
            itemStyle: { color: COLOR_ZIN },
            areaStyle: {},
            data: chartsData.sleep_score_data_zin.map((d) => [d.timestamp * 1000, d.value || 0]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "line",
            itemStyle: { color: COLOR_BALEN },
            areaStyle: {},
            data: chartsData.sleep_score_data_balen.map((d) => [d.timestamp * 1000, d.value || 0]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    return options;
}

export function generateSleepDebtOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseLineChartOptions("Sleep Debt");

    options.series = [
        {
            name: "Zin",
            type: "line",
            itemStyle: { color: COLOR_ZIN },
            areaStyle: {},
            data: chartsData.sleep_debt_data_zin.map((d) => [d.timestamp * 1000, d.cumulative_debt]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "line",
            itemStyle: { color: COLOR_BALEN },
            areaStyle: {},
            data: chartsData.sleep_debt_data_balen.map((d) => [d.timestamp * 1000, d.cumulative_debt]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    options.tooltip.valueFormatter = (value) => `${value.toFixed(1)} hr`;

    return options;
}

export function generateCalorieOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseLineChartOptions("Calories");

    options.series = [
        {
            name: "Zin",
            type: "line",
            itemStyle: { color: COLOR_ZIN },
            data: chartsData.calorie_data_zin.map((d) => [d.timestamp * 1000, d.calories]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "line",
            itemStyle: { color: COLOR_BALEN },
            data: chartsData.calorie_data_balen.map((d) => [d.timestamp * 1000, d.calories]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    options.yAxis.axisLabel = { formatter: '{value} kcal' };
    options.tooltip.valueFormatter = (value) => `${value} kcal`;

    return options;
}

export function generateReadinessOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseLineChartOptions("Readiness");

    options.series = [
        {
            name: "Zin",
            type: "line",
            itemStyle: { color: COLOR_ZIN },
            data: chartsData.readiness_data_zin.map((d) => [d.timestamp * 1000, d.score]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "line",
            itemStyle: { color: COLOR_BALEN },
            data: chartsData.readiness_data_balen.map((d) => [d.timestamp * 1000, d.score]),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    return options;
}

export function generateSleepPhasesOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseAreaStackChartOptions("Sleep Phases", ["Light", "Deep", "REM"]);

    options.series = [
        createSeries("Light", "zl", "Zin", SLEEP_PHASES_COLORS[0], (d) => d.light, chartsData.sleep_phases_data_zin),
        createSeries("Deep", "zd", "Zin", SLEEP_PHASES_COLORS[1], (d) => d.deep, chartsData.sleep_phases_data_zin),
        createSeries("REM", "zr", "Zin", SLEEP_PHASES_COLORS[2], (d) => d.rem, chartsData.sleep_phases_data_zin),
        createSeries("Light", "bl", "Balen", SLEEP_PHASES_COLORS[0], (d) => d.light, chartsData.sleep_phases_data_balen),
        createSeries("Deep", "bd", "Balen", SLEEP_PHASES_COLORS[1], (d) => d.deep, chartsData.sleep_phases_data_balen),
        createSeries("REM", "br", "Balen", SLEEP_PHASES_COLORS[2], (d) => d.rem, chartsData.sleep_phases_data_balen)
    ];

    options.tooltip = {
        trigger: 'axis',

        formatter: function (params) {
            const zinData = params.filter(param => param.seriesId.startsWith('z'));
            const balenData = params.filter(param => param.seriesId.startsWith('b'));
            const totalZin = zinData.reduce((sum, item) => sum + item.value[2], 0);
            const totalBalen = balenData.reduce((sum, item) => sum + item.value[2], 0);

            let table = `
              <div class="bg-white rounded-lg shadow-md p-4 mx-auto">
                <table class="w-full text-sm text-left text-gray-500">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3 px-6">Phase</th>
                      <th scope="col" class="py-3 px-6" style="color: ${COLOR_ZIN}; background-color: rgba(255, 182, 193, 0.1); border: 1px solid ${COLOR_ZIN};">
                        Zin (%)
                      </th>
                      <th scope="col" class="py-3 px-6" style="color: ${COLOR_BALEN}; background-color: rgba(175, 238, 238, 0.1); border: 1px solid ${COLOR_BALEN};">
                        Balen (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
            `;

            for (let i = 0; i < Math.max(zinData.length, balenData.length); i++) {
                const zinPercent = zinData[i] ? ((zinData[i].value[2] / totalZin) * 100).toFixed(2) : '-';
                const balenPercent = balenData[i] ? ((balenData[i].value[2] / totalBalen) * 100).toFixed(2) : '-';
                const phase = zinData[i] ? zinData[i].seriesName : balenData[i].seriesName;

                table += `
                <tr class="bg-white border-b">
                  <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    ${phase}
                  </th>
                  <td class="py-4 px-6 font-bold" style="color: ${COLOR_ZIN}; background-color: rgba(255, 182, 193, 0.05); border: 1px solid ${COLOR_ZIN};">
                    ${zinPercent}
                  </td>
                  <td class="py-4 px-6 font-bold" style="color: ${COLOR_BALEN}; background-color: rgba(175, 238, 238, 0.05); border: 1px solid ${COLOR_BALEN};">
                    ${balenPercent}
                  </td>
                </tr>
              `;
            }

            table += `
                  </tbody>
                </table>
              </div>
            `;

            return table;
        }
    };

    options.yAxis.axisLabel = { formatter: (value) => `${Math.abs(value)} min` };
    options.tooltip.valueFormatter = (value) => `${value} min`;

    return options;
}

function createSeries(name, id, stack, color, selector, data) {
    return {
        name,
        type: "line",
        id,
        stack,
        itemStyle: { color },
        areaStyle: {},
        emphasis: { focus: "series" },
        data: data.map((d) => [d.timestamp * 1000, stack === "Balen" ? -selector(d) : selector(d), selector(d) + d.light + d.deep + d.rem]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3 }
    };
}

export function generateActivityContributorsOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseAreaStackChartOptions(
        "Activity Contributors",
        ["Meet Daily Targets", "Move Every Hour", "Recovery Time", "Stay Active", "Training Frequency", "Training Volume"]
    );

    options.series = [
        createActivityContributorSeries("Meet Daily Targets", "zmdt", "Zin", ACTIVITY_CONTRIBUTORS_COLORS[0], (d) => d.meet_daily_targets || 0, chartsData.activity_contributors_data_zin),
        createActivityContributorSeries("Move Every Hour", "zmeh", "Zin", ACTIVITY_CONTRIBUTORS_COLORS[1], (d) => d.move_every_hour || 0, chartsData.activity_contributors_data_zin),
        createActivityContributorSeries("Recovery Time", "zrt", "Zin", ACTIVITY_CONTRIBUTORS_COLORS[2], (d) => d.recovery_time || 0, chartsData.activity_contributors_data_zin),
        createActivityContributorSeries("Stay Active", "zsa", "Zin", ACTIVITY_CONTRIBUTORS_COLORS[3], (d) => d.stay_active || 0, chartsData.activity_contributors_data_zin),
        createActivityContributorSeries("Training Frequency", "ztf", "Zin", ACTIVITY_CONTRIBUTORS_COLORS[4], (d) => d.training_frequency || 0, chartsData.activity_contributors_data_zin),
        createActivityContributorSeries("Training Volume", "ztv", "Zin", ACTIVITY_CONTRIBUTORS_COLORS[5], (d) => d.training_volume || 0, chartsData.activity_contributors_data_zin),
        createActivityContributorSeries("Meet Daily Targets", "bmdt", "Balen", ACTIVITY_CONTRIBUTORS_COLORS[0], (d) => -d.meet_daily_targets || 0, chartsData.activity_contributors_data_balen),
        createActivityContributorSeries("Move Every Hour", "bmeh", "Balen", ACTIVITY_CONTRIBUTORS_COLORS[1], (d) => -d.move_every_hour || 0, chartsData.activity_contributors_data_balen),
        createActivityContributorSeries("Recovery Time", "brt", "Balen", ACTIVITY_CONTRIBUTORS_COLORS[2], (d) => -d.recovery_time || 0, chartsData.activity_contributors_data_balen),
        createActivityContributorSeries("Stay Active", "bsa", "Balen", ACTIVITY_CONTRIBUTORS_COLORS[3], (d) => -d.stay_active || 0, chartsData.activity_contributors_data_balen),
        createActivityContributorSeries("Training Frequency", "btf", "Balen", ACTIVITY_CONTRIBUTORS_COLORS[4], (d) => -d.training_frequency || 0, chartsData.activity_contributors_data_balen),
        createActivityContributorSeries("Training Volume", "btv", "Balen", ACTIVITY_CONTRIBUTORS_COLORS[5], (d) => -d.training_volume || 0, chartsData.activity_contributors_data_balen)
    ];

    options.tooltip = {
        trigger: 'axis',

        formatter: function (params) {
            const zinData = params.filter(param => param.seriesId.startsWith('z'));
            const balenData = params.filter(param => param.seriesId.startsWith('b'));
            const totalZin = zinData.reduce((sum, item) => sum + item.value[1], 0);
            const totalBalen = balenData.reduce((sum, item) => sum + item.value[1], 0);

            let table = `
          <div class="bg-white rounded-lg shadow-md p-4 mx-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="py-3 px-6">Contributor</th>
                  <th scope="col" class="py-3 px-6" style="color: ${COLOR_ZIN}; background-color: rgba(255, 182, 193, 0.1); border: 1px solid ${COLOR_ZIN};">
                    Zin (%)
                  </th>
                  <th scope="col" class="py-3 px-6" style="color: ${COLOR_BALEN}; background-color: rgba(175, 238, 238, 0.1); border: 1px solid ${COLOR_BALEN};">
                    Balen (%)
                  </th>
                </tr>
              </thead>
              <tbody>
        `;

            for (let i = 0; i < Math.max(zinData.length, balenData.length); i++) {
                const zinPercent = zinData[i] ? ((zinData[i].value[1] / totalZin) * 100).toFixed(2) : '-';
                const balenPercent = balenData[i] ? ((balenData[i].value[1] / totalBalen) * 100).toFixed(2) : '-';
                const contributor = zinData[i] ? zinData[i].seriesName : balenData[i].seriesName;

                table += `
            <tr class="bg-white border-b">
              <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                ${contributor}
              </th>
              <td class="py-4 px-6 font-bold" style="color: ${COLOR_ZIN}; background-color: rgba(255, 182, 193, 0.05); border: 1px solid ${COLOR_ZIN};">
                ${zinPercent}
              </td>
              <td class="py-4 px-6 font-bold" style="color: ${COLOR_BALEN}; background-color: rgba(175, 238, 238, 0.05); border: 1px solid ${COLOR_BALEN};">
                ${balenPercent}
              </td>
            </tr>
          `;
            }

            table += `
              </tbody>
            </table>
          </div>
        `;

            return table;
        }
    };

    options.yAxis.axisLabel = { formatter: (value) => `${Math.abs(value)}%` };
    options.tooltip.valueFormatter = (value) => `${value}%`;

    return options;
}

function createActivityContributorSeries(name, id, stack, color, selector, data) {
    return {
        name,
        id,
        type: "line",
        stack,
        itemStyle: { color },
        areaStyle: {},
        emphasis: { focus: "series" },
        data: data.map((d) => [d.timestamp * 1000, selector(d)]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3 }
    };
}

export function generateReadinessContributorsOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBaseAreaStackChartOptions(
        "Readiness Contributors",
        [
            "Activity Balance",
            "Body Temperature",
            "HRV Balance",
            "Previous Day Activity",
            "Previous Night",
            "Recovery Index",
            "Sleep Balance",
            "Resting Heart Rate"
        ]
    );

    options.series = [
        createReadinessContributorSeries("Activity Balance", "zab", "Zin", READINESS_CONTRIBUTORS_COLORS[0], (d) => d.activity_balance || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("Body Temperature", "zbt", "Zin", READINESS_CONTRIBUTORS_COLORS[1], (d) => d.body_temperature || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("HRV Balance", "zhb", "Zin", READINESS_CONTRIBUTORS_COLORS[2], (d) => d.hrv_balance || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("Previous Day Activity", "zpda", "Zin", READINESS_CONTRIBUTORS_COLORS[3], (d) => d.previous_day_activity || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("Previous Night", "zpn", "Zin", READINESS_CONTRIBUTORS_COLORS[4], (d) => d.previous_night || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("Recovery Index", "zri", "Zin", READINESS_CONTRIBUTORS_COLORS[5], (d) => d.recovery_index || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("Sleep Balance", "zsb", "Zin", READINESS_CONTRIBUTORS_COLORS[6], (d) => d.sleep_balance || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("Resting Heart Rate", "zrhr", "Zin", READINESS_CONTRIBUTORS_COLORS[7], (d) => d.resting_heart_rate || 0, chartsData.readiness_contributors_data_zin),
        createReadinessContributorSeries("Activity Balance", "bab", "Balen", READINESS_CONTRIBUTORS_COLORS[0], (d) => -d.activity_balance || 0, chartsData.readiness_contributors_data_balen),
        createReadinessContributorSeries("Body Temperature", "bbt", "Balen", READINESS_CONTRIBUTORS_COLORS[1], (d) => -d.body_temperature || 0, chartsData.readiness_contributors_data_balen),
        createReadinessContributorSeries("HRV Balance", "bhb", "Balen", READINESS_CONTRIBUTORS_COLORS[2], (d) => -d.hrv_balance || 0, chartsData.readiness_contributors_data_balen),
        createReadinessContributorSeries("Previous Day Activity", "bpda", "Balen", READINESS_CONTRIBUTORS_COLORS[3], (d) => -d.previous_day_activity || 0, chartsData.readiness_contributors_data_balen),
        createReadinessContributorSeries("Previous Night", "bpn", "Balen", READINESS_CONTRIBUTORS_COLORS[4], (d) => -d.previous_night || 0, chartsData.readiness_contributors_data_balen),
        createReadinessContributorSeries("Recovery Index", "bri", "Balen", READINESS_CONTRIBUTORS_COLORS[5], (d) => -d.recovery_index || 0, chartsData.readiness_contributors_data_balen),
        createReadinessContributorSeries("Sleep Balance", "bsb", "Balen", READINESS_CONTRIBUTORS_COLORS[6], (d) => -d.sleep_balance || 0, chartsData.readiness_contributors_data_balen),
        createReadinessContributorSeries("Resting Heart Rate", "brhr", "Balen", READINESS_CONTRIBUTORS_COLORS[7], (d) => -d.resting_heart_rate || 0, chartsData.readiness_contributors_data_balen)
    ];

    options.tooltip = {
        trigger: 'axis',

        formatter: function (params) {
            const zinData = params.filter(param => param.seriesId.startsWith('z'));
            const balenData = params.filter(param => param.seriesId.startsWith('b'));
            const totalZin = zinData.reduce((sum, item) => sum + item.value[1], 0);
            const totalBalen = balenData.reduce((sum, item) => sum + item.value[1], 0);

            let table = `
          <div class="bg-white rounded-lg shadow-md p-4 mx-auto">
            <table class="w-full text-sm text-left text-gray-500">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="py-3 px-6">Contributor</th>
                  <th scope="col" class="py-3 px-6" style="color: ${COLOR_ZIN}; background-color: rgba(255, 182, 193, 0.1); border: 1px solid ${COLOR_ZIN};">
                    Zin (%)
                  </th>
                  <th scope="col" class="py-3 px-6" style="color: ${COLOR_BALEN}; background-color: rgba(175, 238, 238, 0.1); border: 1px solid ${COLOR_BALEN};">
                    Balen (%)
                  </th>
                </tr>
              </thead>
              <tbody>
        `;

            for (let i = 0; i < Math.max(zinData.length, balenData.length); i++) {
                const zinPercent = zinData[i] ? ((zinData[i].value[1] / totalZin) * 100).toFixed(2) : '-';
                const balenPercent = balenData[i] ? ((balenData[i].value[1] / totalBalen) * 100).toFixed(2) : '-';
                const contributor = zinData[i] ? zinData[i].seriesName : balenData[i].seriesName;

                table += `
            <tr class="bg-white border-b">
              <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                ${contributor}
              </th>
              <td class="py-4 px-6 font-bold" style="color: ${COLOR_ZIN}; background-color: rgba(255, 182, 193, 0.05); border: 1px solid ${COLOR_ZIN};">
                ${zinPercent}
              </td>
              <td class="py-4 px-6 font-bold" style="color: ${COLOR_BALEN}; background-color: rgba(175, 238, 238, 0.05); border: 1px solid ${COLOR_BALEN};">
                ${balenPercent}
              </td>
            </tr>
          `;
            }

            table += `
              </tbody>
            </table>
          </div>
        `;

            return table;
        }
    };

    options.yAxis.axisLabel = { formatter: (value) => `${Math.abs(value)}%` };
    options.tooltip.valueFormatter = (value) => `${value}%`;

    return options;
}

function createReadinessContributorSeries(name, id, stack, color, selector, data) {
    return {
        name,
        id,
        type: "line",
        stack,
        itemStyle: { color },
        areaStyle: {},
        emphasis: { focus: "series" },
        data: data.map((d) => [d.timestamp * 1000, selector(d)]),
        smooth: true,
        showSymbol: false,
        lineStyle: { width: 3 }
    };
}

export function generateHeartRateZonesOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const durationsZero = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
    ]

    function addDurations(a, b) {
        var result = Array(...a);
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < a[i].length; j++) {
                result[i][j] += b[i][j];
            }
        }
        return result;
    }

    function sumDurations(a) {
        var result = 0
        for (var i = 0; i < a.length; i++) {
            for (var j = 0; j < a[i].length; j++) {
                result += a[i][j];
            }
        }
        return result;
    }

    const options = {
        title: { left: "center", text: "Heart Rate Zones" },
        tooltip: { trigger: "axis" },
        legend: { top: "5%", type: "scroll", data: ["Resting Heart Rate", "Light", "Moderate", "Vigorous", "Maximum"] },
        grid: { left: "4%", top: "12%", right: "12%", bottom: "10%", containLabel: true },
        yAxis: { type: "category", data: ["Zin", "Balen"] },
        xAxis: { type: "value" },
        series: []
    };
    const durationsZin = chartsData.heart_rate_zones_data_zin.reduce((a, b) => addDurations(a, b.durations.durations), durationsZero.map((a) => a.slice()));
    const durationsBalen = chartsData.heart_rate_zones_data_balen.reduce((a, b) => addDurations(a, b.durations.durations), durationsZero.map((a) => a.slice()));
    const totalZin = sumDurations(durationsZin);
    const totalBalen = sumDurations(durationsBalen);

    options.series = ["Resting Heart Rate", "Light", "Moderate", "Vigorous", "Maximum"].map((zone, index) => ({
        name: zone,
        type: "bar",
        stack: "total",
        label: { show: true },
        emphasis: { focus: "series" },
        data: [
            percentages(durationsZin[index], totalZin),
            percentages(durationsBalen[index], totalBalen)
        ]
    }));

    options.xAxis.axisLabel = { formatter: '{value}%' };
    options.tooltip.valueFormatter = (value) => `${value}%`;

    return options;
}

function percentages(values, total) {
    if (total === 0) {
        return 0;
    }

    function roundTo2decimals(value) {
        return Math.round(value * 100) / 100;
    }

    return roundTo2decimals(values.reduce((a, b) => a + b, 0) / total * 100);
}

export function generateActivityTimeBreakdownOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBasePieChartOptions("Activity Time Proportions");
    options.tooltip = { trigger: "item", formatter: "{a} - {d}%" };
    options.series = [
        {
            name: "Zin",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["25%", "50%"],
            avoidLabelOverlap: false,
            color: ACTIVITY_TIME_BREAKDOWN_COLORS,
            label: { show: false, position: "center" },
            emphasis: { label: { show: true, fontSize: "40", fontWeight: "bold" } },
            labelLine: { show: false },
            data: [
                { value: chartsData.activity_time_data_zin.reduce((a, b) => a + b.high, 0), name: "High" },
                { value: chartsData.activity_time_data_zin.reduce((a, b) => a + b.medium, 0), name: "Medium" },
                { value: chartsData.activity_time_data_zin.reduce((a, b) => a + b.low, 0), name: "Low" },
                { value: chartsData.activity_time_data_zin.reduce((a, b) => a + b.sedentary, 0), name: "Sedentary" }
            ],
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["75%", "50%"],
            avoidLabelOverlap: false,
            color: ACTIVITY_TIME_BREAKDOWN_COLORS,
            label: { show: false, position: "center" },
            emphasis: { label: { show: true, fontSize: "40", fontWeight: "bold" } },
            labelLine: { show: false },
            data: [
                { value: chartsData.activity_time_data_balen.reduce((a, b) => a + b.high, 0), name: "High" },
                { value: chartsData.activity_time_data_balen.reduce((a, b) => a + b.medium, 0), name: "Medium" },
                { value: chartsData.activity_time_data_balen.reduce((a, b) => a + b.low, 0), name: "Low" },
                { value: chartsData.activity_time_data_balen.reduce((a, b) => a + b.sedentary, 0), name: "Sedentary" }
            ],
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    options.tooltip.valueFormatter = (value) => `${value.toFixed(2)}%`;

    return options;
}

export function generateSleepProportionOptions(chartsData) {
    if (!chartsData) {
        return DEFAULT_LOADING_OPTIONS;
    }
    const options = getBasePieChartOptions("Sleep Type Proportions");
    options.tooltip = { trigger: "item", formatter: "{a} - {d}%" };
    options.series = [
        {
            name: "Zin",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["25%", "50%"],
            avoidLabelOverlap: false,
            color: SLEEP_TYPE_PROPORTIONS_COLORS,
            label: { show: false, position: "center" },
            emphasis: { label: { show: true, fontSize: "40", fontWeight: "bold" } },
            labelLine: { show: false },
            data: Object.entries(chartsData.sleep_type_proportion_zin).map(([key, value]) => ({
                value,
                name: key
            })),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        },
        {
            name: "Balen",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["75%", "50%"],
            avoidLabelOverlap: false,
            color: SLEEP_TYPE_PROPORTIONS_COLORS,
            label: { show: false, position: "center" },
            emphasis: { label: { show: true, fontSize: "40", fontWeight: "bold" } },
            labelLine: { show: false },
            data: Object.entries(chartsData.sleep_type_proportion_balen).map(([key, value]) => ({
                value,
                name: key
            })),
            smooth: true,
            showSymbol: false,
            lineStyle: { width: 3 }
        }
    ];

    options.tooltip.valueFormatter = (value) => `${value.toFixed(2)}%`;

    return options;
}