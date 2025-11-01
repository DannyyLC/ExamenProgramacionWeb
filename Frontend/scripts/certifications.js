// ============================================
// Certifications Page - Lógica
// ============================================

// Estado global de la página
let usuarioCertificaciones = [];
let usuarioPagos = [];

/**
 * Obtener información del usuario desde el backend
 * Incluye certificaciones completadas y pagos realizados
 */
async function obtenerInfoUsuario() {
    try {
        // Endpoint que retorna información del usuario
        const response = await peticionAPI('/usuario/info', 'GET');
        
        if (response.ok && response.data) {
            const userData = response.data;
            
            // Guardar las certificaciones completadas (lista de IDs)
            usuarioCertificaciones = userData.certificacionesCompletadas || [];
            
            // Guardar los pagos realizados (lista de IDs)
            usuarioPagos = userData.pagosRealizados || [];
            
            console.log('Usuario Info:', {
                certificacionesCompletadas: usuarioCertificaciones,
                pagosRealizados: usuarioPagos
            });
            
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('Error al obtener info del usuario:', error);
        
        // En desarrollo, simular respuesta
        console.log('Modo desarrollo: Simulando datos de usuario');
        usuarioCertificaciones = []; // IDs de certificaciones completadas
        usuarioPagos = []; // IDs de pagos realizados
        
        return true;
    }
}

/**
 * Verificar si el usuario ya completó una certificación
 */
function yaCompleto(certId) {
    return usuarioCertificaciones.includes(certId);
}

/**
 * Verificar si el usuario ya pagó una certificación
 */
function yaPago(certId) {
    return usuarioPagos.includes(certId);
}

/**
 * Renderizar las tarjetas de certificaciones
 */
function renderizarCertificaciones() {
    const grid = document.getElementById('certificationsGrid');
    const loadingState = document.getElementById('loadingState');
    
    // Limpiar el grid
    grid.innerHTML = '';
    
    // Obtener las certificaciones de CONFIG
    const certificaciones = CONFIG.CERTIFICACIONES;
    
    // Crear una tarjeta por cada certificación
    Object.values(certificaciones).forEach(cert => {
        const card = crearTarjetaCertificacion(cert);
        grid.appendChild(card);
    });
    
    // Ocultar loading y mostrar grid
    loadingState.style.display = 'none';
    grid.style.display = 'grid';
}

/**
 * Crear HTML de una tarjeta de certificación
 */
function crearTarjetaCertificacion(cert) {
    const card = document.createElement('div');
    card.className = `cert-card ${!cert.disponible ? 'disabled' : ''}`;
    card.id = cert.id;
    
    const completada = yaCompleto(cert.id);
    const pagada = yaPago(cert.id);
    
    // Determinar el badge
    let badge = '';
    if (completada) {
        badge = '<span class="cert-badge completed">Completada</span>';
    } else if (cert.disponible) {
        badge = '<span class="cert-badge available">Disponible</span>';
    } else {
        badge = '<span class="cert-badge coming-soon">Próximamente</span>';
    }
    
    // Crear HTML
    card.innerHTML = `
        <div class="cert-card-header">
            <div class="cert-card-top">
                <h2 class="cert-card-title">${cert.nombre}</h2>
                ${badge}
            </div>
            <div class="cert-language">
                <span class="cert-language-icon">${cert.lenguaje.substring(0, 2).toUpperCase()}</span>
                <span>Certificación en ${cert.lenguaje}</span>
            </div>
        </div>
        
        <div class="cert-card-body">
            <p class="cert-description">${cert.descripcion}</p>
            
            <div>
                <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 12px;">Ventajas de esta certificación:</h3>
                <ul class="cert-advantages">
                    ${cert.ventajas.map(ventaja => `<li>${ventaja}</li>`).join('')}
                </ul>
            </div>
            
            <div class="cert-info-grid">
                <div class="cert-info-item">
                    <span class="cert-info-label">Puntuación Mínima</span>
                    <span class="cert-info-value">${cert.puntuacionMinima}%</span>
                </div>
                <div class="cert-info-item">
                    <span class="cert-info-label">Tiempo de Examen</span>
                    <span class="cert-info-value">${cert.tiempoExamen} min</span>
                </div>
                <div class="cert-info-item">
                    <span class="cert-info-label">Costo</span>
                    <span class="cert-info-value">$${cert.costo.toLocaleString('es-MX')} MXN</span>
                </div>
                <div class="cert-info-item">
                    <span class="cert-info-label">Nivel</span>
                    <span class="cert-info-value">${cert.nivel}</span>
                </div>
            </div>
        </div>
        
        <div class="cert-card-footer">
            ${crearBotonesCertificacion(cert, completada, pagada)}
        </div>
    `;
    
    // Agregar event listeners después de crear el elemento
    setTimeout(() => {
        agregarEventListeners(cert.id, completada, pagada, cert.disponible);
    }, 0);
    
    return card;
}

/**
 * Crear los botones apropiados según el estado de la certificación
 */
function crearBotonesCertificacion(cert, completada, pagada) {
    const logueado = estaLogueado();
    
    // Si ya completó el examen
    if (completada) {
        return `
            <div class="completed-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Certificación Completada
            </div>
            <a href="results.html?id=${cert.id}" class="view-certificate-btn">
                Ver Resultados
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </a>
        `;
    }
    
    // Si no está disponible
    if (!cert.disponible) {
        return `
            <button class="btn-cert btn-pay" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                Pagar Certificación
            </button>
            <button class="btn-cert btn-start" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Iniciar Examen
            </button>
        `;
    }
    
    // Si está disponible
    let botonPago = '';
    if (pagada) {
        botonPago = `
            <button class="btn-cert btn-pay paid" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Pagado
            </button>
        `;
    } else {
        botonPago = `
            <button class="btn-cert btn-pay" id="btn-pay-${cert.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                </svg>
                Pagar $${cert.costo.toLocaleString('es-MX')}
            </button>
        `;
    }
    
    // Botón de iniciar examen
    const puedeIniciar = logueado && pagada;
    let botonExamen = '';
    
    if (!logueado) {
        botonExamen = `
            <button class="btn-cert btn-start" id="btn-start-${cert.id}" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Inicia Sesión
            </button>
        `;
    } else if (!pagada) {
        botonExamen = `
            <button class="btn-cert btn-start" id="btn-start-${cert.id}" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Realiza el Pago
            </button>
        `;
    } else {
        botonExamen = `
            <button class="btn-cert btn-start" id="btn-start-${cert.id}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Iniciar Examen
            </button>
        `;
    }
    
    return botonPago + botonExamen;
}

/**
 * Agregar event listeners a los botones
 */
function agregarEventListeners(certId, completada, pagada, disponible) {
    if (!disponible || completada) return;
    
    // Botón de pago
    const btnPay = document.getElementById(`btn-pay-${certId}`);
    if (btnPay && !pagada) {
        btnPay.addEventListener('click', () => manejarPago(certId));
    }
    
    // Botón de iniciar examen
    const btnStart = document.getElementById(`btn-start-${certId}`);
    if (btnStart) {
        btnStart.addEventListener('click', () => manejarInicioExamen(certId));
    }
}

/**
 * Manejar el pago de una certificación (simulado)
 */
async function manejarPago(certId) {
    const cert = CONFIG.CERTIFICACIONES[certId];
    
    // Verificar que el usuario esté logueado
    if (!estaLogueado()) {
        Swal.fire({
            icon: 'warning',
            title: 'Inicia Sesión',
            text: 'Debes iniciar sesión para pagar una certificación',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    // Verificar si ya pagó
    if (yaPago(certId)) {
        Swal.fire({
            icon: 'info',
            title: 'Ya Pagado',
            text: 'Ya has pagado esta certificación',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    // Confirmar pago
    const result = await Swal.fire({
        icon: 'question',
        title: 'Confirmar Pago',
        html: `
            <p>Estás a punto de pagar la certificación:</p>
            <h3 style="color: #3b82f6; margin: 16px 0;">${cert.nombre}</h3>
            <p style="font-size: 1.5rem; font-weight: bold; color: #10b981;">$${cert.costo.toLocaleString('es-MX')} MXN</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Pagar Ahora',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#e5e5e5',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280'
    });
    
    if (!result.isConfirmed) return;
    
    try {
        // TODO: Hacer petición al backend para registrar el pago
        // const response = await peticionAPI('/certificaciones/pagar', 'POST', { certificacionId: certId });
        
        // Simular pago exitoso
        usuarioPagos.push(certId);
        
        await Swal.fire({
            icon: 'success',
            title: '¡Pago Exitoso!',
            text: 'Ahora puedes iniciar tu examen de certificación',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#10b981'
        });
        
        // Re-renderizar las certificaciones
        renderizarCertificaciones();
        
    } catch (error) {
        console.error('Error al procesar pago:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error en el Pago',
            text: 'Hubo un problema al procesar tu pago. Intenta de nuevo.',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#ef4444'
        });
    }
}

/**
 * Manejar el inicio del examen
 */
async function manejarInicioExamen(certId) {
    const cert = CONFIG.CERTIFICACIONES[certId];
    
    // Verificar que el usuario esté logueado
    if (!estaLogueado()) {
        Swal.fire({
            icon: 'warning',
            title: 'Inicia Sesión',
            text: 'Debes iniciar sesión para realizar el examen',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    // Verificar que haya pagado
    if (!yaPago(certId)) {
        Swal.fire({
            icon: 'warning',
            title: 'Pago Requerido',
            text: 'Debes pagar la certificación antes de iniciar el examen',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#f59e0b'
        });
        return;
    }
    
    // Verificar si ya completó el examen
    if (yaCompleto(certId)) {
        Swal.fire({
            icon: 'info',
            title: 'Examen Completado',
            text: 'El examen solo se puede aplicar una vez',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#3b82f6'
        });
        return;
    }
    
    // Confirmar inicio
    const result = await Swal.fire({
        icon: 'info',
        title: 'Iniciar Examen',
        html: `
            <p>Estás a punto de iniciar el examen de:</p>
            <h3 style="color: #3b82f6; margin: 16px 0;">${cert.nombre}</h3>
            <div style="text-align: left; margin: 20px 0; padding: 16px; background: #1c1c1c; border-radius: 8px;">
                <p style="margin: 8px 0;">⏱️ <strong>Duración:</strong> ${cert.tiempoExamen} minutos</p>
                <p style="margin: 8px 0;">📝 <strong>Preguntas:</strong> ${cert.totalPreguntas}</p>
                <p style="margin: 8px 0;">✅ <strong>Para aprobar:</strong> ${cert.puntuacionMinima}%</p>
            </div>
            <p style="color: #f59e0b; font-weight: 600;">⚠️ Solo puedes aplicar este examen UNA vez</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Comenzar Examen',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#e5e5e5',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280'
    });
    
    if (result.isConfirmed) {
        // Redirigir a la página del examen con el ID
        window.location.href = `exam.html?id=${certId}`;
    }
}

/**
 * Inicialización de la página
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Página de certificaciones cargada');
    
    // Obtener información del usuario si está logueado
    if (estaLogueado()) {
        await obtenerInfoUsuario();
    }
    
    // Renderizar las certificaciones
    renderizarCertificaciones();
});
