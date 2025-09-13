const goalsContainer = document.getElementById("goals-container");
const completedContainer = document.getElementById("completed-container");
const historyContainer = document.getElementById("history-container");
const modal = document.getElementById("modal");
const addGoalBtn = document.getElementById("add-goal-btn");
const saveGoalBtn = document.getElementById("save-goal");

let goals = [];

addGoalBtn.onclick = () => modal.classList.remove("hidden");

saveGoalBtn.onclick = () => {
  const name = document.getElementById("goal-name").value;
  const target = parseFloat(document.getElementById("goal-target").value);
  const icon = document.getElementById("goal-icon").value || "🎯";
  const color = document.getElementById("goal-color").value;

  const goal = {
    id: Date.now(),
    name,
    target,
    current: 0,
    icon,
    color,
    steps: [],
    completed: false,
    archived: false,
  };

  goals.push(goal);
  renderGoals();
  modal.classList.add("hidden");
};

function renderGoals() {
  goalsContainer.innerHTML = "";
  completedContainer.innerHTML = "";
  historyContainer.innerHTML = "";

  goals.forEach(goal => {
    const div = document.createElement("div");
    div.className = "goal";
    div.style.borderLeft = `10px solid ${goal.color}`;

    const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
    const progressColor = percent >= 100 ? "gold" : goal.color;

    div.innerHTML = `
      <h3>${goal.icon} ${goal.name}</h3>
      <p>Cel: ${goal.target}</p>
      <p>Obecnie: ${goal.current}</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${percent}%; background:${progressColor}"></div>
      </div>
      <p style="text-align:center;">🔵 ${percent}% zrealizowane</p>
      <div class="goal-actions">
        ${percent < 100 ? `<button onclick="addProgress(${goal.id})">➕ Dodaj postęp</button>` : `<div class="confetti">🎉 Gratulacje!</div>`}
        ${percent >= 100 && !goal.archived ? `<button onclick="archiveGoal(${goal.id})">📦 Archiwizuj</button>` : ""}
        ${percent >= 100 ? `<button onclick="repeatGoal(${goal.id})">🔁 Powtórz</button>` : ""}
      </div>
    `;

    if (goal.completed && !goal.archived) {
      completedContainer.appendChild(div);
    } else if (goal.archived) {
      const stats = document.createElement("div");
      stats.className = "goal";
      stats.innerHTML = `
        <h3>${goal.icon} ${goal.name}</h3>
        <p>✅ Zrealizowano: ${new Date(goal.completedDate).toLocaleDateString()}</p>
        <p>Kroków: ${goal.steps.length}</p>
        <p>Średni postęp: ${Math.round(goal.target / goal.steps.length)} jednostek</p>
      `;
      historyContainer.appendChild(stats);
    } else {
      goalsContainer.appendChild(div);
    }
  });
}

function addProgress(id) {
  const value = prompt("Dodaj wartość postępu:");
  const num = parseFloat(value);
  if (isNaN(num)) return;

  const goal = goals.find(g => g.id === id);
  goal.current += num;
  goal.steps.push(num);

  if (goal.current >= goal.target && !goal.completed) {
    goal.completed = true;
    goal.completedDate = Date.now();
  }

  renderGoals();
}

function archiveGoal(id) {
  const goal = goals.find(g => g.id === id);
  goal.archived = true;
  renderGoals();
}

function repeatGoal(id) {
  const old = goals.find(g => g.id === id);
  const newGoal = {
    ...old,
    id: Date.now(),
    current: 0,
    steps: [],
    completed: false,
    archived: false,
  };
  goals.push(newGoal);
  renderGoals();
}

renderGoals();