import React from 'react';
import {
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  Cloud,
  Thermometer,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  getWeatherMeta,
  formatTemp,
  formatLocalTime,
  formatFullDate,
  formatWindSpeed,
} from '../utils/weatherUtils';

export default function CurrentWeather({
  weatherData,
  location,
  unit,
}) {
  if (!weatherData || !weatherData.current) return null;

  const current = weatherData.current;
  const daily = weatherData.daily;
  const isDay = current.is_day !== undefined ? current.is_day : 1;
  const meta = getWeatherMeta(current.weather_code, isDay);

  const todayHigh = daily && daily.temperature_2m_max ? daily.temperature_2m_max[0] : null;
  const todayLow = daily && daily.temperature_2m_min ? daily.temperature_2m_min[0] : null;

  const getConditionSummary = () => {
    if (current.weather_code >= 95) return 'Severe weather alert: Thunderstorms in your area.';
    if (current.weather_code >= 71) return 'Snow conditions active. Roads may be icy.';
    if (current.weather_code >= 61) return 'Rainfall present. Carry an umbrella.';
    if (current.weather_code >= 51) return 'Light drizzle expected outdoors.';
    if (current.weather_code === 3) return 'Overcast skies with subdued sunlight.';
    if (current.weather_code === 2) return 'Partly sunny with scattered clouds.';
    if (current.weather_code <= 1) return isDay ? 'Clear and sunny skies today.' : 'Clear and serene night sky.';
    return 'Stable atmospheric conditions across the area.';
  };

  return (
    <div className={`current-weather-hero glass-card weather-theme-${meta.activeTheme}`}>
      {/* Top row: City name and Time badge */}
      <div className="hero-top-row">
        <div className="location-heading">
          <div className="location-name-row">
            <MapPin className="text-accent pin-icon" size={22} />
            <h1 className="city-title">{location?.name || 'Selected City'}</h1>
            {location?.countryCode && (
              <span className="badge-country">{location.countryCode}</span>
            )}
          </div>
          <p className="location-sub">
            {[location?.admin1, location?.country].filter(Boolean).join(', ')}
          </p>
        </div>

        <div className="time-badge">
          <Clock size={14} />
          <span className="local-time">
            {formatLocalTime(new Date().toISOString(), weatherData.timezone)}
          </span>
        </div>
      </div>

      {/* Main Focus: Temperature & Condition */}
      <div className="hero-temp-section">
        <div className="hero-temp-left">
          <span className="temperature-value">
            {formatTemp(current.temperature_2m, unit)}
          </span>
          <div className="hero-condition-wrap">
            <span className="condition-text">{meta.description}</span>
            <span className="feels-like-text">
              Feels like {formatTemp(current.apparent_temperature ?? current.temperature_2m, unit)}
            </span>
          </div>
        </div>

        <div className="weather-icon-large">
          <WeatherIcon
            code={current.weather_code}
            isDay={isDay}
            size={76}
            animate={true}
          />
        </div>
      </div>

      {/* Mini Stats Ribbon */}
      <div className="hero-stats-ribbon">
        {todayHigh !== null && todayLow !== null && (
          <div className="ribbon-item">
            <span className="ribbon-label">High / Low</span>
            <div className="ribbon-val high-low-inline">
              <span className="text-red flex-inline">
                <ArrowUp size={13} />
                {formatTemp(todayHigh, unit)}
              </span>
              <span className="text-blue flex-inline">
                <ArrowDown size={13} />
                {formatTemp(todayLow, unit)}
              </span>
            </div>
          </div>
        )}

        <div className="ribbon-item">
          <span className="ribbon-label">Humidity</span>
          <span className="ribbon-val">
            <Droplets size={14} className="text-cyan inline-icon" />
            {current.relative_humidity_2m}%
          </span>
        </div>

        <div className="ribbon-item">
          <span className="ribbon-label">Wind</span>
          <span className="ribbon-val">
            <Wind size={14} className="text-indigo inline-icon" />
            {formatWindSpeed(current.wind_speed_10m, unit)}
          </span>
        </div>

        <div className="ribbon-item">
          <span className="ribbon-label">Clouds</span>
          <span className="ribbon-val">
            <Cloud size={14} className="text-slate inline-icon" />
            {current.cloud_cover ?? 0}%
          </span>
        </div>
      </div>

      {/* Footer advice */}
      <div className="hero-footer-bar">
        <p className="summary-text">{getConditionSummary()}</p>
        {weatherData.isFallback && (
          <span className="offline-notice">Offline sample</span>
        )}
      </div>
    </div>
  );
}
