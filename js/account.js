
const accountUser = {
    name: "Priscilla Chong",
    email: "pris0038@e.ntu.edu.sg",
    initials: "PC"
};




//get html elements

const bookingTabs = document.querySelectorAll(".booking-tab");
const bookingCards = document.querySelectorAll(".account-booking-card");
const emptyBookingMessage = document.querySelector("#empty-booking-message");
const bookingList = document.querySelector("#account-booking-list");
const cancelBookingModal = document.querySelector("#cancel-booking-modal");
const cancelMovieTitle = document.querySelector("#cancel-movie-title");
const cancelSessionDetails = document.querySelector("#cancel-session-details");
const keepBookingButton = document.querySelector("#keep-booking-button");
const confirmCancellationButton = document.querySelector("#confirm-cancellation-button");
const signOutButton = document.querySelector("#sign-out-button");
const cancelBookingIdInput = document.querySelector("#cancel-booking-id");


//booking tabs
let selectedBookingStatus = "upcoming";

function displaySelectedBookings() {
    let visibleBookingCount = 0;

    bookingCards.forEach(function (bookingCard) {
        const cardStatus = bookingCard.dataset.bookingStatus;
        const shouldDisplay = cardStatus === selectedBookingStatus;
        bookingCard.hidden = !shouldDisplay;
        if (shouldDisplay) {
            visibleBookingCount++;
        }
    });

    if (emptyBookingMessage) {
        emptyBookingMessage.hidden = visibleBookingCount !== 0;
        emptyBookingMessage.textContent = `No ${selectedBookingStatus} bookings found.`;
    }
}
bookingTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        selectedBookingStatus = tab.dataset.status;

        bookingTabs.forEach(function (currentTab) {
            const isActive = currentTab === tab;

            currentTab.classList.toggle( "active", isActive );
            currentTab.setAttribute( "aria-selected", isActive );
        });
        displaySelectedBookings();
    });
});

//booking buttons


let bookingToCancelId = null;

bookingList.addEventListener("click", function (event) {
    const detailsButton = event.target.closest( ".view-booking-button" );
    const cancelButton = event.target.closest( ".cancel-booking-button");

    if (detailsButton) {
        alert(
            detailsButton.dataset.movieTitle + "\n" +
            detailsButton.dataset.session + "\n" +
            "Seats: " + detailsButton.dataset.seats + "\n" +
            "Reference: " +
            detailsButton.dataset.reference
        );
    }
    if (cancelButton) {
        cancelBookingIdInput.value = cancelButton.dataset.bookingId;
        bookingToCancelId = cancelButton.dataset.bookingId;
        cancelMovieTitle.textContent = cancelButton.dataset.movieTitle;
        cancelSessionDetails.textContent = cancelButton.dataset.session;
        cancelBookingModal.showModal();
    }
});


//cancellation modal

keepBookingButton.addEventListener("click", function(){
    bookingToCancelId = null;
    cancelBookingModal.close();
});




//initial display
displaySelectedBookings();


// FILM SUBMISSION STATUS TABS


// FILM SUBMISSION STATUS TABS + SHOW MORE / SHOW LESS

const submissionTabs = document.querySelectorAll(".submission-tab");

const filmSubmissionCards = document.querySelectorAll(
    ".account-film-submission"
);

const showMoreButton = document.getElementById("submission-show-more");

let selectedSubmissionStatus = "all";
let showAllSubmissions = false;

// Filter submissions and limit results to three initially
function displaySelectedSubmissions() {
    let matchingCount = 0;
    let visibleCards = [];

    filmSubmissionCards.forEach(function(card) {
        const filmStatus = card.dataset.submissionStatus;

        const matchesStatus =
            selectedSubmissionStatus === "all" ||
            filmStatus === selectedSubmissionStatus;

        if (matchesStatus) {
            matchingCount++;
        }

        const shouldShow =
            matchesStatus && (showAllSubmissions || matchingCount <= 3);

        card.hidden = !shouldShow;

        // reset helper class first
        card.classList.remove("is-last-visible");

        if (shouldShow) {
            visibleCards.push(card);
        }
    });

    // mark the last visible card
    if (visibleCards.length > 0) {
        visibleCards[visibleCards.length - 1].classList.add("is-last-visible");
    }

    if (showMoreButton) {
        showMoreButton.hidden = matchingCount <= 3;
        showMoreButton.textContent = showAllSubmissions
            ? "Show Less"
            : "Show More";
    }
}




// Handle tab selection
submissionTabs.forEach(function(tab) {

    tab.addEventListener("click", function() {

        selectedSubmissionStatus = tab.dataset.status;

        // Reset expansion when switching tabs
        showAllSubmissions = false;

        submissionTabs.forEach(function(otherTab) {
            const isActive = otherTab === tab;

            otherTab.classList.toggle("active", isActive);
            otherTab.setAttribute(
                "aria-selected",
                isActive ? "true" : "false"
            );
        });

        displaySelectedSubmissions();
    });
});

// Handle Show More / Show Less
if (showMoreButton) {
    showMoreButton.addEventListener("click", function() {
        showAllSubmissions = !showAllSubmissions;
        displaySelectedSubmissions();
    });
}

// Initially display only three submissions
displaySelectedSubmissions();
