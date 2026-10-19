/**
 * Capa de UI — taskUI.js
 *
 * Responsabilidad única: renderizado del DOM.
 * No realiza llamadas de red ni contiene lógica de negocio.
 */
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char])
  );

function renderTasks(container, tasks) {
  if (!tasks.length) {
    container.innerHTML = "<p>No hay tareas todavía. Crea la primera.</p>";
    return;
  }
  container.innerHTML = tasks
    .map(
      (task) => `
    <article class="task">
      <div class="task-top">
        <div>
          <h3>${escapeHtml(task.title)}</h3>
          <p>${escapeHtml(task.description || "Sin descripción")}</p>
        </div>
        <strong>#${task.id}</strong>
      </div>
      <div class="task-actions">
        <label for="status-${task.id}">Estado</label>
        <select id="status-${task.id}" data-task-id="${task.id}">
          ${["pendiente", "en progreso", "finalizada"]
            .map(
              (status) =>
                `<option ${task.status === status ? "selected" : ""}>${status}</option>`
            )
            .join("")}
        </select>
        <button type="button" class="secondary" data-save-id="${task.id}">Guardar estado</button>
      </div>
    </article>`
    )
    .join("");
}

function showApiConnected(statusEl) {
  statusEl.textContent = "API conectada";
  statusEl.style.background = "";
  statusEl.style.color = "";
}

function showApiError(statusEl, container, errorMessage) {
  statusEl.textContent = "API no disponible";
  statusEl.style.background = "#fde8e8";
  statusEl.style.color = "#9b2222";
  container.innerHTML = `<p>${escapeHtml(errorMessage)}. Verifica que el backend esté iniciado.</p>`;
}

function showFormMessage(messageEl, text, isError = false) {
  messageEl.style.color = isError ? "#a12b2b" : "#17663a";
  messageEl.textContent = text;
}
