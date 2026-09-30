import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import FavoriteLocations from './components/FavoriteLocations';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherMetricsGrid from './components/WeatherMetricsGrid';
import LoadingSkeleton from './components/LoadingSkeleton';
import ErrorMessage from './components/ErrorMessage';
import {
  DEFAULT_LOCATION,
  getCompleteWeatherReport,
  reverseGeocode,
} from './services/weatherApi';
import { getWeatherMeta } from './utils/weatherUtils';
import './App.css';

const FAVORITES_STORAGE_KEY = 'skycast_favorites_v1';
const UNIT_STORAGE_KEY = 'skycast_unit_v1';
const LAST_LOCATION_KEY = 'skycast_last_location_v1';

export default function App() {
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(LAST_LOCATION_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_LOCATION;
    } catch {
      return DEFAULT_LOCATION;
    }
  });

  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem(UNIT_STORAGE_KEY) || 'c';
    } catch {
      return 'c';
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [
            { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
            { name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
            { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
          ];
    } catch {
      return [];
    }
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);

  // Load weather data for the current location
  const loadWeatherData = useCallback(async (loc, isSilentRefresh = false) => {
    if (!loc || loc.latitude === undefined || loc.longitude === undefined) return;

    if (!isSilentRefresh) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    setError(null);

    try {
      const report = await getCompleteWeatherReport(loc);
      setWeatherData(report);

      // Persist chosen location
      try {
        localStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(loc));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }
    } catch (err) {
      console.error('Failed to load weather report:', err);
      setError(err.message || 'Could not fetch weather data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Fetch when currentLocation changes
  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  // Unit toggle handler
  const handleToggleUnit = (newUnit) => {
    setUnit(newUnit);
    try {
      localStorage.setItem(UNIT_STORAGE_KEY, newUnit);
    } catch (e) {
      console.warn('Failed to save unit to localStorage', e);
    }
  };

  // Change active location
  const handleSelectLocation = (loc) => {
    setCurrentLocation(loc);
  };

  // Current GPS Location trigger
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const locDetails = await reverseGeocode(latitude, longitude);
          setCurrentLocation(locDetails);
        } catch (e) {
          console.error('Reverse geocode error:', e);
          setCurrentLocation({
            name: 'My Location',
            country: '',
            countryCode: '',
            latitude,
            longitude,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
          });
        } finally {
          setIsLocating(false);
        }
      },
      (geoError) => {
        console.warn('Geolocation failed:', geoError);
        setIsLocating(false);
        alert(`Location access denied or unavailable (${geoError.message}). Please search manually.`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Save or remove favorite
  const isCurrentFavorite = favorites.some(
    (f) =>
      Math.abs(f.latitude - currentLocation.latitude) < 0.05 &&
      Math.abs(f.longitude - currentLocation.longitude) < 0.05
  );

  const handleToggleCurrentFavorite = () => {
    let updated;
    if (isCurrentFavorite) {
      updated = favorites.filter(
        (f) =>
          Math.abs(f.latitude - currentLocation.latitude) >= 0.05 ||
          Math.abs(f.longitude - currentLocation.longitude) >= 0.05
      );
    } else {
      updated = [...favorites, currentLocation];
    }
    setFavorites(updated);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  };

  const handleRemoveFavorite = (favToRemove) => {
    const updated = favorites.filter(
      (f) =>
        Math.abs(f.latitude - favToRemove.latitude) >= 0.05 ||
        Math.abs(f.longitude - favToRemove.longitude) >= 0.05
    );
    setFavorites(updated);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    loadWeatherData(currentLocation, true);
  };

  // Determine dynamic background theme from current weather
  const currentCode = weatherData?.current?.weather_code ?? 0;
  const isDay = weatherData?.current?.is_day !== undefined ? weatherData.current.is_day : 1;
  const meta = getWeatherMeta(currentCode, isDay);
  const themeClass = `ambient-${meta.activeTheme}`;

  return (
    <div className={`app-root ${themeClass}`}>
      {/* Background ambient light orbs */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />
        <div className="ambient-orb orb-3" />
      </div>

      <div className="app-layout">
        {/* Navigation & Search Header */}
        <Header
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onUseCurrentLocation={handleUseCurrentLocation}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          onRefresh={handleRefresh}
          isRefreshing={refreshing}
          isLocating={isLocating}
        />

        {/* Quick favorites & trending cities */}
        <FavoriteLocations
          favorites={favorites}
          currentLocation={currentLocation}
          onSelectLocation={handleSelectLocation}
          onRemoveFavorite={handleRemoveFavorite}
          onToggleCurrentFavorite={handleToggleCurrentFavorite}
          isCurrentFavorite={isCurrentFavorite}
        />

        {/* Main Content Area */}
        <main className="dashboard-content">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorMessage
              error={error}
              onRetry={() => loadWeatherData(currentLocation)}
              onResetDefault={(defaultLoc) => setCurrentLocation(defaultLoc)}
            />
          ) : weatherData ? (
            <div className="dashboard-grid">
              {/* Left Column: Overview & Extended 7-Day Forecast */}
              <div className="dashboard-overview-col">
                <CurrentWeather
                  weatherData={weatherData}
                  location={currentLocation}
                  unit={unit}
                />

                <DailyForecast
                  dailyData={weatherData.daily}
                  timezone={weatherData.timezone}
                  unit={unit}
                />
              </div>

              {/* Right Column: 24-Hour Timeline & Detailed Atmospheric Metrics */}
              <div className="dashboard-details-col">
                <HourlyForecast
                  hourlyData={weatherData.hourly}
                  timezone={weatherData.timezone}
                  unit={unit}
                />

                <WeatherMetricsGrid
                  current={weatherData.current}
                  hourly={weatherData.hourly}
                  daily={weatherData.daily}
                  airQuality={weatherData.airQuality}
                  timezone={weatherData.timezone}
                  unit={unit}
                />
              </div>
            </div>
          ) : null}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p className="footer-note">
            Powered by <strong>Open-Meteo</strong> & <strong>OpenStreetMap</strong> APIs • Real-time global atmospheric forecasting
          </p>
        </footer>
      </div>
    </div>
  );
}
