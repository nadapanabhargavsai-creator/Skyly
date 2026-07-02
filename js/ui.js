/* =========================================================
   Skyly Weather App
   ui.js
   Handles DOM Updates
========================================================= */

import {
    convertTemperature,
    currentUnit,
    formatDate,
    formatHumidity,
    formatWindSpeed,
    getWeatherCondition,
    getWeatherIcon,
    applyBackground,
    formatUVIndex,
    formatAQI,
    formatTime
} from "./helpers.js";

/* ---------------- DOM Elements ---------------- */

const cityName = document.getElementById("city-name");
const currentDate = document.getElementById("current-date");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const weatherIcon = document.getElementById("weather-icon");

const uvIndex = document.getElementById("uv-index");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const aqi = document.getElementById("aqi");

const forecastContainer = document.getElementById("forecast-container");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error-message");

/* ======================================================
   Loading
====================================================== */

export function showLoading() {
    loading.classList.remove("hidden");
}

export function hideLoading() {
    loading.classList.add("hidden");
}

/* ======================================================
   Error
====================================================== */

export function showError(message) {

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

}

export function hideError() {

    errorBox.classList.add("hidden");

    errorBox.textContent = "";

}

/* ======================================================
   Current Weather
====================================================== */

export function renderCurrentWeather(data) {

    const weather = getWeatherCondition(data.weatherCode);

    cityName.textContent = data.city;

    currentDate.textContent = new Date().toDateString();

    temperature.textContent =
        `${convertTemperature(data.temperature)}°${currentUnit}`;

    condition.textContent = weather;

    humidity.textContent =
        formatHumidity(data.humidity);

    windSpeed.textContent =
        formatWindSpeed(data.wind);

    if (uvIndex) {
        uvIndex.textContent = formatUVIndex(data.uvIndex);
    }

    if (sunrise) {
        sunrise.textContent = formatTime(data.sunrise);
    }

    if (sunset) {
        sunset.textContent = formatTime(data.sunset);
    }

    if (aqi) {
        aqi.textContent = formatAQI(data.aqi);
    }

    weatherIcon.src =
        getWeatherIcon(weather);

    weatherIcon.alt = weather;

    applyBackground(weather, data.isDay);

}

/* ======================================================
   Forecast
====================================================== */

export function renderForecast(forecast) {

    forecastContainer.innerHTML = "";

    forecast.forEach(day => {

        const weather =
            getWeatherCondition(day.weatherCode);

        const card =
            document.createElement("div");

        card.className =
            "forecast-card fade-in";

        card.innerHTML = `

            <h3>${formatDate(day.date)}</h3>

            <img
                src="${getWeatherIcon(weather)}"
                alt="${weather}">

            <p>${weather}</p>

            <h4>

                ${convertTemperature(day.max)}°
                /
                ${convertTemperature(day.min)}°

            </h4>

        `;

        forecastContainer.appendChild(card);

    });

}

/* ======================================================
   Full Render
====================================================== */

export function renderWeather(data) {

    hideError();

    renderCurrentWeather(data.current);

    renderForecast(data.forecast);

}

/* ======================================================
   Clear Forecast
====================================================== */

export function clearForecast() {

    forecastContainer.innerHTML = "";

}

/* ======================================================
   Reset UI
====================================================== */

export function resetUI() {

    cityName.textContent = "--";

    currentDate.textContent = "--";

    temperature.textContent = "--°";

    condition.textContent = "--";

    humidity.textContent = "--";

    windSpeed.textContent = "--";

    if (uvIndex) uvIndex.textContent = "--";
    if (sunrise) sunrise.textContent = "--";
    if (sunset) sunset.textContent = "--";
    if (aqi) aqi.textContent = "--";

    weatherIcon.src = "assests/icons/clear.svg";

    clearForecast();

}

/* ======================================================
   Toggle Unit Button
====================================================== */

export function updateUnitButton(unit) {

    const btn =
        document.getElementById("unit-toggle");

    btn.textContent =
        unit === "C" ? "°F" : "°C";

}

/* ======================================================
   Background Animation
====================================================== */

export function animateBackground() {

    document.body.classList.add("fade-bg");

    setTimeout(() => {

        document.body.classList.remove("fade-bg");

    }, 800);

}