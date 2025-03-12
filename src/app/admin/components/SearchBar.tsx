import React from 'react'

const SearchBar = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
    <input
      type="text"
      placeholder="Search by child or parent name..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="border border-gray-300 rounded-md px-4 py-2 w-full focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
    />
    {query && (
      <button
        onClick={() => setQuery("")}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
      >
        Reset
      </button>
    )}
  </div>
  )
}

export default SearchBar