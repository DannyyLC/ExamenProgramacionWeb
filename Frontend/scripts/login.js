// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Si el usuario ya está logueado, redirigir a home (index)
    if (estaLogueado()) {
        window.location.href = '../index.html';
        return;
    }
    
    // Obtener elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    
    // Manejar el envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener valores
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Validar que los campos no estén vacíos
        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, ingresa tu usuario y contraseña',
                background: '#1a1a1a',
                color: '#e5e5e5',
                confirmButtonColor: '#3b82f6'
            });
            return;
        }
        
        // Deshabilitar el botón y mostrar loading
        loginButton.disabled = true;
        loginButton.innerHTML = '<span class="loader"></span> Iniciando sesión...';
        
        try {
            // Hacer petición POST al backend usando peticionAPI
            const response = await peticionAPI('/login', 'POST', {
                username: username,
                password: password
            });
            
            // Si la respuesta es exitosa
            if (response.ok && response.data.token) {
                // Guardar token y datos del usuario
                guardarToken(response.data.token);
                guardarUsuario({
                    username: response.data.username || username,
                    nombreCompleto: response.data.nombreCompleto || username,
                    email: response.data.email || ''
                });
                
                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Acceso permitido',
                    background: '#1a1a1a',
                    color: '#e5e5e5',
                    confirmButtonColor: '#10b981',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                // Redirigir a home (index) después de un breve momento
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
                
            } else {
                // Error en las credenciales
                throw new Error(response.data.mensaje || 'Error en las credenciales');
            }
            
        } catch (error) {
            console.error('Error en login:', error);
            
            // Mostrar mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error de acceso',
                text: 'Usuario o contraseña incorrectos',
                background: '#1a1a1a',
                color: '#e5e5e5',
                confirmButtonColor: '#ef4444'
            });
            
            // Rehabilitar el botón
            loginButton.disabled = false;
            loginButton.textContent = 'Iniciar Sesión';
        }
    });
    
    // Efecto de focus en los inputs
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});
