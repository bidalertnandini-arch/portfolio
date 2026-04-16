const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -20px 0px"
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const scrollProgress = document.querySelector(".scroll-progress");
const toTopBtn = document.getElementById("to-top");

function handleScrollEffects() {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${progress}%`;
  }

  if (toTopBtn) {
    toTopBtn.classList.toggle("visible", scrollTop > 420);
  }
}

window.addEventListener("scroll", handleScrollEffects, { passive: true });
handleScrollEffects();

if (toTopBtn) {
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const typedRole = document.getElementById("typed-role");
const typingPhrases = [
  "Python Automation Engineer",
  "Selenium Framework Specialist",
  "Procurement Workflow Automator"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTypewriter() {
  if (!typedRole) return;

  const currentPhrase = typingPhrases[phraseIndex];
  typedRole.textContent = currentPhrase.slice(0, charIndex);

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex += 1;
    setTimeout(runTypewriter, 80);
    return;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(runTypewriter, 1200);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(runTypewriter, 40);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(runTypewriter, 300);
}

runTypewriter();

const counters = document.querySelectorAll(".count-number");
let counterStarted = false;

function animateCounter(counter) {
  const target = Number(counter.dataset.count || 0);
  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    counter.textContent = Math.floor(target * eased).toString();
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target.toString();
    }
  }

  requestAnimationFrame(update);
}

const statsBlock = document.querySelector(".hero-stats");
if (statsBlock) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !counterStarted) {
          counters.forEach((counter) => animateCounter(counter));
          counterStarted = true;
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  counterObserver.observe(statsBlock);
}

const interactiveCards = document.querySelectorAll(".project-card, .stat-card");

interactiveCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 10;
    const rotateX = ((0.5 - y / rect.height)) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
  root.setAttribute("data-theme", "light");
}

function updateThemeButtonLabel() {
  if (!themeToggle) return;
  const isLight = root.getAttribute("data-theme") === "light";
  themeToggle.textContent = isLight ? "Dark" : "Light";
}

updateThemeButtonLabel();

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = root.getAttribute("data-theme") === "light";
    if (isLight) {
      root.removeAttribute("data-theme");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("portfolio-theme", "light");
    }
    updateThemeButtonLabel();
  });
}

const viewButtons = document.querySelectorAll(".view-btn");
const trackSections = document.querySelectorAll(".track-section");
const savedView = localStorage.getItem("portfolio-view") || "automation";
const navAnchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function applyPortfolioView(view) {
  trackSections.forEach((section) => {
    const track = section.dataset.track;
    const shouldShow = view === "full" || track === view || track === "full";
    section.classList.toggle("is-hidden", !shouldShow);
  });

  viewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });

  localStorage.setItem("portfolio-view", view);
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyPortfolioView(button.dataset.view);
  });
});

applyPortfolioView(savedView);

function setActiveNavLinkById(sectionId) {
  navAnchorLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isMatch);
  });
}

function scrollToTarget(hash) {
  const target = document.querySelector(hash);
  if (!target) return;
  const topOffset = 84;
  const targetTop = target.getBoundingClientRect().top + window.scrollY - topOffset;
  window.scrollTo({ top: targetTop, behavior: "smooth" });
}

navAnchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const hash = link.getAttribute("href");
    if (!hash) return;

    const section = document.querySelector(hash);
    if (section && section.classList.contains("track-section") && section.classList.contains("is-hidden")) {
      applyPortfolioView("full");
      setTimeout(() => scrollToTarget(hash), 80);
    } else {
      scrollToTarget(hash);
    }
  });
});

function handleActiveSection() {
  const visibleSections = Array.from(document.querySelectorAll("main section[id]")).filter(
    (section) => !section.classList.contains("is-hidden")
  );
  const current = visibleSections.findLast((section) => {
    const top = section.getBoundingClientRect().top;
    return top <= 150;
  });
  if (current) {
    setActiveNavLinkById(current.id);
  }
}

window.addEventListener("scroll", handleActiveSection, { passive: true });
handleActiveSection();
