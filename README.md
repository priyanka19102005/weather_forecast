# 🌤️ SkyCast — Modern React Weather Forecasting App

A real-time, responsive weather dashboard built with **React**, **Vite**, **Lucide Icons**, and the **Open-Meteo API** (zero API keys required).

![SkyCast Preview](src/assets/hero.png)

---

## ✨ Features

- 🔍 **Live Search with Autocomplete**: Instant debounced search for cities, regions, and countries worldwide.
- 📍 **GPS Geolocation**: 1-click detection of your local weather via browser geolocation & reverse geocoding.
- 🌡️ **Interactive Units**: Instant toggle between **Metric (°C, km/h, mm)** and **Imperial (°F, mph, in)** with local storage persistence.
- 🎨 **Dynamic Atmosphere Themes**: UI ambient lighting and backdrop gradients dynamically adapt to active conditions (Sunny, Starry Night, Rain, Thunderstorm, Snow, Fog).
- ⏱️ **24-Hour Hourly Timeline**: Smooth horizontal scroll tracking hour-by-hour temperatures, condition icons, and precipitation probability.
- 📅 **7-Day Extended Forecast**: Normalized high/low temperature bars with expandable details (Sunrise, Sunset, Max UV, Max Wind, Rain sum).
- 🧭 **Atmospheric Metrics Grid**:
  - **Wind & 360° Compass**: Direction needle and gust tracking.
  - **Air Quality Index (AQI)**: US AQI meter with PM2.5 and PM10 breakdown.
  - **UV Index**: Risk levels and sunscreen advisory.
  - **Daylight Arc**: Visual sun path tracking time until sunset/sunrise.
  - **Humidity & Dew Point**: Barometric pressure and atmospheric visibility.
- ⭐ **Saved Favorites & Trending Hub**: Quick access to saved locations and popular world cities.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/priyanka19102005/practice.git
cd practice
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 🛠️ Built With

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **APIs**: [Open-Meteo API](https://open-meteo.com/) (Forecast, Geocoding, Air Quality) & [OpenStreetMap](https://www.openstreetmap.org/)
- **Styling**: Pure Modern CSS with Glassmorphism, CSS Variables, and Flexbox/Grid

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
