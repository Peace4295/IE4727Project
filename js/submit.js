document.addEventListener("DOMContentLoaded", function() {

const form = document.getElementById("film-submission-form");
const posterInput = document.getElementById("film-poster");
const choosePosterButton = document.getElementById("poster-choose-button");
const selectedPosterRow = document.getElementById("poster-selected-row");
const posterFilename = document.getElementById("poster-filename");
const removePosterButton = document.getElementById("remove-film-poster");

posterInput.addEventListener("change", function () {
    if (posterInput.files.length > 0) {
        posterFilename.textContent = posterInput.files[0].name;

        choosePosterButton.hidden = true;
        selectedPosterRow.hidden = false;
    } else {
        choosePosterButton.hidden = false;
        selectedPosterRow.hidden = true;
    }
});

removePosterButton.addEventListener("click", function () {
    posterInput.value = "";
    posterFilename.textContent = "";

    choosePosterButton.hidden = false;
    selectedPosterRow.hidden = true;

    const posterError = document.getElementById("film-poster-error");
    posterError.textContent = "";
    posterInput.removeAttribute("aria-invalid");
});


    if (form) {
        // Disable browser popups so we can show our own messages.
        form.noValidate = true;

        const fields = form.querySelectorAll("input, select, textarea");

        const messages = {
            "film-title": "Please enter your film title.",
            "genre": "Please select a genre.",
            "runtime": "Please enter the running time.",
            "synopsis": "Please enter a synopsis.",
            "language": "Please enter the primary language.",
            "completion-year": "Please enter the completion year.",
            "director": "Please enter the director's name.",
            "film-link": "Please enter your film link.",
            "film-poster": "Please upload a film poster.",
            "submitter-name": "Please enter your full name.",
            "submitter-email": "Please enter your email address.",
            "school": "Please enter your school or faculty.",
            "student-id": "Please enter your matriculation number.",
            "rights-confirmation": "Please confirm that you have permission to submit this film.",
            "information-confirmation": "Please confirm that the information provided is accurate."
        };

        function getErrorElement(field) {
            let error = document.getElementById(field.id + "-error");

            if (!error) {
                error = document.createElement("small");
                error.className = "field-error";
                error.id = field.id + "-error";

                const container = field.closest(".form-field") ||
                                  field.closest(".checkbox-field") ||
                                  field.parentElement;

                container.appendChild(error);
            }

            return error;
        }

        function validateField(field) {
            const error = getErrorElement(field);
            let message = "";
            const value = field.value.trim();

            if (field.type === "checkbox") {
                if (field.required && !field.checked) {
                    message = messages[field.id];
                }
            } else if (field.required && value === "") {
                message = messages[field.id] || "This field is required.";
            } else if (value !== "") {
                // Validate film poster file size
                if (field.id === "film-poster" && field.files.length > 0) {
                    const poster = field.files[0];
                    const maximumSize = 5 * 1024 * 1024;

                    if (poster.size > maximumSize) {
                        message = "Film poster must be smaller than 5MB.";
                    }
                }
                if (field.id === "runtime") {
                    if (!/^\d+$/.test(value) ||
                        Number(value) < 1 ||
                        Number(value) > 300) {
                        message = "Running time must be a whole number between 1 and 300 minutes.";
                    }
                }

                if (field.id === "completion-year") {
                    const currentYear = new Date().getFullYear();

                    if (!/^\d{4}$/.test(value) ||
                        Number(value) < 1900 ||
                        Number(value) > currentYear) {
                        message = `Please enter a valid year between 1900 and ${currentYear}.`;
                    }
                }

                
                if (["director", "cast", "school"].includes(field.id)) {
                    const namePattern = /^[A-Za-z ]+$/;
                    const castPattern = /^[A-Za-z ,]+$/;

                    if (field.id === "cast") {
                        if (!castPattern.test(value)) {
                            message = "Cast names should contain only letters, spaces and commas.";
                        }
                    } else if (!namePattern.test(value)) {
                        message = "Please use letters and spaces only.";
                    }
                }

                if (field.id === "student-id") {
                    const studentIdPattern = /^[A-Za-z0-9]+$/;

                    if (!studentIdPattern.test(value)) {
                        message = "Matriculation number should contain only letters and numbers.";
                    }
                }

                if (field.id === "film-link" || field.id === "trailer-link") {
                    const urlPattern = /^https?:\/\/([A-Za-z0-9-]+\.)+[A-Za-z]{2,}(?::[0-9]+)?(?:[/?#][^\s]*)?$/i;

                    if (!urlPattern.test(value)) {
                        message = "Please enter a valid link, e.g. https://example.com/film.";
                    }
                }

                if (field.validity.typeMismatch &&
                    field.id !== "film-link" &&
                    field.id !== "trailer-link") {
                    message = "Please enter a valid email address.";
                }


                if (field.validity.tooLong) {
                    message = "Your input exceeds the maximum character limit.";
                }
                
            }

            error.textContent = message;
            field.setAttribute("aria-invalid", message ? "true" : "false");

            return message === "";
        }

        fields.forEach(function(field) {
            const eventName =
                field.type === "checkbox" ||
                field.tagName === "SELECT" ||
                field.type === "file"
                ? "change" : "input";

            field.addEventListener(eventName, function() {
                validateField(field);
            });
        });

        form.addEventListener("submit", function(event) {
            let firstInvalidField = null;

            fields.forEach(function(field) {
                if (!validateField(field) && !firstInvalidField) {
                    firstInvalidField = field;
                }
            });

            if (firstInvalidField) {
                event.preventDefault();
                firstInvalidField.focus();
                firstInvalidField.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        });
    }

    // Display success modal after PHP redirects.
    const parameters = new URLSearchParams(window.location.search);
    const submissionSucceeded = parameters.get("success");
    const referenceNumber = parameters.get("reference");

    if (submissionSucceeded === "1") {
        const modal = document.getElementById("submission-success-modal");
        const referenceText = document.getElementById("submission-ref");

        if (referenceText) {
            referenceText.textContent = referenceNumber || "";
        }

        if (modal) {
            modal.hidden = false;
            modal.setAttribute("aria-hidden", "false");
        }
    }
});
