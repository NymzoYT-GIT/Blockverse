
// ========================================
// BLOCKVERSE - SUPABASE CONNECTION
// ========================================

const SUPABASE_URL = "https://zjuqghwgwaanhgyfkcyo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_9ONLiPEO018THPJ6PFTEBA_Gnt3lJ8l";

const blockverseSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

console.log("Blockverse database connection initialized!");


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
