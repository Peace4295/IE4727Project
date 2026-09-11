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

/* Finds the location dropdown */
const locationSelect = document.getElementById("location-select");

/* Finds every showtime button across all displayed dates */
const showtimeButtons = document.querySelectorAll(".showtime-option");

/* Finds the area used to display the selected session */
const selectedSessionBox = document.getElementById("selected-session");
const selectedSessionText = document.getElementById(
    "selected-session-text"
);

/* Finds the button that continues to seat selection */
const continueBookingButton = document.getElementById(
    "continue-booking"
);

/*
    Stores the selected screening.
    It starts as null because the user has not selected anything yet.
*/
let selectedSession = null;

/*
    Clears the selected showtime.
    This is used when the user changes location.
*/
function clearSelectedSession() {
    /* Remove the selected style from every showtime button */
    showtimeButtons.forEach(function (button) {
        button.classList.remove("selected");
    });

    /* Remove the previously stored session */
    selectedSession = null;

    /* Hide the selected-session summary */
    selectedSessionBox.hidden = true;

    /* Prevent the user from continuing without a session */
    continueBookingButton.disabled = true;
}

/*
    Adds click behaviour to every showtime button.
*/
showtimeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        /* Remove the selected style from all time buttons */
        showtimeButtons.forEach(function (otherButton) {
            otherButton.classList.remove("selected");
        });

        /* Highlight the showtime that was clicked */
        button.classList.add("selected");

        /*
            Store the complete screening preference:
            location, date and time.
        */
        selectedSession = {
            location: locationSelect.value,
            date: button.dataset.date,
            time: button.dataset.time
        };

        /* Display the selected session to the user */
        selectedSessionText.textContent =
            `${locationSelect.options[locationSelect.selectedIndex].text} · ` +
            `${selectedSession.date} · ${button.textContent.trim()}`;

        /* Reveal the summary */
        selectedSessionBox.hidden = false;

        /* Allow the user to continue */
        continueBookingButton.disabled = false;
    });
});

/*
    Changing location clears the selected session because
    the chosen time may not exist at the new location.
*/
locationSelect.addEventListener("change", function () {
    clearSelectedSession();
});

/*
    Sends the complete selection to booking.html.
*/
continueBookingButton.addEventListener("click", function () {
    /* Safety check in case no session has been selected */
    if (!selectedSession) {
        return;
    }

    /*
        Creates URL parameters containing the movie and session details.
    */
    const bookingParameters = new URLSearchParams({
        movieId: selectedMovie.id,
        location: selectedSession.location,
        date: selectedSession.date,
        time: selectedSession.time
    });

    /* Opens the seat-selection page */
    window.location.href =
        `bookingandpayment.html?${bookingParameters.toString()}`;
});