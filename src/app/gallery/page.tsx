'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface Image {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  author: string;
  width: number;
  height: number;
}

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});

  // Unsplash API configuration
  const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || 'demo_key';
  const UNSPLASH_API_URL = 'https://api.unsplash.com';

  // Generate placeholder images using CSS gradients (always works)
  const generatePlaceholderImages = (): Image[] => {
    const categories = [
      'nature', 'architecture', 'technology', 'food', 'travel', 
      'animals', 'art', 'business', 'fashion', 'sports', 'music', 'abstract'
    ];
    
    return Array.from({ length: 12 }, (_, index) => {
      const category = categories[index % categories.length];
      
      return {
        id: `placeholder-${index}`,
        url: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:hsl(${index * 30}, 70%, 60%);stop-opacity:1" />
                <stop offset="100%" style="stop-color:hsl(${index * 30 + 60}, 70%, 40%);stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad${index})" />
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" dy=".3em" fill="white" text-shadow="2px 2px 4px rgba(0,0,0,0.5)">${category.toUpperCase()}</text>
          </svg>
        `)}`,
        thumbnail: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:hsl(${index * 30}, 70%, 60%);stop-opacity:1" />
                <stop offset="100%" style="stop-color:hsl(${index * 30 + 60}, 70%, 40%);stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad${index})" />
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dy=".3em" fill="white" text-shadow="2px 2px 4px rgba(0,0,0,0.5)">${category.toUpperCase()}</text>
          </svg>
        `)}`,
        alt: `Beautiful ${category} image`,
        author: `Photographer ${index + 1}`,
        width: 800,
        height: 600
      };
    });
  };

  // Fetch images from Unsplash
  const fetchUnsplashImages = async (query: string = '') => {
    setLoading(true);
    setError('');

    try {
      const endpoint = query 
        ? `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=12`
        : `${UNSPLASH_API_URL}/photos?per_page=12&order_by=popular`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch images from Unsplash');
      }

      const data = await response.json();
      const photos = query ? data.results : data;

      const formattedImages: Image[] = photos.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnail: photo.urls.small,
        alt: photo.alt_description || 'Unsplash image',
        author: photo.user.name,
        width: photo.width,
        height: photo.height
      }));

      setImages(formattedImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
      // Fallback to placeholder images
      setImages(generatePlaceholderImages());
    } finally {
      setLoading(false);
    }
  };

  // Initialize gallery
  useEffect(() => {
    if (UNSPLASH_ACCESS_KEY === 'demo_key') {
      // Use placeholder images
      setImages(generatePlaceholderImages());
      setLoading(false);
    } else {
      // Use Unsplash API
      fetchUnsplashImages();
    }
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (UNSPLASH_ACCESS_KEY !== 'demo_key') {
      fetchUnsplashImages(searchQuery);
    } else {
      // Filter placeholder images by search query
      const allImages = generatePlaceholderImages();
      const filtered = allImages.filter(img => 
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setImages(filtered.length > 0 ? filtered : allImages);
    }
  };

  // Open modal
  const openModal = (image: Image, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Navigate in modal
  const navigateModal = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + images.length) % images.length
      : (currentIndex + 1) % images.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigateModal('prev');
          break;
        case 'ArrowRight':
          navigateModal('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentIndex]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Image Gallery
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse beautiful images in a responsive gallery. Click any image to view it in full size.
        </p>
      </div>

      {/* API Key Notice */}
      {UNSPLASH_ACCESS_KEY === 'demo_key' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-blue-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Demo Mode - Using Placeholder Images
              </h3>
              <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                Currently showing sample images from Picsum. For real Unsplash images, get a free API key from{' '}
                <a 
                  href="https://unsplash.com/developers" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:no-underline font-medium"
                >
                  Unsplash Developers
                </a>{' '}
                and add it as NEXT_PUBLIC_UNSPLASH_ACCESS_KEY in your .env.local file.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={UNSPLASH_ACCESS_KEY === 'demo_key' ? "Search placeholder images..." : "Search Unsplash images..."}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            {loading ? 'Searching...' : 'Search'}
          </button>
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

      {/* Image Grid */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="group cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 aspect-[4/3] relative"
                onClick={() => openModal(image, index)}
              >
                <img
                  src={image.thumbnail}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to a different image if the original fails to load
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('placeholder')) {
                      target.src = `https://via.placeholder.com/400x300/6366f1/ffffff?text=Image+${index + 1}`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium truncate">{image.alt}</p>
                    <p className="text-xs text-gray-200">by {image.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && images.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg mb-2">No images found</p>
            <p className="text-sm">Try a different search term or check your connection.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => navigateModal('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navigateModal('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all"
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-1">{selectedImage.alt}</h3>
              <p className="text-sm text-gray-200">
                by {selectedImage.author} • {selectedImage.width} × {selectedImage.height}
              </p>
              <p className="text-xs text-gray-300 mt-2">
                {currentIndex + 1} of {images.length} • Use arrow keys to navigate • Press ESC to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}