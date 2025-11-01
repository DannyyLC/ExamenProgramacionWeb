// ============================================
// Funciones de Autenticación y localStorage
// ============================================
// Guardar el token en localStorage
function guardarToken(token) {
    localStorage.setItem('token', token);
}
// Obtener el token del localStorage
function obtenerToken() {
    return localStorage.getItem('token');
}

// Verificar si hay un usuario logueado
function estaLogueado() {
    return localStorage.getItem('token') !== null;
}

// Guardar datos del usuario en localStorage
function guardarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
}
// Obtener datos del usuario del localStorage
function obtenerUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
}

// Cerrar sesión (eliminar todos los datos del localStorage)
function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '../index.html';
}

// Proteger página - Redirigir al login si no está logueado
function protegerPagina() {
    if (!estaLogueado()) {
        window.location.href = '../index.html';
    }
}

/**
 * Hacer petición al backend con el token
 * Maneja tanto JSON como archivos binarios (PDF, imágenes, etc.)
 * endpoint - Endpoint de la API (ej: '/login', '/examen/start')
 * method - Método HTTP (GET, POST, PUT, DELETE)
 * body - Datos a enviar (opcional)
 * esperaArchivo - Si esperas un archivo como respuesta (PDF, imagen, etc.)
 * returns Promesa con la respuesta
 */
async function peticionAPI(endpoint, method = 'GET', body = null, esperaArchivo = false) {
    const url = `${CONFIG.API_URL}${endpoint}`;
    
    const opciones = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    // Si hay token, agregarlo al header Authorization
    const token = obtenerToken();
    if (token) {
        opciones.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Si hay body, agregarlo
    if (body) {
        opciones.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, opciones);
        
        // Si el servidor responde con 401 (no autorizado), cerrar sesión
        if (response.status === 401) {
            cerrarSesion();
            return;
        }
        
        // Verificar el tipo de contenido de la respuesta
        const contentType = response.headers.get('content-type');
        
        // Si esperamos un archivo o el content-type es de un archivo
        if (esperaArchivo || contentType?.includes('application/pdf') || 
            contentType?.includes('application/octet-stream') ||
            contentType?.includes('image/')) {
            
            // Obtener el archivo como blob
            const blob = await response.blob();
            
            return {
                ok: response.ok,
                status: response.status,
                data: blob,
                contentType: contentType,
                esArchivo: true
            };
        } else {
            // Respuesta JSON normal
            const data = await response.json();
            
            return {
                ok: response.ok,
                status: response.status,
                data: data,
                esArchivo: false
            };
        }
        
    } catch (error) {
        console.error('Error en petición API:', error);
        throw error;
    }
}

/**
 * Descargar un archivo (PDF, imagen, etc.) desde un blob
 * blob - El archivo en formato blob
 * nombreArchivo - Nombre con el que se descargará el archivo
 */
function descargarArchivo(blob, nombreArchivo) {
    // Crear un enlace temporal
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}