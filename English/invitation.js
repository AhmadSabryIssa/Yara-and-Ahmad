
/* =========================================================
   COUNTDOWN
========================================================= */

const weddingDate =
    new Date("November 6, 2026 18:00:00").getTime();


function updateCountdown() {

    const now = new Date().getTime();

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

/*
   This stores the ID of the comment that the guest
   has just submitted.

   If the guest does not submit a comment, this stays null.

   If they submit a comment, it contains the ID of that
   comment so the YES button can mark that same comment
   as attending = true.
*/

window.lastCommentId = null;


const commentForm =
    document.querySelector(".comment-form");


if (commentForm) {

    commentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                commentForm
                    .querySelector("input")
                    .value
                    .trim();


            const message =
                commentForm
                    .querySelector("textarea")
                    .value
                    .trim();


            const submitButton =
                commentForm.querySelector("button");


            /* ---------------------------------------------
               CHECK DATABASE CONNECTION
            --------------------------------------------- */

            if (!weddingDbConfigured || !weddingDb) {

                alert(
                    "The guestbook is not connected yet. " +
                    "Please complete the Supabase setup."
                );

                return;
            }


            /* ---------------------------------------------
               CHECK COMMENT FIELDS
            --------------------------------------------- */

            if (!name || !message) {
                return;
            }


            /* ---------------------------------------------
               DISABLE BUTTON WHILE SENDING
            --------------------------------------------- */

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Sending...";


            /* ---------------------------------------------
               SUBMIT COMMENT

               submit_comment now returns the ID of the
               newly created comment.
            --------------------------------------------- */

            const { data, error } =
                await weddingDb.rpc(
                    "submit_comment",
                    {
                        p_guest_name: name,
                        p_message: message
                    }
                );


            /* ---------------------------------------------
               HANDLE ERROR
            --------------------------------------------- */

            if (error) {

                console.error(
                    "Comment submission failed:",
                    error
                );


                alert(
                    "We couldn't send your message right now. " +
                    "Please try again."
                );


                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Leave Your Message";

                return;
            }


            /* ---------------------------------------------
               REMEMBER COMMENT ID

               This allows the YES button to update
               the exact comment that was just submitted.
            --------------------------------------------- */

            window.lastCommentId =
                data;


            /* ---------------------------------------------
               RESET FORM
            --------------------------------------------- */

            commentForm.reset();


            /* ---------------------------------------------
               SUCCESS MESSAGE
            --------------------------------------------- */

            alert(
                `Thank you, ${name}! ❤️\n\n` +
                `Your message means the world to Ahmad & Yara.`
            );


            submitButton.disabled =
                false;

            submitButton.textContent =
                "Leave Your Message";
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
   RSVP
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
       INITIAL NO BUTTON POSITION
    ===================================================== */

    function positionNoInitially() {

        const containerWidth =
            rsvpContainer.clientWidth;


        const buttonWidth =
            rsvpNo.offsetWidth;


        const centerX =
            (containerWidth - buttonWidth) / 2;


        rsvpNo.style.left =
            `${centerX}px`;


        rsvpNo.style.top =
            "calc(50% + 65px)";


        rsvpNo.style.transform =
            "translate(0, -50%)";
    }



    /* =====================================================
       MOVE NO BUTTON
    ===================================================== */

    function moveNoButton() {

        rsvpNo.textContent =
            noMessages[noMessageIndex];


        noMessageIndex++;


        if (
            noMessageIndex >=
            noMessages.length
        ) {

            noMessageIndex = 0;
        }


        rsvpNo.style.transform =
            "none";


        const buttonWidth =
            rsvpNo.offsetWidth;


        const buttonHeight =
            rsvpNo.offsetHeight;


        const containerWidth =
            rsvpContainer.clientWidth;


        const containerHeight =
            rsvpContainer.clientHeight;


        const padding = 10;


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
        async function () {

            /*
               =================================================
               CASE 1:
               Guest submitted a comment.

               We mark that comment as:
                   attending = TRUE
               =================================================
            */

            if (window.lastCommentId) {

                rsvpYes.disabled =
                    true;

                rsvpYes.textContent =
                    "Saving...";


                const { error } =
                    await weddingDb.rpc(
                        "confirm_attendance",
                        {
                            p_comment_id:
                                window.lastCommentId
                        }
                    );


                /*
                   ---------------------------------------------
                   HANDLE DATABASE ERROR
                   ---------------------------------------------
                */

                if (error) {

                    console.error(
                        "Attendance update failed:",
                        error
                    );


                    rsvpResponse.textContent =
                        "We couldn't save your RSVP. Please try again.";


                    rsvpResponse.style.opacity =
                        "1";


                    rsvpYes.disabled =
                        false;


                    rsvpYes.textContent =
                        "Yes, I'll Be There ❤️";


                    return;
                }
            }


            /*
               =================================================
               CASE 2:
               Guest did NOT submit a comment.

               No database action happens.

               We simply show the confirmation message.
               =================================================
            */

            rsvpResponse.textContent =
                "We can't wait to celebrate with you! ❤️";


            rsvpResponse.style.opacity =
                "1";


            rsvpYes.textContent =
                "Confirmed ❤️";


            rsvpYes.disabled =
                true;


            rsvpNo.disabled =
                true;


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

            if (!rsvpNo.disabled) {

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


            if (!rsvpNo.disabled) {

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


            if (!rsvpNo.disabled) {

                moveNoButton();
            }
        }
    );



    /* =====================================================
       INITIAL POSITION
    ===================================================== */

    window.addEventListener(
        "load",
        function () {

            positionNoInitially();
        }
    );


    positionNoInitially();



    /* =====================================================
       HANDLE RESIZING
    ===================================================== */

    window.addEventListener(
        "resize",
        function () {

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



/* =========================================================
   NAVIGATION MENU
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");


const menuClose =
    document.getElementById("menuClose");


const sideMenu =
    document.getElementById("sideMenu");


const menuOverlay =
    document.getElementById("menuOverlay");


const menuLinks =
    document.querySelectorAll(".menu-links a");



/* =========================================================
   OPEN MENU
========================================================= */

function openMenu() {

    sideMenu.classList.add("open");

    menuOverlay.classList.add("show");

    document.body.classList.add("menu-open");


    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );


    sideMenu.setAttribute(
        "aria-hidden",
        "false"
    );
}



/* =========================================================
   CLOSE MENU
========================================================= */

function closeMenu() {

    sideMenu.classList.remove("open");

    menuOverlay.classList.remove("show");

    document.body.classList.remove("menu-open");


    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );


    sideMenu.setAttribute(
        "aria-hidden",
        "true"
    );
}



/* =========================================================
   OPEN
========================================================= */

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        openMenu
    );
}



/* =========================================================
   CLOSE BUTTON
========================================================= */

if (menuClose) {

    menuClose.addEventListener(
        "click",
        closeMenu
    );
}



/* =========================================================
   OVERLAY
========================================================= */

if (menuOverlay) {

    menuOverlay.addEventListener(
        "click",
        closeMenu
    );
}



/* =========================================================
   MENU LINKS
========================================================= */

menuLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    }
);



/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            sideMenu &&
            sideMenu.classList.contains("open")
        ) {

            closeMenu();
        }

    }
);
