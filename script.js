
// ========================================
// BLOCKVERSE - MAIN JAVASCRIPT
// ========================================

// Scroll to the Discover section
function scrollToGames() {
  document.getElementById("discover").scrollIntoView({
    behavior: "smooth"
  });
}

// Scroll to the Creator Studio section
function scrollToCreate() {
  document.getElementById("create").scrollIntoView({
    behavior: "smooth"
  });
}

// Temporary message for features not built yet
function showComingSoon() {
  alert("This feature is coming soon to Blockverse!");
}

// Navigation links
document.addEventListener("DOMContentLoaded", () => {
  console.log("Blockverse initialized!");

  // Smooth scrolling for internal navigation links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
});
