import React, { useState } from 'react';
import {
  Calendar,
  Droplets,
  Wind,
  Sun,
  Sunset,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  getWeatherMeta,
  formatTemp,
  formatDayName,
  formatWindSpeed,
  formatPrecipitation,
  formatLocalTime,
} from '../utils/weatherUtils';

export default function DailyForecast({ dailyData, timezone, unit }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!dailyData || !dailyData.time || dailyData.time.length === 0) return null;

  // Calculate overall min and max across all 7 days for normalized temperature bar
  let globalMin = Math.min(...dailyData.temperature_2m_min);
  let globalMax = Math.max(...dailyData.temperature_2m_max);
  if (globalMax === globalMin) globalMax += 1;

  const toggleExpand = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className="daily-section glass-card" aria-label="7-Day Extended Forecast">
      <div className="section-header">
        <div className="section-title-wrap">
          <Calendar size={18} className="text-accent" />
          <h2 className="section-title">7-Day Extended Forecast</h2>
        </div>
      </div>

      <div className="daily-list">
        {dailyData.time.map((dateStr, idx) => {
          const maxTemp = dailyData.temperature_2m_max[idx];
          const minTemp = dailyData.temperature_2m_min[idx];
          const code = dailyData.weather_code[idx];
          const precipProb = dailyData.precipitation_probability_max
            ? dailyData.precipitation_probability_max[idx]
            : 0;
          const meta = getWeatherMeta(code, 1);
          const isExpanded = expandedIndex === idx;

          // Normalized width and left offset for temperature bar
          const leftPercent = Math.max(
            0,
            Math.round(((minTemp - globalMin) / (globalMax - globalMin)) * 100)
          );
          const rightPercent = Math.min(
            100,
            Math.round(((maxTemp - globalMin) / (globalMax - globalMin)) * 100)
          );
          const barWidth = Math.max(8, rightPercent - leftPercent);

          const sunriseTime = dailyData.sunrise ? dailyData.sunrise[idx] : null;
          const sunsetTime = dailyData.sunset ? dailyData.sunset[idx] : null;
          const uvMax = dailyData.uv_index_max ? dailyData.uv_index_max[idx] : null;
          const maxWind = dailyData.wind_speed_10m_max ? dailyData.wind_speed_10m_max[idx] : null;
          const precipSum = dailyData.precipitation_sum ? dailyData.precipitation_sum[idx] : null;

          return (
            <div
              key={`day-${dateStr}`}
              className={`daily-row-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className="daily-row-main"
                onClick={() => toggleExpand(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpand(idx)}
                aria-expanded={isExpanded}
              >
                <div className="day-info-col">
                  <span className="day-name">{formatDayName(dateStr, idx === 0)}</span>
                  <span className="day-date">
                    {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
                      new Date(dateStr + 'T00:00:00')
                    )}
                  </span>
                </div>

                <div className="day-condition-col">
                  <WeatherIcon code={code} isDay={1} size={26} animate={false} />
                  <span className="day-desc">{meta.description}</span>
                </div>

                <div className="day-precip-col">
                  {precipProb > 0 ? (
                    <span className="precip-tag">
                      <Droplets size={12} />
                      {precipProb}%
                    </span>
                  ) : (
                    <span className="precip-tag-zero">--</span>
                  )}
                </div>

                <div className="day-temp-bar-col">
                  <span className="temp-low">{formatTemp(minTemp, unit)}</span>
                  <div className="temp-track">
                    <div
                      className="temp-fill"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                      }}
                    />
                  </div>
                  <span className="temp-high">{formatTemp(maxTemp, unit)}</span>
                </div>

                <div className="expand-indicator">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {isExpanded && (
                <div className="daily-expanded-details">
                  <div className="detail-item">
                    <Sun size={14} className="text-amber" />
                    <span>Sunrise: {formatLocalTime(sunriseTime, timezone)}</span>
                  </div>
                  <div className="detail-item">
                    <Sunset size={14} className="text-orange" />
                    <span>Sunset: {formatLocalTime(sunsetTime, timezone)}</span>
                  </div>
                  {uvMax !== null && (
                    <div className="detail-item">
                      <span>Max UV Index: <strong>{uvMax.toFixed(1)}</strong></span>
                    </div>
                  )}
                  {maxWind !== null && (
                    <div className="detail-item">
                      <Wind size={14} className="text-indigo" />
                      <span>Max Wind: <strong>{formatWindSpeed(maxWind, unit)}</strong></span>
                    </div>
                  )}
                  {precipSum !== null && (
                    <div className="detail-item">
                      <Droplets size={14} className="text-cyan" />
                      <span>Total Rain: <strong>{formatPrecipitation(precipSum, unit)}</strong></span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
