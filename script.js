document.addEventListener("DOMContentLoaded", function() {
  const welcomeModal = document.getElementById("welcome-modal");
  const startBtn = document.getElementById("start-btn");
  const userNameInput = document.getElementById("user-name");
  const userGreeting = document.getElementById("user-greeting");
  const currentDate = document.getElementById("current-date");

  // Función para obtener la fecha actual
  function getCurrentDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('es-ES', options);
  }

  // Mostrar la fecha actual
  currentDate.textContent = getCurrentDate();

  // Mostrar el modal de bienvenida
  welcomeModal.style.display = "flex";

  // Al hacer clic en "Entrar"
  startBtn.addEventListener("click", function() {
    const userName = userNameInput.value.trim();
    if (userName) {
      userGreeting.textContent = userName;
      welcomeModal.style.display = "none";
    }
  });

  // Funcionalidad para agregar tareas
  const toggleInputsBtn = document.getElementById("toggle-inputs");
  const taskInput = document.querySelector(".task-input");
  const addTaskBtn = document.getElementById("add-task");
  const taskTitle = document.getElementById("task-title");
  const taskDescription = document.getElementById("task-description");
  const categoryInput = document.getElementById("category");
  const dueDate = document.getElementById("due-date");
  const inProgressTasksContainer = document.getElementById("in-progress-tasks");
  const completedTasksContainer = document.getElementById("completed-tasks");

  // Muestra u oculta los inputs al hacer clic en "Crear nueva tarea"
  toggleInputsBtn.addEventListener("click", function() {
    taskInput.classList.toggle("hidden");
  });

  // Agrega la tarea y luego oculta los inputs
  addTaskBtn.addEventListener("click", function() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const category = categoryInput.value;
    const date = dueDate.value;

    if (title && description && category && date) {
      const task = document.createElement("div");
      task.classList.add("task", "in-progress");
      task.innerHTML = `
        <div class="task-details">
          <h3>${title}</h3>
          <p>${description}</p>
          <p><strong>Fecha límite:</strong> ${date}</p>
          <p><strong>Categoría:</strong> ${category}</p>
        </div>
        <div class="icons">
          <button class="complete-task">✔</button>
          <button class="delete-task">❌</button>
        </div>
      `;

      // Cambiar color según categoría
      task.style.borderLeftColor = getCategoryColor(category);

      // Botón de completado
      const completeBtn = task.querySelector(".complete-task");
      completeBtn.addEventListener("click", function() {
        task.classList.toggle("completed");
        if (task.classList.contains("completed")) {
          task.querySelector(".icons").style.display = "none";
        }
        completedTasksContainer.appendChild(task);
      });

      // Botón de eliminar
      const deleteBtn = task.querySelector(".delete-task");
      deleteBtn.addEventListener("click", function() {
        task.remove();
      });

      // Añadir tarea a la lista de "En progreso"
      inProgressTasksContainer.appendChild(task);

      // Limpiar campos
      taskTitle.value = '';
      taskDescription.value = '';
      categoryInput.value = 'Urgente';
      dueDate.value = '';

      // Ocultar los inputs nuevamente
      taskInput.classList.add("hidden");
    }
  });

  // Función para obtener color según la categoría
  function getCategoryColor(category) {
    switch(category.toLowerCase()) {
      case "urgente":
        return "#f44336";
      case "normal":
        return "#ff9800";
      case "baja":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  }
});
