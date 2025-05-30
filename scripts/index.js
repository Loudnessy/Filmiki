document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  const movieList = document.querySelector(".movie-list");
  const pageIndicator = document.getElementById("page-indicator");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  function isFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.some((m) => m.id === id);
  }

  function toggleFavorite(movie, btn) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.findIndex((m) => m.id === movie.id);
    if (index !== -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(movie);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    btn.textContent = isFavorite(movie.id) ? "★" : "☆";
  }

  function displayMovies(movies) {
    movieList.innerHTML = "";
    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.className = "movie-item";

      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
        movie.title
      }" />
        <h3>${movie.title}</h3>
        <button class="favorite-btn">${
          isFavorite(movie.id) ? "★" : "☆"
        }</button>
      `;

      const favBtn = card.querySelector(".favorite-btn");
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(movie, e.target);
      });

      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("favorite-btn")) return;
        localStorage.setItem("movieDetails", JSON.stringify(movie));
        window.location.href = "movie.html";
      });

      li.appendChild(card);
      movieList.appendChild(li);
    });
  }

  async function loadPopularMovies() {
    const movies = await fetchPopularMovies(currentPage);
    pageIndicator.textContent = currentPage;
    displayMovies(movies);
    nextBtn.style.display = movies.length < 20 ? "none" : "inline-block";
    prevBtn.style.display = currentPage > 1 ? "inline-block" : "none";
  }

  nextBtn.addEventListener("click", () => {
    currentPage++;
    loadPopularMovies();
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadPopularMovies();
    }
  });

  loadPopularMovies();
});
