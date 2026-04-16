import { useEffect, useRef, useState } from "react";
import { fetchByGenre, fetchTrending } from "../api/tmdb";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, genreId, trending }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    if (trending) {
      fetchTrending().then(setMovies);
    } else {
      fetchByGenre(genreId).then(({ movies }) => setMovies(movies));
    }
  }, [genreId, trending]);

  // Impede que o scroll vertical da página seja capturado pelo carrossel
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY, behavior: "auto" });
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [movies]);

  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 600, behavior: "smooth" });

  if (movies.length === 0) return null;

  return (
    <div className="px-6 md:px-12 group/row">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#1D4ED8]/30 to-transparent ml-2" />
      </div>

      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-[#1D4ED8]/30 transition-all shadow-glow text-xl"
        >‹</button>

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto hide-scrollbar pb-2"
          style={{ overscrollBehaviorX: "contain" }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-[150px] md:min-w-[170px] flex-shrink-0">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-10 h-10 glass rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 hover:bg-[#1D4ED8]/30 transition-all shadow-glow text-xl"
        >›</button>

        <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[#060B18] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
