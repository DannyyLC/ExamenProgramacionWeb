// ============================================
// Home Page - Lógica Principal
// ============================================
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

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Home page cargada');
    
    // Mostrar mensaje de bienvenida personalizado
    mostrarMensajeBienvenida();
    
    // Inicializar animaciones
    inicializarAnimaciones();
    
    // Log para debug
    console.log('Estado de autenticación:', {
        estaLogueado: estaLogueado(),
        token: obtenerToken() ? 'Presente' : 'No presente',
        usuario: obtenerUsuario()
    });
});
