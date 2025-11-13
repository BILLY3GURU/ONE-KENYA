// Client-side JavaScript for navigation and interactions

let currentPage = "home";
let mobileMenuOpen = false;

function navigateTo(page) {
  window.location.href = "/" + (page === "home" ? "" : page);
}

function toggleMobileMenu() {
  mobileMenuOpen = !mobileMenuOpen;
  const menu = document.getElementById("mobile-menu");
  const icon = document.getElementById("menu-icon");
  if (mobileMenuOpen) {
    menu.classList.remove("hidden");
    icon.textContent = "✕";
  } else {
    menu.classList.add("hidden");
    icon.textContent = "☰";
  }
}

function scrollToSolution() {
  const element = document.getElementById("problem-section");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Set current page based on URL
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  if (path === "/") currentPage = "home";
  else if (path === "/solution") currentPage = "solution";
  else if (path === "/data") currentPage = "data";
  else if (path === "/engage") currentPage = "engage";
  else if (path === "/ai-dashboard") currentPage = "ai-dashboard";
});
