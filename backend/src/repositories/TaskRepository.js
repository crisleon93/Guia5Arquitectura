/**
 * Capa de Repositorio — TaskRepository
 *
 * Responsabilidad única: persistencia en memoria de las tareas.
 * No conoce reglas de negocio ni HTTP.
 *
 * Los datos de semilla se inyectan desde fuera (app.js) para no
 * mezclar inicialización de datos con la lógica de almacenamiento.
 */
const { Task } = require("../domain/Task");

class TaskRepository {
  constructor(seedTasks = []) {
    this.tasks = seedTasks.map(data => new Task(data));
    this.nextId = seedTasks.length
      ? Math.max(...seedTasks.map(t => t.id)) + 1
      : 1;
  }

  findAll() {
    return [...this.tasks];
  }

  create(data) {
    const task = new Task({ ...data, id: this.nextId++ });
    this.tasks.push(task);
    return task;
  }

  findById(id) {
    return this.tasks.find(task => task.id === Number(id)) || null;
  }

  updateStatus(id, status) {
    const task = this.findById(id);
    if (!task) return null;
    task.status = status;
    return task;
  }
}

module.exports = { TaskRepository };
