document.addEventListener("DOMContentLoaded", () => {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const splash = document.querySelector(".splash-screen");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!location.hash) {
    window.scrollTo(0, 0);
  }

  if (splash) {
    if (prefersReducedMotion) {
      splash.remove();
    } else {
      document.body.classList.add("is-splashing");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          splash.classList.add("is-ready");
        });
      });

      window.setTimeout(() => {
        splash.classList.add("is-leaving");
      }, 2450);

      window.setTimeout(() => {
        document.body.classList.remove("is-splashing");
        splash.remove();

        if (location.hash) {
          const target = document.querySelector(location.hash);
          if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
        } else {
          window.scrollTo(0, 0);
        }
      }, 3350);
    }
  }

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));

  const header = document.querySelector(".site-header");

  if (header) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;

      if (document.body.classList.contains("nav-open")) {
        header.classList.remove("is-hidden");
        lastScrollY = Math.max(currentScrollY, 0);
        ticking = false;
        return;
      }

      const scrollingDown = currentScrollY > lastScrollY;
      const farEnough = currentScrollY > 140;

      if (currentScrollY <= 30) {
        header.classList.remove("is-hidden");
      } else if (scrollingDown && farEnough) {
        header.classList.add("is-hidden");
      } else if (!scrollingDown) {
        header.classList.remove("is-hidden");
      }

      lastScrollY = Math.max(currentScrollY, 0);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }


  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");

  if (menuToggle && mainNav) {
    if (!mainNav.querySelector(".mobile-social-links")) {
      const socials = document.createElement("div");
      socials.className = "mobile-social-links";
      socials.innerHTML = `
        <a href="https://www.instagram.com/archstudiokm/" target="_blank" rel="noopener" aria-label="Instagram archstudiokm">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.3A4.7 4.7 0 1 1 7.3 12 4.7 4.7 0 0 1 12 7.3Zm0 2A2.7 2.7 0 1 0 14.7 12 2.7 2.7 0 0 0 12 9.3Zm5.05-2.15a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z"/></svg>
        </a>
        <a href="https://www.facebook.com/people/Studio-km-architektura-wn%C4%99trz-Katarzyna-Micho%C5%84-Kotas/100082891116999/" target="_blank" rel="noopener" aria-label="Facebook Studio KM">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2 8.2V6.8c0-.7.5-1.1 1.2-1.1H17V3h-2.3c-2.5 0-4.1 1.5-4.1 4v1.2H8.4V11h2.2v10h3.6V11h2.5l.4-2.8h-2.9Z"/></svg>
        </a>
      `;
      mainNav.appendChild(socials);
    }
    const setMenuState = (open) => {
      document.body.classList.toggle("nav-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
      if (open && header) header.classList.remove("is-hidden");
    };

    menuToggle.addEventListener("click", () => {
      setMenuState(!document.body.classList.contains("nav-open"));
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 920) setMenuState(false);
    });
  }

  // Smooth scroll tylko dla linków z tej samej podstrony.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      const target = document.querySelector(selector);

      if (!target) return;

      event.preventDefault();
      if (header) header.classList.remove("is-hidden");
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxClose = document.querySelector("#lightboxClose");
  const galleryItems = document.querySelectorAll(".project-gallery-item, .visualization-item");

  if (lightbox && lightboxImage && lightboxClose) {
    projectCards.forEach((card) => {
      card.addEventListener("click", () => {
        const projectUrl = card.dataset.projectUrl;
        if (projectUrl) {
          window.location.href = projectUrl;
          return;
        }

        const image = card.querySelector("img");
        if (!image) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || "Projekt wnętrza";
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        const image = item.querySelector("img");
        if (!image) return;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt || "Projekt wnętrza";
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightboxImage.src = "";
      document.body.style.overflow = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  projectCards.forEach((card) => {
    const projectUrl = card.dataset.projectUrl;
    if (!projectUrl) return;

    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.href = projectUrl;
      }
    });
  });
});

window.addEventListener("pageshow", () => {
  if (!location.hash) {
    window.scrollTo(0, 0);
  }
});


// KM10 — Formularz działa na GitHub Pages przez zewnętrzny endpoint FormSubmit.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const endpoint = form.getAttribute("action");
    const data = new FormData(form);

    if (status) {
      status.textContent = "Wysyłamy wiadomość…";
      status.classList.remove("is-error", "is-success");
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Wysyłanie…";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) {
        throw new Error("Formularz nie został wysłany.");
      }

      form.reset();
      if (status) {
        status.textContent = "Dziękujemy — wiadomość została wysłana.";
        status.classList.add("is-success");
      }
    } catch (error) {
      if (status) {
        status.textContent = "Nie udało się wysłać formularza. Spróbuj ponownie albo napisz na archstudiokm@gmail.com.";
        status.classList.add("is-error");
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Wyślij wiadomość";
      }
    }
  });
});
