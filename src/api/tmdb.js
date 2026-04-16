// Chave pública de demonstração do TMDB (uso acadêmico)
const KEY = "2dca580c2a14b55200e784d157207b4d";
const BASE = "https://api.themoviedb.org/3";
export const IMG = "https://image.tmdb.org/t/p/w500";
export const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";

const get = async (path, params = {}) => {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", KEY);
  url.searchParams.set("language", "pt-BR");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  return res.json();
};

// Filtra filmes sem poster ou sem backdrop
const withPoster = (movies = []) =>
  movies.filter((m) => m.poster_path && m.backdrop_path);

export const fetchTrending = async () => {
  const data = await get("/trending/movie/week");
  return withPoster(data.results);
};

export const fetchByGenre = async (genreId, page = 1) => {
  const data = await get("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    "vote_count.gte": 200,
    page,
  });
  return { movies: withPoster(data.results), totalPages: Math.min(data.total_pages, 20) };
};

export const fetchPopular = async (page = 1) => {
  const data = await get("/movie/popular", { page });
  return { movies: withPoster(data.results), totalPages: Math.min(data.total_pages, 20) };
};

export const searchMovies = async (query, page = 1) => {
  const data = await get("/search/movie", { query, page, include_adult: false });
  return { movies: withPoster(data.results), totalPages: Math.min(data.total_pages || 1, 10) };
};

export const fetchMovieDetails = async (id) => {
  return get(`/movie/${id}`);
};
