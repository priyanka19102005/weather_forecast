import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  RefreshCw,
  X,
  CloudSun,
  Loader2,
} from 'lucide-react';
import { searchLocations } from '../services/weatherApi';

export default function Header({
  currentLocation,
  onSelectLocation,
  onUseCurrentLocation,
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing,
  isLocating,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchContainerRef = useRef(null);

  // Debounced geocoding search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [query]);

  // Click outside listener to close search suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <header className="app-header glass-card">
      <div className="header-left">
        <div className="logo-badge">
          <CloudSun className="logo-icon text-accent" size={26} />
          <div className="brand-text">
            <span className="brand-title">SkyCast</span>
            <span className="brand-tagline">Real-time Weather Intelligence</span>
          </div>
        </div>
      </div>

      <div className="header-center" ref={searchContainerRef}>
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search city, region, or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
          />
          {isSearching && <Loader2 className="spinner-icon search-indicator" size={16} />}
          {query && !isSearching && (
            <button className="clear-btn" onClick={handleClear} title="Clear search">
              <X size={15} />
            </button>
          )}

          {isOpen && suggestions.length > 0 && (
            <ul className="suggestions-dropdown" role="listbox">
              {suggestions.map((loc, idx) => (
                <li
                  key={`${loc.latitude}-${loc.longitude}-${idx}`}
                  className="suggestion-item"
                  onClick={() => handleSelect(loc)}
                  role="option"
                >
                  <MapPin size={16} className="loc-pin" />
                  <div className="suggestion-info">
                    <span className="loc-name">{loc.name}</span>
                    <span className="loc-meta">
                      {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                  {loc.countryCode && (
                    <span className="country-chip">{loc.countryCode}</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {isOpen && !isSearching && query.trim().length >= 2 && suggestions.length === 0 && (
            <div className="suggestions-dropdown no-results">
              No matching locations found for "{query}"
            </div>
          )}
        </div>

        <button
          className={`btn-icon btn-gps ${isLocating ? 'loading' : ''}`}
          onClick={onUseCurrentLocation}
          title="Use My Current GPS Location"
          disabled={isLocating}
        >
          {isLocating ? <Loader2 size={18} className="spinner-icon" /> : <Compass size={18} />}
          <span className="btn-label-desktop">My Location</span>
        </button>
      </div>

      <div className="header-right">
        {/* Unit Toggle °C / °F */}
        <div className="unit-toggle" role="radiogroup" aria-label="Temperature unit selection">
          <button
            type="button"
            className={`unit-btn ${unit === 'c' ? 'active' : ''}`}
            onClick={() => onToggleUnit('c')}
            title="Celsius"
          >
            °C
          </button>
          <button
            type="button"
            className={`unit-btn ${unit === 'f' ? 'active' : ''}`}
            onClick={() => onToggleUnit('f')}
            title="Fahrenheit"
          >
            °F
          </button>
        </div>

        {/* Refresh Button */}
        <button
          className={`btn-icon ${isRefreshing ? 'loading' : ''}`}
          onClick={onRefresh}
          title="Refresh weather data"
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? 'spin' : ''} />
        </button>
      </div>
    </header>
  );
}
