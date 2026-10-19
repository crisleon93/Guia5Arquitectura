/**
 * Capa de API — taskApi.js
 *
 * Responsabilidad única: comunicación con el backend.
 * No conoce el DOM ni la lógica de presentación.
 */
const API_URL = "http://localhost:3000/api/tasks";

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "No se pudo completar la operación.");
  return data;
}

async function fetchTasks() {
  return apiFetch(API_URL);
}

async function createTask(title, description) {
  return apiFetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ title, description }),
  });
}

async function updateTaskStatus(id, status) {
  return apiFetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
