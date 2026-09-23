//find the form, modal and ref number element.
const submissionForm = document.getElementById("film-submission-form");
const successModal = document.getElementById("submission-sucess-modal");
const referenceText = document.getElementById("submission-ref");

//check that javascript successfully found all 3 html elemeents
if(submissionForm && successModal && referenceText) {
    //when form is submitted
    submissionForm.addEventListener("submit", function(event){
        //stop browser from refreshing
        event.preventDefault();

        //generate an display the temporary
        referenceText.textContent = createSubmissionReference();

        //remove the hidden state and display the modal
        successModal.hidden = false;
    });
}
    else{
        console.error("submission form, modal or ref element was not found.");
    }


//generate a temporary reference such as NFH-A3K92P
function createSubmissionReference() {
    const randomCode = Math.random()
    .toString(36) .substring(2, 8) .toUpperCase();

    return `NFH-${randomCode}`;
}