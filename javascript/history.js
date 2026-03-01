document.addEventListener("DOMContentLoaded", () => {
  function normalizeAttempt(raw, index) {
    if (raw.categoryId !== undefined) {
      const label = raw.categoryName || raw.categoryId || "Quiz";
      const format =
        raw.type === "mcq"
          ? "Multiple Choice"
          : raw.type === "truefalse"
            ? "True / False"
            : raw.type === "fillblanks"
              ? "Fill in Blanks"
              : raw.type || "";

      const dateObj = raw.time ? new Date(raw.time) : null;
      const dateStr =
        dateObj && !isNaN(dateObj)
          ? dateObj.toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : raw.date || "—";

      return {
        id: String(raw.time || index),
        title: `${label} — ${format}`,
        category: label,
        date: dateStr,
        score:
          typeof raw.correctAnswers === "number"
            ? raw.correctAnswers
            : Math.round((raw.score / 100) * (raw.totalQuestions || 5)),
        totalQuestions: raw.totalQuestions || 5,
        timeTaken: "—",
        difficulty: raw.difficulty
          ? raw.difficulty.charAt(0).toUpperCase() + raw.difficulty.slice(1)
          : "Easy",
        details: raw.details || [],
      };
    }
    return raw;
  }

  let attempts = [];
  let searchQuery = "";
  let selectedCategory = "All";
  let sortOrder = "Newest";

  const loadHistoryData = () => {
    const stored = localStorage.getItem("eduquiz_attempts");
    if (stored) {
      const raw = JSON.parse(stored);
      if (Array.isArray(raw) && raw.length > 0) {
        attempts = raw.map((a, i) => normalizeAttempt(a, i));
      }
    }

    lucide.createIcons();
    updateSummary();
    renderAttempts();
    renderPerformance();
  };

  // --- 5. Summary Cards ---
  const updateSummary = () => {
    const total = attempts.length;
    document.getElementById("totalAttempts").textContent = total;

    if (total > 0) {
      const avg = Math.round(
        attempts.reduce(
          (acc, a) => acc + (a.score / a.totalQuestions) * 100,
          0,
        ) / total,
      );
      document.getElementById("avgScore").textContent = `${avg}%`;

      const best = Math.max(
        ...attempts.map((a) => Math.round((a.score / a.totalQuestions) * 100)),
      );
      document.getElementById("bestScore").textContent = `${best}%`;

      // Last attempt — try to sort by id (timestamp) for real data
      const sorted = [...attempts].sort((a, b) => Number(b.id) - Number(a.id));
      document.getElementById("lastAttemptDate").textContent = sorted[0].date;
    } else {
      document.getElementById("avgScore").textContent = "0%";
      document.getElementById("bestScore").textContent = "0%";
      document.getElementById("lastAttemptDate").textContent = "—";
    }
  };

  // --- 6. Render Attempt Cards ---
  const renderAttempts = () => {
    const listContainer = document.getElementById("attemptsList");
    const emptyState = document.getElementById("emptyState");

    let filtered = attempts.filter((a) => {
      const matchesSearch = a.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "All" || a.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    filtered.sort((a, b) => {
      if (sortOrder === "Newest") return Number(b.id) - Number(a.id) || 0;
      if (sortOrder === "Oldest") return Number(a.id) - Number(b.id) || 0;
      if (sortOrder === "Highest")
        return b.score / b.totalQuestions - a.score / a.totalQuestions;
      return 0;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");

    listContainer.innerHTML = filtered
      .map((a, idx) => {
        const pct = Math.round((a.score / a.totalQuestions) * 100);
        const scoreClass = pct >= 80 ? "high" : pct >= 50 ? "mid" : "low";
        const diffClass = a.difficulty.toLowerCase();

        return `
                <div class="attempt-card slide-up" style="animation-delay: ${idx * 0.05}s" data-id="${a.id}">
                    <div class="attempt-card-left">
                        <div class="score-badge-large ${scoreClass}">${pct}%</div>
                        <div class="attempt-info-main">
                            <h3>${a.title}</h3>
                            <div class="attempt-meta-row">
                                <div class="meta-item">
                                    <i data-lucide="layers"></i>
                                    ${a.category}
                                </div>
                                <div class="meta-item">
                                    <i data-lucide="calendar"></i>
                                    ${a.date}
                                </div>
                                <div class="meta-item">
                                    <i data-lucide="clock"></i>
                                    ${a.timeTaken}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="attempt-card-right">
                        <span class="difficulty-pill ${diffClass}">${a.difficulty}</span>
                        <button class="btn-delete-attempt" data-id="${a.id}" title="Delete">
                            <i data-lucide="trash-2"></i>
                        </button>
                        <div class="view-details-action">
                            View Details
                            <i data-lucide="chevron-right"></i>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");

    lucide.createIcons();

    document.querySelectorAll(".attempt-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-delete-attempt")) return;
        openDetailsModal(card.getAttribute("data-id"));
      });
    });

    document.querySelectorAll(".btn-delete-attempt").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteAttempt(btn.getAttribute("data-id"));
      });
    });
  };

  // --- 7. Performance Grid ---
  const renderPerformance = () => {
    const perfGrid = document.getElementById("categoryPerformance");
    const perfSection = document.getElementById("performanceSection");

    if (attempts.length === 0) {
      perfSection.classList.add("hidden");
      return;
    }

    perfSection.classList.remove("hidden");

    const statsMap = {};
    attempts.forEach((a) => {
      if (!statsMap[a.category])
        statsMap[a.category] = { score: 0, total: 0, count: 0 };
      statsMap[a.category].score += a.score;
      statsMap[a.category].total += a.totalQuestions;
      statsMap[a.category].count += 1;
    });

    const sortedStats = Object.entries(statsMap)
      .map(([name, d]) => ({
        name,
        percent: Math.round((d.score / d.total) * 100),
        count: d.count,
      }))
      .sort((a, b) => b.percent - a.percent);

    perfGrid.innerHTML = sortedStats
      .map((s) => {
        const cls = s.percent >= 80 ? "high" : s.percent >= 60 ? "mid" : "low";
        return `
                <div class="perf-card-mini">
                    <div class="perf-card-header">
                        <div class="perf-card-title">
                            <h4>${s.name}</h4>
                            <span>${s.count} Quiz${s.count !== 1 ? "zes" : ""}</span>
                        </div>
                        <div class="perf-percentage-badge ${cls}">${s.percent}%</div>
                    </div>
                    <div class="perf-progress-wrapper">
                        <div class="perf-bar-fill ${cls}" style="width: ${s.percent}%"></div>
                    </div>
                </div>
            `;
      })
      .join("");
  };

  // --- 8. Details Modal ---
  const modal = document.getElementById("detailsModal");
  const modalBody = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModal");

  const openDetailsModal = (id) => {
    const attempt = attempts.find((a) => a.id === id);
    if (!attempt) return;

    const pct = Math.round((attempt.score / attempt.totalQuestions) * 100);

    modalBody.innerHTML = `
            <div class="attempt-summary-box">
                <h3 class="summary-title">${attempt.title}</h3>
                <div class="summary-meta">
                    <span>${attempt.date}</span>
                    <span>•</span>
                    <span>${attempt.timeTaken}</span>
                    <span>•</span>
                    <span>${attempt.difficulty}</span>
                </div>
                <div class="summary-stats-row">
                    <div class="summary-stat-group">
                        <div class="summary-stat-lbl">Score</div>
                        <div class="summary-stat-val text-indigo-bold">${attempt.score}/${attempt.totalQuestions}</div>
                    </div>
                    <div class="summary-stat-group">
                        <div class="summary-stat-lbl">Accuracy</div>
                        <div class="summary-stat-val">${pct}%</div>
                    </div>
                </div>
            </div>

            <h4 class="question-review-title">
                <i data-lucide="file-text"></i>
                Question Review
            </h4>

            <div class="question-results-list">
                ${
                  attempt.details && attempt.details.length > 0
                    ? attempt.details
                        .map(
                          (q) => `
                        <div class="question-result-item ${q.isCorrect ? "correct" : "incorrect"}">
                            <div class="q-header">
                                <div class="q-icon"><i data-lucide="${q.isCorrect ? "check-circle-2" : "x-circle"}"></i></div>
                                <div class="q-text">${q.question}</div>
                            </div>
                            <div class="q-answers">
                                <div class="q-ans-group">
                                    <span class="q-ans-lbl">Your Answer:</span>
                                    <span class="q-ans-val ${q.isCorrect ? "" : "user-ans"}">${q.userAnswer}</span>
                                </div>
                                ${
                                  !q.isCorrect
                                    ? `
                                    <div class="q-ans-group">
                                        <span class="q-ans-lbl">Correct:</span>
                                        <span class="q-ans-val correct-ans">${q.correctAnswer}</span>
                                    </div>`
                                    : ""
                                }
                            </div>
                        </div>
                    `,
                        )
                        .join("")
                    : `<div class="loading-state">Detailed question breakdown is not available for this attempt.</div>`
                }
            </div>
        `;

    modal.classList.remove("hidden");
    lucide.createIcons();
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  };

  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // --- 9. Delete ---
  const deleteAttempt = (id) => {
    if (!confirm("Delete this attempt?")) return;

    // Remove from in-memory list
    attempts = attempts.filter((a) => a.id !== id);

    // Also remove from localStorage (real data only)
    const stored = localStorage.getItem("eduquiz_attempts");
    if (stored) {
      const raw = JSON.parse(stored);
      const updated = raw.filter((a) => String(a.time) !== id);
      localStorage.setItem("eduquiz_attempts", JSON.stringify(updated));
    }

    updateSummary();
    renderAttempts();
    renderPerformance();
  };

  // --- 10. Filter event listeners ---
  document.getElementById("quizSearch").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderAttempts();
  });

  document.getElementById("categoryFilter").addEventListener("change", (e) => {
    selectedCategory = e.target.value;
    renderAttempts();
  });

  document.getElementById("sortOrder").addEventListener("change", (e) => {
    sortOrder = e.target.value;
    renderAttempts();
  });

  // --- Init ---
  loadHistoryData();
});
