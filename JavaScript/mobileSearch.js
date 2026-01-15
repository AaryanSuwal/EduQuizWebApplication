// Mobile Search Functionality
// This file handles the mobile search bar in the navigation menu
// to filter categories just like the desktop search bar

// Note: CATEGORIES and renderCategories are global variables defined in categories.js

document.addEventListener("DOMContentLoaded", () => {
  const mobileSearchInput = document.getElementById("mobileSearch");
  const desktopSearchInput = document.getElementById("cat-search");

  if (mobileSearchInput) {
    // Sync mobile search with desktop search functionality
    mobileSearchInput.addEventListener("input", (e) => {
      const value = e.target.value.trim().toLowerCase();

      // Sync the desktop search input value
      if (desktopSearchInput) {
        desktopSearchInput.value = e.target.value;
      }

      // Trigger the desktop search input event to use existing filtering logic
      if (desktopSearchInput) {
        desktopSearchInput.dispatchEvent(new Event("input", { bubbles: true }));
      }

      // Scroll to categories section if there's a search value
      if (value.length > 0) {
        const categoriesSection = document.getElementById("categories");
        if (categoriesSection) {
          setTimeout(() => {
            categoriesSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }
      }
    });
  }

  // Also sync desktop search to mobile
  if (desktopSearchInput) {
    desktopSearchInput.addEventListener("input", (e) => {
      if (mobileSearchInput) {
        mobileSearchInput.value = e.target.value;
      }
    });
  }

  // Handle reset button click to also clear mobile search
  const resetButton = document.getElementById("resetBtn");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      if (mobileSearchInput) {
        mobileSearchInput.value = "";
      }
    });
  }
});
