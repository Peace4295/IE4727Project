// Combine the three categories into one searchable list
const allMovies = [
    ...movies,
    ...studentOriginals,
    ...comingSoon
];

// Read the movie ID from the URL
const urlParameters = new URLSearchParams(window.location.search);
const selectedMovieId = Number(urlParameters.get("id"));

// Find the movie with the matching ID
const selectedMovie = allMovies.find(function (movie) {
    return movie.id === selectedMovieId;
});

// Find the details container in moviedetails.html
const detailsContainer = document.getElementById("movie-details");

// Display the selected movie
if (selectedMovie) {
    detailsContainer.innerHTML = `
        <article class="movie-details">
            <div class="details-poster">
                <img
                    src="${selectedMovie.poster}"
                    alt="${selectedMovie.title} poster"
                >
            </div>

            <div class="details-content">
                <span class="badge">${selectedMovie.rating}</span>

                <h1>${selectedMovie.title}</h1>

                <p class="details-meta">
                    ${selectedMovie.genre}
                    &bull;
                    ${selectedMovie.duration}
                    &bull;
                    ${selectedMovie.releaseDate}
                </p>

                <h2>Synopsis</h2>
                <p>${selectedMovie.synopsis}</p>

                <h2>Director</h2>
                <p>${selectedMovie.director}</p>

                <h2>Cast</h2>
                <p>${selectedMovie.cast}</p>

                <div class="details-actions">
                    ${
                        selectedMovie.status === "coming-soon"
                            ? `
                                <button
                                    type="button"
                                    class="btn btn-secondary"
                                >
                                    Notify Me
                                </button>
                            `
                            : `
                                <a
                                    href="booking.html?id=${selectedMovie.id}"
                                    class="btn btn-primary"
                                >
                                    Buy Tickets
                                </a>
                            `
                    }
                </div>
            </div>
        </article>
    `;
} else {
    detailsContainer.innerHTML = `
        <div class="movie-not-found">
            <h1>Movie not found</h1>
            <p>Please return to the catalogue and select a movie.</p>
            <a href="moviecatalog.html" class="btn btn-primary">
                Back to Movies
            </a>
        </div>
    `;
}