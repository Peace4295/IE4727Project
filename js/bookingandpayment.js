// BOOKING INFORMATION //
//combines all movie into one searchable array
const allBookingMovies = [
    ...movies,
    ...studentOriginals,
    ...comingSoon
];

//reads the booking info passed thru the URL
const bookingUrlParameters = new URLSearchParams(
    window.location.search
);
/*
    Prevents the booking page from continuing
    when required session information is missing.
*/


const bookingMovieId = Number(
    bookingUrlParameters.get("movieId")
);

const bookingLocation =
    bookingUrlParameters.get("location");

const bookingDate =
    bookingUrlParameters.get("date");

const bookingTime =
    bookingUrlParameters.get("time");

if (
    !bookingMovieId ||
    !bookingLocation ||
    !bookingDate ||
    !bookingTime
) {
    window.location.href = "moviecatalog.html";
}

//which movie ID matches the URL movieID
const bookingMovie = allBookingMovies.find(function (movie) {
    return movie.id === bookingMovieId;
});

const locationNames = {
    "north-spine": "North Spine Cinema",
    "south-spine": "South Spine Cinema"
};
const displayedLocation =
    locationNames[bookingLocation] || bookingLocation;


//instead of showing the raw date
function formatBookingDate(dateValue) {
    const date = new Date(`${dateValue}T00:00:00`);

    return date.toLocaleDateString("en-SG", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

//display 24h time to 12h time
function formatBookingTime(timeValue) {
    const [hourText, minute] = timeValue.split(":");
    const hour = Number(hourText);

    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return `${displayHour}:${minute} ${period}`;
}

//session description
const displayedSession =
    `${displayedLocation} · ` +
    `${formatBookingDate(bookingDate)} · ` +
    `${formatBookingTime(bookingTime)}`;

//Finds the booking-summary elements 
const bookingMovieTitle =
    document.getElementById("booking-movie-title");

const bookingSessionDetails =
    document.getElementById("booking-session-details");

const changeSessionLink =
    document.getElementById("change-session-link");

//selected booking info
if (bookingMovie) {
    bookingMovieTitle.textContent = bookingMovie.title;
    bookingSessionDetails.textContent = displayedSession;

    changeSessionLink.href =
        `moviedetails.html?id=${bookingMovie.id}#showtimes`;
} else {
    bookingMovieTitle.textContent = "Movie not found";
    bookingSessionDetails.textContent =
        "Please return to the movie catalog.";
}

//SEAT SELECTION//
const seatPrice = 5     //$5 per seat selected
const maximumSeats = 6  //max seat to purchase in one booking
//const unavailableSeats = [ "A3", "B5", "C2", "C3", "D6" ];

const selectedSeats = [];   //seats selected by user

//Finds the seat-selection elements
const seatMap = document.getElementById("seat-map");
const selectedSeatsText =
    document.getElementById("selected-seats");
const ticketCount =
    document.getElementById("ticket-count");
const bookingTotal =
    document.getElementById("booking-total");
const continuePaymentButton =
    document.getElementById("continue-payment");

//6 rows with 8 seats per row
function createSeatMap() {
    const rowLetters = ["A", "B", "C", "D", "E", "F"];
    const seatsPerRow = 8;

    rowLetters.forEach(function (rowLetter) {
        /* Creates one container for the current row */
        const seatRow = document.createElement("div");
        seatRow.className = "seat-row";

        /* Displays the row letter before the seat buttons */
        const rowLabel = document.createElement("span");
        rowLabel.className = "seat-row-label";
        rowLabel.textContent = rowLetter;

        seatRow.appendChild(rowLabel);

        //creates every numbered seat in the current row
        for (
            let seatNumber = 1;
            seatNumber <= seatsPerRow;
            seatNumber++
        ) {
            const seatName = `${rowLetter}${seatNumber}`;

            const seatButton =
                document.createElement("button");

            seatButton.type = "button";
            seatButton.className = "seat";
            seatButton.textContent = seatNumber;
            seatButton.dataset.seat = seatName;
            seatButton.setAttribute(
                "aria-label",
                `Seat ${seatName}`
            );

            //aisle between seat 4 and 5
            if (seatNumber === 5) {
                seatButton.classList.add("seat-after-aisle");
            }

            //disable the booked seats
            if (unavailableSeats.includes(seatName)) {
                seatButton.classList.add("unavailable");
                seatButton.disabled = true; //prevents button from being clicked
            } else {

            //only avail seats can be clickable
            seatButton.addEventListener(
                    "click",
                    function () {
                        toggleSeat(seatButton);
                    }
                );
            }

            seatRow.appendChild(seatButton);
        }

        seatMap.appendChild(seatRow);
    });
}

//if user select or deselect an available seat
function toggleSeat(seatButton) {
    const seatName = seatButton.dataset.seat;
    const selectedSeatIndex =
        selectedSeats.indexOf(seatName);

    if (selectedSeatIndex !== -1) {
        
        //if the seat was already selected, remove it.
        selectedSeats.splice(selectedSeatIndex, 1);
        seatButton.classList.remove("selected");
        seatButton.setAttribute("aria-pressed", "false");
    } else {
        
         //Stop users from selecting more than six seats.
        if (selectedSeats.length >= maximumSeats) {
            document.getElementById("seat-limit-modal").showModal();
            return;
        }

        selectedSeats.push(seatName);
        seatButton.classList.add("selected");
        seatButton.setAttribute("aria-pressed", "true");
    }

    updateSeatSummary();
}
// Close the seat limit modal
const seatLimitModal = document.getElementById("seat-limit-modal");
const closeSeatLimitButton = document.getElementById("close-seat-limit");

closeSeatLimitButton.addEventListener("click", function () {
    seatLimitModal.close();
});

//update the seat names, ticket quantiy, total price and cont button after every selection
function updateSeatSummary() {
    const totalPrice = selectedSeats.length * seatPrice;

    selectedSeatsText.textContent =
        selectedSeats.length > 0
            ? selectedSeats.join(", ")
            : "None";

    ticketCount.textContent = selectedSeats.length;
    bookingTotal.textContent = totalPrice.toFixed(2);

    
    //payment becomes available only when at least one seat has been selected.
    continuePaymentButton.disabled =
        selectedSeats.length === 0;
}

createSeatMap(); //Generates the seats when bookingandpayment.php opens 


//PAYMENT//

//booking info
const seatSelection =
    document.getElementById("seat-selection");
const paymentSection =
    document.getElementById("payment-section");
const bookingStep =
    document.getElementById("booking-step");

//payment summary
const paymentMovie =
    document.getElementById("payment-movie");
const paymentSession =
    document.getElementById("payment-session");
const paymentSeats =
    document.getElementById("payment-seats");
const paymentTotal =
    document.getElementById("payment-total");

const backToSeatsButton =
    document.getElementById("back-to-seats");
const paymentForm =
    document.getElementById("payment-form");


const formMovieId = document.getElementById("form-movie-id");
const formMovieTitle = document.getElementById("form-movie-title");
const formLocation = document.getElementById("form-location");
const formDate = document.getElementById("form-date");
const formTime = document.getElementById("form-time");
const formSeats = document.getElementById("form-seats");
const formTotal = document.getElementById("form-total");



//hide the seat selection section
continuePaymentButton.addEventListener(
    "click",
    function () {
        const totalPrice =
            selectedSeats.length * seatPrice;

        // Fill the payment summary 
        paymentMovie.textContent = bookingMovie.title;
        paymentSession.textContent = displayedSession;
        paymentSeats.textContent = selectedSeats.join(", ");
        paymentTotal.textContent = totalPrice.toFixed(2);

        // Change the visible stage 
        seatSelection.hidden = true;
        paymentSection.hidden = false;
        bookingStep.textContent = "Step 2 of 2";
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);

//let user edit their seat selection if needed
backToSeatsButton.addEventListener(
    "click",
    function () {
        paymentSection.hidden = true;
        seatSelection.hidden = false;
        bookingStep.textContent = "Step 1 of 2";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);



/* Finds the confirmation modal */
const confirmationModal =
    document.getElementById("confirmation-modal");



const confirmationReference =
    document.getElementById("confirmation-ref");


// MOCK PAYMENT VALIDATION
const cardholderInput = document.getElementById("cardholder-name");
const cardNumberInput = document.getElementById("card-number");
const expiryInput = document.getElementById("card-expiry");
const cvvInput = document.getElementById("card-cvv");

const paymentFields = [
    cardholderInput,
    cardNumberInput,
    expiryInput,
    cvvInput
];

// Allow custom error messages instead of browser popups
paymentForm.noValidate = true;

function validatePaymentField(field) {
    const value = field.value.trim();
    let message = "";

    if (field.id === "cardholder-name") {
        if (!/^[A-Za-z ]+$/.test(value)) {
            message = "Please enter a valid cardholder name.";
        }
    }

    if (field.id === "card-number") {
        if (!/^[0-9]{16}$/.test(value)) {
            message = "Card number must contain exactly 16 digits.";
        }
    }

    if (field.id === "card-expiry") {
        const match = value.match(/^(\d{2})\/(\d{2})$/);

        if (!match) {
            message = "Please use MM/YY format.";
        } else {
            const month = Number(match[1]);
            const year = 2000 + Number(match[2]);
            const today = new Date();

            if (month < 1 || month > 12) {
                message = "Please enter a valid expiry month.";
            } else if (
                year < today.getFullYear() ||
                (year === today.getFullYear() &&
                 month < today.getMonth() + 1)
            ) {
                message = "This card has expired.";
            }
        }
    }

    if (field.id === "card-cvv") {
        if (!/^[0-9]{3}$/.test(value)) {
            message = "CVV must contain exactly 3 digits.";
        }
    }

    const errorElement = document.getElementById(field.id + "-error")
        || document.getElementById("cardholder-error");

    errorElement.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");

    return message === "";
}

// Validate each field when edited
paymentFields.forEach(function(field) {
    field.addEventListener("input", function() {
        validatePaymentField(field);
    });
});

// Validate before sending booking to PHP
paymentForm.addEventListener("submit", function(event) {
    let firstInvalidField = null;

    paymentFields.forEach(function(field) {
        if (!validatePaymentField(field) && !firstInvalidField) {
            firstInvalidField = field;
        }
    });

    if (selectedSeats.length === 0 || firstInvalidField) {
        event.preventDefault();

        if (firstInvalidField) {
            firstInvalidField.focus();
        } else {
            alert("Please select at least one seat.");
        }
        return;
    }

    const finalTotal = selectedSeats.length * seatPrice;

    formMovieId.value = bookingMovieId;
    formMovieTitle.value = bookingMovie.title;
    formLocation.value = bookingLocation;
    formDate.value = bookingDate;
    formTime.value = bookingTime;
    formSeats.value = selectedSeats.join(",");
    formTotal.value = finalTotal.toFixed(2);
});


//check whether php redirected back after a sucessful booking
if(bookingUrlParameters.get("success")==="1"){
    const referenceFromUrl = bookingUrlParameters.get("reference");
    confirmationReference.textContent = referenceFromUrl || "Reference unavailable";
    confirmationModal.showModal();
}