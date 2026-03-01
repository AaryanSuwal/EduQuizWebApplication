/* help-center.js — Premium Interactivity */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. FAQ Accordion Logic ---
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Close all others for a clean look
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove("active");
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add("active");
      }
    });
  });

  // --- 2. Advanced Search Logic ---
  const searchInput = document.getElementById("helpSearch");
  const faqList = document.getElementById("faqList");
  const noResults = document.getElementById("noResults");
  const topicCards = document.querySelectorAll(".topic-card");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      let hasResults = false;

      // 1. Filter Topics
      topicCards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = "flex";
          hasResults = true;
        } else {
          card.style.display = "none";
        }
      });

      // 2. Filter FAQs
      faqItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = "block";
          hasResults = true;
        } else {
          item.style.display = "none";
        }
      });

      // 3. Handle No Results State
      if (!hasResults) {
        noResults.classList.remove("hidden");
        faqList.classList.add("hidden");
      } else {
        noResults.classList.add("hidden");
        faqList.classList.remove("hidden");
      }
    });
  }

  if (window.lucide) lucide.createIcons();
});
