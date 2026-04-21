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
      <input
        type="text"
        placeholder="Buscar filmes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "14px center",
        }}
        className="w-full pl-12 pr-10 py-4 glass rounded-2xl text-white placeholder-slate-500 focus:outline-none transition-all text-sm"
      />
      {query && (
        <button onClick={clear} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}
