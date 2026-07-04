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
    formatTime,
    calculateMoonPhase
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
const moonrise = document.getElementById("moonrise");
const moonset = document.getElementById("moonset");
const aqi = document.getElementById("aqi");

const moonShadow = document.querySelector(".moon-shadow");
const moonPhaseName = document.getElementById("moon-phase-name");

const forecastContainer = document.getElementById("forecast-container");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error-message");

let weatherMap = null;
let radarLayer = null;

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

    if (moonrise && data.moonrise) {
        moonrise.textContent = formatTime(data.moonrise);
    }

    if (moonset && data.moonset) {
        moonset.textContent = formatTime(data.moonset);
    }

    if (aqi) {
        aqi.textContent = formatAQI(data.aqi);
    }

    weatherIcon.src =
        getWeatherIcon(weather);

    weatherIcon.alt = weather;

    applyBackground(weather, data.isDay);

    let phase = calculateMoonPhase(new Date());
    renderMoonPhase(phase);

    if (data.latitude && data.longitude) {
        updateRadarMap(data.latitude, data.longitude);
    }

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

/* ======================================================
   Moon Phase Visualizer
====================================================== */

function renderMoonPhase(phase) {
    if (!moonPhaseName || !moonShadow) return;

    let phaseName = "";
    let shadowX = 0;
    
    // Open-Meteo phase: 0 = new moon, 0.25 = first quarter, 0.5 = full, 0.75 = third quarter, 1.0 = new
    if (phase === 0 || phase === 1) {
        phaseName = "New Moon";
        shadowX = 0;
    } else if (phase > 0 && phase < 0.25) {
        phaseName = "Waxing Crescent";
        shadowX = 50; 
    } else if (phase === 0.25) {
        phaseName = "First Quarter";
        shadowX = 100;
    } else if (phase > 0.25 && phase < 0.5) {
        phaseName = "Waxing Gibbous";
        shadowX = 150;
    } else if (phase === 0.5) {
        phaseName = "Full Moon";
        shadowX = 250; 
    } else if (phase > 0.5 && phase < 0.75) {
        phaseName = "Waning Gibbous";
        shadowX = -150;
    } else if (phase === 0.75) {
        phaseName = "Third Quarter";
        shadowX = -100;
    } else if (phase > 0.75 && phase < 1) {
        phaseName = "Waning Crescent";
        shadowX = -50;
    }

    moonPhaseName.textContent = phaseName;
    
    // Use transform to move the shadow
    if (phaseName === "Full Moon") {
        moonShadow.style.opacity = "0";
    } else if (phaseName === "New Moon") {
        moonShadow.style.opacity = "0.95";
        moonShadow.style.transform = `translateX(0%) scale(1.1)`;
    } else {
        moonShadow.style.opacity = "0.95";
        moonShadow.style.transform = `translateX(${shadowX}%)`;
    }
}

/* ======================================================
   Radar Map
====================================================== */

async function updateRadarMap(lat, lon) {
    if (typeof L === 'undefined') return;

    if (!weatherMap) {
        weatherMap = L.map('weather-map').setView([lat, lon], 10);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(weatherMap);
    } else {
        weatherMap.setView([lat, lon], 10);
    }

    try {
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        const data = await response.json();
        const past = data.radar.past;
        
        if (past && past.length > 0) {
            const latestFrame = past[past.length - 1];
            
            if (radarLayer) {
                weatherMap.removeLayer(radarLayer);
            }

            radarLayer = L.tileLayer(`https://tilecache.rainviewer.com/v2/radar/${latestFrame.time}/256/{z}/{x}/{y}/2/1_1.png`, {
                opacity: 0.7,
                attribution: 'RainViewer'
            }).addTo(weatherMap);
        }
    } catch (e) {
        console.error("Failed to load RainViewer radar layer:", e);
    }
}