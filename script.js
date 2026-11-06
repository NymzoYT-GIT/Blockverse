
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

function scrollToGames() {
  document.getElementById("discover")?.scrollIntoView({
    behavior: "smooth"
  });
}

function scrollToCreate() {
  document.getElementById("create")?.scrollIntoView({
    behavior: "smooth"
  });
}

function showComingSoon() {
  alert("This feature is coming soon to Blockverse!");
}


// ========================================
// BLOCKVERSE - ACCOUNT HELPERS
// ========================================

function showAccountMessage(id, message) {
  const element = document.getElementById(id);
  if (element) element.textContent = message;
}

function setAccountLoading(form, loading) {
  const button = form?.querySelector('button[type="submit"]');
  if (button) button.disabled = loading;
}


// ========================================
// BLOCKVERSE - PROFILE LOADING
// ========================================

async function loadBlockverseProfile(user) {
  if (!user) return;

  const profileElement = document.getElementById("account-profile");
  const displayElement = document.getElementById("profile-display");
  const usernameElement = document.getElementById("profile-username");
  const avatarElement = document.getElementById("profile-avatar");

  try {
    const { data: profile, error } = await blockverseSupabase
      .from("profiles")
      .select("username, display_name, bio")
      .eq("id", user.id)
      .maybeSingle();

    if (error) throw error;

    const displayName = profile?.display_name || "Player";
    const username = profile?.username || "player";
    const bio = profile?.bio || "";

    if (profileElement) profileElement.hidden = false;

    if (displayElement) {
      displayElement.textContent = displayName;
    }

    if (usernameElement) {
      usernameElement.textContent = "@" + username;
    }

    if (avatarElement) {
      avatarElement.textContent = displayName.charAt(0).toUpperCase();
    }

    const displayInput = document.getElementById("edit-display-name");
    const usernameInput = document.getElementById("edit-username");
    const bioInput = document.getElementById("edit-bio");

    if (displayInput) displayInput.value = displayName;
    if (usernameInput) usernameInput.value = username;
    if (bioInput) bioInput.value = bio;

    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");

    if (signupForm) signupForm.hidden = true;
    if (loginForm) loginForm.hidden = true;

  } catch (error) {
    console.error("Profile loading error:", error);

    showAccountMessage(
      "login-message",
      "You're logged in, but your profile could not be loaded."
    );
  }
}


// ========================================
// BLOCKVERSE - REGISTRATION
// ========================================

document.getElementById("signup-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  showAccountMessage("signup-message", "Creating your account...");
  setAccountLoading(form, true);

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    showAccountMessage(
      "signup-message",
      "Username must be 3–20 characters using letters, numbers, or underscores."
    );
    setAccountLoading(form, false);
    return;
  }

  try {
    const { data, error } = await blockverseSupabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          display_name: username
        }
      }
    });

    if (error) throw error;

    if (data.session) {
      showAccountMessage(
        "signup-message",
        "Account created! Welcome to Blockverse."
      );

      await loadBlockverseProfile(data.user);
    } else {
      showAccountMessage(
        "signup-message",
        "Registration received! Check your email for a verification link."
      );
    }

  } catch (error) {
    console.error("Registration error:", error);

    showAccountMessage(
      "signup-message",
      error.message || "Could not create your account."
    );

  } finally {
    setAccountLoading(form, false);
  }
});


// ========================================
// BLOCKVERSE - LOGIN
// ========================================

document.getElementById("login-form")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = event.currentTarget;

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  showAccountMessage("login-message", "Logging in...");
  setAccountLoading(form, true);

  try {
    const { data, error } = await blockverseSupabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    showAccountMessage("login-message", "Login successful!");

    await loadBlockverseProfile(data.user);

  } catch (error) {
    console.error("Login error:", error);

    showAccountMessage(
      "login-message",
      error.message || "Could not log in."
    );

  } finally {
    setAccountLoading(form, false);
  }
});


// ========================================
// BLOCKVERSE - LOGOUT
// ========================================

document.getElementById("logout-button")?.addEventListener("click", async () => {
  const button = document.getElementById("logout-button");

  if (button) button.disabled = true;

  try {
    const { error } = await blockverseSupabase.auth.signOut();

    if (error) throw error;

    document.getElementById("account-profile").hidden = true;
    document.getElementById("signup-form").hidden = false;
    document.getElementById("login-form").hidden = false;

    document.getElementById("profile-display").textContent = "";

    showAccountMessage("signup-message", "");
    showAccountMessage("login-message", "");

  } catch (error) {
    console.error("Logout error:", error);
    alert(error.message || "Could not log out.");

  } finally {
    if (button) button.disabled = false;
  }
});


// ========================================
// BLOCKVERSE - SESSION RESTORATION
// ========================================

document.addEventListener("DOMContentLoaded", async () => {

  console.log("Blockverse initialized!");

  // Smooth navigation
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

  // Restore existing login session
  try {
    const { data, error } = await blockverseSupabase.auth.getSession();

    if (error) throw error;

    if (data.session) {
      await loadBlockverseProfile(data.session.user);
    }

  } catch (error) {
    console.error("Session restoration error:", error);
  }

});

console.log("Blockverse account system loaded!");
