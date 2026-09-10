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

const commentForm =
    document.querySelector(".comment-form");

if (commentForm) {

    commentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                commentForm.querySelector("input").value.trim();

            const message =
                commentForm.querySelector("textarea").value.trim();

            const language =
                commentForm.dataset.language || "ar";

            const submitButton =
                commentForm.querySelector("button");

            if (!weddingDbConfigured || !weddingDb) {
                alert(
                    "لم يتم ربط دفتر الزوار بقاعدة البيانات بعد. " +
                    "يرجى إكمال إعداد Supabase."
                );
                return;
            }

            if (!name || !message) {
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "جارٍ الإرسال...";

            const { error } =
                await weddingDb.rpc(
                    "submit_comment",
                    {
                        p_guest_name: name,
                        p_message: message
                    }
                );

            if (error) {

                console.error(
                    "Comment submission failed:",
                    error
                );

                alert(
                    "تعذر إرسال رسالتكم حاليًا. " +
                    "يرجى المحاولة مرة أخرى."
                );

                submitButton.disabled = false;
                submitButton.textContent = "أرسل رسالتك";
                return;
            }

            commentForm.reset();

            alert(
                `شكرًا لك يا ${name}! ❤️\n\n` +
                `كلماتك تعني الكثير لأحمد ويارا.`
            );

            submitButton.disabled = false;
            submitButton.textContent = "أرسل رسالتك";
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
        function () {

            const rsvpNameInput =
                document.getElementById("rsvpName");

            const guestName =
                rsvpNameInput
                    ? rsvpNameInput.value.trim()
                    : "";

            const rsvpSection =
                document.getElementById("rsvp");

            const language =
                rsvpSection
                    ? rsvpSection.dataset.language || "ar"
                    : "ar";

            if (!guestName) {
                if (rsvpNameInput) {
                    rsvpNameInput.focus();
                }
                rsvpResponse.textContent =
                    "يرجى كتابة اسمك أولًا.";
                rsvpResponse.style.opacity = "1";
                return;
            }

            if (!weddingDbConfigured || !weddingDb) {
                rsvpResponse.textContent =
                    "لم يتم ربط نظام تأكيد الحضور بقاعدة البيانات بعد.";
                rsvpResponse.style.opacity = "1";
                return;
            }

            rsvpYes.disabled = true;
            rsvpYes.textContent = "جارٍ الحفظ...";

            weddingDb
                .rpc(
                    "submit_rsvp",
                    {
                        p_guest_name: guestName
                    }
                )
                .then(({ error }) => {

                    if (error) {

                        console.error(
                            "RSVP submission failed:",
                            error
                        );

                        rsvpResponse.textContent =
                            "تعذر حفظ تأكيد الحضور. يرجى المحاولة مرة أخرى.";

                        rsvpResponse.style.opacity = "1";
                        rsvpYes.disabled = false;
                        rsvpYes.textContent =
                            "نعم، سأكون معكم ❤️";
                        return;
                    }

                    rsvpResponse.textContent =
                        "لا يسعنا الانتظار للاحتفال معكم! ❤️";

                    rsvpResponse.style.opacity =
                        "1";

                    rsvpNo.disabled =
                        true;

                    rsvpNo.classList.add(
                        "accepted"
                    );

                    if (rsvpNameInput) {
                        rsvpNameInput.disabled = true;
                    }

                    rsvpYes.textContent =
                        "تم تأكيد الحضور ❤️";
                });
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