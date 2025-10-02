let tasks = [];
let editingTaskId = null;
let currentFilter = 'all';

// Elementos del DOM
const welcomeModal = document.getElementById("welcome-modal");
const startBtn = document.getElementById("start-btn");
const userNameInput = document.getElementById("user-name");
const userGreeting = document.getElementById("user-greeting");
const currentDate = document.getElementById("current-date");
const toggleInputsBtn = document.getElementById("toggle-inputs");
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskTitle = document.getElementById("task-title");
const taskDescription = document.getElementById("task-description");
const categoryInput = document.getElementById("category");
const dueDate = document.getElementById("due-date");
const inProgressTasksContainer = document.getElementById("in-progress-tasks");
const completedTasksContainer = document.getElementById("completed-tasks");
const notification = document.getElementById("notification");
const filterBtns = document.querySelectorAll(".filter-btn");

// Inicialización
function init() {
  loadTasks();
  loadUserName();
  setCurrentDate();
  checkUpcomingDeadlines();
  updateStats();
  
  if (!localStorage.getItem('userName')) {
    welcomeModal.classList.add('show');
  }
}

// Fecha actual
function setCurrentDate() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  currentDate.textContent = today.toLocaleDateString('es-ES', options);
}

// Cargar nombre de usuario
function loadUserName() {
  const name = localStorage.getItem('userName');
  if (name) {
    userGreeting.textContent = name;
  }
}

// Modal de bienvenida
startBtn.addEventListener("click", function() {
  const userName = userNameInput.value.trim();
  if (userName) {
    localStorage.setItem('userName', userName);
    userGreeting.textContent = userName;
    welcomeModal.classList.remove('show');
    showNotification('¡Bienvenido!', `Hola ${userName}, ¡comencemos a organizar tus tareas!`);
  }
});

// Toggle inputs
toggleInputsBtn.addEventListener("click", function() {
  taskInput.classList.toggle("show");
  if (taskInput.classList.contains("show")) taskTitle.focus();
  if (editingTaskId) cancelEdit();
});

// Agregar tarea
addTaskBtn.addEventListener("click", function() {
  const title = taskTitle.value.trim();
  const description = taskDescription.value.trim();
  const category = categoryInput.value;
  const date = dueDate.value;

  if (title && description && date) {
    if (editingTaskId) {
      updateTask(editingTaskId, title, description, category, date);
    } else {
      createTask(title, description, category, date);
    }
    clearForm();
    taskInput.classList.remove("show");
  } else {
    showNotification('Campos incompletos', 'Por favor completa todos los campos', 'warning');
  }
});

// Crear tarea
function createTask(title, description, category, date) {
  const task = {
    id: Date.now(),
    title,
    description,
    category,
    date,
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(task);
  saveTasks();
  renderTasks();
  updateStats();
  showNotification('Tarea creada', `"${title}" ha sido agregada exitosamente`);
}

// Actualizar tarea
function updateTask(id, title, description, category, date) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.title = title;
    task.description = description;
    task.category = category;
    task.date = date;
    saveTasks();
    renderTasks();
    updateStats();
    showNotification('Tarea actualizada', 'Los cambios han sido guardados');
    editingTaskId = null;
    addTaskBtn.textContent = 'Añadir tarea';
  }
}

// Renderizar tareas
function renderTasks() {
  inProgressTasksContainer.innerHTML = '';
  completedTasksContainer.innerHTML = '';

  const filteredTasks = currentFilter === 'all' 
    ? tasks 
    : tasks.filter(task => currentFilter === 'completed' ? task.completed : !task.completed);

  filteredTasks.forEach(task => {
    const taskEl = document.createElement('div');
    taskEl.classList.add('task');
    if (task.completed) taskEl.classList.add('completed');

    taskEl.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <span class="category">${task.category}</span>
      <span class="date">Vence: ${task.date}</span>
      <div class="actions">
        <button onclick="toggleComplete(${task.id})">${task.completed ? 'Reabrir' : 'Completar'}</button>
        <button onclick="editTask(${task.id})">Editar</button>
        <button onclick="deleteTask(${task.id})">Eliminar</button>
      </div>
    `;

    if (task.completed) {
      completedTasksContainer.appendChild(taskEl);
    } else {
      inProgressTasksContainer.appendChild(taskEl);
    }
  });
}

// Marcar como completada/reabrir
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
    showNotification('Tarea actualizada', task.completed ? '¡Tarea completada!' : 'Tarea reabierta');
  }
}

// Editar tarea
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    editingTaskId = id;
    taskTitle.value = task.title;
    taskDescription.value = task.description;
    categoryInput.value = task.category;
    dueDate.value = task.date;
    taskInput.classList.add("show");
    addTaskBtn.textContent = 'Actualizar tarea';
  }
}

// Cancelar edición
function cancelEdit() {
  editingTaskId = null;
  clearForm();
  addTaskBtn.textContent = 'Añadir tarea';
}

// Eliminar tarea
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  updateStats();
  showNotification('Tarea eliminada', 'La tarea ha sido eliminada');
}

// Guardar en localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Cargar tareas desde localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    renderTasks();
  }
}

// Limpiar formulario
function clearForm() {
  taskTitle.value = '';
  taskDescription.value = '';
  categoryInput.value = '';
  dueDate.value = '';
}

// Filtros
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    currentFilter = this.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    renderTasks();
  });
});

// Estadísticas
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const inProgress = total - completed;
  document.getElementById("stats").textContent = `Total: ${total} | En progreso: ${inProgress} | Completadas: ${completed}`;
}

// Notificaciones
function showNotification(title, message, type = 'success') {
  notification.innerHTML = `<strong>${title}:</strong> ${message}`;
  notification.className = `show ${type}`;
  setTimeout(() => notification.className = '', 3000);
}

// Revisar fechas próximas
function checkUpcomingDeadlines() {
  const today = new Date().toISOString().split('T')[0];
  tasks.forEach(task => {
    if (!task.completed && task.date === today) {
      showNotification('Recordatorio', `La tarea "${task.title}" vence hoy`, 'warning');
    }
  });
}

// Iniciar
init();
