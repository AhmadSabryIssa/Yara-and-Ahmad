/* =========================================================
COUNTDOWN
========================================================= */

const weddingDate =
new Date("November 6, 2026 18:00:00").getTime();

function updateCountdown() {

const now =
    new Date().getTime();

const difference =
    weddingDate - now;

if (difference <= 0) {

    document.getElementById("days").textContent = "00";
    document.getElementById("hours").textContent = "00";
    document.getElementById("minutes").textContent = "00";
    document.getElementById("seconds").textContent = "00";

    return;
}

const days =
    Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );

const hours =
    Math.floor(
        (difference /
            (1000 * 60 * 60)) % 24
    );

const minutes =
    Math.floor(
        (difference /
            (1000 * 60)) % 60
    );

const seconds =
    Math.floor(
        (difference / 1000) % 60
    );


document.getElementById("days").textContent =
    String(days).padStart(2, "0");

document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");

}

updateCountdown();

setInterval(
updateCountdown,
1000
);

/* =========================================================
COMMENTS
========================================================= */

const commentForm =
document.querySelector(".comment-form");

if (commentForm) {

commentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const name =
            commentForm.querySelector("input").value;

        commentForm.reset();

        alert(
            `Thank you, ${name}! ❤️\n\n` +
            `Your message means the world to Ahmad & Yara.`
        );
    }
);

}

/* =========================================================
RSVP ELEMENTS
========================================================= */

const rsvpYes =
document.getElementById("rsvpYes");

const rsvpNo =
document.getElementById("rsvpNo");

const rsvpResponse =
document.getElementById("rsvpResponse");

const rsvpContainer =
document.querySelector(".rsvp-buttons");

/* =========================================================
RSVP SAFETY CHECK
========================================================= */

if (
rsvpYes &&
rsvpNo &&
rsvpResponse &&
rsvpContainer
) {

/* =====================================================
   PLAYFUL NO MESSAGES
===================================================== */

const noMessages = [

    "Nice try 😏",

    "Are you sure?",

    "Think again 👀",

    "Really? 😢",

    "You can't escape! 😂",

    "Try again!",

    "Nope! 😌",

    "Wrong button 😏",

    "I don't think so!",

    "Are you REALLY sure?",

    "Come on... 🥺",

    "Just say YES ❤️",

    "You missed! 😂",

    "Nice try again 😏",

    "Still no? 😭",

    "I'm not giving up! 😂",

    "One more chance ❤️"

];


let noMessageIndex = 0;




/* =====================================================
   MOVE NO BUTTON
===================================================== */

function moveNoButton() {

    /*
     * Change the text first.
     *
     * This is important because the button
     * may become wider after the text changes.
     */

    rsvpNo.textContent =
        noMessages[noMessageIndex];


    noMessageIndex++;

    if (
        noMessageIndex >=
        noMessages.length
    ) {

        noMessageIndex = 0;
    }


    /*
     * Remove the hover scale while
     * calculating the new position.
     */

    rsvpNo.style.transform =
        "none";


    /*
     * Get current dimensions.
     */

    const buttonWidth =
        rsvpNo.offsetWidth;

    const buttonHeight =
        rsvpNo.offsetHeight;

    const containerWidth =
        rsvpContainer.clientWidth;

    const containerHeight =
        rsvpContainer.clientHeight;


    /*
     * Safe padding from edges.
     */

    const padding = 10;


    /*
     * Calculate maximum legal positions.
     */

    const maxLeft =
        Math.max(
            padding,
            containerWidth -
            buttonWidth -
            padding
        );

    const maxTop =
        Math.max(
            padding,
            containerHeight -
            buttonHeight -
            padding
        );


    /*
     * Pick random coordinates.
     */

    const newLeft =
        padding +
        Math.random() *
        Math.max(
            0,
            maxLeft - padding
        );

    const newTop =
        padding +
        Math.random() *
        Math.max(
            0,
            maxTop - padding
        );


    /*
     * Move smoothly.
     */

    rsvpNo.style.left =
        `${newLeft}px`;

    rsvpNo.style.top =
        `${newTop}px`;
}


/* =====================================================
   YES BUTTON
===================================================== */

rsvpYes.addEventListener(
    "click",
    function () {

        /*
         * Confirmation message.
         */

        rsvpResponse.textContent =
            "We can't wait to celebrate with you! ❤️";

        rsvpResponse.style.opacity =
            "1";


        /*
         * Disable NO immediately.
         */

        rsvpNo.disabled =
            true;


        /*
         * Make NO disappear.
         */

        rsvpNo.classList.add(
            "accepted"
        );
    }
);


/* =====================================================
   DESKTOP
===================================================== */

rsvpNo.addEventListener(
    "mouseenter",
    function () {

        if (
            !rsvpNo.disabled
        ) {

            moveNoButton();
        }
    }
);


/* =====================================================
   MOBILE / TOUCH
===================================================== */

rsvpNo.addEventListener(
    "touchstart",
    function (event) {

        event.preventDefault();

        if (
            !rsvpNo.disabled
        ) {

            moveNoButton();
        }

    },
    {
        passive: false
    }
);


/* =====================================================
   CLICK FALLBACK
===================================================== */

rsvpNo.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        if (
            !rsvpNo.disabled
        ) {

            moveNoButton();
        }
    }
);


/* =====================================================
   INITIAL POSITION
   
   Wait until the page has rendered so
   offsetWidth / offsetHeight are correct.
===================================================== */

window.addEventListener(
    "load",
    function () {

        positionNoInitially();
    }
);


/*
 * Also position it immediately in case
 * the page has already loaded.
 */

positionNoInitially();


/* =====================================================
   HANDLE RESIZING
===================================================== */

window.addEventListener(
    "resize",
    function () {

        /*
         * Only reposition if NO hasn't
         * already been accepted.
         */

        if (
            !rsvpNo.classList.contains(
                "accepted"
            )
        ) {

            positionNoInitially();
        }
    }
);

}
