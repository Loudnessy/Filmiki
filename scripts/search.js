document.addEventListener("DOMContentLoaded", async () => {
  let currentPage = 1;
  let currentQuery = "";
  let currentType = "movie";
  let currentGenre = "";
  let isSearchMode = false;

  const form = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const typeSelect = document.getElementById("type-select");
  const genreSelect = document.getElementById("genre-select");
  const movieList = document.querySelector(".movie-list");
  const pageIndicator = document.getElementById("page-indicator");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const pagination = document.querySelector(".pagination");

  async function loadGenres() {
    const genres = await fetchGenres(currentType);
    genreSelect.innerHTML = '<option value="">All Genres</option>';
    genres.forEach((g) => {
      const option = document.createElement("option");
      option.value = g.id;
      option.textContent = g.name;
      genreSelect.appendChild(option);
    });
  }

  async function loadInitialMovies() {
    const movies = await fetchPopularMovies(currentPage);
    displayResults(movies, "movie");
    pageIndicator.textContent = currentPage;
    pagination.style.display = movies.length ? "flex" : "none";
    nextBtn.style.display = movies.length < 20 ? "none" : "inline-block";
    prevBtn.style.display = currentPage > 1 ? "inline-block" : "none";
  }

  async function search() {
    if (!currentQuery.length) return;
    let results = [];
    if (currentType === "movie") {
      results = await searchMovies(currentQuery, currentPage);
    } else {
      results = await searchSeries(currentQuery, currentPage);
    }

    if (currentGenre) {
      results = results.filter((item) =>
        item.genre_ids.includes(parseInt(currentGenre))
      );
    }

    displayResults(results, currentType);
    pageIndicator.textContent = currentPage;
    pagination.style.display = results.length ? "flex" : "none";
    nextBtn.style.display = results.length < 20 ? "none" : "inline-block";
    prevBtn.style.display = currentPage > 1 ? "inline-block" : "none";
  }

  function displayResults(items, type) {
    movieList.innerHTML = "";
    movieList.style.position = "relative";

    if (items.length === 0) {
      const msgWrapper = document.createElement("div");
      msgWrapper.style.position = "absolute";
      msgWrapper.style.top = "50%";
      msgWrapper.style.left = "50%";
      msgWrapper.style.transform = "translate(-50%, -50%)";
      msgWrapper.style.fontSize = "1.2rem";
      msgWrapper.style.color = "var(--text-color)";
      msgWrapper.textContent = "No results found.";
      movieList.appendChild(msgWrapper);
      return;
    }

    items.forEach((item) => {
      const isTV = type === "tv";
      const title = item.title || item.name || "Untitled";

      const li = document.createElement("li");
      li.className = "movie-item";

      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${
          item.poster_path
        }" alt="${title}" />
        <h3>${title}</h3>
        <button class="favorite-btn">${isFavorite(item.id) ? "★" : "☆"}</button>
      `;

      const favBtn = card.querySelector(".favorite-btn");
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(item, e.target);
      });

      card.addEventListener("click", () => {
        localStorage.setItem(
          "movieDetails",
          JSON.stringify({ ...item, media_type: type })
        );
        window.location.href = "movie.html";
      });

      li.appendChild(card);
      movieList.appendChild(li);
    });
  }

  function isFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some((m) => m.id === id);
  }

  function toggleFavorite(item, btn) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.findIndex((m) => m.id === item.id);
    if (index !== -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ ...item, media_type: currentType });
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    btn.textContent = isFavorite(item.id) ? "★" : "☆";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    currentQuery = searchInput.value.trim();
    currentType = typeSelect.value;
    currentGenre = genreSelect.value;
    currentPage = 1;
    isSearchMode = true;
    await loadGenres();
    await search();
  });

  nextBtn.addEventListener("click", () => {
    currentPage++;
    isSearchMode ? search() : loadInitialMovies();
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      isSearchMode ? search() : loadInitialMovies();
    }
  });

  await loadGenres();
  await loadInitialMovies();
});
