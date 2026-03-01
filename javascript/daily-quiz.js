/* daily-quiz.js */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. State Management ---
  let streak = 3;
  let bestStreak = 7;
  let isCompleted = false;
  let timeLeft = "";

  // --- 2. Timer Logic ---
  const updateTimer = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();

    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const timeStr = `${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`;
    const timerEl = document.getElementById("timer");
    if (timerEl) timerEl.textContent = timeStr;
  };

  // --- 3. Data Loading ---
  const loadDailyData = () => {
    const todayStr = new Date().toDateString();
    const lastAttempt = localStorage.getItem("daily_quiz_last_attempt");

    if (lastAttempt === todayStr) {
      isCompleted = true;
      showCompletedState();
    }

    const storedStreak = localStorage.getItem("daily_quiz_streak");
    if (storedStreak) streak = parseInt(storedStreak);

    const storedBestStreak = localStorage.getItem("daily_quiz_best_streak");
    if (storedBestStreak) bestStreak = parseInt(storedBestStreak);

    updateUI();
  };

  const updateUI = () => {
    // Update Date
    const today = new Date();
    const dateEl = document.getElementById("currentDate");
    if (dateEl) {
      dateEl.textContent = today.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }

    // Update Streak Info
    const streakNumEl = document.getElementById("currentStreak");
    const bestStreakEl = document.getElementById("bestStreak");
    const streakFill = document.getElementById("streakFill");
    const streakIcon = document.getElementById("streakIcon");

    if (streakNumEl) streakNumEl.textContent = streak;
    if (bestStreakEl) bestStreakEl.textContent = bestStreak;

    if (streakFill) {
      // Visualize progress toward a 5-day goal (like React demo)
      const progress = (streak / 5) * 100;
      streakFill.style.width = Math.min(progress, 100) + "%";
    }

    if (streakIcon && streak > 0) {
      streakIcon.classList.add("text-orange-500", "fill-orange-500");
    }

    // Update Day Tracker
    const tracker = document.getElementById("dayTracker");
    if (tracker) {
      tracker.innerHTML = "";
      for (let i = 1; i <= 5; i++) {
        const dot = document.createElement("div");
        dot.className = "day-dot";
        if (i <= streak) {
          dot.className += " completed";
          dot.innerHTML = "✓";
        } else if (i === streak + 1 && !isCompleted) {
          dot.className += " today";
          dot.textContent = i;
        } else {
          dot.textContent = i;
        }
        tracker.appendChild(dot);
      }
    }
  };

  const showCompletedState = () => {
    const actionContainer = document.getElementById("quizActionContainer");
    const completedCard = document.getElementById("completedState");

    if (actionContainer) actionContainer.classList.add("hidden");
    if (completedCard) completedCard.classList.remove("hidden");
  };

  // --- 4. Event Handlers ---
  const handleStartQuiz = () => {
    // Simulate start confirmation
    if (confirm("Start Daily Quiz? (This demo simulates completion)")) {
      const todayStr = new Date().toDateString();
      localStorage.setItem("daily_quiz_last_attempt", todayStr);
      isCompleted = true;

      // Increment streak
      streak += 1;
      localStorage.setItem("daily_quiz_streak", streak.toString());

      if (streak > bestStreak) {
        bestStreak = streak;
        localStorage.setItem("daily_quiz_best_streak", bestStreak.toString());
      }

      showCompletedState();
      updateUI();
    }
  };

  // --- Init ---
  const startBtn = document.getElementById("startQuizBtn");
  if (startBtn) startBtn.addEventListener("click", handleStartQuiz);

  loadDailyData();
  setInterval(updateTimer, 1000);
  updateTimer();

  // Init Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
});
