const API_KEY = "d6c570439cb3c49e4020d7227fe08c07";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchPopularMovies(page = 1) {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  const data = await res.json();
  return data.results;
}

async function fetchPopularSeries(page = 1) {
  const res = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
  );
  const data = await res.json();
  return data.results;
}

async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  const data = await res.json();
  return data.results;
}

async function searchSeries(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  const data = await res.json();
  return data.results;
}

async function fetchGenres(type = "movie") {
  const res = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}`);
  const data = await res.json();
  return data.genres;
}

async function fetchTrailer(id, type = "movie") {
  const res = await fetch(
    `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`
  );
  const data = await res.json();
  return data.results.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
}
