import React, { memo, useEffect, useRef, useCallback } from 'react';
import PhotoCard from './PhotoCard';

const PhotoList = memo(({ photos, onLoadMore, hasMore, loading }) => {
  const observerRef = useRef();
  const loadMoreRef = useRef(null);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !loading && hasMore) {
      onLoadMore();
    }
  }, [onLoadMore, loading, hasMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    observerRef.current = observer;

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
      <div ref={loadMoreRef} className="h-10" />
    </div>
  );
});

export default PhotoList;