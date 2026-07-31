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


// KM9 — Formularz kontaktowy dla statycznej strony GitHub Pages.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const subject = `Zapytanie ze strony — ${data.get("name") || "nowy projekt"}`;
    const body = [
      `Imię i nazwisko: ${data.get("name") || "—"}`,
      `E-mail: ${data.get("email") || "—"}`,
      `Telefon: ${data.get("phone") || "—"}`,
      `Rodzaj projektu: ${data.get("projectType") || "—"}`,
      `Metraż: ${data.get("area") || "—"}`,
      `Lokalizacja: ${data.get("location") || "—"}`,
      "",
      "Wiadomość:",
      data.get("message") || "—"
    ].join("\n");

    if (status) {
      status.textContent = "Otwieramy gotową wiadomość w Twoim programie pocztowym…";
    }

    window.location.href = `mailto:archstudiokm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});
