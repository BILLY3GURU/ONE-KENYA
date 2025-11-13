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

// Download white paper function
function downloadWhitePaper() {
  // Create a simple PDF-like content (in a real implementation, this would be a proper PDF)
  const content = `
AI-DRIVEN INTEGRITY FOR KENYA'S PUBLIC FINANCES
Technical White Paper

EXECUTIVE SUMMARY
This white paper presents the technical implementation of AI-driven integrity systems
designed to combat fiscal leakage in Kenya's public sector through automated detection
of ghost workers, procurement fraud, and revenue leakage.

TECHNICAL ARCHITECTURE
- Machine Learning Models: TensorFlow.js neural networks
- Data Sources: Payroll systems, biometric databases, procurement records, tax transactions
- Real-time Processing: Continuous monitoring and anomaly detection
- Risk Scoring: Probabilistic assessment with confidence intervals

IMPLEMENTATION RESULTS
- Ghost Worker Detection: 95% accuracy rate
- Procurement Fraud: 87% detection rate
- Revenue Leakage: Real-time monitoring of tax compliance
- Audit Efficiency: 40% reduction in audit cycle time

SCALING CONSIDERATIONS
- County-level deployment across 47 administrative units
- Integration with existing government systems
- Data privacy and security compliance
- Continuous model training and improvement

CONCLUSION
AI-driven integrity systems represent a paradigm shift in public financial management,
offering automated, scalable solutions to age-old problems of corruption and inefficiency.
  `;

  // Create a blob with the content
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link and trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "AI_Integrity_Technical_White_Paper.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Clean up the URL object
  URL.revokeObjectURL(url);
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
