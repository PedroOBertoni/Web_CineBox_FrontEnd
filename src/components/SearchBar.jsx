import { useState, useEffect, useRef } from "react";
import { searchMovies } from "../api/tmdb";

export default function SearchBar({ onResults, onSearching }) {
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      onSearching(false, "");
      onResults([], 0);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      onSearching(true, query.trim());
      const { movies, totalPages } = await searchMovies(query.trim(), 1);
      onResults(movies, totalPages);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const clear = () => { setQuery(""); onResults([], 0); onSearching(false, ""); };

  return (
    <div className="relative max-w-2xl mx-auto">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
      <input
        type="text"
        placeholder="Buscar filmes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-12 pr-10 py-4 glass rounded-2xl text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
      />
      {query && (
        <button onClick={clear} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
          ✕
        </button>
      )}
    </div>
  );
}
