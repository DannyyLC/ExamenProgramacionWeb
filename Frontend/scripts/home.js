// ============================================
// Home Page - Lógica Principal
// ============================================

// Verificar estado de autorización del usuario
async function verificarAutorizacion() {
    try {
        // TODO: El endpoint aún no está definido, pero dejamos la estructura
        // const endpoint = '/auth/verify'; // Endpoint a definir en el backend
        
        const token = obtenerToken();
        
        if (!token) {
            console.log('Usuario no autenticado - No hay token');
            return;
        }
        
        console.log('Token encontrado:', token);
        
        // Cuando el endpoint esté listo, descomentar esto:
        /*
        const respuesta = await peticionAPI(endpoint, 'GET');
        
        if (respuesta.ok) {
            console.log('Usuario autorizado:', respuesta.data);
            // Aquí puedes actualizar la UI si es necesario
        } else {
            console.log('Token inválido o expirado');
            // Opcional: cerrar sesión si el token no es válido
            // cerrarSesion();
        }
        */
        
    } catch (error) {
        console.error('Error al verificar autorización:', error);
    }
}

// Mostrar mensaje de bienvenida personalizado si el usuario está logueado
function mostrarMensajeBienvenida() {
    const usuario = obtenerUsuario();
    
    if (usuario && estaLogueado()) {
        console.log(`Bienvenido de nuevo, ${usuario.nombreCompleto || usuario.username}!`);
        
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            const nombre = usuario.nombreCompleto?.split(' ')[0] || usuario.username;
            heroTitle.innerHTML = `¡Hola ${nombre}! <br>Certifica tu Futuro Tecnológico`;
        }
    }
}

// Agregar animaciones suaves al scroll
function inicializarAnimaciones() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar todas las tarjetas
    const cards = document.querySelectorAll('.feature-card, .tech-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Agregar efecto hover suave a las estadísticas
function inicializarEstadisticas() {
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const number = this.querySelector('.stat-number');
            number.style.transform = 'scale(1.1)';
            number.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            const number = this.querySelector('.stat-number');
            number.style.transform = 'scale(1)';
        });
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page cargada');
    
    // Verificar autorización al entrar a la página
    verificarAutorizacion();
    
    // Mostrar mensaje de bienvenida personalizado
    mostrarMensajeBienvenida();
    
    // Inicializar animaciones
    inicializarAnimaciones();
    
    // Inicializar estadísticas
    inicializarEstadisticas();
    
    // Log para debug
    console.log('Estado de autenticación:', {
        estaLogueado: estaLogueado(),
        token: obtenerToken() ? 'Presente' : 'No presente',
        usuario: obtenerUsuario()
    });
});
