// Get DOM elements
const taskInput = document.getElementById("taskInput");
const taskDateInput = document.getElementById("taskDate");
const taskPriorityInput = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const themeToggle = document.getElementById("themeToggle");

// Load tasks on page load
document.addEventListener("DOMContentLoaded", loadTasks);

// Add new task
addTaskBtn.addEventListener("click", addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  const taskDate = taskDateInput.value;
  const priority = taskPriorityInput.value;

  if (taskText === "") {
    alert("Task cannot be empty!");
    return;
  }

  createTaskElement(taskText, false, taskDate, priority);
  saveTask(taskText, false, taskDate, priority);

  taskInput.value = "";
  taskDateInput.value = "";
  taskPriorityInput.value = "Low";
  updateTaskCounter();
}

// Create task element
function createTaskElement(taskText, isCompleted = false, dueDate = "", priority = "Low") {
  const li = document.createElement("li");
  li.className = "task-item";
  if (isCompleted) li.classList.add("completed");

  const span = document.createElement("span");
  span.textContent = taskText;

  // Due date
  const dateSpan = document.createElement("small");
  dateSpan.textContent = dueDate ? ` (Due: ${dueDate})` : "";
  if (dueDate && new Date(dueDate) < new Date()) {
    dateSpan.style.color = "red"; // overdue
  }

  // Priority
  const prioritySpan = document.createElement("strong");
  prioritySpan.textContent = ` [${priority}]`;
  if (priority === "High") prioritySpan.style.color = "red";
  if (priority === "Medium") prioritySpan.style.color = "orange";
  if (priority === "Low") prioritySpan.style.color = "green";

  // Checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isCompleted;
  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
    updateLocalStorage();
    updateTaskCounter();
  });

  // Buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "task-buttons";

  const editBtn = document.createElement("button");
  editBtn.textContent = "✏ Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", () => editTask(span, editBtn));

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑 Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", () => {
    taskList.removeChild(li);
    updateLocalStorage();
    updateTaskCounter();
  });

  buttonsDiv.appendChild(editBtn);
  buttonsDiv.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(dateSpan);
  li.appendChild(prioritySpan);
  li.appendChild(buttonsDiv);

  taskList.appendChild(li);

  updateTaskCounter();
}

// Edit task
function editTask(span, editBtn) {
  if (editBtn.textContent.includes("Edit")) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    span.replaceWith(input);
    editBtn.textContent = "💾 Save";
    editBtn.className = "save-btn";

    editBtn.onclick = () => {
      if (input.value.trim() === "") {
        alert("Task cannot be empty!");
        return;
      }
      span.textContent = input.value.trim();
      input.replaceWith(span);
      editBtn.textContent = "✏ Edit";
      editBtn.className = "edit-btn";
      editBtn.onclick = () => editTask(span, editBtn);
      updateLocalStorage();
    };
  }
}

// Save task
function saveTask(taskText, completed, dueDate, priority) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, completed, dueDate, priority });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update storage
function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll(".task-item").forEach(item => {
    const text = item.querySelector("span").textContent;
    const completed = item.classList.contains("completed");
    const dueDate = item.querySelector("small").textContent.replace(" (Due: ", "").replace(")", "");
    const priority = item.querySelector("strong").textContent.replace(/[\[\]]/g, "").trim();
    tasks.push({ text, completed, dueDate, priority });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTaskElement(task.text, task.completed, task.dueDate, task.priority));
  updateTaskCounter();
}

// Counter
function updateTaskCounter() {
  const totalTasks = document.querySelectorAll(".task-item").length;
  const completedTasks = document.querySelectorAll(".task-item.completed").length;

  document.getElementById("taskCounter").textContent =
    `Tasks: ${totalTasks} | Completed: ${completedTasks}`;
}

// Clear all tasks
function clearAllTasks() {
  const confirmClear = confirm("⚠ Are you sure you want to delete all tasks?");
  if (confirmClear) {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
    updateTaskCounter();
  }
}

// Dark/Light Mode
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
  const sliderIcon = document.querySelector(".slider .icon");
  sliderIcon.textContent = themeToggle.checked ? "🌙" : "🌞";
});
