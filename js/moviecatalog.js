
// Function for a movie card element in moviecatalog.html
function createMovieCard(movie) {
    const isComingSoon = movie.status === "coming-soon";

    // Add the selected movie's ID to the details-page URL
    const detailsUrl = `moviedetails.html?id=${movie.id}`;

    const actionButton = isComingSoon
        ? `
            <button type="button" class="btn btn-secondary btn-block">
                Notify Me
            </button>
        `
        : `
            <a href="#" class="btn btn-primary btn-block">
                Buy Tickets
            </a>
        `;

    return `
        <article class="movie-card">

            <a href="${detailsUrl}" class="movie-poster-link">
                <div class="poster-placeholder">
                    <img
                        src="${movie.poster}"
                        alt="${movie.title} poster"
                    >
                </div>
            </a>

            <div class="movie-meta">
                <h3 class="movie-title">
                    <a href="${detailsUrl}" class="movie-title-link">
                        ${movie.title}
                    </a>
                </h3>

                <p class="movie-info">
                    <span class="badge">${movie.rating}</span>
                    ${movie.genre} &bull; ${movie.duration}
                </p>

                ${actionButton}
            </div>
        </article>
    `;
}

function renderMovies(containerId, movieArray) {
    const container = document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = movieArray
        .map(createMovieCard)
        .join("");
}

renderMovies("movies-list", movies);
renderMovies("student-originals-list", studentOriginals);
renderMovies("coming-soon-list", comingSoon);


