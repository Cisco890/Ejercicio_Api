// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Define base URL for API
    const API_BASE_URL = 'http://localhost:3000';
    
    // Referencias a elementos DOM
    const createForm = document.getElementById('create-form');
    const searchButton = document.getElementById('search-button');
    const incidentsList = document.getElementById('incidents-list');
    const detailContainer = document.getElementById('incident-detail-container');
    
    // Almacenar incidentes
    let incidents = [];
    
    // Cargar incidentes al iniciar
    fetchIncidents();
    
    // Event listeners
    createForm.addEventListener('submit', createIncident);
    searchButton.addEventListener('click', searchIncident);
    
    // Función para mostrar mensajes
    function showMessage(text, isError = false) {
      const messageBox = document.getElementById('message');
      messageBox.textContent = text;
      messageBox.className = isError ? 'message error' : 'message success';
      messageBox.style.display = 'block';
      
      setTimeout(() => {
        messageBox.style.display = 'none';
      }, 3000);
    }
    
    // Función para obtener todos los incidentes
    function fetchIncidents() {
      fetch(`${API_BASE_URL}/incidents`)
        .then(response => {
          if (!response.ok) throw new Error('Error al cargar incidentes');
          return response.json();
        })
        .then(data => {
          incidents = data;
          renderIncidentsList();
        })
        .catch(error => {
          console.error('Error:', error);
          showMessage('Error al cargar los incidentes', true);
        });
    }
    
    // Renderizar lista de incidentes
    function renderIncidentsList() {
      incidentsList.innerHTML = '';
      
      if (incidents.length === 0) {
        incidentsList.innerHTML = '<p>No hay incidentes registrados</p>';
        return;
      }
      
      const table = document.createElement('table');
      table.innerHTML = `
        <thead>
          <tr>
            <th>ID</th>
            <th>Reportado por</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody></tbody>
      `;
      
      const tbody = table.querySelector('tbody');
      
      incidents.forEach(incident => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${incident.id}</td>
          <td>${incident.reporter}</td>
          <td>${formatStatus(incident.status)}</td>
          <td>${formatDate(incident.createdAt)}</td>
          <td>
            <button class="view-btn" data-id="${incident.id}">Ver</button>
          </td>
        `;
        tbody.appendChild(row);
      });
      
      incidentsList.appendChild(table);
      
      // Agregar eventos a los botones "Ver"
      document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          const incident = incidents.find(inc => inc.id === parseInt(id));
          if (incident) {
            showIncidentDetails(incident);
          }
        });
      });
    }
    
    // Función para mostrar detalles de un incidente
    function showIncidentDetails(incident) {
      detailContainer.style.display = 'block';
      
      const detailsDiv = document.getElementById('incident-details');
      detailsDiv.innerHTML = `
        <div class="detail-card">
          <p><strong>ID:</strong> ${incident.id}</p>
          <p><strong>Reportado por:</strong> ${incident.reporter}</p>
          <p><strong>Descripción:</strong> ${incident.description}</p>
          <p><strong>Estado:</strong> ${formatStatus(incident.status)}</p>
          <p><strong>Fecha:</strong> ${formatDate(incident.createdAt)}</p>
          
          <div class="actions">
            <div>
              <select id="status-select">
                <option value="pendiente" ${incident.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="en proceso" ${incident.status === 'en_proceso' ? 'selected' : ''}>En proceso</option>
                <option value="resuelto" ${incident.status === 'resuelto' ? 'selected' : ''}>Resuelto</option>
              </select>
              <button id="update-button" data-id="${incident.id}">Actualizar</button>
            </div>
            <button id="delete-button" data-id="${incident.id}">Eliminar</button>
            <button id="close-button">Cerrar</button>
          </div>
        </div>
      `;
      
      // Event listeners para los botones
      document.getElementById('update-button').addEventListener('click', updateIncidentStatus);
      document.getElementById('delete-button').addEventListener('click', deleteIncident);
      document.getElementById('close-button').addEventListener('click', () => {
        detailContainer.style.display = 'none';
      });
    }
    
    // Función para buscar incidente por ID
    function searchIncident() {
      const searchId = document.getElementById('search-input').value.trim();
      const resultContainer = document.getElementById('search-result');
      
      if (!searchId) {
        resultContainer.innerHTML = '<p class="error">Ingrese un ID válido</p>';
        return;
      }
      
      fetch(`${API_BASE_URL}/incidents/${searchId}`)
        .then(response => {
          if (!response.ok) throw new Error('Incidente no encontrado');
          return response.json();
        })
        .then(incident => {
          showIncidentDetails(incident);
          resultContainer.innerHTML = '';
        })
        .catch(error => {
          console.error('Error:', error);
          resultContainer.innerHTML = '<p class="error">Incidente no encontrado</p>';
        });
    }
    
    // Función para crear un nuevo incidente
    function createIncident(event) {
      event.preventDefault();
      
      const reporter = document.getElementById('reporter').value.trim();
      const description = document.getElementById('description').value.trim();
      
      if (description.length < 10) {
        showMessage('La descripción debe tener al menos 10 caracteres', true);
        return;
      }
      
      fetch(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporter, description }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al crear incidente');
          return response.json();
        })
        .then(data => {
          showMessage('Incidente creado con éxito');
          document.getElementById('reporter').value = '';
          document.getElementById('description').value = '';
          fetchIncidents();
        })
        .catch(error => {
          console.error('Error:', error);
          showMessage('Error al crear el incidente', true);
        });
    }
    
    // Función para actualizar el estado de un incidente
    function updateIncidentStatus(event) {
      const id = event.target.getAttribute('data-id');
      const status = document.getElementById('status-select').value;
      
      fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al actualizar');
          return response.json();
        })
        .then(data => {
          showMessage('Estado actualizado con éxito');
          fetchIncidents();
        })
        .catch(error => {
          console.error('Error:', error);
          showMessage('Error al actualizar el estado', true);
        });
    }
    
    // Función para eliminar un incidente
    function deleteIncident(event) {
      const id = event.target.getAttribute('data-id');
      
      if (!confirm('¿Está seguro que desea eliminar este incidente?')) {
        return;
      }
      
      fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) throw new Error('Error al eliminar');
          return response.json();
        })
        .then(data => {
          showMessage('Incidente eliminado con éxito');
          detailContainer.style.display = 'none';
          fetchIncidents();
        })
        .catch(error => {
          console.error('Error:', error);
          showMessage('Error al eliminar el incidente', true);
        });
    }
    
    // Funciones auxiliares para formateo
    function formatStatus(status) {
      const statusMap = {
        'pendiente': 'Pendiente',
        'en_proceso': 'En proceso',
        'resuelto': 'Resuelto'
      };
      return statusMap[status] || status;
    }
    
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  });