/**
 * Capa de Dominio — Entidad Task
 *
 * Responsabilidad única: representar una tarea con sus atributos y ninguna
 * dependencia hacia frameworks, HTTP ni bases de datos.
 */
class Task {
  constructor({ id, title, description = "", status = "pendiente" }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.createdAt = new Date().toISOString();
  }
}

module.exports = { Task };
