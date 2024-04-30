<script>
    export let live;
    export let startDate;

    let months = [
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

    function generateYears() {
        let years = [];

        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 10; i <= currentYear; i++) {
            years.push(i);
        }

        return years;
    }

    const [year, month] = startDate.split("-");
    let selectedYear = parseInt(year);
    let selectedMonth = parseInt(month) - 1;
    let years = generateYears();

    function handleMonthChange(event) {
        selectedMonth = parseInt(event.target.value);
        live.pushEvent("dateChanged", {
            month: selectedMonth,
            year: selectedYear,
        });
        document.dispatchEvent(new CustomEvent("setOptionsToNull"));
    }

    function handleYearChange(event) {
        selectedYear = parseInt(event.target.value);
        live.pushEvent("dateChanged", {
            month: selectedMonth,
            year: selectedYear,
        });
        document.dispatchEvent(new CustomEvent("setOptionsToNull"));
    }
</script>

<div
    class="datepicker bg-white dark:bg-gray-800 md:rounded-lg shadow-md font-sans"
>
    <div
        class="datepicker-header bg-blue-500 dark:bg-blue-800 neon:bg-pink-600 text-white py-4 text-center md:rounded-t-lg"
    >
        <h2 class="text-xl font-semibold">
            {months[selectedMonth]}
            {selectedYear}
        </h2>
    </div>
    <div class="datepicker-body p-4">
        <div class="datepicker-select flex justify-between">
            <select
                class="w-5/12 px-3 py-2 text-base border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md appearance-none bg-white bg-no-repeat bg-right-2 bg-origin-content focus:outline-none focus:border-blue-500 focus:shadow-outline-blue dark:focus:border-blue-800 neon:focus:border-pink-500"
                style="background-image: url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23000\' d=\'M6 9L1.4 4.4 2.8 3l3.2 3.2L9.2 3l1.4 1.4z\'/%3E%3C/svg%3E');"
                on:change={handleMonthChange}
            >
                {#each months as month, index}
                    <option
                        value={index}
                        class="px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 neon:hover:bg-pink-800"
                        selected={index === selectedMonth}
                    >
                        {month}
                    </option>
                {/each}
            </select>

            <select
                class="w-5/12 px-3 py-2 text-base border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-md appearance-none bg-white bg-no-repeat bg-right-2 bg-origin-content focus:outline-none focus:border-blue-500 focus:shadow-outline-blue dark:focus:border-blue-800 neon:focus:border-pink-500"
                style="background-image: url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23000\' d=\'M6 9L1.4 4.4 2.8 3l3.2 3.2L9.2 3l1.4 1.4z\'/%3E%3C/svg%3E');"
                on:change={handleYearChange}
            >
                {#each years as year}
                    <option
                        value={year}
                        class="px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 neon:hover:bg-pink-800"
                        selected={year === selectedYear}
                    >
                        {year}
                    </option>
                {/each}
            </select>
        </div>
    </div>
</div>
