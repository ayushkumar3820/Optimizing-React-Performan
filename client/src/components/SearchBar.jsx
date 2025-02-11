import React, { memo } from 'react';

const SearchBar = memo(({ onSearch }) => {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Search photos..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
    </div>
  );
});

export default SearchBar;