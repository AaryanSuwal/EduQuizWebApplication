// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. State & Data Logic ---
  let stats = { categories: {}, totalQuizzes: 0, totalScore: 0 };
  let attempts = [];

  const loadDashboardData = () => {
    try {
      const storedStats = localStorage.getItem("eduquiz_stats");
      const storedAttempts = localStorage.getItem("eduquiz_attempts");

      if (storedStats) stats = JSON.parse(storedStats);
      if (storedAttempts) attempts = JSON.parse(storedAttempts);

      updateStatsGrid();
      updatePerformanceSection();
      updateRecentActivity();
      updateCategoryBreakdown();
      updateLastPlayedDetails();
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  };

  const updateStatsGrid = () => {
    const statsGrid = document.getElementById("statsGrid");
    if (!statsGrid) return;

    const statCards = statsGrid.querySelectorAll(".stat-card");

    // Total Quizzes
    if (statCards[0]) {
      statCards[0].querySelector(".stat-value").textContent =
        stats.totalQuizzes || 0;
    }

    // Avg Score
    if (statCards[1]) {
      const totalQuestions = Object.values(stats.categories).reduce(
        (acc, c) => acc + (c.totalQuestions || 0),
        0,
      );
      const totalCorrect = Object.values(stats.categories).reduce(
        (acc, c) => acc + (c.correctAnswers || 0),
        0,
      );
      const avg =
        totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : 0;
      statCards[1].querySelector(".stat-value").textContent = avg + "%";
    }

    // Highest Score
    if (statCards[2]) {
      const highest = Object.values(stats.categories).reduce(
        (max, c) => Math.max(max, c.highestScore || 0),
        0,
      );
      statCards[2].querySelector(".stat-value").textContent = highest + "%";
    }

    // Streak (from daily-quiz logic)
    if (statCards[3]) {
      const streak = localStorage.getItem("daily_quiz_streak") || 0;
      statCards[3].querySelector(".stat-value").textContent = `${streak} Days`;
    }
  };

  const updatePerformanceSection = () => {
    const perfSection = document.getElementById("performanceSection");
    if (!perfSection) return;

    const totalQuestions = Object.values(stats.categories).reduce(
      (acc, c) => acc + (c.totalQuestions || 0),
      0,
    );
    const totalCorrect = Object.values(stats.categories).reduce(
      (acc, c) => acc + (c.correctAnswers || 0),
      0,
    );
    const totalIncorrect = totalQuestions - totalCorrect;
    const avg =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;

    const accVal = perfSection.querySelector(".acc-val");
    const progressFill = perfSection.querySelector(".progress-bar-fill");
    const correctVal = perfSection.querySelector(
      ".perf-stat-box.green .perf-stat-val",
    );
    const incorrectVal = perfSection.querySelector(
      ".perf-stat-box.red .perf-stat-val",
    );

    if (accVal) accVal.textContent = avg + "%";
    if (progressFill) progressFill.style.width = avg + "%";
    if (correctVal) correctVal.textContent = totalCorrect;
    if (incorrectVal) incorrectVal.textContent = totalIncorrect;
  };

  const updateRecentActivity = () => {
    const activityList = document.querySelector(
      "#recentActivitySection .activity-list",
    );
    if (!activityList) return;

    if (attempts.length === 0) {
      activityList.innerHTML =
        '<div class="empty-state-mini">No recent quizzes found. Start one!</div>';
      return;
    }

    activityList.innerHTML = attempts
      .slice(0, 4)
      .map((a) => {
        const pct =
          a.score ||
          Math.round((a.correctAnswers / a.totalQuestions) * 100) ||
          0;
        const scoreColor = pct >= 80 ? "emerald" : pct >= 50 ? "blue" : "amber";

        // Format time ago (simplified)
        const timeDiff = Date.now() - (a.time || Date.now());
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        const timeStr =
          hoursAgo === 0
            ? "Just now"
            : hoursAgo < 24
              ? `${hoursAgo} hours ago`
              : a.date || "Recently";

        return `
                <div class="activity-item">
                    <div class="activity-info">
                        <div class="activity-score ${scoreColor}">${pct}%</div>
                        <div>
                            <h4>${a.categoryName || "General Quiz"}</h4>
                            <p>${a.type === "mcq" ? "Multiple Choice" : a.type === "truefalse" ? "True / False" : "Fill in Blanks"}</p>
                        </div>
                    </div>
                    <div class="activity-meta">
                        <div class="activity-date">${timeStr}</div>
                        <i data-lucide="chevron-right" class="chevron"></i>
                    </div>
                </div>
            `;
      })
      .join("");
    lucide.createIcons();
  };

  const updateCategoryBreakdown = () => {
    const breakdownList = document.querySelector(
      "#breakdownSection .breakdown-list",
    );
    if (!breakdownList) return;

    const catStats = Object.entries(stats.categories);
    if (catStats.length === 0) {
      breakdownList.innerHTML =
        '<div class="empty-state-mini">Start playing to see category breakdown.</div>';
      return;
    }

    // Sort by accuracy
    const sorted = catStats
      .map(([id, s]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        accuracy: Math.round((s.correctAnswers / s.totalQuestions) * 100) || 0,
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 4);

    breakdownList.innerHTML = sorted
      .map((c) => {
        const color =
          c.accuracy >= 80 ? "emerald" : c.accuracy >= 50 ? "blue" : "amber";
        return `
                <div class="breakdown-item">
                    <div class="bd-header">
                        <span class="bd-name">${c.name}</span>
                        <span class="bd-val">${c.accuracy}%</span>
                    </div>
                    <div class="bd-bar-bg"><div class="bd-bar-fill bg-${color}" style="width: ${c.accuracy}%;"></div></div>
                    ${c.accuracy < 50 ? '<div class="bd-warning">Needs Improvement</div>' : ""}
                </div>
            `;
      })
      .join("");
  };

  const updateLastPlayedDetails = () => {
    if (attempts.length === 0) return;
    const last = attempts[0];

    const content = document.querySelector(".last-played-content");
    if (!content) return;

    const pct =
      last.score ||
      Math.round((last.correctAnswers / last.totalQuestions) * 100) ||
      0;

    // Determine color class based on score
    let colorClass = "red";
    if (pct >= 80) colorClass = "green";
    else if (pct >= 60) colorClass = "emerald";
    else if (pct >= 40) colorClass = "yellow";

    // Calculate circular progress angle (0-360 degrees based on percentage)
    const angle = (pct / 100) * 360;

    content.innerHTML = `
            <div class="score-circle-wrapper ${colorClass}" style="--score-angle: ${angle}deg;">
                <div class="score-circle">
                    <div class="score-text">
                        <span class="val">${pct}%</span>
                        <span class="lbl">Score</span>
                    </div>
                </div>
            </div>
            <div class="last-played-details">
                <div class="detail-box">
                    <div class="lbl">Category</div>
                    <div class="val">${last.categoryName || "General"}</div>
                </div>
                <div class="detail-box">
                    <div class="lbl">Game Mode</div>
                    <div class="val">${last.type === "mcq" ? "Multiple Choice" : "Rapid Fire"}</div>
                </div>
                <div class="detail-box">
                    <div class="lbl">Date Completed</div>
                    <div class="val">${last.date || "Today"}</div>
                </div>
                <div class="detail-box">
                    <div class="lbl">Status</div>
                    <div class="val text-${pct >= 50 ? colorClass : "red"}">${pct >= 50 ? "Passed" : "Failed"}</div>
                </div>
            </div>
        `;
  };

  // --- 2. Button Listeners ---
  const settingsBtn = document.getElementById("dashboardSettingsBtn");
  const settingsDropdown = document.getElementById("settingsDropdown");

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsDropdown.classList.toggle("hidden");
      settingsBtn.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (
        !settingsDropdown.contains(e.target) &&
        e.target !== settingsBtn &&
        !settingsBtn.contains(e.target)
      ) {
        settingsDropdown.classList.add("hidden");
        settingsBtn.classList.remove("active");
      }
    });
  }

  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      refreshBtn.classList.add("spinning");
      refreshBtn.innerHTML = '<i data-lucide="refresh-cw"></i> Refreshing...';
      lucide.createIcons();

      // Re-load data
      loadDashboardData();

      setTimeout(() => {
        refreshBtn.classList.remove("spinning");
        refreshBtn.innerHTML = '<i data-lucide="refresh-cw"></i> Refresh Data';
        lucide.createIcons();
      }, 1000);
    });
  }

  // Toggle widgets
  const toggles = [
    { id: "toggleAchievements", section: "achievementsSection" },
    { id: "toggleRecentActivity", section: "recentActivitySection" },
    {
      id: "togglePerformance",
      section: "performanceSection",
      breakdown: "breakdownSection",
    },
  ];

  toggles.forEach((t) => {
    const toggleEl = document.getElementById(t.id);
    if (toggleEl) {
      toggleEl.addEventListener("click", function () {
        this.classList.toggle("active");
        const isActive = this.classList.contains("active");
        const section = document.getElementById(t.section);
        if (section) section.style.display = isActive ? "block" : "none";
        if (t.breakdown) {
          const bSection = document.getElementById(t.breakdown);
          if (bSection) bSection.style.display = isActive ? "block" : "none";
        }
      });
    }
  });

  // Compact Mode
  const toggleCompact = document.getElementById("toggleCompact");
  if (toggleCompact) {
    toggleCompact.addEventListener("click", function () {
      this.classList.toggle("active");
      const isCompact = this.classList.contains("active");
      const elements = [
        document.getElementById("statsGrid"),
        document.getElementById("quickActionsGrid"),
        document.getElementById("mainDashboardLayout"),
      ];
      elements.forEach(
        (el) =>
          el &&
          (isCompact
            ? el.classList.add("compact")
            : el.classList.remove("compact")),
      );
    });
  }

  // Modal achievements
  const viewAllBtn = document.getElementById("viewAllAchievementsBtn");
  const modal = document.getElementById("achievementsModal");
  const closeBtn = document.getElementById("closeAchievementsModal");

  if (viewAllBtn && modal && closeBtn) {
    viewAllBtn.onclick = () => {
      modal.classList.remove("hidden");
      document.body.style.overflow = "hidden";
    };
    const closeModal = () => {
      modal.classList.add("hidden");
      document.body.style.overflow = "";
    };
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.classList.contains("hidden"))
        closeModal();
    });
  }

  // Quick Action Links
  const actionCards = document.querySelectorAll(".action-card");
  if (actionCards[0])
    actionCards[0].onclick = () => (window.location.href = "categories.html"); // Start New Quiz
  if (actionCards[1])
    actionCards[1].onclick = () => (window.location.href = "categories.html"); // Choose Category
  if (actionCards[2])
    actionCards[2].onclick = () => (window.location.href = "categories.html"); // Select Mode
  if (actionCards[3])
    actionCards[3].onclick = () => (window.location.href = "history.html"); // View Performance

  // Init Data
  loadDashboardData();
});
