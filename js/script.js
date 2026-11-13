
document.addEventListener("DOMContentLoaded", function () {

    /* =================================
       ELEMEN UNDANGAN
    ================================= */

    const cover = document.getElementById("cover");
    const openButton = document.getElementById("openInvitation");
    const mainInvitation = document.getElementById("mainInvitation");
    const isiUndangan = document.getElementById("isiUndangan");
    const guestName = document.getElementById("guestName");

    const musicButton = document.getElementById("musicButton");
    const weddingMusic = document.getElementById("weddingMusic");

    let isPlaying = false;


    /* =================================
       NAMA TAMU OTOMATIS
    ================================= */

    const urlParams = new URLSearchParams(window.location.search);
    const guest = urlParams.get("untuk");

    if (guest && guestName) {
        guestName.textContent = guest;
    }


    /* =================================
       BUKA UNDANGAN + MUSIK OTOMATIS
    ================================= */

    if (openButton) {

        openButton.addEventListener("click", async function () {

            // Hilangkan cover
            if (cover) {
                cover.style.display = "none";
            }

            // Tampilkan isi undangan
            if (mainInvitation) {
                mainInvitation.classList.add("active");
            }

            if (isiUndangan) {
                isiUndangan.style.display = "block";
            }

            // Mulai musik otomatis
            if (weddingMusic) {

                try {

                    await weddingMusic.play();

                    isPlaying = true;

                    if (musicButton) {
                        musicButton.classList.add("playing");
                    }

                } catch (error) {

                    console.log("Musik gagal diputar:", error);

                }

            }

            // Kembali ke bagian atas
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =================================
       TOMBOL ON/OFF MUSIK
    ================================= */

    if (musicButton && weddingMusic) {

        musicButton.addEventListener("click", async function () {

            if (!isPlaying) {

                try {

                    await weddingMusic.play();

                    isPlaying = true;
                    musicButton.classList.add("playing");

                } catch (error) {

                    console.log("Musik gagal diputar:", error);

                }

            } else {

                weddingMusic.pause();

                isPlaying = false;

                musicButton.classList.remove("playing");

            }

        });

    }

});



/* ==========================================
   COUNTDOWN OTOMATIS PERNIKAHAN
========================================== */

// Tanggal pernikahan Habib & Adiba
const weddingDate = new Date("2026-12-28T00:00:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const distance = weddingDate - now;

    if (distance <= 0) {

        document.getElementById("days").textContent = "00";
        document.getElementById("hours").textContent = "00";
        document.getElementById("minutes").textContent = "00";
        document.getElementById("seconds").textContent = "00";

        return;
    }

    const days = Math.floor(
        distance / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
    );


    // Tampilkan angka
    document.getElementById("days").textContent = days;

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}


// Jalankan countdown
updateCountdown();

setInterval(updateCountdown, 1000);



/* ==========================================
   GALERI FOTO & VIDEO LIGHTBOX
========================================== */

const galleryItems = document.querySelectorAll(".gallery-item");

const galleryLightbox = document.getElementById("galleryLightbox");

const lightboxImage = document.getElementById("lightboxImage");

const lightboxVideo = document.getElementById("lightboxVideo");

const lightboxClose = document.getElementById("lightboxClose");

const lightboxPrev = document.getElementById("lightboxPrev");

const lightboxNext = document.getElementById("lightboxNext");

const lightboxCounter = document.getElementById("lightboxCounter");

let currentGalleryIndex = 0;

let previousBodyOverflow = "";


/* ==========================================
   TAMPILKAN MEDIA
========================================== */

function showGalleryMedia(index) {

    currentGalleryIndex =
        (index + galleryItems.length) % galleryItems.length;

    const item = galleryItems[currentGalleryIndex];

    const mediaType = item.dataset.type;

    const mediaSrc = item.dataset.src;

    // Hentikan video sebelumnya
    lightboxVideo.pause();

    lightboxVideo.removeAttribute("src");

    lightboxVideo.removeAttribute("poster");

    lightboxVideo.load();


    if (mediaType === "video") {

        lightboxImage.style.display = "none";

        lightboxVideo.style.display = "block";

        lightboxVideo.src = mediaSrc;

        if (item.dataset.poster) {
            lightboxVideo.poster = item.dataset.poster;
        }

        lightboxVideo.load();

        // Video diputar ketika pengunjung memilihnya
        lightboxVideo.play().catch(() => {
            console.log("Video siap diputar melalui tombol play.");
        });

    } else {

        lightboxVideo.style.display = "none";

        lightboxImage.style.display = "block";

        lightboxImage.src = mediaSrc;

        lightboxImage.alt =
            item.querySelector("img")?.alt || "Foto galeri";

    }


    // Nomor foto / video
    lightboxCounter.textContent =
        `${currentGalleryIndex + 1} / ${galleryItems.length}`;

}


/* ==========================================
   BUKA LIGHTBOX
========================================== */

function openGallery(index) {

    previousBodyOverflow = document.body.style.overflow;

    galleryLightbox.classList.add("active");

    galleryLightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    showGalleryMedia(index);

    lightboxClose.focus();

}


/* ==========================================
   TUTUP LIGHTBOX
========================================== */

function closeGallery() {

    galleryLightbox.classList.remove("active");

    galleryLightbox.setAttribute("aria-hidden", "true");

    lightboxVideo.pause();

    lightboxVideo.removeAttribute("src");

    lightboxVideo.removeAttribute("poster");

    lightboxVideo.load();

    document.body.style.overflow = previousBodyOverflow;

}


/* ==========================================
   TOMBOL SEBELUMNYA
========================================== */

function previousGallery() {

    showGalleryMedia(currentGalleryIndex - 1);

}


/* ==========================================
   TOMBOL BERIKUTNYA
========================================== */

function nextGallery() {

    showGalleryMedia(currentGalleryIndex + 1);

}


/* ==========================================
   KLIK ITEM GALERI
========================================== */

galleryItems.forEach((item, index) => {

    item.addEventListener("click", function () {

        openGallery(index);

    });

});


/* ==========================================
   EVENT TOMBOL
========================================== */

lightboxClose.addEventListener("click", closeGallery);

lightboxPrev.addEventListener("click", previousGallery);

lightboxNext.addEventListener("click", nextGallery);


/* ==========================================
   KLIK AREA LUAR FOTO
========================================== */

galleryLightbox.addEventListener("click", function (event) {

    if (event.target === galleryLightbox) {

        closeGallery();

    }

});


/* ==========================================
   KEYBOARD NAVIGATION
========================================== */

document.addEventListener("keydown", function (event) {

    if (!galleryLightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {

        closeGallery();

    }

    if (event.key === "ArrowLeft") {

        previousGallery();

    }

    if (event.key === "ArrowRight") {

        nextGallery();

    }

});



/* ==========================================
   COPY NOMOR REKENING WEDDING GIFT
========================================== */

const copyButtons = document.querySelectorAll(".copy-account");

copyButtons.forEach(button => {

    button.addEventListener("click", async function () {

        const accountNumber = this.dataset.copy;

        const buttonText = this.querySelector("span");

        try {

            // Salin nomor rekening
            if (navigator.clipboard && window.isSecureContext) {

                await navigator.clipboard.writeText(accountNumber);

            } else {

                // Fallback untuk localhost / browser lama
                const tempInput = document.createElement("textarea");

                tempInput.value = accountNumber;

                tempInput.style.position = "fixed";
                tempInput.style.opacity = "0";

                document.body.appendChild(tempInput);

                tempInput.select();

                const success = document.execCommand("copy");

                tempInput.remove();

                if (!success) {
                    throw new Error("Gagal menyalin rekening");
                }

            }

            // Ubah tampilan tombol
            buttonText.textContent = "Berhasil Disalin";

            this.classList.add("copied");

            const icon = this.querySelector("i");

            icon.classList.remove("fa-copy");
            icon.classList.add("fa-check");

            // Kembalikan tampilan
            setTimeout(() => {

                buttonText.textContent = "Salin Nomor";

                this.classList.remove("copied");

                icon.classList.remove("fa-check");
                icon.classList.add("fa-copy");

            }, 2000);

        } catch (error) {

            alert("Nomor rekening gagal disalin. Silakan salin secara manual.");

        }

    });

});



/* ==========================================
   RSVP FORM
========================================== */

const rsvpForm = document.getElementById("rsvpForm");

if (rsvpForm) {

    const rsvpName = document.getElementById("rsvpName");

    const rsvpMessage = document.getElementById("rsvpMessage");

    const rsvpSuccess = document.getElementById("rsvpSuccess");

    const nameError = document.getElementById("nameError");

    const messageError = document.getElementById("messageError");

    const attendanceError = document.getElementById("attendanceError");


    // Hilangkan error ketika nama diisi
    rsvpName.addEventListener("input", function () {

        if (this.value.trim() !== "") {
            nameError.classList.remove("show");
        }

    });


    // Hilangkan error ketika ucapan diisi
    rsvpMessage.addEventListener("input", function () {

        if (this.value.trim() !== "") {
            messageError.classList.remove("show");
        }

    });


    // Hilangkan error ketika pilihan kehadiran dipilih
    document.querySelectorAll('input[name="attendance"]').forEach(radio => {

        radio.addEventListener("change", function () {

            attendanceError.classList.remove("show");

        });

    });


    // KIRIM RSVP
    rsvpForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let valid = true;

        const name = rsvpName.value.trim();

        const message = rsvpMessage.value.trim();

        const attendance = document.querySelector(
            'input[name="attendance"]:checked'
        );


        // Validasi nama
        if (!name) {

            nameError.classList.add("show");

            valid = false;

        } else {

            nameError.classList.remove("show");

        }


        // Validasi ucapan
        if (!message) {

            messageError.classList.add("show");

            valid = false;

        } else {

            messageError.classList.remove("show");

        }


        // Validasi kehadiran
        if (!attendance) {

            attendanceError.classList.add("show");

            valid = false;

        } else {

            attendanceError.classList.remove("show");

        }


        if (!valid) return;


        // Tampilkan pesan berhasil
        rsvpForm.style.display = "none";

        rsvpSuccess.classList.add("show");

        rsvpSuccess.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        console.log({
            nama: name,
            ucapan: message,
            kehadiran: attendance.value
        });

    });

}




/* ==========================================
   GLOBAL WEDDING ANIMATION SYSTEM
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const sections = document.querySelectorAll(
        "#mainInvitation section, #isiUndangan section"
    );

    // Daftar elemen yang dianimasikan
    const animatedElements = [
        ".section-heading",
        ".rsvp-heading",
        ".gift-heading",
        ".event-card",
        ".person-card",
        ".gift-card",
        ".gallery-item",
        ".story-card",
        ".story-item",
        ".countdown-item",
        ".closing-photo",
        ".closing-message",
        ".ayat-content"
    ];

    const animatedImages = [
        "img",
        ".closing-photo"
    ];

    const animatedIcons = [
        ".event-icon",
        ".gift-chip",
        ".bank-symbol",
        ".footer-social i"
    ];

    // Siapkan elemen animasi
    sections.forEach(section => {

        // Anak langsung section
        Array.from(section.children).forEach(element => {
            if (!["SCRIPT", "STYLE"].includes(element.tagName)) {
                element.classList.add("motion-item");
            }
        });

        // Heading, kartu, dan elemen lainnya
        animatedElements.forEach(selector => {

            section.querySelectorAll(selector).forEach(element => {

                element.classList.add("motion-item");

                if (
                    selector.includes("heading")
                ) {
                    element.classList.add("motion-heading");
                }

                if (
                    selector.includes("card") ||
                    selector.includes("item")
                ) {
                    element.classList.add("motion-card");
                }

            });

        });

        // Gambar
        animatedImages.forEach(selector => {

            section.querySelectorAll(selector).forEach(image => {
                image.classList.add("motion-item", "motion-image");
            });

        });

        // Icon
        animatedIcons.forEach(selector => {

            section.querySelectorAll(selector).forEach(icon => {
                icon.classList.add("motion-item", "motion-icon");
            });

        });

        // Stagger / jeda kemunculan
        const items = section.querySelectorAll(".motion-item");

        items.forEach((item, index) => {

            item.style.setProperty(
                "--motion-delay",
                `${(index % 5) * 120}ms`
            );

        });

    });


    // Jalankan observer
    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show-motion");

                    observer.unobserve(entry.target);

                }

            });

        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        document.querySelectorAll(".motion-item").forEach(item => {
            observer.observe(item);
        });

    } else {

        document.querySelectorAll(".motion-item").forEach(item => {
            item.classList.add("show-motion");
        });

    }

});
