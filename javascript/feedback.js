/* feedback.js */

document.addEventListener("DOMContentLoaded", () => {
  // Current user profile state
  let profile = JSON.parse(
    localStorage.getItem("userProfile_v2") ||
      '{"username": "Alex Morgan", "email": "alex.morgan@example.com", "avatar": "https://picsum.photos/seed/alex/200/200", "plan": "PRO"}',
  );

  // --- 0. Sync Profile with Sidebar ---
  const syncProfile = () => {
    // Avatars
    document
      .querySelectorAll(".profile-img, .mobile-profile img")
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
  };
  syncProfile();

  let rating = null;
  let category = null;

  const ratingBtns = document.querySelectorAll(".rating-btn");
  const catBtns = document.querySelectorAll(".cat-btn");
  const feedbackForm = document.getElementById("feedbackForm");
  const submitBtn = document.getElementById("submitBtn");
  const errorMsg = document.getElementById("errorMsg");
  const formContainer = document.getElementById("feedbackFormContainer");
  const successState = document.getElementById("successState");
  const sendAnotherBtn = document.getElementById("sendAnotherBtn");

  // --- 1. Selection Handlers ---
  ratingBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingBtns.forEach((rb) => rb.classList.remove("active"));
      btn.classList.add("active");
      rating = btn.getAttribute("data-val");
      validateForm();
    });
  });

  catBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      catBtns.forEach((cb) => cb.classList.remove("active"));
      btn.classList.add("active");
      category = btn.getAttribute("data-cat");
      validateForm();
    });
  });

  const validateForm = () => {
    if (rating && category) {
      submitBtn.disabled = false;
      errorMsg.classList.add("hidden");
    } else {
      submitBtn.disabled = true;
      errorMsg.classList.remove("hidden");
    }
  };

  // --- 1.2 Character Counter ---
  const feedbackMessage = document.getElementById("feedbackMessage");
  const charCount = document.getElementById("charCount");

  if (feedbackMessage && charCount) {
    feedbackMessage.addEventListener("input", () => {
      const length = feedbackMessage.value.length;
      charCount.textContent = `${length} / 1000`;

      // Visual feedback for length
      if (length >= 900) {
        charCount.style.color = "var(--red-500)";
      } else if (length >= 700) {
        charCount.style.color = "var(--amber-500)";
      } else {
        charCount.style.color = "var(--slate-400)";
      }
    });
  }

  // --- 2. Form Submission ---
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Show loading state
    const btnText = submitBtn.querySelector("span");
    const originalText = btnText.textContent;
    btnText.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      formContainer.classList.add("hidden");
      successState.classList.remove("hidden");
      window.scrollTo(0, 0);

      // Reset form
      feedbackForm.reset();
      rating = null;
      category = null;
      ratingBtns.forEach((rb) => rb.classList.remove("active"));
      catBtns.forEach((cb) => cb.classList.remove("active"));
      btnText.textContent = originalText;
      validateForm();
    }, 1500);
  });

  sendAnotherBtn.addEventListener("click", () => {
    successState.classList.add("hidden");
    formContainer.classList.remove("hidden");
  });

  // --- 1.3 Screenshot Upload ---
  const addScreenshotBtn = document.getElementById("addScreenshotBtn");
  const screenshotInput = document.getElementById("screenshotInput");
  const filePreview = document.getElementById("filePreview");
  const fileNameDisplay = document.getElementById("fileName");
  const screenshotPreview = document.getElementById("screenshotPreview");
  const removeFileBtn = document.getElementById("removeFileBtn");

  if (addScreenshotBtn && screenshotInput) {
    addScreenshotBtn.addEventListener("click", () => {
      screenshotInput.click();
    });

    screenshotInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];

        // Show filename
        fileNameDisplay.textContent = file.name;

        // Create Preview
        const reader = new FileReader();
        reader.onload = (event) => {
          screenshotPreview.src = event.target.result;
          filePreview.classList.remove("hidden");
          addScreenshotBtn.classList.add("hidden");
        };
        reader.readAsDataURL(file);
      }
    });

    removeFileBtn.addEventListener("click", () => {
      screenshotInput.value = "";
      screenshotPreview.src = "";
      filePreview.classList.add("hidden");
      addScreenshotBtn.classList.remove("hidden");
    });
  }

  if (window.lucide) lucide.createIcons();
});
