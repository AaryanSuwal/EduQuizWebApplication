const settingsOverlay = document.getElementById("settingsOverlay");
const closeBtn = document.getElementById("closeSettings");
const saveBtn = document.getElementById("saveSettings");
const usernameInput = document.getElementById("usernameInput");

const lightBtn = document.getElementById("lightMode");
const darkBtn = document.getElementById("darkMode");

const resetWarning = document.getElementById("resetWarning");
const resetData = document.getElementById("resetData");

// OPEN modal
function openSettings() {
  settingsOverlay.classList.remove("hidden");
  usernameInput.value = localStorage.getItem("username") || "Student";
}

// CLOSE modal
function closeSettings() {
  settingsOverlay.classList.add("hidden");
}

closeBtn.addEventListener("click", closeSettings);

// SAVE
saveBtn.addEventListener("click", () => {
  localStorage.setItem("username", usernameInput.value || "Student");

  // Update welcome text + avatar
  document.querySelector(".welcome-title").textContent = `Welcome back, ${
    usernameInput.value || "Student"
  }!`;

  document.querySelector(".avatar").src = `https://ui-avatars.com/api/?name=${
    usernameInput.value || "Student"
  }&background=6366f1&color=fff`;

  closeSettings();
});

// THEME
lightBtn.addEventListener("click", () => {
  document.body.classList.remove("dark");
  lightBtn.classList.add("active");
  darkBtn.classList.remove("active");
  localStorage.setItem("theme", "light");
});

darkBtn.addEventListener("click", () => {
  document.body.classList.add("dark");
  darkBtn.classList.add("active");
  lightBtn.classList.remove("active");
  localStorage.setItem("theme", "dark");
});

// RESET
resetWrapper.onclick = () => {
  resetData.classList.remove("hidden");
  resetWrapper.classList.add("hidden");
};

cancelReset.onclick = () => {
  resetData.classList.add("hidden");
  resetWrapper.classList.remove("hidden");
};

confirmReset.onclick = () => {
  localStorage.clear();
  location.reload();
};

// LOAD SAVED SETTINGS
window.addEventListener("DOMContentLoaded", () => {
  const theme = localStorage.getItem("theme");
  const name = localStorage.getItem("username") || "Student";

  document.querySelector(
    ".welcome-title"
  ).textContent = `Welcome back, ${name}!`;

  document.querySelector(
    ".avatar"
  ).src = `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`;

  if (theme === "dark") {
    darkBtn.click();
  }
});
