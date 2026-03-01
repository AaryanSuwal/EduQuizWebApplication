document.addEventListener("DOMContentLoaded", () => {
  // --- 0. Global User Hydration ---
  const globalAuthSession = localStorage.getItem("eduquiz_user");
  if (globalAuthSession) {
    const userData = JSON.parse(globalAuthSession);
    document.querySelectorAll(".profile-name, .brand-name").forEach((el) => {
      // Only update actual profile names, avoiding modifying brand icons if matched
      if (el.classList.contains("profile-name")) {
        el.textContent = userData.name;
      }
    });
  }

  // --- 1. Infinite Marquee Creation ---
  const marqueeContent = document.getElementById("marquee");
  if (marqueeContent) {
    // Create 10 span elements exactly like the React version
    let content = "";
    for (let i = 0; i < 10; i++) {
      content += `<span class="marquee-item">Learn • Master • Achieve • </span>`;
    }
    marqueeContent.innerHTML = content;
  }

  // --- 2. Spotlight Testimonial Slider ---
  const testSlides = document.querySelectorAll(".test-slide");
  const testDots = document.querySelectorAll(".test-dot");
  const prevBtn = document.getElementById("prevTest");
  const nextBtn = document.getElementById("nextTest");

  if (testSlides.length > 0) {
    let currentIndex = 0;
    const total = testSlides.length;

    const updateSlider = (index) => {
      // Normalize index
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;

      currentIndex = index;

      // Remove all states
      testSlides.forEach((s) => s.classList.remove("active"));
      testDots.forEach((d) => d.classList.remove("active"));

      // Set new active state
      testSlides[currentIndex].classList.add("active");
      testDots[currentIndex].classList.add("active");
    };

    // Event Listeners
    if (nextBtn)
      nextBtn.addEventListener("click", () => updateSlider(currentIndex + 1));
    if (prevBtn)
      prevBtn.addEventListener("click", () => updateSlider(currentIndex - 1));

    testDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => updateSlider(idx));
    });

    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();

    // Initial setup
    updateSlider(0);
  }

  // --- 5. Blog Category Filtering ---
  const catPills = document.querySelectorAll(".cat-pill-v3");
  const articleCards = document.querySelectorAll(".art-card-v3");

  if (catPills.length > 0) {
    catPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const targetCategory = pill.textContent.trim();

        // Update active state
        catPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");

        // Real Filtering Logic
        let visibleCount = 0;
        articleCards.forEach((card) => {
          const cardCategory = card
            .querySelector(".art-badge-v3")
            .textContent.trim();

          // Exit Animation
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";

          setTimeout(() => {
            if (
              targetCategory === "All Articles" ||
              cardCategory === targetCategory
            ) {
              card.style.display = "flex";
              visibleCount++;
              // Re-entry Animation
              setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              }, 50);
            } else {
              card.style.display = "none";
            }

            // Handle Empty State
            const emptyState = document.getElementById("blogEmptyState");
            if (emptyState) {
              if (visibleCount === 0) {
                emptyState.style.display = "block";
                setTimeout(() => {
                  emptyState.style.opacity = "1";
                  emptyState.style.transform = "translateY(0)";
                }, 50);
              } else {
                emptyState.style.display = "none";
                emptyState.style.opacity = "0";
                emptyState.style.transform = "translateY(20px)";
              }
            }
          }, 400);
        });
      });
    });
  }

  // --- 6. Scroll Interactions (Intersection Observers) ---
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const fadeInElements = document.querySelectorAll(
    ".about-section, .modes-section, .domains-section, .why-choose-section, .testimonials-section, .path-section, .blog-hero-v3, .article-grid-section-v3, .newsletter-section-v3",
  );

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeInElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
    scrollObserver.observe(el);
  });

  // --- 7. Global Profile Sync ---
  const updateGlobalProfile = () => {
    const savedProfile = localStorage.getItem("userProfile_v2");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);

      // Migration: Boost all users to PRO for the premium feel
      if (!profile.plan || profile.plan === "Free Plan") {
        profile.plan = "PRO";
        localStorage.setItem("userProfile_v2", JSON.stringify(profile));
      }

      // Sidebar name
      const sidebarNames = document.querySelectorAll(".sidebar .profile-name");
      sidebarNames.forEach((el) => (el.textContent = profile.username));

      // Profile images (Sidebar & Mobile Header)
      const profileImgs = document.querySelectorAll(
        ".profile-img, .mobile-profile img",
      );
      profileImgs.forEach((img) => (img.src = profile.avatar));

      // Sync Plan
      const profilePlans = document.querySelectorAll(".profile-plan");
      profilePlans.forEach((el) => {
        const planText = profile.plan || "PRO";
        // If plan is 'PRO', format as 'Pro Plan'
        el.textContent =
          planText === "PRO"
            ? "Pro Plan"
            : planText.includes("Plan")
              ? planText
              : `${planText} Plan`;
      });
    }
  };

  updateGlobalProfile();

  // --- 5. Newsletter Validation ---
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterMessage = document.getElementById("newsletterMessage");
  const newsletterBtn = document.getElementById("newsletterBtn");

  if (newsletterForm && newsletterEmail && newsletterMessage) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = newsletterEmail.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Reset state
      newsletterMessage.textContent = "";
      newsletterMessage.classList.remove("visible", "success", "error");
      newsletterEmail.classList.remove("invalid");

      if (!emailRegex.test(email)) {
        newsletterEmail.classList.add("invalid");
        newsletterMessage.textContent = "Please enter a valid email address.";
        newsletterMessage.classList.add("visible", "error");
        return;
      }

      // Simulate loading
      newsletterBtn.classList.add("loading");
      const originalBtnText = newsletterBtn.innerHTML;
      newsletterBtn.innerHTML =
        'Subscribing... <i data-lucide="loader-2" class="animate-spin"></i>';
      if (window.lucide) lucide.createIcons();

      setTimeout(() => {
        newsletterBtn.classList.remove("loading");
        newsletterBtn.innerHTML = originalBtnText;
        if (window.lucide) lucide.createIcons();

        newsletterMessage.textContent = "Welcome to the EduQuiz!";
        newsletterMessage.classList.add("visible", "success");
        newsletterEmail.value = "";

        // Clear success message after 5 seconds
        setTimeout(() => {
          newsletterMessage.classList.remove("visible");
        }, 5000);
      }, 1200);
    });

    // Real-time validation feedback
    newsletterEmail.addEventListener("input", () => {
      newsletterEmail.classList.remove("invalid");
      if (newsletterMessage.classList.contains("error")) {
        newsletterMessage.classList.remove("visible");
      }
    });
  }

  // --- 6. Initialize Icons ---
  if (window.lucide) {
    lucide.createIcons();
  }
});
