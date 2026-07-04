/* =========================================================
   Skyly Weather App
   app.js
   Main Entry Point
========================================================= */

import {
    getCompleteWeather,
    getWeatherByCoords,
    getSuggestions
} from "./weather.js";

import {
    getCurrentLocationWeather
} from "./location.js";

import {
    initSearch,
    restoreLastSearch,
    initAutocomplete
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
   Load Weather by Coordinates (Autocomplete selection)
------------------------------ */

async function loadCityCoords(loc) {

    try {

        showLoading();

        const weather = await getWeatherByCoords(loc.latitude, loc.longitude);

        const current = weather.current;
        const daily = weather.daily;
        const aq = weather.aq;

        const data = {

            current: {

                city: loc.fullName,

                latitude: loc.latitude,

                longitude: loc.longitude,

                temperature:
                    current.temperature_2m,

                humidity:
                    current.relative_humidity_2m,

                wind:
                    current.wind_speed_10m,

                weatherCode:
                    current.weather_code,

                isDay:
                    current.is_day === 1,

                sunrise: daily && daily.sunrise ? daily.sunrise[0] : null,

                sunset: daily && daily.sunset ? daily.sunset[0] : null,

                moonrise: daily && daily.moonrise ? daily.moonrise[0] : null,

                moonset: daily && daily.moonset ? daily.moonset[0] : null,

                moonPhase: daily && daily.moon_phase ? daily.moon_phase[0] : null,

                uvIndex: daily && daily.uv_index_max ? daily.uv_index_max[0] : null,

                aqi: aq ? aq.us_aqi : null,

                pm2_5: aq ? aq.pm2_5 : null,

                pm10: aq ? aq.pm10 : null

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

async function getCityNameFromCoords(lat, lon) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        if (response.ok) {
            const data = await response.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.county;
                if (city) return city;
            }
        }
    } catch (e) {
        console.warn("Reverse geocode failed", e);
    }
    return "Current Location";
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
        const aq = result.aq;

        const actualLat = result.location ? result.location.latitude : result.latitude;
        const actualLon = result.location ? result.location.longitude : result.longitude;
        const actualCity = await getCityNameFromCoords(actualLat, actualLon);

        const data = {

            current: {

                city: actualCity,

                latitude: actualLat,

                longitude: actualLon,

                temperature:
                    current.temperature_2m,

                humidity:
                    current.relative_humidity_2m,

                wind:
                    current.wind_speed_10m,

                weatherCode:
                    current.weather_code,

                isDay:
                    current.is_day === 1,

                sunrise: daily && daily.sunrise ? daily.sunrise[0] : null,

                sunset: daily && daily.sunset ? daily.sunset[0] : null,

                moonrise: daily && daily.moonrise ? daily.moonrise[0] : null,

                moonset: daily && daily.moonset ? daily.moonset[0] : null,

                moonPhase: daily && daily.moon_phase ? daily.moon_phase[0] : null,

                uvIndex: daily && daily.uv_index_max ? daily.uv_index_max[0] : null,

                aqi: aq ? aq.us_aqi : null,

                pm2_5: aq ? aq.pm2_5 : null,

                pm10: aq ? aq.pm10 : null

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

    initAutocomplete(loadCityCoords, getSuggestions);

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