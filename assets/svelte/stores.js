import { writable } from 'svelte/store';

export const searchQuery = writable('');
export const openGroups = writable(['Time Series and Trends', 'Composition and Proportions']);
export const highlightedItem = writable(null); 