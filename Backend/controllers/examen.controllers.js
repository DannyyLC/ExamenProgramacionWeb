const path = require('path');
const { generarConstanciaPDF } = require('../utils/pdfGenerator');
const users = require("../models/users.json");
const exams = require("../models/exams.json");

exports.comprarExamen = (req, res) => {
    const { examenId } = req.body;
    const userID = req.userId;

    if (!userID) {
        return res.status(400).json({ error: "Falta el ID del usuario." });
    }
    if (!examenId) {
        return res.status(400).json({ error: "Falta el ID del examen." });
    }

    const user = users.find(u => u.id === userID);
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }
    if (user.examenesComprados.includes(examenId)) {
        return res.status(400).json({ error: "Examen ya comprado." });
    }

    if (!exams[examenId]) {
        return res.status(404).json({ error: "Examen no encontrado." });
    }

    user.examenesComprados.push(examenId);
    return res.status(200).json({ mensaje: "Examen comprado con éxito." });
    };

exports.infoExamenes = (req, res) => {
    const examenes = JSON.parse(JSON.stringify(exams));
    
    if (examenes["cert-001"] && examenes["cert-001"].preguntas) {
        delete examenes["cert-001"].preguntas;
    }

    return res.status(200).json({ examenes });
}

exports.obtenerExamen = (req, res) => {
   const { examenId } = req;

    const examen = exams[examenId];
    if (!examen) {
        return res.status(404).json({ error: "Examen no encontrado." });
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
    const { calificacion } = req.body;
    const { userID, examenId } = req;

    if (!examenId || !userID || calificacion === undefined) {
        return res.status(400).json({ error: "Faltan datos requeridos." });
    }

    const examen = exams[examenId];
    if (!examen) {
        return res.status(404).json({ error: "Examen no encontrado." });
    }

    const user = users.find(u => u.id === userID);
    if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const intento = {
        examenId: examenId,
        calificacion: calificacion,
        fecha: new Date().toISOString()
    }


    user.intentos.push(intento);
    return res.status(200).json({ mensaje: "Intento registrado con éxito." });
}

exports.generarConstancia = async (req, res) => {
    const { userID, examenId } = req;
    const user = users.find(u => u.id === userID);
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
    const firmaCEOPath = path.join(__dirname, '../images/Firma_Harriet.png');
    const logoPath = path.join(__dirname, '../images/UniOne.png');
    const outputPath = path.join(__dirname, `../certificados/constancia_${userID}_${examenId}.pdf`);

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