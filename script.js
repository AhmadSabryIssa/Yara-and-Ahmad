const envelope =
    document.querySelector(".envelope");

const openButton =
    document.querySelector("#openButton");

const invitationCover =
    document.querySelector(".invitation-cover");


let isOpening = false;


function openEnvelope() {

    if (isOpening) {
        return;
    }

    isOpening = true;


    /*
     * ========================================
     * STEP 1
     * FLAP OPENS
     * ========================================
     */

    invitationCover.classList.add(
        "opened"
    );

    openButton.disabled = true;

    openButton.textContent =
        "Opening...";


    /*
     * ========================================
     * STEP 2
     * LETTER RISES
     * ========================================
     *
     * The letter starts at 1 second.
     *
     * It takes 1.3 seconds to rise.
     *
     * It finishes at approximately 2.3s.
     */


    /*
     * ========================================
     * STEP 3
     * LETTER IS NOW FULLY OUT
     * ========================================
     *
     * ONLY NOW do we bring it
     * above the envelope.
     */

    setTimeout(() => {

        invitationCover.classList.add(
            "letter-emerged"
        );

    }, 2300);


    /*
     * ========================================
     * STEP 4
     * ENVELOPE DISAPPEARS
     * ========================================
     */

    setTimeout(() => {

        invitationCover.classList.add(
            "envelope-gone"
        );

    }, 2500);


    /*
     * ========================================
     * STEP 5
     * LETTER BECOMES FULL PAGE
     * ========================================
     */

    setTimeout(() => {

        invitationCover.classList.add(
            "transitioning"
        );

    }, 3450);


    /*
     * ========================================
     * STEP 6
     * GO TO ACTUAL WEBSITE
     * ========================================
     */

    setTimeout(() => {

        window.location.href =
            "English/invitation.html";

    }, 5000);
}


/*
 * Click envelope
 */

envelope.addEventListener(
    "click",
    openEnvelope
);


/*
 * Click button
 */

openButton.addEventListener(
    "click",
    openEnvelope
);