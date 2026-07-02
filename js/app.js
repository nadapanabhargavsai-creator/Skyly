/* =========================================================
   Skyly Weather App
   app.js
   Main Entry Point
========================================================= */

import {
    getCompleteWeather
} from "./weather.js";

import {
    getCurrentLocationWeather
} from "./location.js";

import {
    initSearch,
    restoreLastSearch
} from "./search.js";

import {
    renderWeather,
    showLoading,
    hideLoading,
    showError,
    updateUnitButton
} from "./ui.js";

import {
    setUnit,
    currentUnit,
    getWeatherCondition
} from "./helpers.js";

/* -----------------------------
   State
------------------------------ */

let weatherCache = null;

/* -----------------------------
   Load Weather by City
------------------------------ */

async function loadCity(city) {

    try {

        showLoading();

        const data = await getCompleteWeather(city);

        weatherCache = data;

        renderWeather(data);

    } catch (error) {

        showError(error.message);

    } finally {

        hideLoading();

    }

}

/* -----------------------------
   Load Current Location
------------------------------ */

async function loadCurrentLocation() {

    try {

        showLoading();

        const result =
            await getCurrentLocationWeather();

        const current = result.current;
        const daily = result.daily;

        const data = {

            current: {

                city: "Current Location",

                temperature:
                    current.temperature_2m,

                humidity:
                    current.relative_humidity_2m,

                wind:
                    current.wind_speed_10m,

                weatherCode:
                    current.weather_code,

                isDay:
                    current.is_day === 1

            },

            forecast: daily.time.map((date, index) => ({

                date,

                max:
                    daily.temperature_2m_max[index],

                min:
                    daily.temperature_2m_min[index],

                weatherCode:
                    daily.weather_code[index]

            }))

        };

        weatherCache = data;

        renderWeather(data);

    } catch (error) {

        showError(error.message);

    } finally {

        hideLoading();

    }

}

/* -----------------------------
   Toggle Temperature Unit
------------------------------ */

function toggleUnit() {

    const nextUnit =
        currentUnit === "C" ? "F" : "C";

    setUnit(nextUnit);

    updateUnitButton(nextUnit);

    if (weatherCache) {

        renderWeather(weatherCache);

    }

}

/* -----------------------------
   Event Listeners
------------------------------ */

function registerEvents() {

    initSearch(loadCity);

    document
        .getElementById("location-btn")
        .addEventListener(
            "click",
            loadCurrentLocation
        );

    document
        .getElementById("unit-toggle")
        .addEventListener(
            "click",
            toggleUnit
        );

}

/* -----------------------------
   App Initialization
------------------------------ */

async function init() {

    registerEvents();

    updateUnitButton(currentUnit);

    const lastCity = restoreLastSearch();

    if (lastCity) {

        await loadCity(lastCity);

    } else {

        await loadCurrentLocation();

    }

}

/* -----------------------------
   Start Application
------------------------------ */

document.addEventListener(
    "DOMContentLoaded",
    init
);