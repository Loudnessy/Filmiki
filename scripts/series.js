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

  function toggleFavorite(series, btn) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.findIndex((m) => m.id === series.id);
    if (index !== -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push({ ...series, media_type: "tv" });
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    btn.textContent = isFavorite(series.id) ? "★" : "☆";
  }

  function displaySeries(seriesList) {
    movieList.innerHTML = "";
    seriesList.forEach((show) => {
      const li = document.createElement("li");
      li.className = "movie-item";

      const card = document.createElement("div");
      card.className = "movie-card";
      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${
        show.name
      }" />
        <h3>${show.name}</h3>
        <button class="favorite-btn">${isFavorite(show.id) ? "★" : "☆"}</button>
      `;

      const favBtn = card.querySelector(".favorite-btn");
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(show, e.target);
      });

      card.addEventListener("click", (e) => {
        if (e.target.classList.contains("favorite-btn")) return;
        localStorage.setItem(
          "movieDetails",
          JSON.stringify({ ...show, media_type: "tv" })
        );
        window.location.href = "movie.html";
      });

      li.appendChild(card);
      movieList.appendChild(li);
    });
  }

  async function loadPopularSeries() {
    const series = await fetchPopularSeries(currentPage);
    pageIndicator.textContent = currentPage;
    displaySeries(series);
    nextBtn.style.display = series.length < 20 ? "none" : "inline-block";
    prevBtn.style.display = currentPage > 1 ? "inline-block" : "none";
  }

  nextBtn.addEventListener("click", () => {
    currentPage++;
    loadPopularSeries();
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      loadPopularSeries();
    }
  });

  loadPopularSeries();
});
