// ============================================
// Variables Globales
// ============================================
let certificacionId = null;
let preguntas = [];
let respuestasUsuario = {};
let preguntaActual = 0;
let tiempoRestante = 0; // en segundos
let timerInterval = null;
let certificacionInfo = null;

// ============================================
// Inicialización
// ============================================
document.addEventListener('DOMContentLoaded', async function() {
    // Proteger la página - requiere login
    if (!estaLogueado()) {
        window.location.href = '../pages/login.html';
        return;
    }
    
    // Obtener ID de la certificación desde URL
    const urlParams = new URLSearchParams(window.location.search);
    certificacionId = urlParams.get('id');
    
    if (!certificacionId) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se especificó la certificación para el examen',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonText: 'Volver',
            confirmButtonColor: '#ef4444'
        });
        window.location.href = '../pages/certifications.html';
        return;
    }
    
    // Obtener información de la certificación
    certificacionInfo = CONFIG.CERTIFICACIONES[certificacionId];
    
    if (!certificacionInfo) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Certificación no encontrada',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonText: 'Volver',
            confirmButtonColor: '#ef4444'
        });
        window.location.href = '../pages/certifications.html';
        return;
    }
    
    // Actualizar título
    document.getElementById('examTitle').textContent = `Examen: ${certificacionInfo.nombre}`;
    document.getElementById('examSubtitle').textContent = `${certificacionInfo.totalPreguntas} preguntas • ${certificacionInfo.tiempoExamen} minutos • Puntuación mínima: ${certificacionInfo.puntuacionMinima}%`;
    
    // Confirmar inicio del examen
    const confirmar = await Swal.fire({
        icon: 'warning',
        title: '¿Iniciar Examen?',
        html: `
            <p>Estás a punto de iniciar el examen de <strong>${certificacionInfo.lenguaje}</strong>.</p>
            <p>Una vez iniciado, el tiempo comenzará a correr y no podrás pausar el examen.</p>
            <p><strong>Tiempo disponible:</strong> ${certificacionInfo.tiempoExamen} minutos</p>
        `,
        showCancelButton: true,
        confirmButtonText: 'Iniciar Examen',
        cancelButtonText: 'Cancelar',
        background: '#1a1a1a',
        color: '#e5e5e5',
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#6b7280'
    });
    
    if (!confirmar.isConfirmed) {
        window.location.href = '../pages/certifications.html';
        return;
    }
    
    // Cargar preguntas del examen
    await cargarPreguntas();
});

// ============================================
// Cargar Preguntas desde API
// ============================================
async function cargarPreguntas() {
    // Llamar al backend: GET /api/:examenId
    const response = await peticionAPI(`/${certificacionId}`, 'GET');
    
    if (response.ok && response.examenData) {
        const examenData = response.examenData;
        preguntas = examenData.preguntas;
        
        // Validar que haya 8 preguntas
        if (preguntas.length !== 8) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El examen debe tener exactamente 8 preguntas',
                background: '#1a1a1a',
                color: '#e5e5e5',
                confirmButtonText: 'Volver',
                confirmButtonColor: '#ef4444'
            });
            window.location.href = 'certifications.html';
            return;
        }
        
        // Mapear las preguntas al formato que esperamos
        preguntas = preguntas.map((p, index) => ({
            numero: p.numero || (index + 1),
            pregunta: p.pregunta,
            opciones: p.opciones,
            respuestaCorrecta: p.respuestaCorrecta // Guardamos para verificar al final
        }));
        
        // Inicializar respuestas
        preguntas.forEach((pregunta, index) => {
            respuestasUsuario[index] = null;
        });
        
        // Iniciar timer
        tiempoRestante = certificacionInfo.tiempoExamen * 60; // convertir a segundos
        iniciarTimer();
        
        // Ocultar loading y mostrar primera pregunta
        document.getElementById('examLoading').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'block';
        document.getElementById('examNavigation').style.display = 'flex';
        
        // Renderizar dots de navegación
        renderizarQuestionDots();
        
        // Mostrar primera pregunta
        mostrarPregunta(0);
        
    } else {
        // Error al cargar el examen
        console.error('Error al cargar preguntas:', response);
        
        let mensaje = response.error || response.mensaje || 'No se pudieron cargar las preguntas del examen. Por favor, intenta de nuevo.';
        let titulo = 'Error';
        let icono = 'error';
        
        // Si el error es 403, significa que no ha comprado el examen
        if (response.status === 403) {
            titulo = 'Acceso Denegado';
            mensaje = 'Debes comprar este examen antes de poder realizarlo.';
            icono = 'warning';
        }
        
        await Swal.fire({
            icon: icono,
            title: titulo,
            text: mensaje,
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonText: 'Volver',
            confirmButtonColor: '#ef4444'
        });
        window.location.href = 'certifications.html';
    }
}

// ============================================
// Timer del Examen
// ============================================
function iniciarTimer() {
    actualizarDisplayTimer();
    
    timerInterval = setInterval(() => {
        tiempoRestante--;
        actualizarDisplayTimer();
        
        // Cambiar color cuando quede poco tiempo
        const timerElement = document.getElementById('examTimer');
        if (tiempoRestante <= 300) { // 5 minutos
            timerElement.classList.add('danger');
        } else if (tiempoRestante <= 600) { // 10 minutos
            timerElement.classList.add('warning');
        }
        
        // Cuando se acabe el tiempo
        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            finalizarExamenAutomatico();
        }
    }, 1000);
}

function actualizarDisplayTimer() {
    const minutos = Math.floor(tiempoRestante / 60);
    const segundos = tiempoRestante % 60;
    const display = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;
}

async function finalizarExamenAutomatico() {
    await Swal.fire({
        icon: 'warning',
        title: 'Tiempo Agotado',
        text: 'El tiempo del examen ha terminado. Se enviará tu examen automáticamente.',
        background: '#1a1a1a',
        color: '#e5e5e5',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#f59e0b'
    });
    
    enviarRespuestas();
}

// ============================================
// Mostrar Pregunta
// ============================================
function mostrarPregunta(index) {
    preguntaActual = index;
    const pregunta = preguntas[index];
    
    // Actualizar header de la pregunta
    document.getElementById('questionNumber').textContent = `Pregunta ${index + 1}`;
    const puntosPorPregunta = (100 / preguntas.length).toFixed(1);
    document.getElementById('questionPoints').textContent = `Puntos: ${puntosPorPregunta}`;
    
    // Actualizar texto de la pregunta
    document.getElementById('questionText').textContent = pregunta.pregunta;
    
    // Renderizar opciones
    const optionsContainer = document.getElementById('questionOptions');
    optionsContainer.innerHTML = '';
    
    const letras = ['A', 'B', 'C', 'D'];
    pregunta.opciones.forEach((opcion, opcionIndex) => {
        const isSelected = respuestasUsuario[index] === opcionIndex;
        
        const optionDiv = document.createElement('div');
        optionDiv.className = `option-item ${isSelected ? 'selected' : ''}`;
        optionDiv.onclick = () => seleccionarOpcion(index, opcionIndex);
        
        optionDiv.innerHTML = `
            <input type="radio" name="pregunta_${index}" value="${opcionIndex}" ${isSelected ? 'checked' : ''}>
            <div class="option-radio"></div>
            <label class="option-label">
                <span class="option-letter">${letras[opcionIndex]}.</span>
                <span class="option-text">${opcion}</span>
            </label>
        `;
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // Actualizar barra de progreso
    const progreso = ((index + 1) / preguntas.length) * 100;
    document.getElementById('progressFill').style.width = `${progreso}%`;
    document.getElementById('progressText').textContent = `Pregunta ${index + 1} de ${preguntas.length}`;
    
    // Actualizar botones de navegación
    document.getElementById('btnPrevious').disabled = index === 0;
    
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (index === preguntas.length - 1) {
        btnNext.style.display = 'none';
        btnSubmit.style.display = 'block';
    } else {
        btnNext.style.display = 'flex';
        btnSubmit.style.display = 'none';
    }
    
    // Actualizar dots
    actualizarQuestionDots();
}

// ============================================
// Seleccionar Opción
// ============================================
function seleccionarOpcion(preguntaIndex, opcionIndex) {
    respuestasUsuario[preguntaIndex] = opcionIndex;
    mostrarPregunta(preguntaIndex);
}

// ============================================
// Navegación entre Preguntas
// ============================================
document.getElementById('btnPrevious')?.addEventListener('click', () => {
    if (preguntaActual > 0) {
        mostrarPregunta(preguntaActual - 1);
    }
});

document.getElementById('btnNext')?.addEventListener('click', () => {
    if (preguntaActual < preguntas.length - 1) {
        mostrarPregunta(preguntaActual + 1);
    }
});

// ============================================
// Question Dots (Navegación Visual)
// ============================================
function renderizarQuestionDots() {
    const container = document.getElementById('questionDots');
    container.innerHTML = '';
    
    preguntas.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'question-dot';
        dot.onclick = () => mostrarPregunta(index);
        dot.title = `Pregunta ${index + 1}`;
        container.appendChild(dot);
    });
}

function actualizarQuestionDots() {
    const dots = document.querySelectorAll('.question-dot');
    dots.forEach((dot, index) => {
        dot.classList.remove('current', 'answered');
        
        if (index === preguntaActual) {
            dot.classList.add('current');
        }
        
        if (respuestasUsuario[index] !== null) {
            dot.classList.add('answered');
        }
    });
}

// ============================================
// Finalizar y Enviar Examen
// ============================================
document.getElementById('btnSubmit')?.addEventListener('click', async () => {
    // Verificar preguntas sin responder
    const sinResponder = Object.values(respuestasUsuario).filter(r => r === null).length;
    
    if (sinResponder > 0) {
        const confirmar = await Swal.fire({
            icon: 'warning',
            title: 'Preguntas sin responder',
            text: `Tienes ${sinResponder} pregunta(s) sin responder. ¿Deseas enviar el examen de todas formas?`,
            showCancelButton: true,
            confirmButtonText: 'Enviar de todas formas',
            cancelButtonText: 'Revisar',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280'
        });
        
        if (!confirmar.isConfirmed) {
            return;
        }
    } else {
        const confirmar = await Swal.fire({
            icon: 'question',
            title: '¿Finalizar Examen?',
            text: 'Una vez enviado, no podrás cambiar tus respuestas.',
            showCancelButton: true,
            confirmButtonText: 'Finalizar Examen',
            cancelButtonText: 'Revisar',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#6b7280'
        });
        
        if (!confirmar.isConfirmed) {
            return;
        }
    }
    
    enviarRespuestas();
});

// ============================================
// Enviar Respuestas al Backend
// ============================================
async function enviarRespuestas() {
    // Detener timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Mostrar loading
    Swal.fire({
        title: 'Procesando examen...',
        text: 'Por favor espera mientras calculamos tu calificación',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Calcular calificación en el frontend
    let respuestasCorrectas = 0;
    
    preguntas.forEach((pregunta, index) => {
        const respuestaUsuario = respuestasUsuario[index];
        if (respuestaUsuario !== null) {
            const opcionSeleccionada = pregunta.opciones[respuestaUsuario];
            if (opcionSeleccionada === pregunta.respuestaCorrecta) {
                respuestasCorrectas++;
            }
        }
    });
    
    // Calcular calificación (porcentaje)
    const calificacion = Math.round((respuestasCorrectas / preguntas.length) * 100);
    const aprobado = calificacion >= certificacionInfo.puntuacionMinima;
    
    // Calcular tiempo utilizado (en segundos)
    const tiempoTotal = certificacionInfo.tiempoExamen * 60; // tiempo total en segundos
    const tiempoUtilizado = tiempoTotal - tiempoRestante; // tiempo que se usó
    
    // Registrar intento en el backend: POST /api/:examenId/registrar_intento
    // El backend automáticamente:
    // - Mantiene el examen en la lista de comprados si aprueba
    // - Remueve el examen de la lista de comprados si no aprueba
    const response = await peticionAPI(`/${certificacionId}/registrar_intento`, 'POST', {
        calificacion: calificacion,
        tiempo: tiempoUtilizado // tiempo en segundos
    });
    
    if (response.ok) {
        // Cerrar loading
        Swal.close();
        
        // Redirigir directamente a resultados con la calificación
        window.location.href = `results.html?id=${certificacionId}&calificacion=${calificacion}&correctas=${respuestasCorrectas}&tiempo=${tiempoUtilizado}`;
    } else {
        // Error al registrar el intento
        console.error('Error al enviar respuestas:', response);
        
        const mensaje = response.error || response.mensaje || 'Hubo un problema al procesar tu examen. Por favor, contacta al soporte.';
        
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#ef4444'
        });
        
        // No reiniciar timer, llevar a certificaciones
        window.location.href = 'certifications.html';
    }
}

// ============================================
// Nota: Se removieron las prevenciones de salida para mejor UX
// ============================================
