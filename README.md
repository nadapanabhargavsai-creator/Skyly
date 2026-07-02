# 🌤️ Skyly

Skyly is a modern weather web application built with **HTML5, CSS3, and Vanilla JavaScript (ES6 Modules)**. It provides real-time weather information, a 5-day forecast, dynamic weather backgrounds, geolocation support, and responsive design.

---

## Features

- 🔍 Search weather by city
- 📍 Current location weather
- 🌡️ Current temperature
- 💧 Humidity
- 🌬️ Wind speed
- 📅 5-day forecast
- 🌙 Dynamic day/night backgrounds
- 🌦️ Weather-based animated backgrounds
- 🔄 °C / °F toggle
- 💾 Remembers last searched city
- 📱 Fully responsive
- ⚡ Fast & lightweight
- 🎨 Glassmorphism UI

---

## Folder Structure

```text
Skyly/
│
├── index.html
├── README.md
├── .gitignore
│
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
│
├── js/
│   ├── app.js
│   ├── weather.js
│   ├── location.js
│   ├── search.js
│   ├── ui.js
│   └── helpers.js
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── favicon.ico
│
└── screenshots/
    └── preview.png
```

---

## API

Skyly uses the **Open-Meteo API**.

### Weather Forecast

```
https://api.open-meteo.com/v1/forecast
```

### Geocoding

```
https://geocoding-api.open-meteo.com/v1/search
```

No API key is required.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/skyly.git
```

Open the project folder:

```bash
cd skyly
```

Launch `index.html` using a local server.

Example using VS Code Live Server.

---

## Technologies

- HTML5
- CSS3
- JavaScript ES6 Modules
- Open-Meteo API
- Geolocation API
- Local Storage

---

## Screenshot

Place your project screenshot here:

```
screenshots/preview.png
```

---

## Future Improvements

- Air Quality
- Sunrise & Sunset
- UV Index
- Hourly Forecast
- Weather Maps
- Multiple Saved Cities
- PWA Support
- Offline Cache

---

## License

MIT License

---

Made with ❤️ using Vanilla JavaScript.