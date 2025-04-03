Esta API REST 
---
Está desarrollada con **Node.js**, **Express**, **Prisma ORM** y **PostgreSQL**. Permite realizar operaciones para crear, leer, actualizar y eliminar reportes de incidentes. 
Para ver el html explicando los Enpoints debes de correr http://localhost:3000/ en tu navegador
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

![Image](https://github.com/user-attachments/assets/7fc04f59-2752-40dd-9e94-63d4f6d42428)
Ejemplo de get/incidentes

![Image](https://github.com/user-attachments/assets/7ef1f8d8-d1e5-4365-977f-dd03eda3239b)
Ejemplo de post/incidents

### 📍 `/incidents/:id`

| Método | Descripción                                 |
|--------|---------------------------------------------|
| GET    | Obtener un incidente específico por ID      |
| PUT    | Actualizar el estado de un incidente        |
| DELETE | Eliminar un incidente                       |

![Image](https://github.com/user-attachments/assets/8b324d49-c2bb-484a-9334-709d2195d54d)
Ejemplo de get/incidents/:id

![Image](https://github.com/user-attachments/assets/acee02cc-39f0-408c-a237-d90d1a0a617c)
Ejemplo de put/incidents/:id

![Image](https://github.com/user-attachments/assets/ef360f62-2249-452f-a4c7-3b814e8152d4)
Ejemplo de delete/incidents/:id

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
