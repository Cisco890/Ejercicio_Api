Esta API REST 
---
Está desarrollada con **Node.js**, **Express**, **Prisma ORM** y **PostgreSQL**. Permite realizar operaciones para crear, leer, actualizar y eliminar reportes de incidentes. 
## ✅ Prerrequisitos

Antes de ejecutar esta API, asegurate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

## ⚙️ Instalación y configuración

1. **Clonar el repositorio**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**

   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   DATABASE_URL="URL de la base de datos de PostgreSQL"
   ```
   Se puede utilizar https://aiven.io/ para crear una base de datos en linea

4. **Inicializar Prisma y aplicar migraciones**
   ```bash
   npx prisma generate
   npx prisma migrate dev 
   ```

5. **Iniciar el servidor**
   ```bash
   npm start
   ```

---

## 🔁 Endpoints disponibles

### 📍 `/incidents`

| Método | Descripción                        |
|--------|------------------------------------|
| GET    | Obtener todos los incidentes       |
| POST   | Crear un nuevo incidente           |

![alt text]([image.png](https://github.com/Cisco890/imagenesapi/blob/6a7c298b018f72bc58501e4aea09cb9ac6014c09/Screenshot%202025-04-03%20120158.png))
Ejemplo de get/incidentes

### 📍 `/incidents/:id`

| Método | Descripción                                 |
|--------|---------------------------------------------|
| GET    | Obtener un incidente específico por ID      |
| PUT    | Actualizar el estado de un incidente        |
| DELETE | Eliminar un incidente                       |

---

## 📌 Campos del modelo de incidente

| Campo       | Tipo       | Descripción                                  |
|-------------|------------|----------------------------------------------|
| id          | Int        | Identificador único (autoincremental)        |
| reporter    | String     | Nombre de quien reporta el incidente         |
| description | String     | Detalles del problema (mínimo 10 caracteres) |
| status      | Enum       | Estado: `pendiente`, `en_proceso`, `resuelto`|
| createdAt   | DateTime   | Fecha y hora de creación automática           |

---
