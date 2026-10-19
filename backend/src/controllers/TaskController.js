/**
 * Capa de Controladores — TaskController
 *
 * Responsabilidad única: traducir peticiones HTTP en llamadas al
 * servicio y convertir los resultados/errores en respuestas HTTP.
 *
 * Aquí sí se asignan códigos de estado HTTP; el servicio solo
 * lanza errores de dominio sin conocer el protocolo.
 */

// Mapa de mensajes de error de dominio → código HTTP correspondiente
const HTTP_STATUS_BY_MESSAGE = {
  "El título debe tener al menos 3 caracteres.": 400,
  "Estado inválido": 400,
  "No existe una tarea con ese identificador.": 404,
};

function resolveHttpStatus(error) {
  for (const [fragment, code] of Object.entries(HTTP_STATUS_BY_MESSAGE)) {
    if (error.message.startsWith(fragment)) return code;
  }
  return 500;
}

function createTaskController(service) {
  return {
    list(req, res, next) {
      try {
        res.json(service.listTasks());
      } catch (error) {
        next(error);
      }
    },

    create(req, res, next) {
      try {
        const task = service.createTask(req.body || {});
        res.status(201).json(task);
      } catch (error) {
        error.statusCode = resolveHttpStatus(error);
        next(error);
      }
    },

    updateStatus(req, res, next) {
      try {
        const task = service.changeStatus(req.params.id, req.body?.status);
        res.json(task);
      } catch (error) {
        error.statusCode = resolveHttpStatus(error);
        next(error);
      }
    },
  };
}

module.exports = { createTaskController };
