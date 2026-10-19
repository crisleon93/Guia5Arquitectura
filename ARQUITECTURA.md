# Documento de Estructura Arquitectónica
**Guía 05 — Arquitectura y Organización del Software**  
SENA · ADSO · Octubre 2026

---

## 1. Análisis del Proyecto Base — Violaciones Identificadas

El proyecto original tenía todos los archivos del backend en un único directorio plano (`src/`), lo que generaba las siguientes violaciones al principio de **Separación de Responsabilidades**:

| # | Archivo original | Violación |
|---|-----------------|-----------|
| 1 | `server.js` | Mezclaba composición de dependencias (instanciar capas) con configuración de infraestructura HTTP (puertos, middleware, rutas, errores globales). |
| 2 | `taskRepository.js` | Los datos de semilla (`new Task(...)`) estaban hardcodeados dentro del constructor, mezclando inicialización de prueba con la lógica de persistencia. |
| 3 | `taskService.js` | Asignaba códigos HTTP (`statusCode`) en los errores de dominio. La capa de negocio no debe conocer el protocolo de transporte. |
| 4 | Estructura plana `src/` | Sin separación física por capas; todos los archivos coexistían al mismo nivel sin indicar su rol arquitectónico. |
| 5 | `frontend/src/app.js` | Un único archivo mezclaba llamadas HTTP, lógica de renderizado DOM y manejadores de eventos. |

---

## 2. Estructura Refactorizada

Se aplicó **Arquitectura por Capas** con **Inyección de Dependencias** manual.

```
Guia5Arquitectura/
│
├── backend/
│   └── src/
│       ├── domain/
│       │   └── Task.js               ← Entidad de dominio (solo atributos)
│       ├── repositories/
│       │   └── TaskRepository.js     ← Acceso y persistencia en memoria
│       ├── services/
│       │   └── TaskService.js        ← Reglas de negocio
│       ├── controllers/
│       │   └── TaskController.js     ← Traducción HTTP ↔ Servicio
│       ├── routes/
│       │   └── taskRoutes.js         ← Mapeo de rutas Express
│       ├── app.js                    ← Composición (Inyección de Dependencias)
│       └── server.js                 ← Punto de entrada (solo levanta el puerto)
│
└── frontend/
    ├── index.html
    ├── styles.css
    └── src/
        ├── api/
        │   └── taskApi.js            ← Comunicación con el backend
        ├── ui/
        │   └── taskUI.js             ← Renderizado del DOM
        └── app.js                    ← Orquestador de eventos
```

---

## 3. Diagrama de Capas

```
┌──────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  ┌──────────┐    ┌──────────┐    ┌───────────────┐  │
│  │ taskApi  │───▶│  app.js  │◀───│   taskUI      │  │
│  │ (Red)    │    │(Eventos) │    │   (DOM)        │  │
│  └──────────┘    └──────────┘    └───────────────┘  │
└──────────────────────────┬───────────────────────────┘
                           │ HTTP
┌──────────────────────────▼───────────────────────────┐
│                    BACKEND                           │
│                                                      │
│  server.js  →  app.js (Composición DI)               │
│                  │                                   │
│         ┌────────▼────────┐                          │
│         │    routes/      │  ← Mapeo HTTP            │
│         └────────┬────────┘                          │
│         ┌────────▼────────┐                          │
│         │  controllers/   │  ← HTTP ↔ Servicio       │
│         └────────┬────────┘                          │
│         ┌────────▼────────┐                          │
│         │   services/     │  ← Reglas de negocio     │
│         └────────┬────────┘                          │
│         ┌────────▼────────┐                          │
│         │ repositories/   │  ← Persistencia          │
│         └────────┬────────┘                          │
│         ┌────────▼────────┐                          │
│         │    domain/      │  ← Entidades             │
│         └─────────────────┘                          │
└──────────────────────────────────────────────────────┘
```

---

## 4. Mejoras de Calidad Obtenidas

### Reducción del acoplamiento
- Cada capa solo conoce la capa inmediatamente inferior (dependencia unidireccional).
- La **Inyección de Dependencias** en `app.js` permite sustituir el repositorio (ej. cambiar de memoria a una BD real) sin tocar servicios ni controladores.

### Aumento de la cohesión
| Capa | Hace solo una cosa |
|------|--------------------|
| `domain/Task.js` | Representa la estructura de una tarea |
| `repositories/` | Almacena y recupera tareas |
| `services/` | Aplica las reglas de negocio |
| `controllers/` | Traduce HTTP ↔ Servicio |
| `routes/` | Declara los endpoints |
| `app.js` | Ensambla las capas |
| `server.js` | Arranca el servidor |

### Cumplimiento de estándares
- **SRP** (Single Responsibility Principle): cada módulo tiene una única razón para cambiar.
- **DIP** (Dependency Inversion Principle): los servicios dependen de abstracciones (repositorio inyectado), no de implementaciones concretas.
- El servicio puede probarse de forma unitaria inyectando un repositorio mock sin necesidad de levantar Express ni una base de datos.

---

## 5. Referencias
- Martin, R. C. (2017). *Clean Architecture*. Prentice Hall.
- Fowler, M. (2018). *Refactoring* (2nd ed.). Addison-Wesley.
- IEEE Std 730-2014. *IEEE Standard for Software Quality Assurance Processes*.
