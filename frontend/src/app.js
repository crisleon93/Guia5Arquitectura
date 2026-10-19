/**
 * Orquestador principal — app.js
 *
 * Responsabilidad única: conectar la capa de API con la capa de UI
 * registrando los manejadores de eventos del usuario.
 * No contiene lógica de negocio, llamadas de red directas ni HTML.
 */

// --- Referencias al DOM ---
const form          = document.querySelector("#task-form");
const titleInput    = document.querySelector("#title");
const descInput     = document.querySelector("#description");
const taskList      = document.querySelector("#task-list");
const messageEl     = document.querySelector("#message");
const apiStatusEl   = document.querySelector("#api-status");
const refreshButton = document.querySelector("#refresh");

// --- Carga y renderizado de tareas ---
async function loadTasks() {
  try {
    const tasks = await fetchTasks();
    renderTasks(taskList, tasks);
    showApiConnected(apiStatusEl);
  } catch (error) {
    showApiError(apiStatusEl, taskList, error.message);
  }
}

// --- Crear tarea ---
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  messageEl.textContent = "";
  try {
    await createTask(titleInput.value, descInput.value);
    form.reset();
    showFormMessage(messageEl, "Tarea creada correctamente.");
    await loadTasks();
  } catch (error) {
    showFormMessage(messageEl, error.message, true);
  }
});

// --- Actualizar estado ---
taskList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-save-id]");
  if (!button) return;
  const id     = button.dataset.saveId;
  const select = taskList.querySelector(`[data-task-id="${id}"]`);
  try {
    await updateTaskStatus(id, select.value);
    await loadTasks();
  } catch (error) {
    showFormMessage(messageEl, error.message, true);
  }
});

// --- Botón actualizar ---
refreshButton.addEventListener("click", loadTasks);

// --- Inicio ---
loadTasks();
