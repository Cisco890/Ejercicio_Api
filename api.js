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

app.get('/incidents', (req, res) => {
    res.send(incidents);
});

app.post('/incidents', (req, res) => {
    const { reporter, description, status } = req.body;

    if (!reporter || !description || !status) {
        return res.status(400).json({ error: 'Son requeridos: reporter, description y status' });
    }

    const newIncident = {
        id: incidents.length + 1,
        reporter,
        description,
        status,
        created_at: new Date().toISOString()
    };

    incidents.push(newIncident); 

    res.status(201).json({
        message: 'Nuevo incidente creado con éxito',
        incident: newIncident
    });
});


const incidents = [
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
