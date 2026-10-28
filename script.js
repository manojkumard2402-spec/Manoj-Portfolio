/* ========== Portfolio interactions ========== */
(function () {
  "use strict";

  // Mark the page as JS-enabled so reveal animations only hide content when scripts run
  document.documentElement.classList.add("js");

  /* ---------- 1. Mobile navigation menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  function setMenu(open) {
    navMenu.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    navToggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
  }

  navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
  // Close the menu after choosing a link
  navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  // Close with the Escape key (keyboard friendly)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      setMenu(false);
      navToggle.focus();
    }
  });

  /* ---------- 2. Active navigation highlighting ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-menu a");

  function highlightNav() {
    const marker = window.scrollY + window.innerHeight * 0.35; // point 35% down the viewport
    let currentId = sections[0].id;
    sections.forEach((section) => {
      if (section.offsetTop <= marker) currentId = section.id;
    });
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  /* ---------- 3. Back-to-top button ---------- */
  const toTop = document.getElementById("toTop");
  function toggleToTop() {
    toTop.classList.toggle("show", window.scrollY > 500);
  }
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  let ticking = false; // throttle scroll work with requestAnimationFrame
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        highlightNav();
        toggleToTop();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  highlightNav();
  toggleToTop();

  /* ---------- 4. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible")); // fallback: show everything
  }

  /* ---------- 5. Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- 6. Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Each rule returns an error message, or "" when the value is fine
  const rules = {
    name: (v) => (v.trim().length < 2 ? "Enter your name (at least 2 characters)." : ""),
    email: (v) => (!emailPattern.test(v.trim()) ? "Enter a valid email address, like name@example.com." : ""),
    subject: (v) => (v.trim().length < 3 ? "Enter a subject (at least 3 characters)." : ""),
    message: (v) => (v.trim().length < 10 ? "Write a message of at least 10 characters." : ""),
  };

  function validateField(field) {
    const message = rules[field.name](field.value);
    document.getElementById(field.name + "Error").textContent = message;
    field.classList.toggle("invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => { if (field.classList.contains("invalid")) validateField(field); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";

    const fields = Object.keys(rules).map((name) => form.elements[name]);
    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus(); // move focus to the first problem
      return;
    }

    // No backend here, so open the visitor's email app with the message filled in.
    // To send for real, replace this block with a fetch() to Formspree / Netlify Forms / your own API.
    const body = `${form.elements.message.value}\n\nFrom: ${form.elements.name.value} (${form.elements.email.value})`;
    const mailto = `mailto:manojkumard2402@gmail.com?subject=${encodeURIComponent(form.elements.subject.value)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    status.textContent = "Opening your email app. If nothing opens, email manojkumard2402@gmail.com directly.";
    form.reset();
  });
})();
