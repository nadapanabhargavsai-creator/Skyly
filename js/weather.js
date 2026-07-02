/* =========================================================
   Skyly Weather App
   weather.js
   Handles Open-Meteo API Requests
========================================================= */

const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

/**
 * Search city and return coordinates
 */
export async function getCoordinatesByCity(city) {
    try {
        const response = await fetch(
            `${GEO_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch location.");
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error("City not found.");
        }

        const place = data.results[0];

        return {
            name: place.name,
            country: place.country,
            latitude: place.latitude,
            longitude: place.longitude
        };

    } catch (error) {
        throw error;
    }
}

/**
 * Fetch weather using coordinates
 */
export async function getWeatherByCoords(lat, lon) {

    try {

        const url =
            `${WEATHER_API}?latitude=${lat}&longitude=${lon}` +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day" +
            "&daily=weather_code,temperature_2m_max,temperature_2m_min" +
            "&forecast_days=5" +
            "&timezone=auto";

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Unable to fetch weather.");
        }

        return await response.json();

    } catch (error) {
        throw error;
    }

}

/**
 * Fetch weather directly from city name
 */
export async function getWeatherByCity(city) {

    const location = await getCoordinatesByCity(city);

    const weather = await getWeatherByCoords(
        location.latitude,
        location.longitude
    );

    return {
        location,
        weather
    };

}

/**
 * Build current weather object
 */
export function parseCurrentWeather(result) {

    const current = result.weather.current;

    return {

        city:
            `${result.location.name}, ${result.location.country}`,

        temperature: current.temperature_2m,

        humidity: current.relative_humidity_2m,

        wind: current.wind_speed_10m,

        weatherCode: current.weather_code,

        isDay: current.is_day === 1

    };

}

/**
 * Build forecast array
 */
export function parseForecast(result) {

    const daily = result.weather.daily;

    const forecast = [];

    for (let i = 0; i < daily.time.length; i++) {

        forecast.push({

            date: daily.time[i],

            max: daily.temperature_2m_max[i],

            min: daily.temperature_2m_min[i],

            weatherCode: daily.weather_code[i]

        });

    }

    return forecast;

}

/**
 * Combined helper
 */
export async function getCompleteWeather(city) {

    const result = await getWeatherByCity(city);

    return {

        current: parseCurrentWeather(result),

        forecast: parseForecast(result)

    };

}