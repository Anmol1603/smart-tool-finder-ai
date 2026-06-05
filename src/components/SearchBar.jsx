function SearchBar({ query, setQuery, handleSearch }) {
  return (
    <div className="flex gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="What do you need?"
        className="flex-1 p-3 border rounded-xl outline-none"
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white px-5 py-3 rounded-xl"
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;