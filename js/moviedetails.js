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
                                <a href="#showtimes" class="btn btn-primary">
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

/* ========================= SHOWTIME SELECTION ========================= */

/*
    These variables store the user's current selections.
    The first location and first date are selected by default.
*/
let selectedLocation =
    document.getElementById("location-select").value;

let selectedDate =
    document.querySelector(".date-option.active").dataset.date;

/* Finds all date and time buttons on the page */
const dateButtons = document.querySelectorAll(".date-option");
const timeButtons = document.querySelectorAll(".time-option");

/*
    Updates selectedLocation whenever the user chooses
    a different cinema from the dropdown.
*/
document
    .getElementById("location-select")
    .addEventListener("change", function (event) {
        selectedLocation = event.target.value;
    });

/*
    Adds a click event to every date button.
*/
dateButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        /* Removes the active appearance from every date */
        dateButtons.forEach(function (dateButton) {
            dateButton.classList.remove("active");
        });

        /* Highlights the date that the user selected */
        button.classList.add("active");

        /* Saves the selected date from its data-date attribute */
        selectedDate = button.dataset.date;
    });
});

/*
    When the user selects a time, all booking information
    is placed into the booking-page URL.
*/
timeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const selectedTime = button.dataset.time;

        /*
            URLSearchParams safely formats the selected values
            as a query string.
        */
        const bookingParameters = new URLSearchParams({
            movie: selectedMovie.id,
            location: selectedLocation,
            date: selectedDate,
            time: selectedTime
        });

        /* Opens the booking page with the completed selection */
        window.location.href =
            `booking.html?${bookingParameters.toString()}`;
    });
});