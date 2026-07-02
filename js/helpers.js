/* =========================================================
   Skyly Weather App
   helpers.js
   Utility Functions
========================================================= */

/**
 * Temperature Unit
 */
export let currentUnit = "C";

/**
 * Change active unit
 */
export function setUnit(unit) {
    currentUnit = unit;
}

/**
 * Celsius → Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
    return (celsius * 9) / 5 + 32;
}

/**
 * Fahrenheit → Celsius
 */
export function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
}

/**
 * Convert temperature
 */
export function convertTemperature(temp, unit = currentUnit) {
    return unit === "F"
        ? Math.round(celsiusToFahrenheit(temp))
        : Math.round(temp);
}

/**
 * Format date
 */
export function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}

/**
 * Format full date
 */
export function formatFullDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    });
}

/**
 * Debounce
 */
export function debounce(callback, delay = 500) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/**
 * Validate city name
 */
export function isValidCity(city) {

    if (!city) return false;

    return /^[a-zA-Z\s.'-]{2,60}$/.test(city.trim());

}

/**
 * Wind Speed
 */
export function formatWindSpeed(speed) {

    return `${Math.round(speed)} km/h`;

}

/**
 * Humidity
 */
export function formatHumidity(value) {

    return `${Math.round(value)}%`;

}

/**
 * Weather code → condition
 * Open-Meteo Codes
 */
export function getWeatherCondition(code) {

    const map = {

        0: "Clear",

        1: "Clouds",
        2: "Clouds",
        3: "Clouds",

        45: "Mist",
        48: "Mist",

        51: "Rain",
        53: "Rain",
        55: "Rain",

        56: "Rain",
        57: "Rain",

        61: "Rain",
        63: "Rain",
        65: "Rain",

        66: "Rain",
        67: "Rain",

        71: "Snow",
        73: "Snow",
        75: "Snow",

        77: "Snow",

        80: "Rain",
        81: "Rain",
        82: "Rain",

        85: "Snow",
        86: "Snow",

        95: "Thunderstorm",

        96: "Thunderstorm",

        99: "Thunderstorm"

    };

    return map[code] || "Clear";

}

/**
 * Weather icon
 */
export function getWeatherIcon(condition) {

    const icons = {

        Clear: "clear.svg",

        Clouds: "clouds.svg",

        Rain: "rain.svg",

        Snow: "snow.svg",

        Thunderstorm: "thunder.svg",

        Mist: "mist.svg"

    };

    return `assests/icons/${icons[condition] || "clear.svg"}`;

}

/**
 * Background Class
 */
export function getBackgroundClass(condition, isDay = true) {

    switch (condition) {

        case "Clear":
            return isDay ? "clear-day" : "clear-night";

        case "Clouds":
            return isDay ? "clouds-day" : "clouds-night";

        case "Rain":
            return "rain";

        case "Snow":
            return "snow";

        case "Thunderstorm":
            return "thunderstorm";

        case "Mist":
            return "mist";

        default:
            return "clear-day";
    }

}

/**
 * Save Last City
 */
export function saveLastCity(city) {

    localStorage.setItem("skyly-last-city", city);

}

/**
 * Load Last City
 */
export function getLastCity() {

    return localStorage.getItem("skyly-last-city");

}

/**
 * Remove Last City
 */
export function clearLastCity() {

    localStorage.removeItem("skyly-last-city");

}

/**
 * Capitalize
 */
export function capitalize(text = "") {

    return text
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());

}

/**
 * Current Time
 */
export function isDayTime(hour) {

    return hour >= 6 && hour < 18;

}

/**
 * Toggle Body Background
 */
export function applyBackground(condition, isDay = true) {

    const classes = [

        "clear-day",
        "clear-night",
        "clouds-day",
        "clouds-night",
        "rain",
        "snow",
        "mist",
        "thunderstorm"

    ];

    document.body.classList.remove(...classes);

    document.body.classList.add(
        getBackgroundClass(condition, isDay)
    );

}

/**
 * Today's ISO Date
 */
export function todayISO() {

    return new Date().toISOString().split("T")[0];

}

/**
 * Round Number
 */
export function round(value) {

    return Math.round(value);

}

/**
 * Sleep Utility
 */
export function sleep(ms) {

    return new Promise(resolve => {

        setTimeout(resolve, ms);

    });

}

/**
 * Format UV Index with rating
 */
export function formatUVIndex(val) {
    if (val === null || val === undefined) return "--";
    let desc = "Low";
    if (val >= 11) desc = "Extreme";
    else if (val >= 8) desc = "Very High";
    else if (val >= 6) desc = "High";
    else if (val >= 3) desc = "Moderate";
    return `${val.toFixed(1)} (${desc})`;
}

/**
 * Format US AQI with rating
 */
export function formatAQI(val) {
    if (val === null || val === undefined) return "--";
    let desc = "Good";
    if (val >= 301) desc = "Hazardous";
    else if (val >= 201) desc = "Very Unhealthy";
    else if (val >= 151) desc = "Unhealthy";
    else if (val >= 101) desc = "Sensitive Group";
    else if (val >= 51) desc = "Moderate";
    return `${val} (${desc})`;
}

/**
 * Format ISO datetime string to local time string
 */
export function formatTime(isoString) {
    if (!isoString) return "--";
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    } catch {
        return "--";
    }
}