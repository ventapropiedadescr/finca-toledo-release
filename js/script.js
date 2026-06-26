(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const body = document.body;
  const header = $(".site-header");
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const backToTop = $("#backToTop");
  const preloader = $("#preloader");
  const year = $("#year");
  const lightbox = $("#lightbox");
  const lightboxImage = lightbox ? $("img", lightbox) : null;
  const lightboxClose = lightbox ? $(".lightbox-close", lightbox) : null;

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };

  const setBackToTopState = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 600);
  };

  const closeMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  const toggleMobileMenu = () => {
    if (!menuToggle || !mobileMenu) return;
    const isOpen = mobileMenu.classList.toggle("is-open");
    menuToggle.classList.toggle("is-active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    body.classList.toggle("menu-open", isOpen);
  };

  const initMenu = () => {
    if (menuToggle) menuToggle.addEventListener("click", toggleMobileMenu);

    $$("a[href^='#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = $(targetId);
        if (!target) return;
        event.preventDefault();
        closeMobileMenu();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        closeLightbox();
      }
    });
  };

  const initActiveNavigation = () => {
    const sections = $$('main section[id]');
    const navLinks = $$(".desktop-nav a, .mobile-menu a");
    if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 });

    sections.forEach((section) => observer.observe(section));
  };

  const initRevealAnimations = () => {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  };

  const openLightbox = (image) => {
    if (!lightbox || !lightboxImage || !image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Imagen ampliada de Finca Toledo";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    body.classList.add("menu-open");
  };

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    body.classList.remove("menu-open");
  }

  const initGallery = () => {
    $$(".gallery-grid img").forEach((image) => {
      image.addEventListener("click", () => openLightbox(image));
    });

    if (lightbox) {
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
      });
    }
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  };

  const initControls = () => {
    if (year) year.textContent = new Date().getFullYear();
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    const onScroll = () => {
      setHeaderState();
      setBackToTopState();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  };

  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 450);
  };

  document.addEventListener("DOMContentLoaded", () => {
    initMenu();
    initActiveNavigation();
    initRevealAnimations();
    initGallery();
    initControls();
    window.setTimeout(hidePreloader, 700);
  });

  window.addEventListener("load", hidePreloader);
})();
