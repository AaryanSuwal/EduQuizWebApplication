/* settings.js — Enhanced with Sync and Feedback */

document.addEventListener("DOMContentLoaded", () => {
  let profile = JSON.parse(
    localStorage.getItem("userProfile_v2") ||
      '{"username": "Alex Morgan", "email": "alex.morgan@example.com", "avatar": "https://picsum.photos/seed/alex/200/200", "plan": "PRO"}',
  );

  // Sync from Auth Session
  const authSession = localStorage.getItem("eduquiz_user");
  if (authSession) {
    const userData = JSON.parse(authSession);
    profile.username = userData.name || profile.username;
    profile.email = userData.email || profile.email;
  }

  // --- 1. Load Initial Data ---
  const loadSettings = () => {
    // Load Profile
    document.getElementById("username").value =
      profile.username || "Alex Morgan";
    document.getElementById("email").value =
      profile.email || "alex.morgan@example.com";

    // Update Everywhere (Sidebar & Mobile)
    const updateGlobally = () => {
      // Avatars
      document
        .querySelectorAll(".profile-img, .mobile-profile img, #settingsAvatar")
        .forEach((img) => {
          if (img) img.src = profile.avatar;
        });

      // Name
      document.querySelectorAll(".profile-name").forEach((el) => {
        el.textContent = profile.username;
      });

      // Plan
      const planText = profile.plan || "PRO";
      document.querySelectorAll(".profile-plan").forEach((el) => {
        el.textContent =
          planText === "PRO"
            ? "Pro Plan"
            : planText.includes("Plan")
              ? planText
              : `${planText} Plan`;
      });
      const settingsBadge = document.getElementById("currentPlanBadge");
      if (settingsBadge) settingsBadge.textContent = planText;
    };

    updateGlobally();

    // Load Preferences
    const prefs = JSON.parse(
      localStorage.getItem("eduquiz_preferences") ||
        '{"darkMode": false, "sound": true, "push": true, "email": true}',
    );

    document.getElementById("darkModeToggle").checked = prefs.darkMode;
    document.getElementById("soundToggle").checked = prefs.sound;
    document.getElementById("pushToggle").checked = prefs.push;
    document.getElementById("emailToggle").checked = prefs.email;

    if (prefs.darkMode) {
      document.body.classList.add("dark-mode");
    }
  };

  // --- 2. Avatar Change Handlers ---
  const avatarInput = document.getElementById("avatarInput");
  const changeAvatarBtn = document.getElementById("changeAvatarBtn");

  if (changeAvatarBtn && avatarInput) {
    changeAvatarBtn.onclick = () => avatarInput.click();

    avatarInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert("Image too large! Please choose an image under 2MB.");
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target.result;
          profile.avatar = base64;

          // Sync globally
          document
            .querySelectorAll(
              ".profile-img, .mobile-profile img, #settingsAvatar",
            )
            .forEach((img) => {
              if (img) img.src = base64;
            });
          localStorage.setItem("userProfile_v2", JSON.stringify(profile));
        };
        reader.readAsDataURL(file);
      }
    };
  }

  // --- 3. Save Handlers ---
  document.getElementById("saveProfileBtn").addEventListener("click", () => {
    profile.username = document.getElementById("username").value.trim();
    profile.email = document.getElementById("email").value.trim();

    // Save to settings profile
    localStorage.setItem("userProfile_v2", JSON.stringify(profile));

    // Sync back to auth session
    const authSessionInfo = localStorage.getItem("eduquiz_user");
    if (authSessionInfo) {
      const userData = JSON.parse(authSessionInfo);
      userData.name = profile.username;
      userData.email = profile.email;
      localStorage.setItem("eduquiz_user", JSON.stringify(userData));
    }

    // Sync Name & Plan everywhere globally on this page
    document.querySelectorAll(".profile-name, .brand-name").forEach((el) => {
      if (el.classList.contains("profile-name")) {
        el.textContent = profile.username;
      }
    });

    alert("Profile updated successfully!");
  });

  const savePreferences = () => {
    const prefs = {
      darkMode: document.getElementById("darkModeToggle").checked,
      sound: document.getElementById("soundToggle").checked,
      push: document.getElementById("pushToggle").checked,
      email: document.getElementById("emailToggle").checked,
    };
    localStorage.setItem("eduquiz_preferences", JSON.stringify(prefs));

    // Apply dark mode immediately
    if (prefs.darkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  };

  // Attach change listeners to all toggles
  ["darkModeToggle", "soundToggle", "pushToggle", "emailToggle"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", savePreferences);
    },
  );

  // --- 4. Export Data ---
  const exportBtn = document.getElementById("exportDataBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const data = {
        profile: localStorage.getItem("userProfile_v2"),
        attempts: localStorage.getItem("eduquiz_attempts_extended"),
        streak: localStorage.getItem("daily_quiz_streak"),
        preferences: localStorage.getItem("eduquiz_preferences"),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eduquiz-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // --- 5. Password Modal Handlers ---
  const passwordModal = document.getElementById("passwordModal");
  const passwordBtn = document.getElementById("passwordSecurityBtn");
  const closePasswordModal = document.getElementById("closePasswordModal");
  const cancelPasswordBtn = document.getElementById("cancelPasswordBtn");
  const passwordForm = document.getElementById("passwordForm");

  const togglePasswordModal = (show) => {
    if (show) passwordModal.classList.add("active");
    else {
      passwordModal.classList.remove("active");
      passwordForm.reset();
      // Reset visibility to password
      document
        .querySelectorAll(".input-wrapper input")
        .forEach((input) => (input.type = "password"));
      document.querySelectorAll(".btn-toggle-pass i").forEach((icon) => {
        icon.setAttribute("data-lucide", "eye");
      });
      if (window.lucide) lucide.createIcons();

      // Clear errors
      document.querySelectorAll(".error-msg").forEach((el) => {
        el.textContent = "";
        el.classList.remove("show");
      });
      document
        .querySelectorAll(".field-group input")
        .forEach((el) => el.classList.remove("invalid"));
    }
  };

  if (passwordBtn) passwordBtn.onclick = () => togglePasswordModal(true);
  if (closePasswordModal)
    closePasswordModal.onclick = () => togglePasswordModal(false);
  if (cancelPasswordBtn)
    cancelPasswordBtn.onclick = () => togglePasswordModal(false);

  // --- 5.1 Password Visibility Toggles (enhanced) ---
  // use manual icon replacement to avoid full lucide re-render jump
  document.querySelectorAll(".btn-toggle-pass").forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      if (!input) return;

      // flip type
      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      // determine new icon and swap node manually
      const newIconData = isPassword ? "eye" : "eye-off";
      const newIcon = document.createElement("i");
      newIcon.setAttribute("data-lucide", newIconData);
      this.innerHTML = "";
      this.appendChild(newIcon);

      if (window.lucide) lucide.createIcons();
    });
  });

  // --- 5.2 Forgot Password Handler ---
  const forgotBtn = document.getElementById("forgotPasswordBtn");
  if (forgotBtn) {
    forgotBtn.onclick = () => {
      alert(
        "A password reset link has been sent to your registered email address.",
      );
    };
  }

  // Close on overlay click
  passwordModal.onclick = (e) => {
    if (e.target === passwordModal) togglePasswordModal(false);
  };

  const showError = (inputId, errorId, message) => {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (input) input.classList.add("invalid");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("show");
    }
  };

  const clearErrors = () => {
    document.querySelectorAll(".error-msg").forEach((el) => {
      el.textContent = "";
      el.classList.remove("show");
    });
    document
      .querySelectorAll(".field-group input")
      .forEach((el) => el.classList.remove("invalid"));
  };

  if (passwordForm) {
    passwordForm.onsubmit = (e) => {
      e.preventDefault();
      clearErrors();

      const currPass = document.getElementById("currentPassword").value;
      const newPass = document.getElementById("newPassword").value;
      const confirmPass = document.getElementById("confirmPassword").value;

      let hasError = false;

      // In a real app, you'd check currPass against a server/storage
      if (currPass.length < 4) {
        showError(
          "currentPassword",
          "currPassError",
          "Current password is too short.",
        );
        hasError = true;
      }

      if (newPass.length < 8) {
        showError(
          "newPassword",
          "newPassError",
          "Password must be at least 8 characters.",
        );
        hasError = true;
      }

      if (newPass !== confirmPass) {
        showError(
          "confirmPassword",
          "confirmPassError",
          "Passwords do not match.",
        );
        hasError = true;
      }

      if (hasError) return;

      // Simulate save success
      const btn = passwordForm.querySelector(".btn-primary");
      const originalText = btn.textContent;
      btn.textContent = "Updating...";
      btn.disabled = true;

      setTimeout(() => {
        alert("Password updated successfully!"); // Keeping a single success alert for major actions
        togglePasswordModal(false);
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1000);
    };
  }

  // --- 6. Delete Account (Simulation) ---
  const deleteBtn = document.querySelector(".delete-account-btn");
  if (deleteBtn) {
    deleteBtn.onclick = () => {
      if (
        confirm(
          "Are you sure you want to delete your account? This will wipe all your quiz history and statistics permanently.",
        )
      ) {
        localStorage.clear();
        alert("Account data wiped. Redirecting to home...");
        window.location.href = "../index.html";
      }
    };
  }

  // --- 7. Language Modal Handlers ---
  const langModal = document.getElementById("languageModal");
  const langBtn = document.getElementById("languageBtn");
  const closeLangModal = document.getElementById("closeLanguageModal");
  const confirmLangBtn = document.getElementById("confirmLangBtn");
  const langItems = document.querySelectorAll(".lang-item");

  let tempSelectedLang = "English";

  const toggleLangModal = (show) => {
    if (show) langModal.classList.add("active");
    else langModal.classList.remove("active");
  };

  if (langBtn) langBtn.onclick = () => toggleLangModal(true);
  if (closeLangModal) closeLangModal.onclick = () => toggleLangModal(false);

  langItems.forEach((item) => {
    item.onclick = () => {
      langItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");
      tempSelectedLang = item.getAttribute("data-lang");
    };
  });

  if (confirmLangBtn) {
    confirmLangBtn.onclick = () => {
      document.getElementById("currentLangVal").textContent = tempSelectedLang;
      document.getElementById("currentLangDesc").textContent =
        `Currently set to ${tempSelectedLang}`;

      // Simulation
      const btnOriginal = confirmLangBtn.textContent;
      confirmLangBtn.textContent = "Updating...";
      confirmLangBtn.disabled = true;

      setTimeout(() => {
        alert(`Language switched to ${tempSelectedLang}`);
        toggleLangModal(false);
        confirmLangBtn.textContent = btnOriginal;
        confirmLangBtn.disabled = false;
      }, 800);
    };
  }

  // Close on overlay click
  langModal.onclick = (e) => {
    if (e.target === langModal) toggleLangModal(false);
  };

  // Logout Logic
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("eduquiz_user");
        window.location.href = "../index.html";
      }
    };
  }

  // --- Init ---
  loadSettings();
  if (window.lucide) lucide.createIcons();
});
