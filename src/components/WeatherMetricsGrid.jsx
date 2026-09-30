import React from 'react';
import {
  Wind,
  Droplets,
  Sun,
  Sunset,
  Sunrise,
  Eye,
  Gauge,
  ShieldCheck,
  Compass,
  Activity,
} from 'lucide-react';
import {
  formatWindSpeed,
  getWindDirection,
  getUVGuidance,
  getAQILevel,
  getHumidityRating,
  formatTemp,
  formatLocalTime,
  calculateDaylightProgress,
} from '../utils/weatherUtils';

export default function WeatherMetricsGrid({
  current,
  hourly,
  daily,
  airQuality,
  timezone,
  unit,
}) {
  if (!current) return null;

  // UV index guidance
  const uvValue = current.uv_index ?? (daily?.uv_index_max ? daily.uv_index_max[0] : 3);
  const uvInfo = getUVGuidance(uvValue);

  // AQI information
  const aqiValue = airQuality?.current?.us_aqi ?? 38;
  const aqiInfo = getAQILevel(aqiValue);
  const pm25 = airQuality?.current?.pm2_5;
  const pm10 = airQuality?.current?.pm10;

  // Sunrise / Sunset calculations
  const sunriseIso = daily?.sunrise ? daily.sunrise[0] : null;
  const sunsetIso = daily?.sunset ? daily.sunset[0] : null;
  const daylight = calculateDaylightProgress(sunriseIso, sunsetIso);

  // Visibility calculation (from hourly or standard)
  let visibilityKm = 10;
  if (hourly?.visibility && hourly.visibility.length > 0) {
    const rawVis = hourly.visibility[0];
    visibilityKm = rawVis > 1000 ? Math.round(rawVis / 1000) : rawVis;
  }
  const visibilityDisplay =
    unit === 'f'
      ? `${Math.round(visibilityKm * 0.621371)} mi`
      : `${visibilityKm} km`;

  // Dew point
  const dewPoint = hourly?.dew_point_2m ? hourly.dew_point_2m[0] : null;

  // Pressure in hPa
  const pressure = current.pressure_msl ?? current.surface_pressure ?? 1013;

  return (
    <div className="metrics-grid">
      {/* 1. Wind & Gusts Card */}
      <div className="metric-card glass-card">
        <div className="metric-header">
          <Wind size={18} className="metric-icon text-indigo" />
          <span className="metric-title">Wind & Gusts</span>
        </div>

        <div className="metric-body wind-body">
          <div className="wind-readout">
            <span className="metric-big-val">
              {formatWindSpeed(current.wind_speed_10m, unit)}
            </span>
            <span className="metric-sub-val">
              Direction: <strong>{getWindDirection(current.wind_direction_10m)}</strong> (
              {Math.round(current.wind_direction_10m ?? 0)}°)
            </span>
            {current.wind_gusts_10m && (
              <span className="metric-badge">
                Gusts up to {formatWindSpeed(current.wind_gusts_10m, unit)}
              </span>
            )}
          </div>

          <div className="compass-visual" title={`Wind direction: ${current.wind_direction_10m}°`}>
            <div className="compass-outer">
              <span className="compass-mark mark-n">N</span>
              <span className="compass-mark mark-e">E</span>
              <span className="compass-mark mark-s">S</span>
              <span className="compass-mark mark-w">W</span>
              <div
                className="compass-arrow"
                style={{ transform: `rotate(${current.wind_direction_10m ?? 0}deg)` }}
              >
                <div className="arrow-head" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. UV Index Card */}
      <div className="metric-card glass-card">
        <div className="metric-header">
          <Sun size={18} className="metric-icon text-amber" />
          <span className="metric-title">UV Index</span>
        </div>

        <div className="metric-body">
          <div className="uv-readout-row">
            <span className="metric-big-val">{uvValue.toFixed(1)}</span>
            <span
              className="uv-level-badge"
              style={{ backgroundColor: `${uvInfo.color}22`, color: uvInfo.color, borderColor: uvInfo.color }}
            >
              {uvInfo.level}
            </span>
          </div>

          <div className="uv-meter-bar">
            <div
              className="uv-marker"
              style={{ left: `${Math.min(100, (uvValue / 11) * 100)}%`, backgroundColor: uvInfo.color }}
            />
          </div>

          <p className="metric-description">{uvInfo.advice}</p>
        </div>
      </div>

      {/* 3. Air Quality Card */}
      <div className="metric-card glass-card">
        <div className="metric-header">
          <Activity size={18} className="metric-icon text-emerald" />
          <span className="metric-title">Air Quality (AQI)</span>
        </div>

        <div className="metric-body">
          <div className="aqi-score-row">
            <div className="aqi-score-circle" style={{ borderColor: aqiInfo.color }}>
              <span className="aqi-number" style={{ color: aqiInfo.color }}>
                {Math.round(aqiValue)}
              </span>
            </div>
            <div className="aqi-info-text">
              <span className="aqi-status" style={{ color: aqiInfo.color }}>
                {aqiInfo.level}
              </span>
              <span className="aqi-summary-sub">{aqiInfo.summary}</span>
            </div>
          </div>

          {(pm25 !== undefined || pm10 !== undefined) && (
            <div className="pollutants-row">
              {pm25 !== undefined && (
                <div className="pollutant-chip">
                  <span className="p-label">PM2.5</span>
                  <span className="p-val">{pm25.toFixed(1)} µg/m³</span>
                </div>
              )}
              {pm10 !== undefined && (
                <div className="pollutant-chip">
                  <span className="p-label">PM10</span>
                  <span className="p-val">{pm10.toFixed(1)} µg/m³</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Sunrise & Sunset Card */}
      <div className="metric-card glass-card">
        <div className="metric-header">
          <Sunrise size={18} className="metric-icon text-orange" />
          <span className="metric-title">Sun & Daylight</span>
        </div>

        <div className="metric-body">
          <div className="sun-times-row">
            <div className="sun-time-block">
              <Sunrise size={20} className="text-amber" />
              <div className="sun-text">
                <span className="sun-label">Sunrise</span>
                <span className="sun-val">{formatLocalTime(sunriseIso, timezone)}</span>
              </div>
            </div>

            <div className="sun-time-block">
              <Sunset size={20} className="text-orange" />
              <div className="sun-text">
                <span className="sun-label">Sunset</span>
                <span className="sun-val">{formatLocalTime(sunsetIso, timezone)}</span>
              </div>
            </div>
          </div>

          <div className="daylight-arc-container">
            <div className="arc-track">
              <div
                className="arc-progress-sun"
                style={{ left: `${daylight.progress}%` }}
                title={daylight.label}
              >
                ☀️
              </div>
            </div>
            <span className="daylight-progress-text">{daylight.label}</span>
          </div>
        </div>
      </div>

      {/* 5. Humidity & Dew Point Card */}
      <div className="metric-card glass-card">
        <div className="metric-header">
          <Droplets size={18} className="metric-icon text-cyan" />
          <span className="metric-title">Humidity</span>
        </div>

        <div className="metric-body">
          <div className="humidity-row">
            <span className="metric-big-val">{current.relative_humidity_2m}%</span>
            <span className="metric-status-badge">
              {getHumidityRating(current.relative_humidity_2m)}
            </span>
          </div>

          <div className="progress-bar-simple">
            <div
              className="progress-fill fill-cyan"
              style={{ width: `${current.relative_humidity_2m}%` }}
            />
          </div>

          {dewPoint !== null && (
            <p className="metric-description">
              The dew point is currently <strong>{formatTemp(dewPoint, unit)}</strong>.
            </p>
          )}
        </div>
      </div>

      {/* 6. Pressure & Visibility Card */}
      <div className="metric-card glass-card">
        <div className="metric-header">
          <Gauge size={18} className="metric-icon text-blue" />
          <span className="metric-title">Atmospheric Pressure</span>
        </div>

        <div className="metric-body">
          <div className="pressure-row">
            <span className="metric-big-val">{Math.round(pressure)}</span>
            <span className="metric-unit-text">hPa</span>
          </div>

          <p className="metric-description">
            {pressure > 1020
              ? 'High pressure system: generally indicates calm, clear conditions.'
              : pressure < 1005
              ? 'Low pressure system: often brings cloudiness, winds, or precipitation.'
              : 'Standard atmospheric pressure.'}
          </p>

          <div className="visibility-bar-row">
            <div className="vis-item">
              <Eye size={15} className="text-secondary" />
              <span>Visibility: <strong>{visibilityDisplay}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
