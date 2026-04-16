const KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE = "https://www.omdbapi.com/";

const get = (params) =>
  fetch(`${BASE}?apikey=${KEY}&${new URLSearchParams(params)}`).then((r) => r.json());

// Busca filmes por título
export const searchMovies = async (query, page = 1) => {
  const data = await get({ s: query, type: "movie", page });
  return data.Search || [];
};

// Busca filmes por termo/gênero (OMDb não tem filtro de gênero nativo, usamos termos representativos)
export const fetchByGenre = async (term, page = 1) => {
  const data = await get({ s: term, type: "movie", page });
  return data.Search || [];
};

// Detalhes completos de um filme pelo imdbID
export const fetchMovieDetails = async (imdbID) => {
  return get({ i: imdbID, plot: "short" });
};

// Busca múltiplos termos e mescla resultados (para seções da home)
export const fetchMultiple = async (terms) => {
  const results = await Promise.all(terms.map((t) => fetchByGenre(t)));
  const seen = new Set();
  return results.flat().filter((m) => {
    if (!m?.imdbID || seen.has(m.imdbID)) return false;
    seen.add(m.imdbID);
    return true;
  });
};
