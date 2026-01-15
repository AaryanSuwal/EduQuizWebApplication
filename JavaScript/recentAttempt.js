function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function formatLabel(type) {
  if (type === "mcq") return "Multiple Choice";
  if (type === "truefalse") return "True / False";
  if (type === "fillblanks") return "Fill in the Blanks";
  return type;
}

function getRecentAttempts() {
  return JSON.parse(localStorage.getItem("recentAttempts")) || [];
}

function renderRecentAttempts() {
  const list = document.getElementById("activityList");
  const attempts = getRecentAttempts();

  list.innerHTML = "";

  if (attempts.length === 0) {
    list.innerHTML = `
      <div class="no-activity">
        <p>No recent attempts found</p>
      </div>
    `;
    return;
  }

  attempts.forEach((item) => {
    const div = document.createElement("div");
    div.className = "recent-item";

    div.innerHTML = `
        <div class="activity-row">
            <div class="module">
                <div class="icon-box"><i class="bi bi-journal-text"></i></div>
                <div>
                <p class="module-title">${capitalize(item.category)}</p>
                <p class="module-sub">
                    ${capitalize(item.difficulty)} x ${formatLabel(item.type)}
                </p>
                </div>
            </div>

            <div class="activity-meta">
              <span class="badge">${item.score}/${
      item.total
    } Correct</span>        
              <span class="time">${timeAgo(item.time)}</span>
            </div>
        </div>
    `;

    list.appendChild(div);
  });
}

renderRecentAttempts();

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 60000);

  if (diff < 1) return "Just now";
  if (diff < 60) return diff + " min ago";
  return Math.floor(diff / 60) + " hr ago";
}
