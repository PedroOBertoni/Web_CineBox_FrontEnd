import { useEffect, useState } from "react";
import { fetchTrending, IMG_ORIGINAL } from "../api/tmdb";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    fetchTrending().then((results) => setMovies(results.slice(0, 5)));
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIndex((i) => (i + 1) % movies.length); setFade(true); }, 400);
    }, 7000);
    return () => clearInterval(timer);
  }, [movies]);

  const movie = movies[index];
  if (!movie) return <div className="h-screen bg-[#060B18]" />;

  const year = (movie.release_date || "").slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
      <div className={`absolute inset-0 transition-opacity duration-700 ${fade ? "opacity-100" : "opacity-0"}`}>
        <img
          src={`${IMG_ORIGINAL}${movie.backdrop_path}`}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060B18] via-[#060B18]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060B18] via-transparent to-[#060B18]/30" />
      </div>

      <div className={`relative z-10 h-full flex flex-col justify-center px-8 md:px-16 max-w-3xl transition-all duration-700 ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-[#1D4ED8]/20 border border-[#1D4ED8]/40 rounded-full text-[#60A5FA] text-xs font-semibold uppercase tracking-wider">
            🔥 Em Alta
          </span>
          {year && <span className="text-slate-400 text-sm">{year}</span>}
          {rating && <span className="text-yellow-400 text-sm font-semibold">⭐ {rating}</span>}
        </div>

        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 text-white drop-shadow-2xl">
          {movie.title}
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 max-w-xl">
          {movie.overview || "Sem descrição disponível."}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/catalogo" className="flex items-center gap-2 px-6 py-3 bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transition-all text-sm">
            ▶ Ver Catálogo
          </Link>
          <Link to="/planos" className="flex items-center gap-2 px-6 py-3 glass rounded-xl font-semibold hover:border-[#1D4ED8]/50 transition-all text-sm text-slate-200">
            Assinar Agora
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 md:left-16 z-10 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFade(false); setTimeout(() => { setIndex(i); setFade(true); }, 400); }}
            className={`h-1 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-[#3B82F6]" : "w-2 bg-slate-600 hover:bg-slate-400"}`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060B18] to-transparent" />
    </div>
  );
}
