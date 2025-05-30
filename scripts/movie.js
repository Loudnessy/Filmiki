document.addEventListener("DOMContentLoaded", async () => {
  const movie = JSON.parse(localStorage.getItem("movieDetails"));
  const container = document.getElementById("movie-details");

  if (!movie) {
    container.innerHTML = "<p>Movie data not found.</p>";
    return;
  }

  const isTV = movie.media_type === "tv";
  const title = isTV ? movie.name : movie.title;
  const release = isTV ? movie.first_air_date : movie.release_date;
  const rating = movie.vote_average;

  const trailer = await fetchTrailer(movie.id, isTV ? "tv" : "movie");

  container.innerHTML = `
    <div class="details-wrapper">
      <div class="poster">
        <img src="https://image.tmdb.org/t/p/w500${
          movie.poster_path
        }" alt="${title}" />
      </div>
      <div class="info">
        <h2>${title}</h2>
        <p>${movie.overview}</p>
        <p><strong>Release:</strong> ${release}</p>
        <p><strong>Rating:</strong> ${rating}/10</p>
      </div>
    </div>
    <div class="trailer">
      ${
        trailer
          ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`
          : `<p>No trailer available.</p>`
      }
    </div>
  `;
});
