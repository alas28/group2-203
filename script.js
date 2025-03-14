document.addEventListener("DOMContentLoaded", () => {
    const openBookButton = document.getElementById("open-book");
    const closeBookButton = document.getElementById("close-book");
    const book = document.getElementById("book");
    const navButtons = document.querySelectorAll(".nav-button");
    const pages = document.querySelectorAll(".page");
    const floatingImages = document.querySelectorAll(".floating-image");
    const letterText = document.querySelector(".letter-text");
    const fullText = letterText.getAttribute("data-text");
    const modal = document.getElementById("modal");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const closeModal = document.querySelector(".close");
    
    let currentPage = 0;
    let i = 0;
    let hasTyped = false;

    // Smooth Scrolling for Navbar Links
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = document.getElementById("navbar").offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = targetPosition - navbarHeight - 10; 

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Arrange pages in proper stacking order
    pages.forEach((page, index) => {
        page.style.zIndex = pages.length - index;
    });

    // Typing Effect for Old Letter
    function typeEffect() {
        if (i < fullText.length) {
            letterText.textContent += fullText.charAt(i);
            i++;
            setTimeout(typeEffect, 30);
        }
    }

    function startTyping(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasTyped) {
                hasTyped = true;
                typeEffect();
                observer.unobserve(letterText);
            }
        });
    }

    const observer = new IntersectionObserver(startTyping, { threshold: 0.5 });
    observer.observe(letterText);

    // Page Flip Effect
    function turnPage(forward) {
        if (forward && currentPage < pages.length - 1) {
            let current = pages[currentPage];
            let next = pages[currentPage + 1];

            current.style.transform = "rotateY(-180deg)";
            setTimeout(() => {
                current.style.zIndex = "0";
                next.style.zIndex = pages.length - currentPage;
                next.classList.add("visible");
            }, 1000);
            currentPage++;
        } else if (!forward && currentPage > 0) {
            let prev = pages[currentPage];
            currentPage--;
            let current = pages[currentPage];
            let next = pages[currentPage + 1];

            current.style.transform = "rotateY(0deg)";
            current.style.zIndex = pages.length - currentPage;
            next.style.zIndex = "0";
            prev.classList.remove("visible");
        }

        navButtons.forEach(button => button.style.display = currentPage > 0 ? "block" : "none");
        openBookButton.style.display = currentPage === 0 ? "block" : "none";

        setTimeout(() => floatingImages[currentPage]?.classList.add("visible"), 500);
    }

    document.getElementById("next").addEventListener("click", () => turnPage(true));
    document.getElementById("prev").addEventListener("click", () => turnPage(false));

    openBookButton.addEventListener("click", () => {
        book.classList.add("opened");
        openBookButton.style.display = "none";
        setTimeout(() => turnPage(true), 500);
    });
    closeBookButton.addEventListener("click", () => {
        for (let i = currentPage; i >= 0; i--) {
            setTimeout(() => {
                pages[i].style.transform = "rotateY(0deg)";
                pages[i].style.zIndex = pages.length - i; // Reset z-index
                pages[i].classList.remove("visible"); // Hide images
            }, 100 * i);
        }
    
        setTimeout(() => {
            currentPage = 0;
            openBookButton.style.display = "block";
            
            // 🚀 Hide navigation buttons
            document.getElementById("prev").style.display = "none";
            document.getElementById("next").style.display = "none";
        }, (currentPage + 1) * 100);
    });
    
    // Modal for Cards
    document.querySelectorAll(".card").forEach(card => {
        card.addEventListener("click", () => {
            modalImage.src = card.querySelector("img").src;
            modalTitle.textContent = card.getAttribute("data-title");
            modalDescription.textContent = card.getAttribute("data-text");
            modal.style.display = "flex";
        });
    });

    closeModal.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    // Magic Particle Effect
    const canvas = document.createElement("canvas");
    canvas.id = "magic-effect";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "9999";
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let particles = [];
    function createParticles() {
        for (let i = 0; i < 150; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 4 + 1,
                speedX: (Math.random() * 2 - 1) * 1.2,
                speedY: (Math.random() * 2 - 1) * 1.2,
                alpha: Math.random() * 0.8 + 0.2,
                twinkle: Math.random() > 0.8,
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "rgba(255, 223, 0, 0.7)";

        for (let p of particles) {
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;
            p.alpha -= 0.005;

            if (p.alpha <= 0) {
                p.x = Math.random() * canvas.width;
                p.y = Math.random() * canvas.height;
                p.alpha = Math.random() * 0.8 + 0.2;
                p.size = Math.random() * 4 + 1;
            }

            if (p.twinkle && Math.random() > 0.97) {
                p.alpha = Math.random();
            }
        }

        if (Math.random() > 0.97) {
            let flareX = Math.random() * canvas.width;
            let flareY = Math.random() * canvas.height;
            let flareSize = Math.random() * 60 + 20;
            let gradient = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, flareSize);
            gradient.addColorStop(0, "rgba(255, 255, 150, 0.9)");
            gradient.addColorStop(1, "rgba(255, 255, 150, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(flareX, flareY, flareSize, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(drawParticles);
    }

    createParticles();
    drawParticles();

    document.querySelectorAll(".member-card").forEach(card => {
        card.addEventListener("click", () => {
            const url = card.getAttribute("data-url");
            if (url) {
                window.location.href = url;
            }
        });
    });
    
    
});
