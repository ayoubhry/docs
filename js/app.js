document.addEventListener("DOMContentLoaded", () => {

  /* ── 1. THEME (identique au portfolio) ─────────────── */
  const htmlEl = document.documentElement;
  const saved  = localStorage.getItem("theme") || "light";
  htmlEl.setAttribute("data-theme", saved);

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  ["themeToggle", "themeToggleMobile"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        const next = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
      });
    }
  });

  /* ── 2. NAVIGATION INTERNE ─────────────────────────── */
  const navItems       = document.querySelectorAll(".nav-item[data-target]");
  const sections       = document.querySelectorAll(".content-section");
  const validSectionIds = new Set(Array.from(sections).map(s => s.id));
  const DEFAULT_SECTION = "accueil";

  function updateHash(targetId) {
    const newHash = `#${targetId}`;
    if (window.location.hash !== newHash) {
      // pushState évite le saut de scroll natif du navigateur et garde l'historique (bouton "précédent")
      history.pushState({ section: targetId }, "", newHash);
    }
  }

  function activateSection(targetId, { updateURL = true, scroll = "smooth" } = {}) {
    if (!validSectionIds.has(targetId)) return;

    // Mise à jour nav
    document.querySelector(".nav-item.active")?.classList.remove("active");
    document.querySelector(`.nav-item[data-target="${targetId}"]`)?.classList.add("active");

    // Mise à jour contenu
    document.querySelector(".content-section.active")?.classList.remove("active");
    const target = document.getElementById(targetId);
    if (target) {
      target.classList.add("active");
      // Scroll to top
      window.scrollTo({ top: 0, behavior: scroll });
      // Trigger animations
      requestAnimationFrame(() => triggerAnimations(target));
    }

    if (updateURL) updateHash(targetId);

    // Fermer le menu mobile
    closeMobileSidebar();
  }

  navItems.forEach(item => {
    item.addEventListener("click", () => {
      activateSection(item.getAttribute("data-target"));
    });
  });

  // Cartes de la page d'accueil cliquables
  document.querySelectorAll(".category-card[data-target]").forEach(card => {
    card.addEventListener("click", () => {
      activateSection(card.getAttribute("data-target"));
    });
  });

  // Ouverture directe sur une section via l'URL (ex: docs/#glpi) ou navigation précédent/suivant
  function activateFromHash(scroll = "auto") {
    const idFromHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    const targetId = validSectionIds.has(idFromHash) ? idFromHash : DEFAULT_SECTION;
    activateSection(targetId, { updateURL: false, scroll });
  }

  window.addEventListener("popstate", () => activateFromHash("smooth"));

  // Au chargement de la page : si un hash valide est présent, on ouvre directement la bonne section
  if (window.location.hash) {
    activateFromHash("auto");
  }

  /* ── 3. MOBILE SIDEBAR ──────────────────────────────── */
  const sidebar  = document.getElementById("sidebar");
  const overlay  = document.getElementById("sidebarOverlay");
  const burger   = document.getElementById("burgerBtn");

  function closeMobileSidebar() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("visible");
    burger?.classList.remove("open");
  }

  burger?.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    overlay.classList.toggle("visible", isOpen);
    burger.classList.toggle("open", isOpen);
  });
  overlay?.addEventListener("click", closeMobileSidebar);

  /* ── 4. COPIE DE CODE ───────────────────────────────── */
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const pre = btn.closest(".code-header")?.nextElementSibling;
      const codeEl = pre?.querySelector("code") || pre;
      if (!codeEl) return;

      navigator.clipboard.writeText(codeEl.innerText).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copié !';
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove("copied");
        }, 2000);
      });
    });
  });

  /* ── 5. SCROLL ANIMATIONS ───────────────────────────── */
  function triggerAnimations(root = document) {
    const els = root.querySelectorAll("[data-animate]");
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => observer.observe(el));
  }

  // Déclencher pour la section active initiale
  const initialActive = document.querySelector(".content-section.active");
  if (initialActive) triggerAnimations(initialActive);

});
