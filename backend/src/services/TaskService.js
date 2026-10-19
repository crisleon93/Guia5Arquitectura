/**
 * Capa de Servicios — TaskService
 *
 * Responsabilidad única: reglas de negocio de las tareas.
 * No sabe nada de HTTP (sin statusCode en los errores),
 * ni de cómo se almacenan los datos.
 *
 * El repositorio se inyecta por constructor (Inyección de Dependencias),
 * lo que permite sustituirlo sin tocar la lógica de negocio.
 */
const VALID_STATUSES = ["pendiente", "en progreso", "finalizada"];

class TaskService {
  constructor(repository) {
    this.repository = repository;
  }

  listTasks() {
    return this.repository.findAll();
  }

  createTask({ title, description = "" }) {
    if (typeof title !== "string" || title.trim().length < 3) {
      throw new Error("El título debe tener al menos 3 caracteres.");
    }
    return this.repository.create({
      title: title.trim(),
      description: String(description).trim(),
      status: "pendiente",
    });
  }

  changeStatus(id, status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error(`Estado inválido. Use: ${VALID_STATUSES.join(", ")}.`);
    }
    const updated = this.repository.updateStatus(id, status);
    if (!updated) {
      throw new Error("No existe una tarea con ese identificador.");
    }
    return updated;
  }
}

module.exports = { TaskService };
