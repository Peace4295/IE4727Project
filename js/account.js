/* ========================= TEMPORARY ACCOUNT DATA ========================= */

/*
    This information is temporary frontend data.

    Later:
    - PHP will identify the signed-in user.
    - MySQL will store and return their bookings.
*/
const accountUser = {
    name: "Priscilla Chong",
    email: "pris0038@e.ntu.edu.sg",
    initials: "PC"
};

/*
    Temporary booking records.

    Each booking contains:
    - A unique ID
    - Movie information
    - Session information
    - Booking status
*/
const accountBookings = [
    {
        id: 1,
        movieTitle: "Requiem",
        poster: "images/posters/requiem.jpg",
        location: "North Spine Cinema",
        date: "18 September 2026",
        time: "9:00 PM",
        seats: ["F8"],
        reference: "NTF-MTWOFKER",
        status: "upcoming"
    },
    {
        id: 2,
        movieTitle: "The Last Light",
        poster: "images/posters/movieposter.jpg",
        location: "One-North Hall",
        date: "24 September 2026",
        time: "7:30 PM",
        seats: ["C4", "C5"],
        reference: "NTF-QPLWJ832",
        status: "upcoming"
    },
    {
        id: 3,
        movieTitle: "After Rain",
        poster: "images/posters/minionposter.jpg",
        location: "South Spine Theatre",
        date: "26 August 2026",
        time: "6:30 PM",
        seats: ["B6"],
        reference: "NTF-K70H2P9Q",
        status: "past"
    },
    {
        id: 4,
        movieTitle: "Blue Hour",
        poster: "images/posters/movieposter.jpg",
        location: "North Spine Cinema",
        date: "5 September 2026",
        time: "8:00 PM",
        seats: ["D3"],
        reference: "NTF-84KMD20Z",
        status: "cancelled"
    }
];

/* Temporary film-submission records */
const filmSubmissions = [
    {
        id: 1,
        title: "A Walk Through NTU",
        submittedDate: "13 September 2026",
        reference: "NFH-F1042",
        status: "Pending Review"
    }
];

/*
    let is used because new activity can be added
    after a booking is cancelled.
*/
let accountActivities = [
    {
        description: 'Submitted "A Walk Through NTU"',
        date: "13 September 2026"
    },
    {
        description: 'Booked "Requiem"',
        date: "12 September 2026"
    },
    {
        description: 'Cancelled "Blue Hour"',
        date: "3 September 2026"
    }
];

/* The page initially displays upcoming bookings */
let selectedBookingStatus = "upcoming";

/*
    Stores the booking selected for cancellation.
    null means that no booking is currently selected.
*/
let bookingToCancelId = null;


/* ========================= GET HTML ELEMENTS ========================= */

const profileName = document.querySelector("#profile-name");
const profileEmail = document.querySelector("#profile-email");
const profileAvatar = document.querySelector("#profile-avatar");

const upcomingBookingCount = document.querySelector(
    "#upcoming-booking-count"
);

const filmSubmissionCount = document.querySelector(
    "#film-submission-count"
);

const pendingReviewCount = document.querySelector(
    "#pending-review-count"
);

const bookingList = document.querySelector("#account-booking-list");
const bookingTabs = document.querySelectorAll(".booking-tab");

const filmSubmissionList = document.querySelector(
    "#film-submission-list"
);

const activityList = document.querySelector("#activity-list");

const cancelBookingModal = document.querySelector(
    "#cancel-booking-modal"
);

const cancelMovieTitle = document.querySelector(
    "#cancel-movie-title"
);

const cancelSessionDetails = document.querySelector(
    "#cancel-session-details"
);

const keepBookingButton = document.querySelector(
    "#keep-booking-button"
);

const confirmCancellationButton = document.querySelector(
    "#confirm-cancellation-button"
);

const editProfileButton = document.querySelector(
    "#edit-profile-button"
);

const signOutButton = document.querySelector("#sign-out-button");


/* ========================= RENDER PROFILE ========================= */

/*
    Displays the temporary user's information in the HTML.
*/
function renderProfile() {
    profileName.textContent = accountUser.name;
    profileEmail.textContent = accountUser.email;
    profileAvatar.textContent = accountUser.initials;
}


/* ========================= RENDER STATISTICS ========================= */

function renderAccountStatistics() {
    /*
        filter() creates a new array containing only
        upcoming bookings.
    */
    const upcomingBookings = accountBookings.filter(function (booking) {
        return booking.status === "upcoming";
    });

    /*
        filter() also identifies submissions that are
        currently pending review.
    */
    const pendingSubmissions = filmSubmissions.filter(
        function (submission) {
            return submission.status === "Pending Review";
        }
    );

    upcomingBookingCount.textContent = upcomingBookings.length;
    filmSubmissionCount.textContent = filmSubmissions.length;
    pendingReviewCount.textContent = pendingSubmissions.length;
}


/* ========================= RENDER BOOKING TABS ========================= */

function renderBookingTabs() {
    bookingTabs.forEach(function (tab) {
        /*
            Checks whether the tab represents the currently
            selected booking status.
        */
        const isActive =
            tab.dataset.status === selectedBookingStatus;

        /*
            toggle() adds the active class when isActive is true
            and removes it when isActive is false.
        */
        tab.classList.toggle("active", isActive);

        /*
            aria-selected helps screen readers understand
            which tab is selected.
        */
        tab.setAttribute("aria-selected", isActive);
    });
}


/* ========================= RENDER BOOKINGS ========================= */

function renderBookings() {
    /*
        Finds bookings that match the selected tab.
    */
    const filteredBookings = accountBookings.filter(
        function (booking) {
            return booking.status === selectedBookingStatus;
        }
    );

    /* Clears previously displayed bookings */
    bookingList.innerHTML = "";

    /* Shows a message when a tab has no bookings */
    if (filteredBookings.length === 0) {
        bookingList.innerHTML = `
            <p class="empty-account-message">
                No ${selectedBookingStatus} bookings found.
            </p>
        `;

        return;
    }

    /*
        Creates one HTML article for every filtered booking.
    */
    filteredBookings.forEach(function (booking) {
        const bookingCard = document.createElement("article");

        bookingCard.className = "account-booking-card";

        /*
            join(", ") converts a seat array such as
            ["C4", "C5"] into "C4, C5".
        */
        const formattedSeats = booking.seats.join(", ");

        /*
            Cancel Booking is shown only for upcoming bookings.
        */
        const cancellationButton =
            booking.status === "upcoming"
                ? `
                    <button
                        type="button"
                        class="cancel-booking-button"
                        data-booking-id="${booking.id}"
                    >
                        Cancel Booking
                    </button>
                `
                : "";

        bookingCard.innerHTML = `
            <img
                src="${booking.poster}"
                alt="${booking.movieTitle} poster"
                class="account-booking-poster"
            >

            <div class="account-booking-information">
                <h3>${booking.movieTitle}</h3>

                <p>
                    ${booking.location} ·
                    ${booking.date} ·
                    ${booking.time}
                </p>

                <p>
                    Seat${booking.seats.length > 1 ? "s" : ""}:
                    ${formattedSeats}
                </p>

                <p>
                    Reference:
                    <span class="booking-reference">
                        ${booking.reference}
                    </span>
                </p>
            </div>

            <div class="account-booking-actions">
                <span class="booking-status ${booking.status}">
                    ${booking.status}
                </span>

                <button
                    type="button"
                    class="btn btn-secondary view-booking-button"
                    data-booking-id="${booking.id}"
                >
                    View Details
                </button>

                ${cancellationButton}
            </div>
        `;

        bookingList.appendChild(bookingCard);
    });
}


/* ========================= RENDER FILM SUBMISSIONS ========================= */

function renderFilmSubmissions() {
    filmSubmissionList.innerHTML = "";

    if (filmSubmissions.length === 0) {
        filmSubmissionList.innerHTML = `
            <p class="empty-account-message">
                You have not submitted any films.
            </p>
        `;

        return;
    }

    filmSubmissions.forEach(function (submission) {
        const submissionElement = document.createElement("article");

        submissionElement.className = "account-film-submission";

        submissionElement.innerHTML = `
            <h3>${submission.title}</h3>

            <p>
                Submitted ${submission.submittedDate} ·
                ${submission.reference}
            </p>

            <span class="submission-status">
                ${submission.status}
            </span>
        `;

        filmSubmissionList.appendChild(submissionElement);
    });
}


/* ========================= RENDER RECENT ACTIVITY ========================= */

function renderActivities() {
    activityList.innerHTML = "";

    /*
        slice(0, 5) ensures that only the first five
        activity records are shown.
    */
    const recentActivities = accountActivities.slice(0, 5);

    recentActivities.forEach(function (activity) {
        const activityElement = document.createElement("article");

        activityElement.className = "account-activity";

        activityElement.innerHTML = `
            <p>${activity.description}</p>
            <time>${activity.date}</time>
        `;

        activityList.appendChild(activityElement);
    });
}


/* ========================= CHANGE BOOKING TAB ========================= */

bookingTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        /*
            data-status in the HTML determines which
            bookings should be displayed.
        */
        selectedBookingStatus = tab.dataset.status;

        renderBookingTabs();
        renderBookings();
    });
});


/* ========================= BOOKING BUTTONS ========================= */

/*
    Event delegation allows JavaScript to recognise buttons
    that were dynamically created inside bookingList.
*/
bookingList.addEventListener("click", function (event) {
    const cancelButton = event.target.closest(
        ".cancel-booking-button"
    );

    const detailsButton = event.target.closest(
        ".view-booking-button"
    );

    /* Opens the cancellation modal */
    if (cancelButton) {
        const bookingId = Number(cancelButton.dataset.bookingId);

        openCancellationModal(bookingId);
    }

    /*
        Temporary behaviour for View Details.
        This can later open a proper booking-details page.
    */
    if (detailsButton) {
        const bookingId = Number(detailsButton.dataset.bookingId);

        const selectedBooking = accountBookings.find(
            function (booking) {
                return booking.id === bookingId;
            }
        );

        if (selectedBooking) {
            alert(
                `${selectedBooking.movieTitle}\n` +
                `${selectedBooking.location}\n` +
                `${selectedBooking.date}, ${selectedBooking.time}\n` +
                `Seats: ${selectedBooking.seats.join(", ")}`
            );
        }
    }
});


/* ========================= CANCELLATION MODAL ========================= */

function openCancellationModal(bookingId) {
    /*
        find() returns the booking with the matching ID.
    */
    const selectedBooking = accountBookings.find(
        function (booking) {
            return booking.id === bookingId;
        }
    );

    if (!selectedBooking) {
        return;
    }

    /* Remembers which booking is being cancelled */
    bookingToCancelId = selectedBooking.id;

    /* Displays the selected booking inside the modal */
    cancelMovieTitle.textContent = selectedBooking.movieTitle;

    cancelSessionDetails.textContent =
        `${selectedBooking.location} · ` +
        `${selectedBooking.date} · ` +
        `${selectedBooking.time}`;

    /*
        showModal() displays a native HTML dialog
        above the rest of the page.
    */
    cancelBookingModal.showModal();
}


/* Closes the modal without changing the booking */
keepBookingButton.addEventListener("click", function () {
    bookingToCancelId = null;
    cancelBookingModal.close();
});


/* Confirms and performs the temporary cancellation */
confirmCancellationButton.addEventListener(
    "click",
    function () {
        const selectedBooking = accountBookings.find(
            function (booking) {
                return booking.id === bookingToCancelId;
            }
        );

        if (!selectedBooking) {
            return;
        }

        /*
            Changes the booking's temporary frontend status.
            PHP and MySQL will perform this UPDATE later.
        */
        selectedBooking.status = "cancelled";

        /*
            Adds the cancellation to the beginning
            of the recent activity array.
        */
        accountActivities.unshift({
            description:
                `Cancelled "${selectedBooking.movieTitle}"`,
            date: "13 September 2026"
        });

        bookingToCancelId = null;
        cancelBookingModal.close();

        /*
            Re-renders the affected areas so the page
            immediately shows the change.
        */
        renderBookings();
        renderAccountStatistics();
        renderActivities();
    }
);


/* ========================= EDIT PROFILE ========================= */

editProfileButton.addEventListener("click", function () {
    /*
        Temporary prototype behaviour.
        A proper edit form can be added later.
    */
    alert("Profile editing will be connected to the backend later.");
});


/* ========================= SIGN OUT ========================= */

signOutButton.addEventListener("click", function () {
    /*
        confirm() prevents accidental sign-out.
        PHP will later destroy the user's login session.
    */
    const shouldSignOut = confirm(
        "Are you sure you want to sign out?"
    );

    if (shouldSignOut) {
        window.location.href = "login.html";
    }
});


/* ========================= INITIAL PAGE LOAD ========================= */

/*
    These functions run once when account.html opens.
*/
renderProfile();
renderAccountStatistics();
renderBookingTabs();
renderBookings();
renderFilmSubmissions();
renderActivities();