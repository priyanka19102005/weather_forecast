import React, { useRef } from 'react';
import { Clock, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherUtils';

export default function HourlyForecast({ hourlyData, timezone, unit }) {
  const scrollRef = useRef(null);

  if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) return null;

  // Find the index closest to current local time, then take the next 24 hours
  const now = new Date();
  let startIndex = 0;

  for (let i = 0; i < hourlyData.time.length; i++) {
    const itemTime = new Date(hourlyData.time[i]);
    if (itemTime >= now) {
      startIndex = Math.max(0, i - 1);
      break;
    }
  }

  const hours = [];
  const count = Math.min(24, hourlyData.time.length - startIndex);

  for (let i = 0; i < count; i++) {
    const idx = startIndex + i;
    const timeIso = hourlyData.time[idx];
    const temp = hourlyData.temperature_2m[idx];
    const code = hourlyData.weather_code ? hourlyData.weather_code[idx] : 0;
    const precipProb = hourlyData.precipitation_probability ? hourlyData.precipitation_probability[idx] : 0;

    // Determine hour string and day/night
    const dateObj = new Date(timeIso);
    const hourNumber = dateObj.getHours();
    const isDay = hourNumber >= 6 && hourNumber < 20 ? 1 : 0;

    let timeLabel = '';
    if (i === 0) {
      timeLabel = 'Now';
    } else {
      timeLabel = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: true,
        timeZone: timezone || undefined,
      }).format(dateObj);
    }

    hours.push({
      timeIso,
      timeLabel,
      temp,
      code,
      precipProb,
      isDay,
    });
  }

  // Scroll buttons
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="hourly-section glass-card" aria-label="Hourly Forecast">
      <div className="section-header">
        <div className="section-title-wrap">
          <Clock size={18} className="text-accent" />
          <h2 className="section-title">24-Hour Forecast</h2>
        </div>

        <div className="scroll-controls">
          <button
            className="btn-scroll"
            onClick={() => scroll('left')}
            title="Scroll left"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="btn-scroll"
            onClick={() => scroll('right')}
            title="Scroll right"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="hourly-scroll-container" ref={scrollRef}>
        {hours.map((item, idx) => (
          <div key={`hour-${item.timeIso}-${idx}`} className="hourly-card">
            <span className="hourly-time">{item.timeLabel}</span>

            <div className="hourly-icon-wrap">
              <WeatherIcon
                code={item.code}
                isDay={item.isDay}
                size={34}
                animate={false}
              />
            </div>

            <span className="hourly-temp">{formatTemp(item.temp, unit)}</span>

            <div className={`precip-chance ${item.precipProb > 0 ? 'visible' : ''}`}>
              <Droplets size={12} className="precip-icon" />
              <span>{item.precipProb}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
