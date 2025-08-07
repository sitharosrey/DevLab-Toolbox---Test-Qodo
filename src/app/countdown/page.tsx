'use client';

import { useState, useEffect, useRef } from 'react';
import { ClockIcon, PlayIcon, StopIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CountdownData {
  title: string;
  targetDate: string;
  isActive: boolean;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export default function CountdownPage() {
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load countdown from localStorage on component mount
  useEffect(() => {
    setMounted(true);
    const savedCountdown = localStorage.getItem('countdown-timer');
    if (savedCountdown) {
      try {
        const parsedCountdown = JSON.parse(savedCountdown);
        setCountdown(parsedCountdown);
      } catch (error) {
        console.error('Error parsing saved countdown:', error);
      }
    }
  }, []);

  // Save countdown to localStorage whenever it changes
  useEffect(() => {
    if (mounted && countdown) {
      localStorage.setItem('countdown-timer', JSON.stringify(countdown));
    }
  }, [countdown, mounted]);

  // Calculate time remaining
  const calculateTimeRemaining = (targetDate: string): TimeRemaining => {
    const target = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: difference };
  };

  // Update timer every second
  useEffect(() => {
    if (countdown && countdown.isActive) {
      intervalRef.current = setInterval(() => {
        const remaining = calculateTimeRemaining(countdown.targetDate);
        setTimeRemaining(remaining);

        // Stop timer when countdown reaches 0
        if (remaining.total <= 0) {
          setCountdown(prev => prev ? { ...prev, isActive: false } : null);
        }
      }, 1000);

      // Initial calculation
      const remaining = calculateTimeRemaining(countdown.targetDate);
      setTimeRemaining(remaining);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    const newCountdown: CountdownData = {
      title: title.trim(),
      targetDate,
      isActive: true
    };

    setCountdown(newCountdown);
    setTitle('');
    setTargetDate('');
  };

  const toggleTimer = () => {
    if (countdown) {
      setCountdown(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
    }
  };

  const resetTimer = () => {
    setCountdown(null);
    setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
    if (mounted) {
      localStorage.removeItem('countdown-timer');
    }
  };

  // Get minimum date/time (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1); // At least 1 minute in the future
    return now.toISOString().slice(0, 16);
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Countdown Timer
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Loading your timer...
          </p>
        </div>
      </div>
    );
  }

  const isExpired = countdown && timeRemaining.total <= 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Countdown Timer
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Set timers for your work sessions, breaks, or any time-sensitive tasks.
        </p>
      </div>

      {!countdown ? (
        // Create new countdown form
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Create New Countdown
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter countdown title..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Date & Time
              </label>
              <input
                type="datetime-local"
                id="targetDate"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={getMinDateTime()}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ClockIcon className="h-5 w-5" />
              Start Countdown
            </button>
          </form>
        </div>
      ) : (
        // Active countdown display
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {countdown.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Target: {new Date(countdown.targetDate).toLocaleString()}
            </p>

            {isExpired ? (
              <div className="mb-8">
                <div className="text-6xl font-bold text-red-500 mb-4">
                  🎉
                </div>
                <div className="text-3xl font-bold text-red-500 mb-2">
                  Time's Up!
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  Your countdown has reached zero
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {timeRemaining.days}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {timeRemaining.days === 1 ? 'Day' : 'Days'}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {timeRemaining.hours}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {timeRemaining.hours === 1 ? 'Hour' : 'Hours'}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {timeRemaining.minutes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {timeRemaining.minutes === 1 ? 'Minute' : 'Minutes'}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {timeRemaining.seconds}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {timeRemaining.seconds === 1 ? 'Second' : 'Seconds'}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              {!isExpired && (
                <button
                  onClick={toggleTimer}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    countdown.isActive
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {countdown.isActive ? (
                    <>
                      <StopIcon className="h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <PlayIcon className="h-5 w-5" />
                      Resume
                    </>
                  )}
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <TrashIcon className="h-5 w-5" />
                Reset
              </button>
            </div>

            {!countdown.isActive && !isExpired && (
              <div className="mt-4 text-yellow-600 dark:text-yellow-400 font-medium">
                Timer is paused
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}