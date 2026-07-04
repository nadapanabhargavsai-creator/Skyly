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

        const weatherUrl =
            `${WEATHER_API}?latitude=${lat}&longitude=${lon}` +
            "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day" +
            "&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max" +
            "&forecast_days=5" +
            "&timezone=auto";

        const aqUrl =
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
            "&current=us_aqi,pm2_5,pm10" +
            "&timezone=auto";

        const [weatherRes, aqRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(aqUrl).catch(() => null)
        ]);

        if (!weatherRes.ok) {
            throw new Error("Unable to fetch weather.");
        }

        const weatherData = await weatherRes.json();
        let aqData = null;
        if (aqRes && aqRes.ok) {
            aqData = await aqRes.json();
        }

        return {
            ...weatherData,
            aq: aqData ? aqData.current : null
        };

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
    const daily = result.weather.daily;
    const aq = result.weather.aq;

    return {

        city:
            `${result.location.name}, ${result.location.country}`,

        latitude: result.location.latitude,

        longitude: result.location.longitude,

        temperature: current.temperature_2m,

        humidity: current.relative_humidity_2m,

        wind: current.wind_speed_10m,

        weatherCode: current.weather_code,

        isDay: current.is_day === 1,

        sunrise: daily && daily.sunrise ? daily.sunrise[0] : null,

        sunset: daily && daily.sunset ? daily.sunset[0] : null,

        moonrise: daily && daily.moonrise ? daily.moonrise[0] : null,

        moonset: daily && daily.moonset ? daily.moonset[0] : null,

        moonPhase: daily && daily.moon_phase ? daily.moon_phase[0] : null,

        uvIndex: daily && daily.uv_index_max ? daily.uv_index_max[0] : null,

        aqi: aq ? aq.us_aqi : null,

        pm2_5: aq ? aq.pm2_5 : null,

        pm10: aq ? aq.pm10 : null

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

/**
 * Fetch suggestions from OpenStreetMap Nominatim with fallback to Open-Meteo
 */
export async function getSuggestions(query) {
    if (!query || query.trim().length < 3) return [];
    
    const cleanQuery = query.trim();
    
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&limit=5&addressdetails=1`
        );
        
        if (!response.ok) {
            throw new Error("Nominatim API error");
        }
        
        const data = await response.json();
        
        return data.map(item => {
            const name = item.name || "";
            let country = "";
            let state = "";
            
            if (item.address) {
                country = item.address.country || "";
                state = item.address.state || item.address.state_district || "";
            }
            
            let fullName = item.display_name;
            if (item.address) {
                const parts = [];
                if (name) parts.push(name);
                if (state && state !== name) parts.push(state);
                if (country && country !== name) parts.push(country);
                fullName = parts.join(", ");
            }
            
            return {
                name: name,
                fullName: fullName,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
                country: country,
                state: state
            };
        });
    } catch (e) {
        console.warn("Nominatim Geocoding failed, falling back to Open-Meteo Geocoding:", e);
        try {
            const response = await fetch(
                `${GEO_API}?name=${encodeURIComponent(cleanQuery)}&count=5&language=en&format=json`
            );
            
            if (!response.ok) {
                return [];
            }
            
            const data = await response.json();
            
            if (!data.results) {
                return [];
            }
            
            return data.results.map(item => ({
                name: item.name,
                fullName: `${item.name}${item.admin1 ? ", " + item.admin1 : ""}, ${item.country}`,
                latitude: item.latitude,
                longitude: item.longitude,
                country: item.country,
                state: item.admin1 || ""
            }));
        } catch (err) {
            console.error("Open-Meteo fallback geocoding failed too:", err);
            return [];
        }
    }
}