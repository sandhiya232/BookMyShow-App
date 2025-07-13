import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    let url = `https://api.themoviedb.org/3/movie/popular?page=${page}&api_key=25131d6b9753528e5fdfbacc1d982378`;

    if (search) {
      url = `https://api.themoviedb.org/3/search/movie?query=${search}&api_key=25131d6b9753528e5fdfbacc1d982378`;
    }

    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setLoading(false);
      });
  }, [page, search]);

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-red-400">
          🎬 Now Showing
        </h2>

        {/* 🔍 Search Input */}
        <div className="flex justify-center mb-10">
          <input
            className="p-3 w-full max-w-xl border border-gray-700 rounded-lg bg-gray-800 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Search Movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 🎥 Movie Grid or Loading */}
        {loading ? (
          <div className="text-center text-lg text-gray-400">Loading movies...</div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400">
            No movies found for "{search}".
          </div>
        )}

        {/* ⏩ Pagination */}
        <div className="flex justify-between items-center mt-12 text-white">
          <button
            disabled={page === 1}
            className="bg-gray-700 hover:bg-gray-600 transition px-5 py-2 rounded-lg disabled:opacity-50"
            onClick={() => setPage((prev) => prev - 1)}
          >
            ◀ Previous
          </button>

          <span className="text-lg font-semibold text-gray-300">
            Page {page}
          </span>

          <button
            className="bg-gray-700 hover:bg-gray-600 transition px-5 py-2 rounded-lg"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
}
