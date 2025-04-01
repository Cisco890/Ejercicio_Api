const express = require('express') ; 

const app = express() ; //hacemos una instancia de express 
const port = 2400;  // le indicamos un puerto 

app.use(express.json()); //le decimos a express que vamos a usar json

//confirmamos que el servidor esta corriendo
app.listen(port, () => {
    console.log('Server is running'); 
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
app.get('/incidents', (req, res) => {
    res.send(incidents);
});

// se hace un post para los incidentes
app.post('/incidents', (req, res) => {
    const { reporter, description } = req.body;

    if (!reporter || !description) {// si el incidente que se quiere agregar no tiene uno de estos campos, da error. 
        return res.status(400).json({ error: 'Son requeridos: reporter, description' });
    }

    const newIncident = {// la "estructura" de los incidentes
        id: incidents.length + 1,
        reporter,
        description,
        status: "pendiente",
        created_at: new Date().toISOString()
    };

    incidents.push(newIncident); // push a los incidentes

    res.status(201).json({
        message: 'Nuevo incidente creado con éxito',// mensaje de confirmación de la creación de los incidentes 
        incident: newIncident
    });
});

//Se obtienen los incidentes por medio del id
app.get('/incidents/:id', (req, res) => {
    const id = parseInt(req.params.id); 

    const incident = incidents.find(inc => inc.id === id); // se busca por el id

    if (!incident) {
        return res.status(404).json({ error: 'Incidente no encontrado' });// si el id no existe se muestra este mensaje
    }

    res.json(incident); 
});

// se hace el put para modificar el status de los incidentes
app.put('/incidents/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const validStatuses = ["pendiente", "en proceso", "resuelto"];

    // Validar si el nuevo status es válido
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            error: 'El estado debe ser: pendiente, en proceso, resuelto'
        });
    }

    // se busca por el id
    const incident = incidents.find(inc => inc.id === id);

    if (!incident) {
        return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    // Actualizar el status
    incident.status = status;

    res.json({
        message: 'Estado del incidente actualizado con éxito',
        incident
    });
});

const incidents = [// incidentes guardados 
    {
        id: 1,
        reporter: "Lucía Fernández",
        description: "La computadora se reinicia sola constantemente.",
        status: "pendiente",
        created_at: "2025-03-27T09:15:00Z"
    },
    {
        id: 2,
        reporter: "Carlos Méndez",
        description: "Las luces del pasillo no encienden.",
        status: "en proceso",
        created_at: "2025-03-27T10:45:00Z"
    },
    {
        id: 3,
        reporter: "Ana López",
        description: "El software de contabilidad no abre correctamente.",
        status: "resuelto",
        created_at: "2025-03-26T16:20:00Z"
    },
    {
        id: 4,
        reporter: "Diego Ramírez",
        description: "Problemas con el acceso a la red WiFi.",
        status: "pendiente",
        created_at: "2025-03-25T13:00:00Z"
    }
];
