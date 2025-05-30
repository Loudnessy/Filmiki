document.addEventListener("DOMContentLoaded", () => {
  const movieList = document.querySelector("section ul.movie-list");
  const pageIndicator = document.getElementById("page-indicator");

  function displayFavorites(items) {
    movieList.innerHTML = "";

    if (!items.length) {
      const noItems = document.createElement("p");
      noItems.textContent = "No favorites yet.";
      noItems.style.padding = "1rem";
      movieList.appendChild(noItems);
      return;
    }

    items.forEach((item) => {
      const title = item.title || item.name || "Untitled";

      const li = document.createElement("li");
      li.className = "movie-item";

      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${title}" />
        <h3>${title}</h3>
        <button class="favorite-btn">★</button>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("favorite-btn")) return;
        localStorage.setItem("movieDetails", JSON.stringify(item));
        window.location.href = "movie.html";
      });

      card.querySelector(".favorite-btn").addEventListener("click", () => {
        removeFavorite(item.id);
        loadFavorites();
      });

      li.appendChild(card);
      movieList.appendChild(li);
    });
  }

  function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (pageIndicator) pageIndicator.textContent = "Favorites";
    displayFavorites(favorites);
  }

  function removeFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((item) => item.id !== id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  loadFavorites();
});
