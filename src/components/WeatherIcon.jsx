import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { getWeatherMeta } from '../utils/weatherUtils';

const ICON_MAP = {
  Sun: Sun,
  Moon: Moon,
  CloudSun: CloudSun,
  CloudMoon: CloudMoon,
  Cloud: Cloud,
  CloudRain: CloudRain,
  CloudDrizzle: CloudDrizzle,
  CloudSnow: CloudSnow,
  CloudLightning: CloudLightning,
  CloudFog: CloudFog,
};

export default function WeatherIcon({
  code = 0,
  isDay = 1,
  size = 32,
  className = '',
  animate = true,
}) {
  const meta = getWeatherMeta(code, isDay);
  const IconComponent = ICON_MAP[meta.activeIcon] || Cloud;

  // Distinctive color palettes based on weather condition
  const getIconColor = () => {
    switch (meta.category) {
      case 'clear':
        return isDay ? '#f59e0b' : '#818cf8';
      case 'clouds':
        return isDay ? '#38bdf8' : '#94a3b8';
      case 'rain':
        return '#0284c7';
      case 'snow':
        return '#38bdf8';
      case 'thunderstorm':
        return '#eab308';
      case 'fog':
        return '#94a3b8';
      default:
        return '#38bdf8';
    }
  };

  return (
    <div
      className={`weather-icon-wrapper ${animate ? 'animate-weather' : ''} ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      title={meta.description}
    >
      <IconComponent
        size={size}
        color={getIconColor()}
        strokeWidth={1.8}
        className="weather-svg"
      />
    </div>
  );
}
