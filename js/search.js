/* =========================================================
   Skyly Weather App
   search.js
   Handles Search & Local Storage
========================================================= */

import { isValidCity, debounce, saveLastCity, getLastCity } from "./helpers.js";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

/**
 * Get city from input
 */
export function getSearchValue() {
    return searchInput.value.trim();
}

/**
 * Clear input
 */
export function clearSearch() {
    searchInput.value = "";
}

/**
 * Set input value
 */
export function setSearchValue(city) {
    searchInput.value = city;
}

/**
 * Handle form submit
 */
export function initSearch(onSearch) {

    if (!searchForm || !searchInput) return;

    searchForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const city = getSearchValue();

        if (!isValidCity(city)) {
            alert("Please enter a valid city name.");
            return;
        }

        saveLastCity(city);

        onSearch(city);

    });

}

/**
 * Debounced live search
 */
export function initLiveSearch(onSearch, delay = 600) {

    const debounced = debounce(() => {

        const city = getSearchValue();

        if (!isValidCity(city)) return;

        saveLastCity(city);

        onSearch(city);

    }, delay);

    searchInput.addEventListener("input", () => {

        const value = getSearchValue();

        if (value.length < 3) return;

        debounced();

    });

}

/**
 * Restore last searched city
 */
export function restoreLastSearch() {

    const city = getLastCity();

    if (city) {
        setSearchValue(city);
    }

    return city;

}

/**
 * Focus search field
 */
export function focusSearch() {
    searchInput.focus();
}

/**
 * Listen for Enter key
 */
export function bindEnterKey(onSearch) {

    searchInput.addEventListener("keydown", (event) => {

        if (event.key !== "Enter") return;

        event.preventDefault();

        const city = getSearchValue();

        if (!isValidCity(city)) return;

        saveLastCity(city);

        onSearch(city);

    });

}

/**
 * Search history
 */
export function addSearchHistory(city) {

    const history =
        JSON.parse(localStorage.getItem("skyly-history")) || [];

    if (!history.includes(city)) {

        history.unshift(city);

    }

    localStorage.setItem(
        "skyly-history",
        JSON.stringify(history.slice(0, 10))
    );

}

/**
 * Get history
 */
export function getSearchHistory() {

    return JSON.parse(
        localStorage.getItem("skyly-history")
    ) || [];

}

/**
 * Clear history
 */
export function clearSearchHistory() {

    localStorage.removeItem("skyly-history");

}