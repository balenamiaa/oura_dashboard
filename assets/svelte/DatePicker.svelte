<script>
    import { onMount } from "svelte";

    export let live;
    export let startDateStr;
    export let endDateStr;
    let selectedStartDate = new Date(startDateStr);
    let selectedEndDate = new Date(endDateStr);
    let selectedEndDatePossibly = null;
    let currentDateYear = selectedStartDate.getFullYear();
    let currentDateMonth = selectedStartDate.getMonth();
    let selectedMonthDays = getMonthDays(currentDateYear, currentDateMonth);
    let yearOptions = getYearOptions();
    let isPopdownOpen = false;
    let isSelectionLimitExceeded = false;

    $: selectedMonthDays = getMonthDays(currentDateYear, currentDateMonth);
    $: yearOptions = getYearOptions();

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const weekdays = getWeekdays();

    onMount(() => {
        //get start date and endDate str from cache possibly
        if (window.localStorage.getItem("startDateStr")) {
            startDateStr = window.localStorage.getItem("startDateStr");
            selectedStartDate = new Date(startDateStr);
        }

        if (window.localStorage.getItem("endDateStr")) {
            endDateStr = window.localStorage.getItem("endDateStr");
            selectedEndDate = new Date(endDateStr);
        }

        notifyBackend();
    });

    function getYearOptions() {
        const currentYear = new Date().getFullYear();
        const yearOptions = [];

        for (let i = currentYear - 5; i <= currentYear; i++) {
            yearOptions.push(i);
        }

        return yearOptions;
    }

    function getWeekdays() {
        const baseDate = new Date(2023, 0, 1);
        const weekdays = [];

        for (let i = 0; i < 7; i++) {
            weekdays.push(
                baseDate.toLocaleString("default", { weekday: "short" }),
            );
            baseDate.setDate(baseDate.getDate() + 1);
        }

        return weekdays;
    }

    function dateWithinRange(date, startDate, endDate) {
        if (!date || !startDate || !endDate) return false;

        return date >= startDate && date <= endDate;
    }

    function togglePopdown() {
        isPopdownOpen = !isPopdownOpen;
    }

    function closePopdown() {
        isPopdownOpen = false;
    }

    function isSelected(
        date,
        selectedStartDate,
        selectedEndDate,
        selectedEndDatePossibly,
    ) {
        if (!date) return false;

        if (selectedEndDatePossibly) {
            let comparisonDateStart = selectedStartDate;
            let comparisonDateEnd = selectedEndDatePossibly;
            if (selectedEndDatePossibly < selectedStartDate) {
                comparisonDateStart = selectedEndDatePossibly;
                comparisonDateEnd = selectedStartDate;
            }

            return dateWithinRange(
                date,
                comparisonDateStart,
                comparisonDateEnd,
            );
        }

        if (!selectedEndDate) return date == selectedStartDate;

        return dateWithinRange(date, selectedStartDate, selectedEndDate);
    }

    function handleDateClick(date) {
        if (!date) return;

        if (selectedStartDate && selectedEndDate) {
            selectedStartDate = date;
            selectedEndDate = null;
            isSelectionLimitExceeded = false;
        } else if (selectedStartDate) {
            const daysDiff = Math.ceil(
                Math.abs(date - selectedStartDate) / (1000 * 60 * 60 * 24),
            );

            if (daysDiff > 30) {
                isSelectionLimitExceeded = true;
                return;
            }

            if (date < selectedStartDate) {
                let temp = selectedStartDate;
                selectedStartDate = date;
                selectedEndDate = temp;
            } else {
                selectedEndDate = date;
            }

            selectedEndDatePossibly = null;
            isSelectionLimitExceeded = false;
            handleNewDateRange(selectedStartDate, selectedEndDate);
        } else {
            selectedStartDate = date;
            isSelectionLimitExceeded = false;
        }
    }

    function handleDateHover(date) {
        if (!date) return;

        if (selectedStartDate && !selectedEndDate) {
            const daysDiff = Math.ceil(
                Math.abs(date - selectedStartDate) / (1000 * 60 * 60 * 24),
            );

            if (daysDiff > 30) {
                isSelectionLimitExceeded = true;
            } else {
                selectedEndDatePossibly = date;
                isSelectionLimitExceeded = false;
            }
        }
    }

    let oldSelectedStartDate = selectedStartDate;
    let oldSelectedEndDate = selectedEndDate;
    function handleNewDateRange(startDate, endDate) {
        if (
            oldSelectedStartDate.toDateString() !== startDate.toDateString() ||
            oldSelectedEndDate.toDateString() !== endDate.toDateString()
        ) {
            window.localStorage.setItem(
                "startDateStr",
                startDate.toISOString(),
            );
            window.localStorage.setItem("endDateStr", endDate.toISOString());
            document.dispatchEvent(new CustomEvent("setOptionsToNull"));
            notifyBackend();
        }

        oldSelectedStartDate = startDate;
        oldSelectedEndDate = endDate;

        closePopdown();
    }

    function notifyBackend() {
        live.pushEvent("date_changed", {
            start_date_str: selectedStartDate.toISOString().split("T")[0],
            end_date_str: selectedEndDate.toISOString().split("T")[0],
        });
    }

    function getMonthDays(year, month) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }

    function updateCurrentDateYear(event) {
        currentDateYear = parseInt(event.target.value);
    }

    function updateCurrentDateMonth(event) {
        currentDateMonth = parseInt(event.target.value);
    }

    function checkApplyRoundedLeft(
        date,
        selectedStartDate,
        selectedEndDate,
        selectedEndDatePossibly,
    ) {
        if (!date) return false;

        if (!selectedEndDatePossibly) {
            if (!selectedEndDate) return false;
            return date.toDateString() === selectedStartDate.toDateString();
        }

        if (
            selectedStartDate.toDateString() ===
            selectedEndDatePossibly.toDateString()
        ) {
            return false;
        }

        if (selectedEndDatePossibly < selectedStartDate) {
            return (
                date.toDateString() === selectedEndDatePossibly.toDateString()
            );
        }

        return date.toDateString() === selectedStartDate.toDateString();
    }

    function checkApplyRoundedRight(
        date,
        selectedStartDate,
        selectedEndDate,
        selectedEndDatePossibly,
    ) {
        if (!date) return false;

        if (!selectedEndDatePossibly) {
            if (!selectedEndDate) return false;
            return date.toDateString() === selectedEndDate.toDateString();
        }

        if (selectedStartDate === selectedEndDatePossibly) {
            return false;
        }

        if (selectedEndDatePossibly < selectedStartDate) {
            return date.toDateString() === selectedStartDate.toDateString();
        }

        return date.toDateString() === selectedEndDatePossibly.toDateString();
    }
</script>

<div
    class="flex items-center justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-amber-400"
>
    <div class="relative inline-block">
        <div
            class="cursor-pointer text-lg font-bold bg-white dark:bg-gray-800 rounded-md shadow-md px-4 py-2"
            on:click={togglePopdown}
        >
            {#if selectedStartDate && selectedEndDate}
                {selectedStartDate.toDateString()} - {selectedEndDate.toDateString()}
            {:else if selectedStartDate}
                {selectedStartDate.toDateString()} - Select end date
            {:else}
                Select start date
            {/if}
        </div>
        {#if isPopdownOpen}
            <div
                class="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
            >
                <div class="flex flex-col p-4">
                    <div class="flex justify-between pb-4 px-2">
                        <button
                            type="button"
                            class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                            on:click={() => {
                                currentDateMonth = currentDateMonth - 1;
                                if (currentDateMonth < 0) {
                                    currentDateMonth = 11;
                                    currentDateYear = currentDateYear - 1;
                                }
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            class="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                            on:click={() => {
                                currentDateMonth = currentDateMonth + 1;
                                if (currentDateMonth > 11) {
                                    currentDateMonth = 0;
                                    currentDateYear = currentDateYear + 1;
                                }
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </button>
                    </div>
                    <div class="flex flex-nowrap">
                        <div class="block">
                            <div class="flex justify-center pl-3 mb-6">
                                <label>
                                    <span class="sr-only">Year</span>
                                    <select
                                        class="bg-white dark:bg-gray-800 border-none outline-none rounded-lg mr-2 px-2 font-bold text-xl w-24 text-gray-800 dark:text-amber-400"
                                        value={currentDateYear}
                                        on:change={updateCurrentDateYear}
                                    >
                                        {#each yearOptions as yearOption}
                                            <option
                                                value={yearOption}
                                                class="bg-white dark:bg-gray-800 text-gray-800 dark:text-amber-400"
                                                >{yearOption}</option
                                            >
                                        {/each}
                                    </select>
                                </label>
                                <label>
                                    <span class="sr-only">Month</span>
                                    <select
                                        class="bg-white dark:bg-gray-800 border-none outline-none rounded-lg mr-2 px-2 font-bold text-xl w-40 text-gray-800 dark:text-amber-400"
                                        value={currentDateMonth}
                                        on:change={updateCurrentDateMonth}
                                    >
                                        {#each months as month, monthIndex}
                                            <option
                                                value={monthIndex}
                                                class="bg-white dark:bg-gray-800 text-gray-800 dark:text-amber-400"
                                                >{month}</option
                                            >
                                        {/each}
                                    </select>
                                </label>
                            </div>
                            <div class="block">
                                <div class="grid grid-cols-7 mb-1">
                                    {#each weekdays as weekday}
                                        <div
                                            class="text-center text-gray-500 dark:text-amber-200"
                                        >
                                            {weekday}
                                        </div>
                                    {/each}
                                </div>
                            </div>
                            <div class="block">
                                {#each Array(6) as _, weekIndex}
                                    <div class="grid grid-cols-7 mb-1">
                                        {#each Array(7) as _, dayIndex}
                                            {@const day =
                                                selectedMonthDays[
                                                    weekIndex * 7 + dayIndex
                                                ]}
                                            <div
                                                class="block relative p-0 rounded-none cursor-pointer"
                                                class:bg-blue-200={isSelected(
                                                    day,
                                                    selectedStartDate,
                                                    selectedEndDate,
                                                    selectedEndDatePossibly,
                                                ) &&
                                                    !selectedEndDatePossibly &&
                                                    !isSelectionLimitExceeded}
                                                class:bg-blue-100={isSelected(
                                                    day,
                                                    selectedStartDate,
                                                    selectedEndDate,
                                                    selectedEndDatePossibly,
                                                ) &&
                                                    selectedEndDatePossibly &&
                                                    !isSelectionLimitExceeded}
                                                class:dark:bg-amber-700={isSelected(
                                                    day,
                                                    selectedStartDate,
                                                    selectedEndDate,
                                                    selectedEndDatePossibly,
                                                ) &&
                                                    !selectedEndDatePossibly &&
                                                    !isSelectionLimitExceeded}
                                                class:dark:bg-amber-600={isSelected(
                                                    day,
                                                    selectedStartDate,
                                                    selectedEndDate,
                                                    selectedEndDatePossibly,
                                                ) &&
                                                    selectedEndDatePossibly &&
                                                    !isSelectionLimitExceeded}
                                                class:text-gray-400={!day}
                                                class:dark:text-gray-500={!day}
                                                class:rounded-l-full={checkApplyRoundedLeft(
                                                    day,
                                                    selectedStartDate,
                                                    selectedEndDate,
                                                    selectedEndDatePossibly,
                                                )}
                                                class:rounded-r-full={checkApplyRoundedRight(
                                                    day,
                                                    selectedStartDate,
                                                    selectedEndDate,
                                                    selectedEndDatePossibly,
                                                )}
                                                on:click={() =>
                                                    handleDateClick(day)}
                                                on:mouseover={() =>
                                                    handleDateHover(day)}
                                                on:focus={() =>
                                                    handleDateClick(day)}
                                            >
                                                <div
                                                    class="rounded-full border-2 border-transparent flex items-center justify-center w-12 h-12"
                                                >
                                                    {day ? day.getDate() : ""}
                                                </div>
                                            </div>
                                        {/each}
                                    </div>
                                {/each}
                            </div>
                            {#if isSelectionLimitExceeded}
                                <div class="flex animate-puls mt-3">
                                    <div class="mt-auto text-red-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="w-6 h-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                                            />
                                        </svg>
                                    </div>

                                    <span
                                        class="mx-auto text-center text-xl font-bold text-red-500"
                                    >
                                        Selection limit exceeded
                                    </span>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .rounded-l-full {
        border-top-left-radius: 9999px;
        border-bottom-left-radius: 9999px;
        background: rgb(36, 71, 123);
        color: white;
    }

    .rounded-r-full {
        border-top-right-radius: 9999px;
        border-bottom-right-radius: 9999px;
        background: rgb(36, 71, 123);
        color: white;
    }
</style>
