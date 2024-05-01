import { writable } from 'svelte/store';

export const isBrowser = typeof window !== 'undefined';
export const searchQuery = writable('');
export const openGroups = writable(['Time Series and Trends', 'Composition and Proportions']);
export const highlightedItem = writable(null);
export const theme = writable(getThemeFromCache() || getSystemTheme());

function getThemeFromCache() {
    if (isBrowser) {
        return localStorage.getItem('theme');
    }
    return null;
}

function saveThemeToCache(theme) {
    if (isBrowser) {
        localStorage.setItem('theme', theme);
    }
}

function getSystemTheme() {
    if (isBrowser) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        } else {
            return 'light';
        }
    }
    return 'light';
}


if (isBrowser) {
    theme.subscribe(value => {
        saveThemeToCache(value);
        if (value === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });

    window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
        if (e.matches) {
            theme.set('dark');
        } else {
            theme.set('light');
        }
    });
}