import { getCurrentToken } from './firebase';

const API_BASE_URL = 'http://localhost:8080'; // Cambia esto por la URL de tu backend

const apiClient = {
  async fetch(endpoint, options = {}) {
    try {
      // Obtener el token de autenticación
      let token = null;
      try {
        token = await getCurrentToken();
      } catch (error) {
        console.log('No hay token de autenticación disponible');
      }

      // Agregar headers
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Agregar header de autorización si hay token
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Realizar la petición
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Manejar errores de la API
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'Ocurrió un error desconocido',
        }));
        
        throw new Error(errorData.message || `Error HTTP ${response.status}`);
      }

      // Parsear respuesta JSON si el contenido existe
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json') && response.status !== 204) {
        return await response.json();
      }

      return null;
    } catch (error) {
      console.error('Falló la petición a la API:', error);
      throw error;
    }
  },

  // Métodos para diferentes verbos HTTP
  get(endpoint, options = {}) {
    return this.fetch(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, data, options = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.fetch(endpoint, { ...options, method: 'DELETE' });
  },
};

export default apiClient; 