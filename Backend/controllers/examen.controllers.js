const path = require('path');
const { generarConstanciaPDF } = require('../utils/pdfGenerator');
const users = require("../models/users.json");
const exams = require("../models/exams.json");

exports.comprarExamen = (req, res) => {
    const { examenId } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ error: "Falta el ID del usuario." });
    }
    if (!examenId) {
        return res.status(400).json({ error: "Falta el ID del examen." });
    }

    const user = users.find(u => u.username === userId);

    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }
    if (user.comprados.includes(examenId)) {
        return res.status(400).json({ error: "Examen ya comprado." });
    }

    if (!exams[examenId]) {
        return res.status(404).json({ error: "Examen no encontrado." });
    }

    user.comprados.push(examenId);
    return res.status(200).json({ mensaje: "Examen comprado con éxito." });
    };

exports.infoExamenes = (req, res) => {
    const examenes = JSON.parse(JSON.stringify(exams));
    const { userId } = req;
    const user = users.find(u => u.username === userId);
    const examen = user.intentos.find(i => i.examenId === "cert-001");

    if (examenes["cert-001"] && examenes["cert-001"].preguntas) {
        delete examenes["cert-001"].preguntas;
        if (examen && examen.calificacion >= examenes["cert-001"].puntuacionMinima) {
            examenes["cert-001"].aprobado = true;
        }else {
            examenes["cert-001"].aprobado = false;
        }
    }

    return res.status(200).json({ examenes });
}

exports.obtenerExamen = (req, res) => {
    const { userId, examenId } = req;
    const user = users.find(u => u.username === userId);
    const examen = exams[examenId];

    if (!examen) {
        return res.status(404).json({ error: "Examen no encontrado." });
    }
    
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Verificar que el usuario haya comprado el examen
    if (!user.comprados.includes(examenId)) {
        return res.status(403).json({ error: "Debes comprar este examen primero." });
    }

    // Verificar si ya aprobó el examen
    const intento = user.intentos.find(i => i.examenId === examenId);
    if (intento &&  intento.calificacion >= examen.puntuacionMinima) {
        return res.status(400).json({ error: 'El examen ya ha sido aprobado.' });
    }

    let preguntas = [...examen.preguntas];
    preguntas = preguntas.sort(() => Math.random() - 0.5).slice(0, 8);

    preguntas = preguntas.map(p => ({
        ...p,
        opciones: [...p.opciones].sort(() => Math.random() - 0.5)
    }));

    const examenData = {
        id: examen.id,
        nombre: examen.nombre,
        lenguaje: examen.lenguaje,
        puntuacionMinima: examen.puntuacionMinima,
        tiempoExamen: examen.tiempoExamen,
        totalPreguntas: examen.totalPreguntas,
        preguntas: preguntas
    };

    return res.status(200).json({ examenData });
}

exports.registrarIntento = (req, res) => {
    const { calificacion, tiempo } = req.body;
    const { userId, examenId } = req;

    if (!examenId || !userId || calificacion === undefined || tiempo === undefined) {
        return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    const examen = exams[examenId];
    if (!examen) {
        return res.status(404).json({ error: "Examen no encontrado." });
    }

    const user = users.find(u => u.username === userId);
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const nuevoIntento = {
        examenId: examenId,
        calificacion: calificacion,
        tiempo: tiempo,
        fecha: new Date().toISOString()
    };

    const idx = user.intentos.findIndex(i => i.examenId === examenId);
    if (idx !== -1) {
        if (user.intentos[idx].calificacion >= examen.puntuacionMinima) {
            return res.status(400).json({ mensaje: "El examen ya ha sido aprobado." });
        }
        user.intentos[idx] = nuevoIntento;
    } else {
        user.intentos.push(nuevoIntento);
    }
    
    user.comprados = [];

    return res.status(200).json({ mensaje: "Intento registrado con éxito." });
}

exports.generarConstancia = async (req, res) => {
    const { userId, examenId } = req;
    const user = users.find(u => u.username === userId);
    const examen = exams[examenId];

    if (!user || !examen) {
        return res.status(404).json({ error: 'Usuario o examen no encontrado.' });
    }

    const intento = user.intentos.find(i => i.examenId === examenId);
    if (!intento) {
        return res.status(404).json({ error: 'No se encontró un intento para este examen.' });
    }

    const fecha = new Date(intento.fecha).toLocaleDateString('es-MX');
    const ciudad = 'Aguascalientes';
    const nombreInstructor = 'Carlos González Quintanar';
    const firmaInstructorPath = path.join(__dirname, '../images/Firma_Harriet.png');
    const nombreCEO = 'Daniel Limón Cervantes';
    const firmaCEOPath = path.join(__dirname, '../images/firmaDaniel.png');
    const logoPath = path.join(__dirname, '../images/UniOne.png');
    const outputPath = path.join(__dirname, `../certificados/constancia_${userId}_${examenId}.pdf`);

    try {
        await generarConstanciaPDF({
            nombreUsuario: user.nombreCompleto,
            nombreCertificacion: examen.nombre,
            fecha,
            ciudad,
            nombreInstructor,
            firmaInstructorPath,
            nombreCEO,
            firmaCEOPath,
            logoPath,
            outputPath
        });
        res.download(outputPath);
    } catch (err) {
        res.status(500).json({ error: 'Error al generar el PDF', detalle: err.message });
    }
};

exports.obtenerIntentos = (req, res) => {
    const { userId } = req;
    const user = users.find(u => u.username === userId);
    return res.status(200).json({ intentos: user.intentos });
};