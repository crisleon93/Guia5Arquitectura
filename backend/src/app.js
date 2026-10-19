/**
 * Composición de la aplicación Express (app.js)
 *
 * Responsabilidad única: ensamblar todas las capas mediante
 * Inyección de Dependencias y registrar el middleware global.
 *
 * Al separarlo de server.js, la aplicación puede importarse en
 * pruebas sin levantar un puerto real.
 */
const express = require("express");
const cors = require("cors");

const { TaskRepository } = require("./repositories/TaskRepository");
const { TaskService }    = require("./services/TaskService");
const { createTaskController } = require("./controllers/TaskController");
const { createTaskRoutes }     = require("./routes/taskRoutes");

// Datos de semilla — separados del repositorio para no mezclar
// inicialización de prueba con la lógica de persistencia.
const SEED_TASKS = [
  { id: 1, title: "Analizar el proyecto base",  description: "Identificar responsabilidades", status: "en progreso" },
  { id: 2, title: "Diseñar la arquitectura",     description: "Proponer módulos",             status: "pendiente"   },
];

function buildApp() {
  const app = express();

  // Middleware global
  app.use(cors());
  app.use(express.json());

  // Composición de capas (Inyección de Dependencias manual)
  const repository  = new TaskRepository(SEED_TASKS);
  const service     = new TaskService(repository);
  const controller  = createTaskController(service);

  // Rutas
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/tasks", createTaskRoutes(controller));

  // Manejador global de errores
  app.use((error, req, res, next) => { // eslint-disable-line no-unused-vars
    res.status(error.statusCode || 500).json({
      error: error.message || "Error interno del servidor",
    });
  });

  return app;
}

module.exports = { buildApp };
