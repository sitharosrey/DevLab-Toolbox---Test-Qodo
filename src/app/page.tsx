export default function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to DevLab Toolbox
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          A collection of useful development tools and utilities to boost your productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            To-Do List
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Organize your tasks and stay productive with our simple to-do list manager.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Countdown Timer
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Set timers for your work sessions, breaks, or any time-sensitive tasks.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Expense Tracker
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Keep track of your expenses and manage your budget effectively.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Weather
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Check current weather conditions and forecasts for your location.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Markdown Editor
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Write and preview markdown documents with our live editor.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Color Palette
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Generate and explore color palettes for your design projects.
          </p>
        </div>
      </div>
    </div>
  );
}