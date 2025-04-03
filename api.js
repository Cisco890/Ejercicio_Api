// Juan Francisco Martínez 23617 --- API de Incidentes con Express js usando Prisma como ORM 
const express = require('express') ; 

const app = express() ; //hacemos una instancia de express 
const port = 3000;  // le indicamos un puerto 
const { PrismaClient } = require('@prisma/client')// se importa prisma
const prisma = new PrismaClient();// se configura prisma para poder ser utilizado 


app.use(express.json()); //le decimos a express que vamos a usar json

//confirmamos que el servidor esta corriendo
app.listen(port, () => {
    console.log('Server is running on port 3000'); 
});

// creamos una ruta 'principal' donde se pueden revisar los distintos endpoints de la API 
app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>API de Incidentes</title>
    </head>
    <body>
        <h1>API de Incidentes</h1>
        <p>Bienvenido a la API para gestionar los incidentes.</p>
        <p><strong>Endpoints disponibles:</strong></p>
        
        <h4><a href="/incidents">GET /incidents</a></h4>
        <p>Hace fetch de los incidentes almacenados en la base de datos</p>

        <h4><a href="/incidents/1">GET /incidents/:id</a> </h4>
        <p>Hace fetch de UN incidente en específico utilizando un id válido (revisar el get para saber que id's son válidos)</p>

        <h4>POST /incidents</h4>
        <p>Crea un incidente nuevo con los siguientes campos:</p>

        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
        <thead>
            <tr>
            <th>Campo</th>
            <th>Tipo</th>
            <th>Descripción</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td><code>id</code></td>
            <td>Int</td>
            <td>Generado automáticamente (autoincrement)</td>
            </tr>
            <tr>
            <td><code>reporter</code></td>
            <td>String</td>
            <td>Ingresado por el usuario</td>
            </tr>
            <tr>
            <td><code>description</code></td>
            <td>String</td>
            <td>Descripción del incidente, dada por el usuario</td>
            </tr>
            <tr>
            <td><code>status</code></td>
            <td>Enum (Status)</td>
            <td>Por defecto: <code>pendiente</code></td>
            </tr>
            <tr>
            <td><code>createdAt</code></td>
            <td>DateTime</td>
            <td>Generado automáticamente con la hora actual</td>
            </tr>
        </tbody>
        </table>
        <p>Ejemplo de uso: {
        "reporter": "Maria Gomez",
        "description": "impresora sin tinta"
        }
        </p>

        <h4>PUT /incidents/:id </h4>
        <p>Modifica el status de UN incidente en específico utilizando el id</p>
        <p>El status puede ser: "pendiente", "en_proceso", "resuelto" </p>

        <h4>DELETE /incidents/:id</h4>
        <p>Elimina UN incidente utilizando el id </p>
    </body>
    </html>
    `;

    res.send(html);
});



//Se obtienen los incidentes 
app.get('/incidents', async (req, res) => {
    try {
        const incidents = await prisma.incidents.findMany();// se llama prisma para conectar con la db

        res.json(incidents);// se devuelve como json 

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los incidentes' });
    }
});

// se hace un post para los incidentes
app.post('/incidents', async (req, res) => {
    const { reporter, description } = req.body;

    if (!reporter || !description) {
        return res.status(400).json({ error: 'Son requeridos: reporter, description' });// se pide que el reporter y description sean obligatorios
    }
    if (description.length < 10) {
        return res.status(400).json({ error: 'La descripción debe tener al menos 10 caracteres' });// se pide que la description tenga 10 caracteres
    }

    try {
        const newIncident = await prisma.incidents.create({// se llama prisma para conectar con la db
            data: {
                reporter,
                description,
                status: 'pendiente', 
               
            }
        });

        res.status(201).json({
            message: 'Nuevo incidente creado con éxito',
            incident: newIncident
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el incidente' });
    }
});


//Se obtienen los incidentes por medio del id
app.get('/incidents/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const incident = await prisma.incidents.findUnique({//se llama prisma para conectar con la db
            where: { id }// se indica que se busca por medio del id
        });

        if (!incident) {
            return res.status(404).json({ error: 'Incidente no encontrado' });// indica que el id no se  ha encontrado
        }

        res.json(incident);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el incidente' });
    }
});


// se hace el put para modificar el status de los incidentes
app.put('/incidents/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    let { status } = req.body;

    if (status === "en proceso") {// se hace esto para que coincida con el valor que establecimos al momento de crear la db 
        status = "en_proceso";
    }

    const validStatus = ["pendiente", "en_proceso", "resuelto"];// valida que sea uno de los status permitidos

    if (!validStatus.includes(status)) {
        return res.status(400).json({
            error: 'El estado debe ser: pendiente, en proceso, resuelto'// error si se ingresa otro tipo de status 
        });
    }

    try {
       
        const incident = await prisma.incidents.findUnique({// se llama a prisma para buscar incidentes
            where: { id }//se busca por medio del id
        });

        if (!incident) {
            return res.status(404).json({ error: 'Incidente no encontrado' });//error si no existe el incidente 
        }

        // se actualiza el status
        const updatedIncident = await prisma.incidents.update({// se llama a prisma para hacer el update
            where: { id },
            data: { status }
        });

        res.json({
            message: 'Estado del incidente actualizado con éxito',
            incident: updatedIncident
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el incidente' });
    }
});


// se hace un delete para eliminar el incidente
app.delete('/incidents/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        
        const incident = await prisma.incidents.findUnique({// se llama a prisma para buscar incidentes
            where: { id }//se busca por medio del id
        });

        if (!incident) {
            return res.status(404).json({ error: 'Incidente no encontrado' });//error si no existe el incidente
        }

        
        const deletedIncident = await prisma.incidents.delete({// se llama a prisma para eliminar el incidente deseado 
            where: { id }
        });

        res.json({
            message: 'Incidente eliminado correctamente',
            incident: deletedIncident
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el incidente' });
    }
});