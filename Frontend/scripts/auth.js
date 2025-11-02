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
async function cerrarSesion() {
    try {
        // Intentar cerrar sesión en el backend
        await peticionAPI('/logout', 'POST');
    } catch (error) {
        console.error('Error al cerrar sesión en el backend:', error);
    }
    
    // Limpiar localStorage de todos modos
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    
    // Detectar si estamos en la raíz o en pages/
    const currentPath = window.location.pathname;
    const isInRoot = currentPath.endsWith('index.html') || currentPath.endsWith('/');
    
    // Redirigir al home (index.html)
    if (isInRoot) {
        window.location.href = 'index.html';
    } else {
        window.location.href = '../index.html';
    }
}

// ============================================
// Funciones para Obtener Información del Usuario desde Backend
// ============================================

/**
 * Obtener perfil completo del usuario desde el backend
 * Incluye la lista de exámenes comprados
 * @returns {Promise<Object>} Datos del usuario con exámenes comprados
 */
async function obtenerPerfilUsuario() {
    const response = await peticionAPI('/profile', 'GET');
    
    if (response.ok && response.usuario) {
        return {
            username: response.usuario.username,
            nombreCompleto: response.usuario.nombreCompleto,
            comprados: response.usuario.comprados || []
        };
    }
    
    console.error('Error al obtener perfil del usuario:', response.error || 'Error desconocido');
    return null;
}

// Proteger página - Redirigir al login si no está logueado
function protegerPagina() {
    if (!estaLogueado()) {
        window.location.href = 'login.html';
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
    
    // Si hay body y no es string, convertirlo
    if (body && typeof body !== 'string') {
        opciones.body = JSON.stringify(body);
    } else if (body) {
        opciones.body = body;
    }
    
    try {
        const response = await fetch(url, opciones);
        
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
            
            // Si el servidor responde con error (status 4xx o 5xx)
            if (!response.ok) {
                // Si es 401 (token inválido o expirado) y estamos autenticados
                if (response.status === 401 && obtenerToken()) {
                    console.warn('Token inválido o expirado, limpiando sesión...');
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    
                    // Si no estamos en login o home, redirigir
                    const currentPath = window.location.pathname;
                    const isInLogin = currentPath.includes('login.html');
                    const isInHome = currentPath.endsWith('index.html') || currentPath.endsWith('/');
                    
                    if (!isInLogin && !isInHome) {
                        // Esperar un poco para que otras operaciones terminen
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }
                }
                
                // Retornar la respuesta con ok: false y el mensaje de error
                return {
                    ok: false,
                    status: response.status,
                    error: data.error || data.mensaje || 'Error en la petición',
                    ...data
                };
            }
            
            // Respuesta exitosa
            return {
                ok: true,
                status: response.status,
                ...data // Incluir directamente las propiedades del objeto
            };
        }
        
    } catch (error) {
        console.error('Error en petición API:', error);
        // Retornar un objeto de error en lugar de lanzar excepción
        return {
            ok: false,
            status: 0,
            error: error.message || 'Error de conexión con el servidor'
        };
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