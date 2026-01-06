const CATEGORIES = [
  {
    id: "math",
    name: "Mathematics",
    icon: "bi-calculator",
    color: "linear-gradient(135deg, #3b82f6, #22d3ee)",
    description: "Algebra, Geometry, and Calculus challenges.",
  },
  {
    id: "science",
    name: "Science",
    icon: "bi-lightning-charge",
    color: "linear-gradient(135deg, #10b981, #4ade80)",
    description: "Explore Physics, Chemistry, and Biology.",
  },
  {
    id: "history",
    name: "History",
    icon: "bi-hourglass-split",
    color: "linear-gradient(135deg, #f59e0b, #fb923c)",
    description: "Journey through time and civilizations.",
  },
  {
    id: "tech",
    name: "Technology",
    icon: "bi-cpu",
    color: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    description: "Coding, AI, and latest tech trends.",
  },
  {
    id: "geo",
    name: "Geography",
    icon: "bi-globe",
    color: "linear-gradient(135deg, #14b8a6, #34d399)",
    description: "Countries, capitals, and landscapes.",
  },
  {
    id: "lit",
    name: "Literature",
    icon: "bi-book",
    color: "linear-gradient(135deg, #ec4899, #fb7185)",
    description: "Classic novels, poetry, and authors.",
  },
  {
    id: "art",
    name: "Art & Culture",
    icon: "bi-palette",
    color: "linear-gradient(135deg, #d946ef, #a855f7)",
    description: "Paintings, music, and cultural heritage.",
  },
  {
    id: "gk",
    name: "General Knowledge",
    icon: "bi-lightbulb",
    color: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
    description: "Test your overall awareness.",
  },
];

const grid = document.getElementById("categoriesGrid");
const emptyState = document.getElementById("noCategories");
const searchInput = document.getElementById("cat-search");
const resetButton = document.getElementById("resetBtn");

document.addEventListener("DOMContentLoaded", () => {
  const countCategory = CATEGORIES.length;
  document.getElementById("categoryCount").textContent = countCategory + "+";
});

searchInput.addEventListener("input", (e) => {
  const value = e.target.value.trim().toLowerCase();

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(value)
  );

  renderCategories(filteredCategories);
});

resetButton.addEventListener("click", () => {
  searchInput.value = "";
  renderCategories(CATEGORIES);
});

function renderCategories(list) {
  grid.innerHTML = "";

  if (list.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  list.forEach((cat) => {
    const card = document.createElement("button");
    card.className = "category-card";

    card.style.setProperty("--hover-bg", cat.color);

    card.innerHTML = `
      <div class="category-icon" style="background:${cat.color}">
        <i class="bi ${cat.icon}"></i>
      </div>
      <h3>${cat.name}</h3>
      <p>${cat.description}</p>
      <div class="category-action">
        Configure Quiz <i class="bi bi-gear"></i>
      </div>
    `;

    card.onclick = () => {
      const quizSetupDiv = document.getElementById("quizSetup");

      quizSetupDiv.classList.remove("hidden");

      quizSetupDiv.innerHTML = `
        <div class="quiz-card1">
          <div class="quiz-header" style="background: ${cat.color}">
            <div class="quiz-glow"></div>
            <h2>${cat.name} Quiz</h2>
            <p>Customize your learning experience</p>
          </div>

          <div class="quiz-body">

            <div class="quiz-section">
              <h3>
                <i class="bi bi-graph-up"></i>
                Select Difficulty
              </h3>
              <div class="button-grid three">
                <button class="difficulty-btn">Easy</button>
                <button class="difficulty-btn active">Medium</button>
                <button class="difficulty-btn">Hard</button>
              </div>
            </div>

            <div class="quiz-section">
              <h3>
                <i class="bi bi-gear"></i>
                Select Format
              </h3>
              <div class="button-grid">
                <button class="format-btn active">
                  <i class="bi bi-ui-checks"></i>
                  <span>MCQ</span>
                </button>
                <button class="format-btn">
                  <i class="bi bi-check2"></i>
                  <span>True / False</span>
                </button>
                <button class="format-btn">
                  <i class="bi bi-fonts"></i>
                  <span>Fill Blanks</span>
                </button>
              </div>
            </div>

            <div class="quiz-actions">
              <button class="back-btn" id="backToCategories">Back</button>
              <button class="start-btn" id="startQuiz">
                Start Quiz
              </button>
            </div>

          </div>
        </div>
      `;

      document.getElementById("backToCategories").onclick = () => {
        quizSetupDiv.classList.add("hidden");
      };
    };
    grid.appendChild(card);
  });
}
renderCategories(CATEGORIES);

// Highlight the selected option on click -difficulty, and format

document.addEventListener("click", (e) => {
  if (e.target.closest(".difficulty-btn")) {
    const btn = e.target.closest(".difficulty-btn");
    document
      .querySelectorAll(".difficulty-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }

  if (e.target.closest(".format-btn")) {
    const btn = e.target.closest(".format-btn");
    document
      .querySelectorAll(".format-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }
});
