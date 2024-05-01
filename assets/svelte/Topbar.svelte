<script>
    import { theme } from "./stores";

    export let live;
    export let currentUser;

    let isMenuOpen = false;

    function toggleTheme() {
        theme.update((theme) => (theme === "dark" ? "light" : "dark"));
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }
</script>

<header
    class="bg-gradient-to-r from-blue-500 to-teal-500 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 h-16 w-full relative"
>
    <nav class="flex items-center justify-between h-full px-6 relative z-10">
        <div class="flex items-center space-x-6">
            <a
                href="/dashboard"
                class="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-300"
            >
                Dashboard
            </a>
        </div>
        <div class="hidden md:flex items-center space-x-6">
            {#if currentUser}
                <div class="text-sm leading-6 text-white">
                    {currentUser.email}
                </div>
                <a
                    href="/users/settings"
                    class="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-300"
                >
                    Settings
                </a>
                <a
                    href="/users/log_out"
                    class="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-300"
                >
                    Log out
                </a>
            {:else}
                <a
                    href="/users/register"
                    class="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-300"
                >
                    Register
                </a>
                <a
                    href="/users/log_in"
                    class="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors duration-300"
                >
                    Log in
                </a>
            {/if}
        </div>
        <div class="flex gap-1">
            <button
                on:click={toggleTheme}
                class="p-2 rounded-md bg-white dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
            >
                <svg
                    class="h-6 w-6 text-blue-500 dark:text-gray-300 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {#if theme === "dark"}
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                    {:else}
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    {/if}
                </svg>
            </button>
            <div
                class="md:hidden relative place-content-center"
                on:click={toggleMenu}
                on:keypress={toggleMenu}
            >
                <svg
                    class="h-8 w-8 text-white cursor-pointer transition-transform duration-300 transform {isMenuOpen
                        ? 'rotate-180'
                        : ''}"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M9 18l6-6-6-6" />
                </svg>
                <div
                    class="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 {isMenuOpen
                        ? 'block'
                        : 'hidden'}"
                >
                    <a
                        href="/dashboard"
                        class="block px-4 py-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                        Dashboard
                    </a>
                    {#if currentUser}
                        <div
                            class="px-4 py-2 text-sm leading-6 text-gray-800 dark:text-gray-300"
                        >
                            {currentUser.email}
                        </div>
                        <a
                            href="/users/settings"
                            class="block px-4 py-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                            Settings
                        </a>
                        <a
                            href="/users/log_out"
                            class="block w-full text-left px-4 py-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                            Log out
                        </a>
                    {:else}
                        <a
                            href="/users/register"
                            class="block px-4 py-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                            Register
                        </a>
                        <a
                            href="/users/log_in"
                            class="block px-4 py-2 text-sm font-semibold leading-6 text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                        >
                            Log in
                        </a>
                    {/if}
                </div>
            </div>
        </div>
    </nav>
    <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-700 animate-flow-gradient"
    ></div>
</header>

<style>
    @keyframes flow-gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .animate-flow-gradient {
        animation: flow-gradient 10s ease infinite;
        background-size: 400% 400%;
    }
</style>
