document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // --- Elements Selection ---
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const toggleBtn = document.getElementById("toggle-btn");
  const formTitle = document.getElementById("form-title");
  const formDesc = document.getElementById("form-desc");
  const toggleMsg = document.getElementById("toggle-msg");

  // ==========================================
  // 1. VALIDATION UTILITIES
  // ==========================================

  /**
   * Displays error message and highlights input
   */
  const showError = (inputElement, message) => {
    const wrapper = inputElement.closest(".input-wrapper");
    const errorSpan = wrapper.querySelector(".validate");

    inputElement.classList.add("error");
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.remove("hidden");
    }
  };

  /**
   * Clears error state from an input
   */
  const clearError = (inputElement) => {
    const wrapper = inputElement.closest(".input-wrapper");
    if (!wrapper) return;

    const errorSpan = wrapper.querySelector(".validate");

    inputElement.classList.remove("error");
    if (errorSpan) {
      errorSpan.classList.add("hidden");
      errorSpan.textContent = "";
    }
  };

  // Add input event listeners to clear errors as user types
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => clearError(input));
  });

  // ==========================================
  // 2. PASSWORD VISIBILITY TOGGLE
  // ==========================================
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.parentElement.querySelector(".password-field");
      const icon = this.querySelector("i");

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // Change icon name for Lucide re-render
      const newIconData = isPassword ? "eye" : "eye-off";

      // Replace existing icon node manually to avoid full re-render jump
      const newIcon = document.createElement("i");
      newIcon.setAttribute("data-lucide", newIconData);
      this.innerHTML = "";
      this.appendChild(newIcon);
      lucide.createIcons();
    });
  });

  // ==========================================
  // 3. FORM SWITCHING LOGIC (Login <-> Signup)
  // ==========================================
  toggleBtn.addEventListener("click", () => {
    const isLoggingIn = signupForm.classList.contains("hidden");

    // Clear all existing errors when switching forms
    document.querySelectorAll("input").forEach((input) => clearError(input));

    if (isLoggingIn) {
      loginForm.classList.add("hidden");
      signupForm.classList.remove("hidden");
      formTitle.textContent = "Create Account";
      formDesc.textContent = "Join us and start your journey today.";
      toggleMsg.textContent = "Already have an account?";
      toggleBtn.textContent = "Sign In";
    } else {
      signupForm.classList.add("hidden");
      loginForm.classList.remove("hidden");
      formTitle.textContent = "Welcome Back";
      formDesc.textContent = "Please enter your details to sign in.";
      toggleMsg.textContent = "Don't have an account?";
      toggleBtn.textContent = "Sign up for free";
    }
  });

  // ==========================================
  // 4. FORM SUBMISSION & VALIDATION
  // ==========================================

  // --- LOGIN FORM ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    let isValid = true;

    if (!emailInput.value.trim()) {
      showError(emailInput, "Email is required");
      isValid = false;
    }

    if (!passwordInput.value) {
      showError(passwordInput, "Password is required");
      isValid = false;
    }

    if (isValid) {
      const btn = loginForm.querySelector(".btn-primary");
      const originalText = btn.textContent;
      btn.textContent = "Authenticating...";
      btn.disabled = true;

      // Store user info
      const user = {
        name: emailInput.value.split("@")[0],
        email: emailInput.value,
      };
      localStorage.setItem("eduquiz_user", JSON.stringify(user));

      // Simulate slight delay for premium feel
      setTimeout(() => {
        window.location.href = "home.html";
      }, 800);
    }
  });

  // --- SIGNUP FORM ---
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("signup-name");
    const emailInput = document.getElementById("signup-email");
    const passwordInput = document.getElementById("signup-password");
    const confirmInput = document.getElementById("confirm-password");
    let isValid = true;

    // Name Validation
    if (!nameInput.value.trim()) {
      showError(nameInput, "Full Name is required");
      isValid = false;
    }

    // Email Validation
    if (!emailInput.value.trim()) {
      showError(emailInput, "Email is required");
      isValid = false;
    } else if (!emailInput.value.includes("@")) {
      showError(emailInput, "Valid email required");
      isValid = false;
    }

    // Password Validation
    if (passwordInput.value.length < 6) {
      showError(passwordInput, "Minimum 6 characters required");
      isValid = false;
    }

    // Confirm Password Validation
    if (!confirmInput.value) {
      showError(confirmInput, "Please confirm your password");
      isValid = false;
    } else if (confirmInput.value !== passwordInput.value) {
      showError(confirmInput, "Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      const btn = signupForm.querySelector(".btn-primary");
      btn.textContent = "Creating Account...";
      btn.disabled = true;

      // Store user info
      const user = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
      };
      localStorage.setItem("eduquiz_user", JSON.stringify(user));

      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    }
  });
});
