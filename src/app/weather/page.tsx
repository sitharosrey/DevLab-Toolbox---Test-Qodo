export default function WeatherPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Weather
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Check current weather conditions and forecasts for your location.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Weather functionality will be implemented here.
        </p>
      </div>
    </div>
  );
}