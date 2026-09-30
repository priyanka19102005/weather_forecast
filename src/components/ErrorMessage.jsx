import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { DEFAULT_LOCATION } from '../services/weatherApi';

export default function ErrorMessage({ error, onRetry, onResetDefault }) {
  return (
    <div className="error-card glass-card" role="alert">
      <div className="error-icon-wrap">
        <AlertCircle size={44} className="text-red" />
      </div>

      <h2 className="error-title">Unable to Load Weather Data</h2>
      <p className="error-description">
        {error || 'An error occurred while connecting to the forecast service. Please check your internet connection and try again.'}
      </p>

      <div className="error-actions">
        <button className="btn btn-primary" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Retry Now</span>
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => onResetDefault(DEFAULT_LOCATION)}
        >
          <Home size={16} />
          <span>Reset to London</span>
        </button>
      </div>
    </div>
  );
}
