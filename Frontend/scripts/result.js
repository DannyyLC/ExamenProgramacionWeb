// ============================================
// Variables Globales
// ============================================
let certificacionId = null;
let resultadoId = null;
let resultadoData = null;
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
    
    // Obtener parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    certificacionId = urlParams.get('id');
    resultadoId = urlParams.get('resultadoId');
    
    if (!certificacionId) {
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se especificó la certificación',
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
    
    // Cargar resultados
    await cargarResultados();
});

// ============================================
// Cargar Resultados desde API (siempre desde backend)
// ============================================
async function cargarResultados() {
    try {
        // Obtener intentos del backend: la calificación se calcula en el backend
        const response = await peticionAPI(`/${certificacionId}/obtener_intentos`, 'GET');

        if (response.ok && response.intentos && response.intentos.length > 0) {
            // Si se proporcionó un resultado específico (resultadoId) intentar seleccionarlo,
            // si no, buscar el intento por examenId o usar el más reciente.
            let intento = null;
            if (resultadoId) {
                intento = response.intentos.find(i => i.id === resultadoId || i.resultadoId === resultadoId);
            }

            if (!intento) {
                intento = response.intentos.find(i => i.examenId === certificacionId) || response.intentos[0];
            }

            if (intento) {
                // El backend proporciona la calificación; no calcularla en el frontend
                const aprobado = intento.calificacion >= certificacionInfo.puntuacionMinima;

                resultadoData = {
                    puntuacion: intento.calificacion,
                    calificacion: intento.calificacion,
                    respuestasCorrectas: intento.respuestasCorrectas || intento.correctas || 0,
                    respuestasIncorrectas: (typeof intento.respuestasCorrectas === 'number') ? (preguntasLengthFallback() - intento.respuestasCorrectas) : undefined,
                    tiempoUtilizado: intento.tiempo || 0,
                    fecha: intento.fecha,
                    preguntas: intento.preguntas || null,
                    aprobado: aprobado
                };

                mostrarResultados();
            } else {
                throw new Error('No se encontraron resultados para esta certificación');
            }
        } else {
            throw new Error('No se encontraron resultados para esta certificación');
        }

    } catch (error) {
        console.error('Error al cargar resultados:', error);

        document.getElementById('resultsLoading').innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--color-danger);">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <p style="color: var(--color-danger);">No se encontraron resultados</p>
            <button onclick="window.location.href='certifications.html'" class="btn-action btn-secondary" style="margin-top: var(--spacing-md);">
                Volver a Certificaciones
            </button>
        `;
    }
}

// Helper: fallback para longitud de preguntas (si no está disponible en intento)
function preguntasLengthFallback() {
    // Preferir la lista de preguntas incluida en resultadoData si existe,
    // luego usar la configuración de la certificación, y como último recurso 8.
    if (resultadoData && Array.isArray(resultadoData.preguntas)) {
        return resultadoData.preguntas.length;
    }
    if (certificacionInfo && certificacionInfo.totalPreguntas) {
        return certificacionInfo.totalPreguntas;
    }
    return 8;
}

// ============================================
// Mostrar Resultados
// ============================================
function mostrarResultados() {
    // Ocultar loading y mostrar contenido
    document.getElementById('resultsLoading').style.display = 'none';
    document.getElementById('resultsContent').style.display = 'block';
    
    // Extraer datos (soportar múltiples formatos)
    const puntuacion = resultadoData.puntuacion || resultadoData.calificacion || 0;
    const aprobado = resultadoData.aprobado || puntuacion >= certificacionInfo.puntuacionMinima;
    const correctas = resultadoData.respuestasCorrectas || resultadoData.correctas || 0;
    const incorrectas = resultadoData.respuestasIncorrectas || resultadoData.incorrectas || (8 - correctas);
    const tiempoUtilizado = resultadoData.tiempoUtilizado || 0;
    
    // Actualizar título y subtítulo
    document.getElementById('resultsTitle').textContent = `Resultados: ${certificacionInfo.nombre}`;
    document.getElementById('resultsSubtitle').textContent = certificacionInfo.lenguaje;
    
    // Status Badge
    const statusBadge = document.getElementById('statusBadge');
    if (aprobado) {
        statusBadge.className = 'status-badge approved';
        statusBadge.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Aprobado
        `;
    } else {
        statusBadge.className = 'status-badge failed';
        statusBadge.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            No Aprobado
        `;
    }

    // Animar Score Circle
    animarScore(puntuacion, aprobado);

    // Label del score
    const scoreLabel = document.getElementById('scoreLabel');
    if (aprobado) {
        scoreLabel.textContent = '¡Felicitaciones! Has aprobado el examen';
        scoreLabel.style.color = 'var(--color-success)';
    } else {
        scoreLabel.textContent = 'No alcanzaste la puntuación mínima';
        scoreLabel.style.color = 'var(--color-danger)';
    }
    
    // Stats
    document.getElementById('correctAnswers').textContent = correctas;
    document.getElementById('incorrectAnswers').textContent = incorrectas;
    document.getElementById('timeUsed').textContent = formatearTiempo(tiempoUtilizado);
    document.getElementById('minScore').textContent = `${certificacionInfo.puntuacionMinima}%`;
    
    // Mensaje
    mostrarMensaje(aprobado, puntuacion);
    
    // Botones de acción
    if (aprobado) {
        document.getElementById('btnDownload').style.display = 'inline-flex';
        document.getElementById('btnDownload').onclick = descargarCertificado;
    } else {
        document.getElementById('btnRetry').style.display = 'inline-flex';
        document.getElementById('btnRetry').onclick = () => {
            window.location.href = `certifications.html`;
        };
    }
    
    // Si hay revisión detallada en la respuesta
    if (resultadoData.preguntas && Array.isArray(resultadoData.preguntas)) {
        mostrarRevisionDetallada(resultadoData.preguntas);
    }
}

// ============================================
// Animar Score Circle
// ============================================
function animarScore(puntuacion, aprobado) {
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreProgress = document.getElementById('scoreProgress');
    
    // Animar número
    let currentScore = 0;
    const increment = puntuacion / 50; // 50 frames
    const duration = 1500; // 1.5 segundos
    const frameTime = duration / 50;
    
    const scoreInterval = setInterval(() => {
        currentScore += increment;
        if (currentScore >= puntuacion) {
            currentScore = puntuacion;
            clearInterval(scoreInterval);
        }
        scoreNumber.textContent = Math.round(currentScore);
    }, frameTime);
    
    // Animar círculo
    const circumference = 2 * Math.PI * 90; // radio = 90
    const offset = circumference - (puntuacion / 100) * circumference;
    
    setTimeout(() => {
        scoreProgress.style.strokeDashoffset = offset;
        scoreProgress.classList.add(aprobado ? 'approved' : 'failed');
    }, 100);
}

// ============================================
// Mostrar Mensaje
// ============================================
function mostrarMensaje(aprobado, puntuacion) {
    const messageContainer = document.getElementById('resultsMessage');
    
    if (aprobado) {
        messageContainer.className = 'results-message success';
        messageContainer.innerHTML = `
            <div class="message-icon" style="color: var(--color-success);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h3 class="message-title">¡Felicitaciones por tu aprobación!</h3>
            <p class="message-text">
                Has demostrado tus conocimientos en ${certificacionInfo.lenguaje} con una puntuación de ${puntuacion}%. 
                Tu certificado está disponible para descargar en formato PDF. Puedes volver a esta página en cualquier momento 
                para descargar tu certificado nuevamente.
            </p>
        `;
    } else {
        messageContainer.className = 'results-message error';
        const puntosNecesarios = certificacionInfo.puntuacionMinima - puntuacion;
        messageContainer.innerHTML = `
            <div class="message-icon" style="color: var(--color-danger);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <h3 class="message-title">No alcanzaste la puntuación mínima</h3>
            <p class="message-text">
                Obtuviste ${puntuacion}% pero necesitas al menos ${certificacionInfo.puntuacionMinima}% para aprobar 
                (te faltaron ${puntosNecesarios.toFixed(1)} puntos). Te recomendamos estudiar más y volver a intentarlo. 
                ¡No te desanimes, puedes lograrlo!
            </p>
        `;
    }
}

// ============================================
// Mostrar Revisión Detallada
// ============================================
function mostrarRevisionDetallada(preguntas) {
    const detailedResults = document.getElementById('detailedResults');
    const questionsReview = document.getElementById('questionsReview');
    
    detailedResults.style.display = 'block';
    questionsReview.innerHTML = '';
    
    preguntas.forEach((pregunta, index) => {
        const isCorrect = pregunta.correcta || pregunta.esCorrecta;
        
        const reviewItem = document.createElement('div');
        reviewItem.className = `question-review-item ${isCorrect ? 'correct' : 'incorrect'}`;
        
        const letras = ['A', 'B', 'C', 'D'];
        const respuestaUsuario = pregunta.respuestaUsuario !== undefined ? 
            letras[pregunta.respuestaUsuario] : 'Sin respuesta';
        const respuestaCorrecta = pregunta.respuestaCorrecta !== undefined ? 
            letras[pregunta.respuestaCorrecta] : 'N/A';
        
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="review-number">Pregunta ${index + 1}</span>
                <span class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✓ Correcta' : '✗ Incorrecta'}
                </span>
            </div>
            <p class="review-question">${pregunta.pregunta || pregunta.texto}</p>
            <div class="review-answer">
                <strong>Tu respuesta:</strong> ${respuestaUsuario}
                ${!isCorrect ? `<br><strong>Respuesta correcta:</strong> ${respuestaCorrecta}` : ''}
            </div>
        `;
        
        questionsReview.appendChild(reviewItem);
    });
}

// ============================================
// Descargar Certificado PDF
// ============================================
async function descargarCertificado() {
    // Mostrar loading (usar mismo esquema oscuro que en otras alertas)
    Swal.fire({
        title: 'Generando certificado...',
        text: 'Por favor espera',
        allowOutsideClick: false,
        allowEscapeKey: false,
        background: '#1a1a1a',
        color: '#e5e5e5',
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    // Llamar al backend: POST /api/:examenId/generar_constancia
    const response = await peticionAPI(`/${certificacionId}/generar_constancia`, 'POST', null, true);
    
    if (response.ok && response.esArchivo) {
        // Obtener el blob del PDF
        const blob = response.data;
        
        // Crear nombre del archivo
        const usuario = obtenerUsuario();
        const nombreArchivo = `Constancia_${certificacionInfo.lenguaje}_${usuario.username || 'usuario'}.pdf`;
        
        // Descargar el archivo
        descargarArchivo(blob, nombreArchivo);
        
        // Cerrar loading
        Swal.close();
        
        // Mostrar éxito
        await Swal.fire({
            icon: 'success',
            title: '¡Descarga Exitosa!',
            text: 'Tu certificado ha sido descargado correctamente',
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonColor: '#10b981',
            timer: 2000,
            showConfirmButton: false
        });
    } else {
        // Error al generar certificado
        console.error('Error al descargar certificado:', response);
        
        const mensaje = response.error || response.mensaje || 'No se pudo descargar el certificado. Por favor, intenta de nuevo.';
        
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje,
            background: '#1a1a1a',
            color: '#e5e5e5',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#ef4444'
        });
    }
}

// ============================================
// Utilidades
// ============================================
function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
}
