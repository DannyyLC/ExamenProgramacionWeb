// Manejar el envío del formulario de contacto

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.error('Formulario de contacto no encontrado');
        return;
    }
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener los valores del formulario
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            email: document.getElementById('email').value.trim(),
            asunto: document.getElementById('asunto').value.trim() || 'Sin asunto',
            mensaje: document.getElementById('mensaje').value.trim()
        };
        
        // Validaciones básicas
        if (!formData.nombre || !formData.email || !formData.mensaje) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor completa todos los campos obligatorios',
                background: '#1a1a1a',
                color: '#e5e5e5',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            Swal.fire({
                icon: 'error',
                title: 'Email inválido',
                text: 'Por favor ingresa un correo electrónico válido',
                background: '#1a1a1a',
                color: '#e5e5e5',
                confirmButtonColor: '#ef4444'
            });
            return;
        }
        
        // Deshabilitar el botón durante el envío
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spinner">
                <circle cx="12" cy="12" r="10"></circle>
            </svg>
            Enviando...
        `;
        
        try {
            // Hacer petición POST al backend
            const response = await peticionAPI('/contacto', 'POST', formData);
            
            if (response.ok) {
                // Guardar el mensaje en localStorage (solo el último)
                const mensajeConFecha = {
                    ...formData,
                    fecha: new Date().toISOString(),
                    fechaLegible: new Date().toLocaleString('es-MX')
                };
                localStorage.setItem('ultimoMensajeContacto', JSON.stringify(mensajeConFecha));
                
                // Mostrar mensaje de éxito
                await Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje Enviado!',
                    text: 'Gracias por contactarnos. Te responderemos pronto.',
                    background: '#1a1a1a',
                    color: '#e5e5e5',
                    confirmButtonColor: '#10b981'
                });
                
                // Limpiar el formulario
                contactForm.reset();
                
                // Log para verificar que se guardó en el backend
                console.log('Mensaje de contacto enviado y guardado:', mensajeConFecha);
                
            } else {
                throw new Error(response.error || response.mensaje || 'Error al enviar el mensaje');
            }
            
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            
            // Si falla, guardar en localStorage (solo el último)
            const mensajeConFecha = {
                ...formData,
                fecha: new Date().toISOString(),
                fechaLegible: new Date().toLocaleString('es-MX'),
                enviado: false // Marcar que no se envió al servidor
            };
            localStorage.setItem('ultimoMensajeContacto', JSON.stringify(mensajeConFecha));
            
            // Log en consola
            console.log('=== MENSAJE DE CONTACTO (Guardado Localmente) ===');
            console.log('Nombre:', formData.nombre);
            console.log('Email:', formData.email);
            console.log('Asunto:', formData.asunto);
            console.log('Mensaje:', formData.mensaje);
            console.log('Fecha:', mensajeConFecha.fechaLegible);
            console.log('================================================');
            
            // Mostrar alert de éxito
            await Swal.fire({
                icon: 'success',
                title: '¡Mensaje Recibido!',
                text: 'Gracias por contactarnos. Te responderemos pronto.',
                background: '#1a1a1a',
                color: '#e5e5e5',
                confirmButtonColor: '#10b981'
            });
            
            // Limpiar el formulario
            contactForm.reset();
        } finally {
            // Rehabilitar el botón
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
    
    // Agregar efectos visuales a los inputs
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// Agregar animación de spinner al botón de envío
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .spinner {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
