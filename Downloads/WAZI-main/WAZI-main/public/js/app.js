// Client-side JavaScript for navigation and interactions

let currentPage = "home";
let mobileMenuOpen = false;

function navigateTo(page) {
  // Add loading state
  const buttons = document.querySelectorAll('button[onclick*="navigateTo"]');
  buttons.forEach((btn) => {
    btn.style.pointerEvents = "none";
    btn.style.opacity = "0.7";
  });

  // Navigate after a brief delay for visual feedback
  setTimeout(() => {
    window.location.href = "/" + (page === "home" ? "" : page);
  }, 150);
}

function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("menu-icon");

  if (mobileMenuOpen) {
    menu.classList.remove("hidden");
    menu.classList.add("animate-fade-in");
    icon.textContent = "✕";
    icon.style.transform = "rotate(180deg)";
  } else {
    menu.classList.add("hidden");
    menu.classList.remove("animate-fade-in");
    icon.textContent = "☰";
    icon.style.transform = "rotate(0deg)";
  }

  // Smooth transition for icon
  icon.style.transition = "transform 0.3s ease";
}

function scrollToSolution() {
  const element = document.getElementById("problem-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Add click ripple effect to buttons
function addRippleEffect(event) {
  const button = event.currentTarget;
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + "px";
  ripple.style.left = x + "px";
  ripple.style.top = y + "px";
  ripple.classList.add("ripple-effect");

  const oldRipple = button.querySelector(".ripple-effect");
  if (oldRipple) {
    oldRipple.remove();
  }

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Set current page based on URL and add event listeners
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  if (path === "/") currentPage = "home";
  else if (path === "/solution") currentPage = "solution";
  else if (path === "/data") currentPage = "data";
  else if (path === "/engage") currentPage = "engage";
  else if (path === "/ai-dashboard") currentPage = "ai-dashboard";

  // Add ripple effects to navigation buttons
  const navButtons = document.querySelectorAll('button[onclick*="navigateTo"]');
  navButtons.forEach((button) => {
    button.addEventListener("click", addRippleEffect);
  });

  // Add keyboard navigation
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileMenuOpen) {
      toggleMobileMenu();
    }
  });
});
