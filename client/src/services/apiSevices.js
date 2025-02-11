// services/apiService.js
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const fetchPhotos = async (start, limit) => {
  try {
    const response = await fetch(
      `${BASE_URL}/photos?_start=${start}&_limit=${limit}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to ensure valid image URLs
    return data.map(photo => ({
      id: photo.id,
      title: photo.title,
      // Use a reliable placeholder service instead of the original URLs
      thumbnailUrl: `https://picsum.photos/id/${photo.id}/300/200`,
      url: `https://picsum.photos/id/${photo.id}/600/400`
    }));

  } catch (error) {
    console.error('Error fetching photos:', error);
    throw error;
  }
};