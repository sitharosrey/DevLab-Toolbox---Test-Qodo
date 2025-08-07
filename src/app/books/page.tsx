'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  TrashIcon, 
  PencilIcon, 
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Book {
  id: string;
  title: string;
  author: string;
  status: 'to-read' | 'reading' | 'finished';
  dateAdded: Date;
  dateStarted?: Date;
  dateFinished?: Date;
  notes?: string;
}

type FilterStatus = 'all' | 'to-read' | 'reading' | 'finished';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'to-read' as Book['status'],
    notes: ''
  });

  // Load books from localStorage on component mount
  useEffect(() => {
    setMounted(true);
    const savedBooks = localStorage.getItem('book-tracker');
    if (savedBooks) {
      try {
        const parsedBooks = JSON.parse(savedBooks).map((book: any) => ({
          ...book,
          dateAdded: new Date(book.dateAdded),
          dateStarted: book.dateStarted ? new Date(book.dateStarted) : undefined,
          dateFinished: book.dateFinished ? new Date(book.dateFinished) : undefined,
        }));
        setBooks(parsedBooks);
      } catch (error) {
        console.error('Error parsing saved books:', error);
      }
    }
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('book-tracker', JSON.stringify(books));
    }
  }, [books, mounted]);

  // Add or update book
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) return;

    const now = new Date();

    if (editingBook) {
      // Update existing book
      setBooks(prev => prev.map(book => 
        book.id === editingBook.id 
          ? {
              ...book,
              title: formData.title.trim(),
              author: formData.author.trim(),
              status: formData.status,
              notes: formData.notes.trim(),
              dateStarted: formData.status === 'reading' && !book.dateStarted ? now : book.dateStarted,
              dateFinished: formData.status === 'finished' && !book.dateFinished ? now : book.dateFinished,
            }
          : book
      ));
      setEditingBook(null);
    } else {
      // Add new book
      const newBook: Book = {
        id: Date.now().toString(),
        title: formData.title.trim(),
        author: formData.author.trim(),
        status: formData.status,
        notes: formData.notes.trim(),
        dateAdded: now,
        dateStarted: formData.status === 'reading' ? now : undefined,
        dateFinished: formData.status === 'finished' ? now : undefined,
      };
      setBooks(prev => [newBook, ...prev]);
    }

    // Reset form
    setFormData({ title: '', author: '', status: 'to-read', notes: '' });
    setShowAddForm(false);
  };

  // Delete book
  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  };

  // Start editing book
  const startEdit = (book: Book) => {
    setFormData({
      title: book.title,
      author: book.author,
      status: book.status,
      notes: book.notes || ''
    });
    setEditingBook(book);
    setShowAddForm(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setFormData({ title: '', author: '', status: 'to-read', notes: '' });
    setEditingBook(null);
    setShowAddForm(false);
  };

  // Update book status
  const updateBookStatus = (id: string, newStatus: Book['status']) => {
    const now = new Date();
    setBooks(prev => prev.map(book => 
      book.id === id 
        ? {
            ...book,
            status: newStatus,
            dateStarted: newStatus === 'reading' && !book.dateStarted ? now : book.dateStarted,
            dateFinished: newStatus === 'finished' && !book.dateFinished ? now : book.dateFinished,
          }
        : book
    ));
  };

  // Filter books
  const filteredBooks = books.filter(book => 
    filter === 'all' || book.status === filter
  );

  // Get status counts
  const statusCounts = {
    all: books.length,
    'to-read': books.filter(b => b.status === 'to-read').length,
    reading: books.filter(b => b.status === 'reading').length,
    finished: books.filter(b => b.status === 'finished').length,
  };

  // Get status display info
  const getStatusInfo = (status: Book['status']) => {
    switch (status) {
      case 'to-read':
        return { label: 'To Read', icon: ClockIcon, color: 'text-yellow-600 dark:text-yellow-400' };
      case 'reading':
        return { label: 'Reading', icon: BookOpenIcon, color: 'text-blue-600 dark:text-blue-400' };
      case 'finished':
        return { label: 'Finished', icon: CheckCircleIcon, color: 'text-green-600 dark:text-green-400' };
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Book Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Loading your books...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Book Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Keep track of books you've read, want to read, and are currently reading.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Book
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {statusCounts.all}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Books</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {statusCounts['to-read']}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">To Read</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {statusCounts.reading}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reading</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {statusCounts.finished}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Finished</div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </h2>
            <button
              onClick={cancelEdit}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Book['status'] }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="to-read">To Read</option>
                <option value="reading">Currently Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Add your thoughts, rating, or notes about this book..."
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex flex-wrap gap-2">
          {(['all', 'to-read', 'reading', 'finished'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {status === 'all' ? 'All' : getStatusInfo(status).label} ({statusCounts[status]})
            </button>
          ))}
        </div>
      </div>

      {/* Books List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Books
        </h2>
        {filteredBooks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {filter === 'all' 
              ? "No books yet. Add your first book above!"
              : `No ${filter === 'to-read' ? 'to read' : filter} books yet.`
            }
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map((book) => {
              const statusInfo = getStatusInfo(book.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div
                  key={book.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {book.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        by {book.author}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className={statusInfo.color}>
                          {statusInfo.label}
                        </span>
                        <span>Added {book.dateAdded.toLocaleDateString()}</span>
                        {book.dateStarted && (
                          <span>Started {book.dateStarted.toLocaleDateString()}</span>
                        )}
                        {book.dateFinished && (
                          <span>Finished {book.dateFinished.toLocaleDateString()}</span>
                        )}
                      </div>
                      {book.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "{book.notes}"
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {/* Status Change Buttons */}
                      <select
                        value={book.status}
                        onChange={(e) => updateBookStatus(book.id, e.target.value as Book['status'])}
                        className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="to-read">To Read</option>
                        <option value="reading">Reading</option>
                        <option value="finished">Finished</option>
                      </select>
                      <button
                        onClick={() => startEdit(book)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}