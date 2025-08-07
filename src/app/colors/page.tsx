'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowPathIcon, 
  ClipboardIcon, 
  CheckIcon, 
  LockClosedIcon, 
  LockOpenIcon 
} from '@heroicons/react/24/outline';

interface Color {
  id: string;
  hex: string;
  locked: boolean;
}

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Generate a random hex color
  const generateRandomHex = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Initialize colors on component mount
  useEffect(() => {
    const initialColors: Color[] = Array.from({ length: 5 }, (_, index) => ({
      id: `color-${index}`,
      hex: generateRandomHex(),
      locked: false
    }));
    setColors(initialColors);
  }, []);

  // Generate new palette (keeping locked colors)
  const generateNewPalette = () => {
    setColors(prevColors =>
      prevColors.map(color =>
        color.locked
          ? color
          : { ...color, hex: generateRandomHex() }
      )
    );
  };

  // Toggle lock state of a color
  const toggleLock = (id: string) => {
    setColors(prevColors =>
      prevColors.map(color =>
        color.id === id
          ? { ...color, locked: !color.locked }
          : color
      )
    );
  };

  // Copy hex code to clipboard
  const copyToClipboard = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color: ', err);
    }
  };

  // Get text color based on background brightness
  const getTextColor = (hex: string): string => {
    // Remove # if present
    const color = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // Return white for dark colors, black for light colors
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  // Generate complementary color schemes
  const generateComplementaryPalette = () => {
    const baseHue = Math.floor(Math.random() * 360);
    const newColors = colors.map((color, index) => {
      if (color.locked) return color;
      
      const hue = (baseHue + (index * 72)) % 360; // 72 degrees apart for 5 colors
      const saturation = 70 + Math.random() * 30; // 70-100%
      const lightness = 40 + Math.random() * 40; // 40-80%
      
      const hex = hslToHex(hue, saturation, lightness);
      return { ...color, hex };
    });
    setColors(newColors);
  };

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // Generate monochromatic palette
  const generateMonochromaticPalette = () => {
    const baseColor = generateRandomHex();
    const baseHue = hexToHsl(baseColor).h;
    
    const newColors = colors.map((color, index) => {
      if (color.locked) return color;
      
      const lightness = 20 + (index * 15); // Varying lightness
      const saturation = 60 + Math.random() * 40;
      
      const hex = hslToHex(baseHue, saturation, lightness);
      return { ...color, hex };
    });
    setColors(newColors);
  };

  // Convert Hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Color Palette Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Generate beautiful color palettes for your design projects. Click colors to copy, lock favorites, and explore different schemes.
        </p>
      </div>

      {/* Control Buttons */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={generateNewPalette}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Generate Random
          </button>
          <button
            onClick={generateComplementaryPalette}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Complementary
          </button>
          <button
            onClick={generateMonochromaticPalette}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Monochromatic
          </button>
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {colors.map((color, index) => (
            <div
              key={color.id}
              className="relative group aspect-square md:aspect-[3/4] cursor-pointer transition-transform hover:scale-105"
              style={{ backgroundColor: color.hex }}
              onClick={() => copyToClipboard(color.hex)}
            >
              {/* Color Info Overlay */}
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: getTextColor(color.hex)
                }}
              >
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">
                    {color.hex}
                  </div>
                  <div className="flex items-center gap-2">
                    {copiedColor === color.hex ? (
                      <>
                        <CheckIcon className="h-5 w-5" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-5 w-5" />
                        <span className="text-sm">Click to copy</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Lock Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLock(color.id);
                }}
                className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                  color.locked
                    ? 'bg-yellow-500 text-white shadow-lg'
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
              >
                {color.locked ? (
                  <LockClosedIcon className="h-4 w-4" />
                ) : (
                  <LockOpenIcon className="h-4 w-4" />
                )}
              </button>

              {/* Color Index */}
              <div 
                className="absolute bottom-3 left-3 text-sm font-medium"
                style={{ color: getTextColor(color.hex) }}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Details */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Palette Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {colors.map((color, index) => {
            const hsl = hexToHsl(color.hex);
            return (
              <div key={color.id} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    Color {index + 1}
                  </span>
                  {color.locked && (
                    <LockClosedIcon className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>HEX: {color.hex}</div>
                  <div>HSL: {Math.round(hsl.h)}°, {Math.round(hsl.s)}%, {Math.round(hsl.l)}%</div>
                  <div>
                    RGB: {parseInt(color.hex.slice(1, 3), 16)}, {parseInt(color.hex.slice(3, 5), 16)}, {parseInt(color.hex.slice(5, 7), 16)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          How to Use
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Generate Palettes</h4>
            <ul className="space-y-1">
              <li>• <strong>Random:</strong> Generate completely random colors</li>
              <li>• <strong>Complementary:</strong> Colors that work well together</li>
              <li>• <strong>Monochromatic:</strong> Variations of a single hue</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Interact with Colors</h4>
            <ul className="space-y-1">
              <li>• <strong>Click:</strong> Copy hex code to clipboard</li>
              <li>• <strong>Lock:</strong> Keep color when generating new palette</li>
              <li>• <strong>Hover:</strong> See color details and copy option</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}