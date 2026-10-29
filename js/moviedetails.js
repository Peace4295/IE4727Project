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


const showtimesSection = document.getElementById("showtimes");

if (showtimesSection) {showtimesSection.hidden = true;}

if (selectedMovie && selectedMovie.status === "coming-soon") {
    showtimesSection.hidden = true;
}

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
                                <p class="coming-soon-notice">
                                    Screening dates will be announced soon.
                                </p>
                            `
                            : `
                                <button type="button"
                                        class="btn btn-primary"
                                        id="show-showtimes">
                                    Buy Tickets
                                </button>
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

// Find Buy Tickets after the movie details have been generated
const showShowtimesButton = document.getElementById("show-showtimes");

if (showShowtimesButton && showtimesSection) {
    showShowtimesButton.addEventListener("click", function() {

        // Show the hidden showtimes section
        showtimesSection.hidden = false;

        // Scroll smoothly to the showtimes
        showtimesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}


// SHOWTIME SELECTION

/* Finds the location dropdown */
const locationSelect = document.getElementById("location-select");

//create showtime dates for today and the next two days
const showtimeDateGroups = document.querySelectorAll(".showtime-date-group");
showtimeDateGroups.forEach(function (group,index){
    const screeningDate = new Date();

    //index 0 = today, 1=tmr, 2=two days later

    screeningDate.setDate(screeningDate.getDate() + index);

    const year = screeningDate.getFullYear();
    const month = String(screeningDate.getMonth()+1).padStart(2,"0");
    const day = String(screeningDate.getDate()).padStart(2,"0");

    //database-friendly format:YYYYMMDD
    const dateValue = `${year}-${month}-${day}`;

    const dateHeading = group.querySelector("h3");
    const dateButtons = group.querySelectorAll(".showtime-option");

    let dateLabel = screeningDate.toLocaleDateString("en-SG",{
        day: "numeric",
        month: "short"
    });

    if(index === 0){
        dateLabel = `Today, ${dateLabel}`;
    } else if (index === 1){
        dateLabel = `Tomorrow, ${dateLabel}`;
    }
    dateHeading.textContent = dateLabel;
    dateButtons.forEach(function(button){
        button.dataset.date = dateValue;
    });
});

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

    //Hide the selected-session summary 
    selectedSessionBox.hidden = true;

    /* Prevent the user from continuing without a session */
    continueBookingButton.disabled = true;
}

// Disable screening times that have already passed
showtimeButtons.forEach(function(button) {
    const screeningDateTime = new Date(
        `${button.dataset.date}T${button.dataset.time}:00`
    );

    if (screeningDateTime <= new Date()) {
        button.disabled = true;
        button.classList.add("unavailable");
    }
});

/* Adds click behaviour to every showtime button.*/
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
        `bookingandpayment.php?${bookingParameters.toString()}`;
});