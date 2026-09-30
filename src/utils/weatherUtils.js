// Weather utility functions, WMO weather codes, unit conversions, and formatting

/**
 * WMO Weather interpretation codes (WW)
 * https://open-meteo.com/en/docs
 */
export const WMO_CODES = {
  0: { description: 'Clear sky', icon: 'Sun', nightIcon: 'Moon', category: 'clear', theme: 'clear' },
  1: { description: 'Mainly clear', icon: 'Sun', nightIcon: 'Moon', category: 'clear', theme: 'clear' },
  2: { description: 'Partly cloudy', icon: 'CloudSun', nightIcon: 'CloudMoon', category: 'clouds', theme: 'clouds' },
  3: { description: 'Overcast', icon: 'Cloud', nightIcon: 'Cloud', category: 'clouds', theme: 'overcast' },
  45: { description: 'Foggy', icon: 'CloudFog', nightIcon: 'CloudFog', category: 'fog', theme: 'fog' },
  48: { description: 'Depositing rime fog', icon: 'CloudFog', nightIcon: 'CloudFog', category: 'fog', theme: 'fog' },
  51: { description: 'Light drizzle', icon: 'CloudDrizzle', nightIcon: 'CloudDrizzle', category: 'rain', theme: 'rain' },
  53: { description: 'Moderate drizzle', icon: 'CloudDrizzle', nightIcon: 'CloudDrizzle', category: 'rain', theme: 'rain' },
  55: { description: 'Dense drizzle', icon: 'CloudDrizzle', nightIcon: 'CloudDrizzle', category: 'rain', theme: 'rain' },
  56: { description: 'Light freezing drizzle', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  57: { description: 'Dense freezing drizzle', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  61: { description: 'Slight rain', icon: 'CloudRain', nightIcon: 'CloudRain', category: 'rain', theme: 'rain' },
  63: { description: 'Moderate rain', icon: 'CloudRain', nightIcon: 'CloudRain', category: 'rain', theme: 'rain' },
  65: { description: 'Heavy rain', icon: 'CloudRain', nightIcon: 'CloudRain', category: 'rain', theme: 'heavy-rain' },
  66: { description: 'Light freezing rain', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  67: { description: 'Heavy freezing rain', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  71: { description: 'Slight snow fall', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  73: { description: 'Moderate snow fall', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  75: { description: 'Heavy snow fall', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  77: { description: 'Snow grains', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  80: { description: 'Slight rain showers', icon: 'CloudRain', nightIcon: 'CloudRain', category: 'rain', theme: 'rain' },
  81: { description: 'Moderate rain showers', icon: 'CloudRain', nightIcon: 'CloudRain', category: 'rain', theme: 'rain' },
  82: { description: 'Violent rain showers', icon: 'CloudRain', nightIcon: 'CloudRain', category: 'rain', theme: 'heavy-rain' },
  85: { description: 'Slight snow showers', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  86: { description: 'Heavy snow showers', icon: 'CloudSnow', nightIcon: 'CloudSnow', category: 'snow', theme: 'snow' },
  95: { description: 'Thunderstorm', icon: 'CloudLightning', nightIcon: 'CloudLightning', category: 'thunderstorm', theme: 'thunderstorm' },
  96: { description: 'Thunderstorm with slight hail', icon: 'CloudLightning', nightIcon: 'CloudLightning', category: 'thunderstorm', theme: 'thunderstorm' },
  99: { description: 'Thunderstorm with heavy hail', icon: 'CloudLightning', nightIcon: 'CloudLightning', category: 'thunderstorm', theme: 'thunderstorm' },
};

/**
 * Get weather information based on code and day/night status
 */
export function getWeatherMeta(code, isDay = 1) {
  const meta = WMO_CODES[code] || {
    description: 'Unknown weather',
    icon: 'Cloud',
    nightIcon: 'Cloud',
    category: 'clouds',
    theme: 'clouds',
  };

  const iconName = isDay ? meta.icon : meta.nightIcon;
  const theme = isDay ? meta.theme : `${meta.theme}-night`;

  return {
    ...meta,
    activeIcon: iconName,
    activeTheme: theme,
    isDay: Boolean(isDay),
  };
}

/**
 * Format temperature based on unit ('c' or 'f')
 */
export function formatTemp(tempC, unit = 'c') {
  if (tempC === null || tempC === undefined || isNaN(tempC)) return '--°';
  if (unit === 'f') {
    const tempF = (tempC * 9) / 5 + 32;
    return `${Math.round(tempF)}°`;
  }
  return `${Math.round(tempC)}°`;
}

/**
 * Format wind speed
 */
export function formatWindSpeed(kmh, unit = 'c') {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'f') {
    // Convert to mph
    const mph = kmh * 0.621371;
    return `${Math.round(mph)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Format precipitation
 */
export function formatPrecipitation(mm, unit = 'c') {
  if (mm === null || mm === undefined || isNaN(mm)) return '0 mm';
  if (unit === 'f') {
    const inches = mm * 0.0393701;
    return `${inches.toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

/**
 * Convert wind degree to compass direction
 */
export function getWindDirection(deg) {
  if (deg === null || deg === undefined) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * UV index severity and safety guidance
 */
export function getUVGuidance(uv) {
  if (uv === null || uv === undefined) return { level: 'Unknown', color: '#94a3b8', advice: 'No data' };
  const val = Math.round(uv);
  if (val <= 2) {
    return { level: 'Low', color: '#22c55e', advice: 'Safe to enjoy the outdoors. Minimal sun protection needed.' };
  } else if (val <= 5) {
    return { level: 'Moderate', color: '#eab308', advice: 'Wear sunglasses and use SPF 30+ sunscreen if outdoors.' };
  } else if (val <= 7) {
    return { level: 'High', color: '#f97316', advice: 'Seek shade during midday. Hat, sunglasses & sunscreen advised.' };
  } else if (val <= 10) {
    return { level: 'Very High', color: '#ef4444', advice: 'Extra protection needed. Avoid sun exposure between 10am-4pm.' };
  } else {
    return { level: 'Extreme', color: '#a855f7', advice: 'Take all precautions. Unprotected skin can burn in minutes.' };
  }
}

/**
 * Air Quality Index (US AQI) interpretation
 */
export function getAQILevel(aqi) {
  if (aqi === null || aqi === undefined) {
    return { level: 'Good', score: 35, color: '#22c55e', status: 'Optimal', summary: 'Air quality is considered satisfactory.' };
  }
  if (aqi <= 50) {
    return { level: 'Good', score: aqi, color: '#22c55e', status: 'Optimal', summary: 'Air quality is satisfactory and poses little or no risk.' };
  } else if (aqi <= 100) {
    return { level: 'Moderate', score: aqi, color: '#eab308', status: 'Acceptable', summary: 'Acceptable quality; sensitive groups should consider limiting prolonged outdoor exertion.' };
  } else if (aqi <= 150) {
    return { level: 'Unhealthy for Sensitive Groups', score: aqi, color: '#f97316', status: 'Sensitive Caution', summary: 'General public not likely affected; children and respiratory patients should reduce exertion.' };
  } else if (aqi <= 200) {
    return { level: 'Unhealthy', score: aqi, color: '#ef4444', status: 'Unhealthy', summary: 'Everyone may begin to experience health effects; wear a mask outdoors.' };
  } else if (aqi <= 300) {
    return { level: 'Very Unhealthy', score: aqi, color: '#a855f7', status: 'Health Alert', summary: 'Health warnings of emergency conditions. Keep windows closed.' };
  } else {
    return { level: 'Hazardous', score: aqi, color: '#7f1d1d', status: 'Hazardous', summary: 'Health warning of emergency conditions. Entire population is more likely affected.' };
  }
}

/**
 * Humidity comfort rating
 */
export function getHumidityRating(humidity) {
  if (humidity === null || humidity === undefined) return 'Normal';
  if (humidity < 30) return 'Dry';
  if (humidity <= 60) return 'Comfortable';
  if (humidity <= 75) return 'Humid';
  return 'Very Humid';
}

/**
 * Format local time
 */
export function formatLocalTime(isoString, timezone) {
  try {
    const date = isoString ? new Date(isoString) : new Date();
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone || undefined,
    }).format(date);
  } catch {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

/**
 * Format day name
 */
export function formatDayName(dateString, isFirstDay = false) {
  if (isFirstDay) return 'Today';
  try {
    const date = new Date(dateString + 'T00:00:00');
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format date display (e.g., "Wednesday, Oct 1")
 */
export function formatFullDate(dateString) {
  try {
    const date = dateString ? new Date(dateString) : new Date();
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return new Date().toDateString();
  }
}

/**
 * Calculate sunrise & sunset daylight progress percentage (0 - 100)
 */
export function calculateDaylightProgress(sunriseIso, sunsetIso) {
  try {
    if (!sunriseIso || !sunsetIso) return { progress: 50, isDaytime: true, label: 'Daylight' };
    const now = new Date().getTime();
    const sunrise = new Date(sunriseIso).getTime();
    const sunset = new Date(sunsetIso).getTime();

    if (now < sunrise) {
      return { progress: 0, isDaytime: false, label: 'Before Sunrise' };
    }
    if (now > sunset) {
      return { progress: 100, isDaytime: false, label: 'After Sunset' };
    }

    const totalDaylight = sunset - sunrise;
    const elapsed = now - sunrise;
    const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDaylight) * 100)));
    return { progress, isDaytime: true, label: `${progress}% daylight elapsed` };
  } catch {
    return { progress: 50, isDaytime: true, label: 'Daylight' };
  }
}
