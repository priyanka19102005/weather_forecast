import React from 'react';
import { Star, MapPin, X, Globe, Sparkles } from 'lucide-react';
import { POPULAR_LOCATIONS } from '../services/weatherApi';

export default function FavoriteLocations({
  favorites = [],
  currentLocation,
  onSelectLocation,
  onRemoveFavorite,
  onToggleCurrentFavorite,
  isCurrentFavorite,
}) {
  return (
    <section className="favorites-container glass-card" aria-label="Favorite and popular locations">
      <div className="favorites-header">
        <div className="favorites-title-wrap">
          <Star className={`star-icon ${isCurrentFavorite ? 'fill-star' : ''}`} size={18} />
          <span className="favorites-title">Quick Locations</span>
        </div>

        <button
          className={`favorite-toggle-btn ${isCurrentFavorite ? 'is-fav' : ''}`}
          onClick={onToggleCurrentFavorite}
          title={isCurrentFavorite ? 'Remove from saved locations' : 'Save current location'}
        >
          <Star size={15} className={isCurrentFavorite ? 'fill-gold' : ''} />
          <span>{isCurrentFavorite ? 'Saved' : 'Save City'}</span>
        </button>
      </div>

      <div className="locations-scroll-strip">
        {/* Saved Favorites */}
        {favorites.length > 0 && (
          <div className="locations-group">
            <span className="group-label">Saved</span>
            <div className="pills-row">
              {favorites.map((fav) => {
                const isActive =
                  currentLocation &&
                  Math.abs(fav.latitude - currentLocation.latitude) < 0.05 &&
                  Math.abs(fav.longitude - currentLocation.longitude) < 0.05;

                return (
                  <div
                    key={`fav-${fav.name}-${fav.latitude}`}
                    className={`loc-pill ${isActive ? 'active-pill' : ''}`}
                    onClick={() => onSelectLocation(fav)}
                  >
                    <Star size={13} className="fill-gold" />
                    <span className="pill-text">{fav.name}</span>
                    <button
                      className="pill-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFavorite(fav);
                      }}
                      title={`Remove ${fav.name} from saved`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Popular World Capitals & Metropolises */}
        <div className="locations-group">
          <span className="group-label">Trending</span>
          <div className="pills-row">
            {POPULAR_LOCATIONS.map((loc) => {
              const isActive =
                currentLocation &&
                Math.abs(loc.latitude - currentLocation.latitude) < 0.05 &&
                Math.abs(loc.longitude - currentLocation.longitude) < 0.05;

              return (
                <button
                  key={`popular-${loc.name}`}
                  className={`loc-pill ${isActive ? 'active-pill' : ''}`}
                  onClick={() => onSelectLocation(loc)}
                  type="button"
                >
                  <MapPin size={13} className="loc-marker" />
                  <span className="pill-text">{loc.name}</span>
                  <span className="pill-country">{loc.countryCode}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
