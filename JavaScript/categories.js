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

    const quizSetupDiv = document.getElementById("quizSetup");

    card.onclick = () => {
      // hide categories
      grid.classList.add("hidden");
      emptyState.classList.add("hidden");

      // show quiz setup div
      quizSetupDiv.classList.remove("hidden");

      // inject quiz setup HTML
      quizSetupDiv.innerHTML = `
        <h2>${cat.name} Quiz</h2>
        <p>${cat.description}</p>

        <div>
          <h3>Select Difficulty</h3>
          <button onclick="startQuiz('${cat.id}', 'Easy')">Easy</button>
          <button onclick="startQuiz('${cat.id}', 'Medium')">Medium</button>
          <button onclick="startQuiz('${cat.id}', 'Hard')">Hard</button>
        </div>

        <div>
          <h3>Select Format</h3>
          <button onclick="startQuiz('${cat.id}', '${cat.id}-MC')">Multiple Choice</button>
          <button onclick="startQuiz('${cat.id}', '${cat.id}-TF')">True/False</button>
          <button onclick="startQuiz('${cat.id}', '${cat.id}-FB')">Fill in Blanks</button>
        </div>

        <button id="backToCategories">Back</button>
      `;

      document.getElementById("backToCategories").onclick = () => {
        quizSetupDiv.classList.add("hidden");
        grid.classList.remove("hidden");
      };
    };

    grid.appendChild(card);
  });
}

renderCategories(CATEGORIES);
