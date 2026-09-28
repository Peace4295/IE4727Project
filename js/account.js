//temp account data
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



//get html elements

// const profileName = document.querySelector("#profile-name");
// const profileEmail = document.querySelector("#profile-email");
// const profileAvatar = document.querySelector("#profile-avatar");

const bookingTabs = document.querySelectorAll(".booking-tab");
const bookingCards = document.querySelectorAll(".account-booking-card");
const emptyBookingMessage = document.querySelector("#empty-booking-message");
const bookingList = document.querySelector("#account-booking-list");
const cancelBookingModal = document.querySelector("#cancel-booking-modal");
const cancelMovieTitle = document.querySelector("#cancel-movie-title");
const cancelSessionDetails = document.querySelector("#cancel-session-details");
const keepBookingButton = document.querySelector("#keep-booking-button");
const confirmCancellationButton = document.querySelector("#confirm-cancellation-button");
const editProfileButton = document.querySelector("#edit-profile-button");
const signOutButton = document.querySelector("#sign-out-button");


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
confirmCancellationButton.addEventListener("click",function(){
    //replace this alert with php update later
    alert("booking id" + bookingToCancelId+"will be cancelled thru php");
});
    



//edit profile
editProfileButton.addEventListener("click", function () {
    //Temporary prototype behaviour.A proper edit form can be added later.
    alert("Profile editing will be connected to the backend later.");
});


//signout button
signOutButton.addEventListener("click",function(){
    const shouldSignOut = confirm(
        "Are you shure you want to sign out?"
    );
    if(shouldSignOut){
        window.location.href = "login.html";
    }
});

//initial display
displaySelectedBookings();