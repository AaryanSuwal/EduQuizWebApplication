/* profile.js */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. State Management ---
  let profile = {
    username: "Alex Morgan",
    email: "alex@example.com",
    avatar: "https://picsum.photos/seed/alex/200/200",
    joinDate: "Jan 2024",
    xp: 0,
    level: 1,
  };

  let attempts = [];
  let stats = { categories: {}, totalQuizzes: 0, totalScore: 0 };
  let streak = 0;
  let dailyCompleted = false;

  // Heatmap Pagination State
  let heatmapDate = new Date();
  heatmapDate.setDate(1); // Start at first of current month

  // --- 2. Data Loading ---
  const loadProfileData = () => {
    // Load Auth Info first
    const authSession = localStorage.getItem("eduquiz_user");
    if (authSession) {
      const userData = JSON.parse(authSession);
      profile.username = userData.name || profile.username;
      profile.email = userData.email || profile.email;
    }

    // Load specific Profile Info customizations
    const savedProfile = localStorage.getItem("userProfile_v2");
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      profile = { ...profile, ...parsed };
    }

    // Load Quiz Stats
    const savedAttempts = localStorage.getItem("eduquiz_attempts");
    attempts = savedAttempts ? JSON.parse(savedAttempts) : [];

    const savedStats = localStorage.getItem("eduquiz_stats");
    stats = savedStats
      ? JSON.parse(savedStats)
      : { categories: {}, totalQuizzes: 0, totalScore: 0 };

    // Load Streak
    const savedStreak = localStorage.getItem("daily_quiz_streak");
    streak = savedStreak ? parseInt(savedStreak) : 0;

    const lastDaily = localStorage.getItem("daily_quiz_last_attempt");
    dailyCompleted = lastDaily === new Date().toDateString();

    calculateGrowth();
    updateUI();
    renderHeatmap();
  };

  const calculateGrowth = () => {
    // Simple XP: 50 XP per correct answer + 10 XP per quiz attempt
    let totalXP = 0;
    attempts.forEach((a) => {
      totalXP += (a.correctAnswers || 0) * 50;
      totalXP += 10;
    });

    profile.xp = totalXP;
    // Level up every 1000 XP
    profile.level = Math.floor(totalXP / 1000) + 1;
  };

  const updateUI = () => {
    // Hero Info
    document.getElementById("userName").textContent = profile.username;
    if (document.getElementById("userEmail")) {
      document.getElementById("userEmail").textContent = profile.email;
    }
    document.getElementById("profileAvatar").src = profile.avatar;
    document.getElementById("userLevel").textContent = `Level ${profile.level}`;
    document.getElementById("joinDate").textContent = profile.joinDate;
    document.getElementById("streakVal").textContent = streak;
    document.getElementById("xpVal").textContent = profile.xp;

    // Level Progress
    const xpProgress = ((profile.xp % 1000) / 1000) * 100;
    const xpToNext = 1000 - (profile.xp % 1000);
    document.getElementById("currentLevelLbl").textContent =
      `Level ${profile.level}`;
    document.getElementById("xpRemainingLbl").textContent =
      `${Math.round(xpToNext)} XP to Level ${profile.level + 1}`;
    document.getElementById("xpFill").style.width = `${xpProgress}%`;

    // Snapshot
    document.getElementById("snapQuizzes").textContent =
      stats.totalQuizzes || 0;

    const totalCorrect = Object.values(stats.categories).reduce(
      (acc, c) => acc + (c.correctAnswers || 0),
      0,
    );
    const totalQuestions = Object.values(stats.categories).reduce(
      (acc, c) => acc + (c.totalQuestions || 0),
      0,
    );
    const avgPct =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;
    document.getElementById("snapAvgScore").textContent = `${avgPct}%`;

    const bestPct = Object.values(stats.categories).reduce(
      (max, c) => Math.max(max, c.highestScore || 0),
      0,
    );
    document.getElementById("snapBestScore").textContent = `${bestPct}%`;

    const uniqueCats = Object.keys(stats.categories).length;
    document.getElementById("snapCategories").textContent = uniqueCats;

    // Personal Progress (Strongest/Weakest)
    let strongest = { name: "-", pct: -1 };
    let weakest = { name: "-", pct: 101 };
    let favorite = { name: "-", attempts: 0 };

    Object.entries(stats.categories).forEach(([id, s]) => {
      const pct = (s.correctAnswers / s.totalQuestions) * 100;
      const name = id.charAt(0).toUpperCase() + id.slice(1);

      if (pct > strongest.pct) strongest = { name, pct };
      if (pct < weakest.pct) weakest = { name, pct };
      if (s.attempts > favorite.attempts)
        favorite = { name, attempts: s.attempts };
    });

    document.getElementById("strongestCat").textContent = strongest.name;
    document.getElementById("weakestCat").textContent = weakest.name;
    document.getElementById("favoriteCat").textContent = favorite.name;

    // Activity Summary
    if (attempts.length > 0) {
      const last = attempts[0];
      document.getElementById("lastAttemptDate").textContent =
        last.date || "Today";
    } else {
      document.getElementById("lastAttemptDate").textContent =
        "No attempts yet";
    }

    const dailyStatusItem = document.getElementById("dailyStatusItem");
    const dailyStatusText = document.getElementById("dailyStatusText");
    if (dailyCompleted) {
      dailyStatusItem.classList.add("completed");
      dailyStatusText.textContent = "Completed Today";
    } else {
      dailyStatusItem.classList.remove("completed");
      dailyStatusText.textContent = "Not Completed";
    }
  };

  const renderHeatmap = () => {
    const heatmap = document.getElementById("activityHeatmap");
    if (!heatmap) return;
    heatmap.innerHTML = "";

    // Show current viewed month
    const year = heatmapDate.getFullYear();
    const month = heatmapDate.getMonth();

    // Display Month Name
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(heatmapDate);
    const monthDisplay = document.getElementById("currentMonthYear");
    if (monthDisplay) monthDisplay.textContent = monthName;

    // Get first and last day of month
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // GitHub style grid: 7 rows.
    // To align correctly, we should add empty placeholders for days from previous month on the first week.
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday

    // Add empty dots for padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      const empty = document.createElement("div");
      empty.className = "h-dot";
      empty.style.visibility = "hidden";
      heatmap.appendChild(empty);
    }

    // Fill days of the month
    let monthQuizzes = 0;
    let monthScore = 0;
    let bestDay = { date: "--", count: 0 };

    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
      const dateObj = new Date(year, month, d);
      const dateStr = dateObj.toDateString();
      const dayAttempts = attempts.filter((a) => {
        const aDate = a.time ? new Date(a.time).toDateString() : a.date;
        return aDate === dateStr;
      });

      const count = dayAttempts.length;
      monthQuizzes += count;
      dayAttempts.forEach((a) => (monthScore += a.score || 0));

      if (count > bestDay.count) {
        bestDay = {
          date: dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
          count,
        };
      }

      const dot = document.createElement("div");
      dot.className = "h-dot";
      if (count >= 10) dot.classList.add("lv-4");
      else if (count >= 5) dot.classList.add("lv-3");
      else if (count >= 3) dot.classList.add("lv-2");
      else if (count >= 1) dot.classList.add("lv-1");

      dot.title = `${dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}: ${count} quizzes`;
      heatmap.appendChild(dot);
    }

    // Update Monthly Stats Panel
    const monthTotalEl = document.getElementById("monthTotal");
    const monthAccuracyEl = document.getElementById("monthAccuracy");
    const monthBestDayEl = document.getElementById("monthBestDay");

    if (monthTotalEl) monthTotalEl.textContent = monthQuizzes;
    if (monthAccuracyEl) {
      const avg = monthQuizzes > 0 ? Math.round(monthScore / monthQuizzes) : 0;
      monthAccuracyEl.textContent = `${avg}%`;
    }
    if (monthBestDayEl) monthBestDayEl.textContent = bestDay.date;

    // Update footer text
    const footer = document.querySelector(".heatmap-footer");
    if (footer) footer.textContent = `Activity summary for ${monthName}`;

    // Disable "Next" if we are at the current month or future
    const now = new Date();
    const nextBtn = document.getElementById("nextMonthBtn");
    if (nextBtn) {
      nextBtn.disabled = year >= now.getFullYear() && month >= now.getMonth();
    }
  };

  // --- 3. Interaction Handlers ---
  const nameDisplay = document.getElementById("nameDisplay");
  const nameEdit = document.getElementById("nameEdit");
  const nameInput = document.getElementById("nameInput");

  const toggleEditName = (show) => {
    if (show) {
      nameDisplay.classList.add("hidden");
      nameEdit.classList.remove("hidden");
      nameInput.value = profile.username;
      nameInput.focus();
    } else {
      nameDisplay.classList.remove("hidden");
      nameEdit.classList.add("hidden");
    }
  };

  const editBtn = document.getElementById("editNameBtn");
  if (editBtn) editBtn.onclick = () => toggleEditName(true);

  const editTrigger = document.getElementById("editUsernameTrigger");
  if (editTrigger)
    editTrigger.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => toggleEditName(true), 400);
    };

  const cancelBtn = document.getElementById("cancelNameBtn");
  if (cancelBtn) cancelBtn.onclick = () => toggleEditName(false);

  const saveBtn = document.getElementById("saveNameBtn");
  if (saveBtn)
    saveBtn.onclick = () => {
      const val = nameInput.value.trim();
      if (val) {
        profile.username = val;
        localStorage.setItem("userProfile_v2", JSON.stringify(profile));
        updateUI();

        // Re-sync name across sidebar if needed (usually handled by page reload or general state)
        const sidebarName = document.querySelector(".sidebar .profile-name");
        if (sidebarName) sidebarName.textContent = val;
      }
      toggleEditName(false);
    };

  // --- Avatar Change Logic ---
  const avatarInput = document.getElementById("avatarInput");
  const changeAvatarBtn = document.getElementById("changeAvatarBtn");
  const changeAvatarTrigger = document.getElementById("changeAvatarTrigger");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("Image too large! Please choose an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Avatar = event.target.result;
        profile.avatar = base64Avatar;
        localStorage.setItem("userProfile_v2", JSON.stringify(profile));

        // Update UI immediately
        document.getElementById("profileAvatar").src = base64Avatar;

        // Global Sync (Sidebar & Mobile Header)
        const globalImages = document.querySelectorAll(
          ".profile-img, .mobile-profile img",
        );
        globalImages.forEach((img) => (img.src = base64Avatar));
      };
      reader.readAsDataURL(file);
    }
  };

  if (changeAvatarBtn && avatarInput) {
    changeAvatarBtn.onclick = () => avatarInput.click();
  }
  if (changeAvatarTrigger && avatarInput) {
    changeAvatarTrigger.onclick = () => avatarInput.click();
  }
  if (avatarInput) {
    avatarInput.onchange = handleAvatarChange;
  }

  // --- Heatmap Pagination Handlers ---
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");

  if (prevMonthBtn) {
    prevMonthBtn.onclick = () => {
      heatmapDate.setMonth(heatmapDate.getMonth() - 1);
      renderHeatmap();
    };
  }

  if (nextMonthBtn) {
    nextMonthBtn.onclick = () => {
      heatmapDate.setMonth(heatmapDate.getMonth() + 1);
      renderHeatmap();
    };
  }

  // Reset Progress
  const resetModal = document.getElementById("resetModal");
  const resetOpenBtn = document.getElementById("resetProgressBtn");
  if (resetOpenBtn)
    resetOpenBtn.onclick = () => resetModal.classList.remove("hidden");

  const resetCancel = document.getElementById("cancelReset");
  if (resetCancel)
    resetCancel.onclick = () => resetModal.classList.add("hidden");

  const resetConfirm = document.getElementById("confirmReset");
  if (resetConfirm) {
    resetConfirm.onclick = () => {
      localStorage.removeItem("eduquiz_attempts");
      localStorage.removeItem("eduquiz_stats");
      localStorage.removeItem("daily_quiz_streak");
      localStorage.removeItem("daily_quiz_last_attempt");

      loadProfileData(); // Reload with defaults
      resetModal.classList.add("hidden");
      alert("All progress data cleared!");
      window.location.reload();
    };
  }

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
  loadProfileData();
  if (window.lucide) lucide.createIcons();
});
