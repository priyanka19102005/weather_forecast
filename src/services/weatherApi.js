// Weather API Service using Open-Meteo (Free, reliable, no API key required)

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AQI_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

// Default initial location: London
export const DEFAULT_LOCATION = {
  id: 2643743,
  name: 'London',
  country: 'United Kingdom',
  countryCode: 'GB',
  admin1: 'England',
  latitude: 51.50853,
  longitude: -0.12574,
  timezone: 'Europe/London',
};

// Popular world cities for quick navigation
export const POPULAR_LOCATIONS = [
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.50853, longitude: -0.12574, timezone: 'Europe/London' },
  { name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6895, longitude: 139.6917, timezone: 'Asia/Tokyo' },
  { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8534, longitude: 2.3488, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', latitude: -33.8678, longitude: 151.2073, timezone: 'Australia/Sydney' },
  { name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', latitude: 25.0772, longitude: 55.3093, timezone: 'Asia/Dubai' },
  { name: 'Mumbai', country: 'India', countryCode: 'IN', latitude: 19.0728, longitude: 72.8826, timezone: 'Asia/Kolkata' },
  { name: 'San Francisco', country: 'United States', countryCode: 'US', latitude: 37.7749, longitude: -122.4194, timezone: 'America/Los_Angeles' },
];

/**
 * Search locations via Open-Meteo Geocoding API
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `${GEO_API_URL}?name=${encodeURIComponent(query.trim())}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding search failed');
    const data = await res.json();

    if (!data.results || !data.results.length) return [];

    return data.results.map((loc) => ({
      id: loc.id,
      name: loc.name,
      country: loc.country || '',
      countryCode: loc.country_code || '',
      admin1: loc.admin1 || '',
      latitude: loc.latitude,
      longitude: loc.longitude,
      timezone: loc.timezone || 'auto',
      elevation: loc.elevation,
    }));
  } catch (error) {
    console.error('Failed to search locations:', error);
    // Filter popular locations as fallback
    const q = query.toLowerCase();
    return POPULAR_LOCATIONS.filter(
      (loc) => loc.name.toLowerCase().includes(q) || loc.country.toLowerCase().includes(q)
    );
  }
}

/**
 * Reverse geocode latitude and longitude to a human-readable city name
 */
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'ReactWeatherApp/1.0' } }
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName = addr.city || addr.town || addr.village || addr.municipality || addr.county || 'Current Location';
      return {
        name: cityName,
        country: addr.country || '',
        countryCode: (addr.country_code || '').toUpperCase(),
        admin1: addr.state || addr.region || '',
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding with OpenStreetMap failed:', err);
  }

  return {
    name: 'Current Location',
    country: '',
    countryCode: '',
    admin1: '',
    latitude: lat,
    longitude: lon,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto',
  };
}

/**
 * Fetch detailed weather forecast data
 */
export async function fetchWeatherData(lat, lon) {
  const currentParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'apparent_temperature',
    'is_day',
    'precipitation',
    'rain',
    'showers',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'pressure_msl',
    'surface_pressure',
    'wind_speed_10m',
    'wind_direction_10m',
    'wind_gusts_10m',
    'uv_index',
  ].join(',');

  const hourlyParams = [
    'temperature_2m',
    'relative_humidity_2m',
    'dew_point_2m',
    'apparent_temperature',
    'precipitation_probability',
    'precipitation',
    'weather_code',
    'pressure_msl',
    'visibility',
    'wind_speed_10m',
    'uv_index',
  ].join(',');

  const dailyParams = [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'apparent_temperature_max',
    'apparent_temperature_min',
    'sunrise',
    'sunset',
    'uv_index_max',
    'precipitation_sum',
    'precipitation_probability_max',
    'wind_speed_10m_max',
  ].join(',');

  const url = `${WEATHER_API_URL}?latitude=${lat}&longitude=${lon}&current=${currentParams}&hourly=${hourlyParams}&daily=${dailyParams}&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather service returned ${res.status}`);
  }
  return await res.json();
}

/**
 * Fetch air quality data
 */
export async function fetchAirQuality(lat, lon) {
  try {
    const currentParams = [
      'european_aqi',
      'us_aqi',
      'pm10',
      'pm2_5',
      'carbon_monoxide',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'ozone',
    ].join(',');

    const url = `${AQI_API_URL}?latitude=${lat}&longitude=${lon}&current=${currentParams}&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Air quality data could not be retrieved:', err);
    return null;
  }
}

/**
 * Generate fallback weather data in case of complete offline status or network errors
 */
export function getMockWeatherData(location = DEFAULT_LOCATION) {
  const now = new Date();
  const hourlyTimes = [];
  const hourlyTemps = [];
  const hourlyCodes = [];
  const hourlyPrecip = [];

  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    hourlyTimes.push(d.toISOString());
    hourlyTemps.push(18 + Math.sin(i / 3) * 5);
    hourlyCodes.push(i % 5 === 0 ? 61 : 2);
    hourlyPrecip.push(Math.max(0, Math.round(Math.sin(i / 2) * 40)));
  }

  const dailyDays = [];
  const dailyMax = [];
  const dailyMin = [];
  const dailyCodes = [];
  const dailyPrecipProb = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86400 * 1000);
    dailyDays.push(d.toISOString().split('T')[0]);
    dailyMax.push(22 + (i % 3));
    dailyMin.push(14 + (i % 2));
    dailyCodes.push(i % 2 === 0 ? 1 : 2);
    dailyPrecipProb.push(15 + i * 5);
  }

  return {
    latitude: location.latitude,
    longitude: location.longitude,
    timezone: location.timezone,
    current: {
      temperature_2m: 21,
      relative_humidity_2m: 58,
      apparent_temperature: 20.5,
      is_day: 1,
      weather_code: 2,
      cloud_cover: 35,
      pressure_msl: 1014,
      wind_speed_10m: 14.5,
      wind_direction_10m: 210,
      wind_gusts_10m: 22,
      uv_index: 4.8,
    },
    hourly: {
      time: hourlyTimes,
      temperature_2m: hourlyTemps,
      weather_code: hourlyCodes,
      precipitation_probability: hourlyPrecip,
      wind_speed_10m: hourlyTemps.map(() => 12),
      relative_humidity_2m: hourlyTemps.map(() => 60),
    },
    daily: {
      time: dailyDays,
      weather_code: dailyCodes,
      temperature_2m_max: dailyMax,
      temperature_2m_min: dailyMin,
      sunrise: [new Date(now.setHours(6, 30, 0, 0)).toISOString()],
      sunset: [new Date(now.setHours(19, 45, 0, 0)).toISOString()],
      uv_index_max: [5.2, 5.0, 4.8, 5.5, 4.2, 5.1, 5.3],
      precipitation_probability_max: dailyPrecipProb,
      precipitation_sum: [0.2, 1.4, 0, 0, 3.2, 0.5, 0],
      wind_speed_10m_max: [16, 20, 14, 18, 22, 15, 12],
    },
    airQuality: {
      current: {
        us_aqi: 42,
        pm2_5: 9.8,
        pm10: 16.4,
        nitrogen_dioxide: 18.2,
        ozone: 54.1,
      },
    },
  };
}

/**
 * Load complete weather dataset for a chosen location
 */
export async function getCompleteWeatherReport(location) {
  try {
    const [weatherRaw, aqiRaw] = await Promise.all([
      fetchWeatherData(location.latitude, location.longitude),
      fetchAirQuality(location.latitude, location.longitude),
    ]);

    return {
      ...weatherRaw,
      airQuality: aqiRaw,
      location,
    };
  } catch (error) {
    console.error('Failed to fetch full weather data, using fallback mockup:', error);
    const mock = getMockWeatherData(location);
    return {
      ...mock,
      location,
      isFallback: true,
      error: error.message,
    };
  }
}
