const contactModel = require("../models/contacto.json");

exports.registrarContacto = (req, res) => {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ error: "Faltan datos del contacto." });
    }

    const nuevoContacto = {
        id: contactModel.length + 1,
        nombre,
        email,
        mensaje
    };

    contactModel.push(nuevoContacto);
    console.log(contactModel);
    return res.status(201).json({ mensaje: "Contacto registrado con éxito.", contacto: nuevoContacto });
};
