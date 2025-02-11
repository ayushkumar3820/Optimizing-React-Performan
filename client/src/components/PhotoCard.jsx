import React, { memo, useState } from 'react';

const PhotoCard = memo(({ photo }) => {
  const [imageError, setImageError] = useState(false);
  
  // Fallback image using a number based on the photo ID to maintain consistency
  const fallbackImage = `https://picsum.photos/seed/${photo.id}/300/200`;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
      <div className="relative w-full h-48">
        <img
          src={imageError ? fallbackImage : photo.thumbnailUrl}
          alt={photo.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{photo.title}</h3>
        <p className="text-gray-600 text-sm mt-2">ID: {photo.id}</p>
      </div>
    </div>
  );
});

export default PhotoCard;