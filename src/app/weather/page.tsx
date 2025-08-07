'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface WeatherData {
  name: string;
  country: string;
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

type TemperatureUnit = 'celsius' | 'fahrenheit';

export default function WeatherPage() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  // You'll need to get your own API key from https://openweathermap.org/api
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'demo_key';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `${BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the spelling and try again.');
        } else if (response.status === 401) {
          throw new Error('API key is invalid. Please check your OpenWeatherMap API key.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again later.');
        }
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        name: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like)
      };

      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const convertTemperature = (temp: number, fromUnit: TemperatureUnit, toUnit: TemperatureUnit) => {
    if (fromUnit === toUnit) return temp;
    
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      return Math.round((temp * 9/5) + 32);
    } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
      return Math.round((temp - 32) * 5/9);
    }
    
    return temp;
  };

  const getDisplayTemperature = (temp: number) => {
    // API returns Celsius, convert if needed
    return unit === 'fahrenheit' ? convertTemperature(temp, 'celsius', 'fahrenheit') : temp;
  };

  const getTemperatureUnit = () => {
    return unit === 'celsius' ? '°C' : '°F';
  };

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Weather
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Check current weather conditions for any city around the world.
        </p>
      </div>

      {/* API Key Notice */}
      {API_KEY === 'demo_key' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                API Key Required
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                To use the weather feature, you need to get a free API key from{' '}
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  OpenWeatherMap
                </a>{' '}
                and add it to your environment variables as NEXT_PUBLIC_OPENWEATHER_API_KEY.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name (e.g., London, New York)"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {/* Temperature Unit Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Temperature Unit:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUnit('celsius')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  unit === 'celsius'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Celsius
              </button>
              <button
                type="button"
                onClick={() => setUnit('fahrenheit')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  unit === 'fahrenheit'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Fahrenheit
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weather Display */}
      {weather && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {weather.name}, {weather.country}
            </h2>
            
            <div className="flex items-center justify-center mb-4">
              <img
                src={getWeatherIconUrl(weather.icon)}
                alt={weather.description}
                className="w-20 h-20"
              />
              <div className="ml-4">
                <div className="text-5xl font-bold text-gray-900 dark:text-white">
                  {getDisplayTemperature(weather.temperature)}{getTemperatureUnit()}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400 capitalize">
                  {weather.description}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Feels Like</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {getDisplayTemperature(weather.feelsLike)}{getTemperatureUnit()}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {weather.humidity}%
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</div>
                <div className="text-xl font-semibold text-gray-900 dark:text-white">
                  {weather.windSpeed} m/s
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!weather && !loading && !error && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            How to use
          </h3>
          <ul className="text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Enter a city name in the search box above</li>
            <li>• Click "Search" or press Enter to get current weather</li>
            <li>• Toggle between Celsius and Fahrenheit as needed</li>
            <li>• Try cities like "London", "New York", "Tokyo", etc.</li>
          </ul>
        </div>
      )}
    </div>
  );
}