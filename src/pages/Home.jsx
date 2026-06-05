import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { getRecommendations } from "../services/geminiService";

function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [selectedHistory, setSelectedHistory] = useState("");

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const data = await getRecommendations(query);

      setResults(data);

      setHistory((prev) => {
        if (prev.includes(query)) return prev;
        return [query, ...prev];
      });
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }

    setLoading(false);
  };

  const toggleFavorite = (tool) => {
    const exists = favorites.find(
      (item) => item.name === tool.name
    );

    if (exists) {
      setFavorites(
        favorites.filter(
          (item) => item.name !== tool.name
        )
      );
    } else {
      setFavorites([tool, ...favorites]);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Sidebar */}
        <div className="w-64 space-y-4">
          {/* Search History */}
          <div
            className={`rounded-2xl p-4 shadow ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-xl">
                Search History
              </h2>

              <button
                onClick={() => setHistory([])}
                className="text-red-500 text-sm hover:underline"
              >
                Clear
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-gray-500">
                No searches yet
              </p>
            ) : (
              history.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(item);
                    setSelectedHistory(item);
                  }}
                  className={`w-full text-left p-2 mb-2 rounded-lg transition-all duration-200
                  ${
                    selectedHistory === item
                      ? "bg-blue-500 text-white"
                      : darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-blue-100"
                  }
                  hover:scale-105 active:scale-95`}
                >
                  {item}
                </button>
              ))
            )}
          </div>

          {/* Favorites */}
          <div
            className={`rounded-2xl p-4 shadow ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-xl">
                Favorites ❤️
              </h2>

              <button
                onClick={() => setFavorites([])}
                className="text-red-500 text-sm hover:underline"
              >
                Clear
              </button>
            </div>

            {favorites.length === 0 ? (
              <p className="text-gray-500">
                No favorites yet
              </p>
            ) : (
              favorites.map((item, index) => (
                <div
                  key={index}
                  className="
                    p-2
                    mb-2
                    border
                    rounded-lg
                    cursor-pointer
                    transition-all
                    duration-200
                    hover:bg-red-50
                    hover:scale-105
                    active:scale-95
                  "
                >
                  ❤️ {item.name}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <button
              onClick={() =>
                setDarkMode(!darkMode)
              }
              className={`px-4 py-2 rounded-xl transition-all ${
                darkMode
                  ? "bg-yellow-500 text-black"
                  : "bg-black text-white"
              }`}
            >
              {darkMode
                ? "☀️ Light Mode"
                : "🌙 Dark Mode"}
            </button>
          </div>

          <h1 className="text-5xl font-bold text-center mb-3">
            Smart Tool Finder AI
          </h1>

          <p className="text-center text-gray-600 mb-8">
            Discover useful websites and apps using AI
          </p>

          <SearchBar
            query={query}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />

          {loading && (
            <div className="text-center mt-8 text-xl">
              🔍 Finding tools...
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4 mt-8">
              {results.map((tool, index) => (
                <div
                  key={index}
                  className={`
                    rounded-2xl
                    shadow
                    p-5
                    transition-all
                    duration-300
                    hover:shadow-xl
                    hover:-translate-y-1
                    ${
                      darkMode
                        ? "bg-gray-800"
                        : "bg-white"
                    }
                  `}
                >
                  <h2 className="text-2xl font-bold">
                    {tool.name}
                  </h2>

                  <p
                    className={`mt-2 ${
                      darkMode
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    {tool.description}
                  </p>

                  <div className="mt-3">
                    <span className="font-semibold">
                      Category:
                    </span>{" "}
                    {tool.category}
                  </div>

                  <div>
                    <span className="font-semibold">
                      Pricing:
                    </span>{" "}
                    {tool.pricing}
                  </div>

                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-blue-500 hover:underline"
                  >
                    Visit Website →
                  </a>

                  <button
                    onClick={() =>
                      toggleFavorite(tool)
                    }
                    className={`block mt-4 px-4 py-2 rounded-xl text-white transition-all duration-200 ${
                      favorites.find(
                        (item) =>
                          item.name === tool.name
                      )
                        ? "bg-green-600"
                        : "bg-red-500"
                    }`}
                  >
                    {favorites.find(
                      (item) =>
                        item.name === tool.name
                    )
                      ? "✅ Saved"
                      : "❤️ Save"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;