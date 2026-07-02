/* =========================================================
   Skyly Weather App
   location.js
   Handles Browser Geolocation
========================================================= */

import { getWeatherByCoords } from "./weather.js";

const GEO_OPTIONS = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 300000 // 5 minutes
};

/**
 * Check browser support
 */
export function isGeolocationSupported() {
    return "geolocation" in navigator;
}

/**
 * Get current position
 */
export function getCurrentPosition() {
    return new Promise((resolve, reject) => {

        if (!isGeolocationSupported()) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => resolve(position),
            error => reject(handleGeoError(error)),
            GEO_OPTIONS
        );

    });
}

/**
 * Get latitude & longitude
 */
export async function getCurrentCoordinates() {

    const position = await getCurrentPosition();

    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
    };

}

/**
 * Get weather from current location
 */
export async function getCurrentLocationWeather() {

    const coords = await getCurrentCoordinates();

    return await getWeatherByCoords(
        coords.latitude,
        coords.longitude
    );

}

/**
 * Convert browser geolocation errors
 */
function handleGeoError(error) {

    switch (error.code) {

        case error.PERMISSION_DENIED:
            return new Error(
                "Location permission denied."
            );

        case error.POSITION_UNAVAILABLE:
            return new Error(
                "Location information unavailable."
            );

        case error.TIMEOUT:
            return new Error(
                "Location request timed out."
            );

        default:
            return new Error(
                "Unable to retrieve your location."
            );

    }

}

/**
 * Watch user location
 */
export function watchLocation(callback) {

    if (!isGeolocationSupported()) return null;

    return navigator.geolocation.watchPosition(

        position => {

            callback({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });

        },

        error => {

            console.error(handleGeoError(error));

        },

        GEO_OPTIONS

    );

}

/**
 * Stop watching location
 */
export function stopWatchingLocation(watchId) {

    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
    }

}

/**
 * Request permission (helper)
 */
export async function requestLocationPermission() {

    try {

        await getCurrentPosition();

        return true;

    } catch {

        return false;

    }

}