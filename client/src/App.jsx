import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import PhotoList from './components/PhotoList';
import SearchBar from './components/SearchBar';
import LoadingSkeleton from './components/LoadingSkeleton';
import { fetchPhotos } from './services/apiSevices';

const App = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 20;

  // Initial load
  useEffect(() => {
    const loadInitialPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const initialPhotos = await fetchPhotos(0, itemsPerPage);
        setPhotos(initialPhotos);
      } catch (err) {
        setError('Failed to load initial photos');
      } finally {
        setLoading(false);
      }
    };

    loadInitialPhotos();
  }, []);

  // Load more photos
  const loadMorePhotos = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newPhotos = await fetchPhotos(
        (nextPage - 1) * itemsPerPage,
        itemsPerPage
      );
      
      if (newPhotos.length > 0) {
        setPhotos(prev => [...prev, ...newPhotos]);
        setPage(nextPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load more photos');
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query) => {
        setLoading(true);
        setError(null);
        try {
          const searchResults = await fetchPhotos(0, 50);
          const filteredResults = searchResults.filter(photo =>
            photo.title.toLowerCase().includes(query.toLowerCase())
          );
          setPhotos(filteredResults);
          setHasMore(false);
        } catch (err) {
          setError('Search failed. Please try again.');
        } finally {
          setLoading(false);
        }
      }, 500),
    []
  );

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      debouncedSearch(query);
    } else {
      // Reset to initial state when search is cleared
      setPage(1);
      setHasMore(true);
      loadInitialPhotos();
    }
  };

  // Filtered photos
  const filteredPhotos = useMemo(() => {
    return photos.filter(photo =>
      photo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [photos, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-gray-800">
          Infinite Scroll Photo Gallery
        </h1>

        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && photos.length === 0 ? (
          <LoadingSkeleton count={8} />
        ) : (
          <PhotoList 
            photos={filteredPhotos} 
            onLoadMore={loadMorePhotos}
            hasMore={hasMore}
            loading={loading}
          />
        )}

        {loading && photos.length > 0 && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!loading && filteredPhotos.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No photos found. Try adjusting your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default App;