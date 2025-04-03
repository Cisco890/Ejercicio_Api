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

// creamos una ruta 'principal' 
app.get('/', (req, res) => {
    let html = `
    <h1>Api Incidentes</h1>
    <p>Bienvenido a la Api para gestionar los incidentes</p>`;

    res.send(html); 
}
);

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
        return res.status(400).json({ error: 'Son requeridos: reporter, description' });
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