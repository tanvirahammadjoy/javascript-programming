const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");
const taskList = document.querySelector("#task-list");
const filters = document.querySelectorAll(".filter-buttons button");
const emptyState = document.querySelector("#empty-state");
const historyLog = document.querySelector("#history-log");
const undoBtn = document.querySelector("#undo-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let history = JSON.parse(localStorage.getItem("tasksHistory")) || [];
let currentFilter = "all";

// ----- Utility functions -----
function saveState() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function pushHistory(action) {
  const record = {
    timestamp: new Date().toLocaleTimeString(),
    action,
    state: JSON.parse(JSON.stringify(tasks)), // deep copy
  };
  history.push(record);
  if (history.length > 50) history.shift(); // keep last 50
  localStorage.setItem("tasksHistory", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  historyLog.innerHTML = "";
  history
    .slice()
    .reverse()
    .forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `[${item.timestamp}] ${item.action}`;
      historyLog.appendChild(li);
    });
}

function undoLastAction() {
  if (history.length < 2) return;
  history.pop(); // remove last action
  const lastState = history[history.length - 1].state;
  tasks = JSON.parse(JSON.stringify(lastState));
  saveState();
  localStorage.setItem("tasksHistory", JSON.stringify(history));
  renderTasks();
  renderHistory();
}

// ----- Rendering -----
function renderTasks() {
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.dataset.id = task.id;

    const span = document.createElement("span");
    span.textContent = task.text;

    const button = document.createElement("button");
    button.className = "delete-btn";
    button.textContent = "✖";

    li.appendChild(span);
    li.appendChild(button);
    taskList.appendChild(li);
  });

  emptyState.style.display = tasks.length === 0 ? "block" : "none";
  saveState();
}

// ----- Actions -----
function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.classList.add("error");
    return;
  }
  taskInput.classList.remove("error");

  const newTask = { id: Date.now(), text, completed: false };
  tasks.push(newTask);
  taskInput.value = "";
  taskInput.focus();
  pushHistory(`Added task: "${text}"`);
  renderTasks();
}

function handleListClick(e) {
  const target = e.target;
  const li = target.closest("li");
  if (!li) return;

  const id = Number(li.dataset.id);
  if (target.classList.contains("delete-btn")) {
    const deleted = tasks.find((t) => t.id === id);
    tasks = tasks.filter((task) => task.id !== id);
    pushHistory(`Deleted task: "${deleted.text}"`);
  } else if (target.tagName === "SPAN") {
    const task = tasks.find((t) => t.id === id);
    task.completed = !task.completed;
    pushHistory(
      `Marked task "${task.text}" as ${task.completed ? "completed" : "active"}`,
    );
  }
  renderTasks();
}

// ----- Event Listeners -----
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
taskList.addEventListener("click", handleListClick);

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

undoBtn.addEventListener("click", undoLastAction);

// ----- Initialize -----
renderTasks();
renderHistory();

// ----- Debugging -----
window.tasks = tasks;
window.history = history;