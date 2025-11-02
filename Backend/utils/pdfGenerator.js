const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Genera un PDF de constancia de acreditación de examen
 * @param {Object} options
 * @param {string} options.nombreUsuario - Nombre completo del usuario
 * @param {string} options.nombreCertificacion - Nombre de la certificación
 * @param {string} options.fecha - Fecha del examen
 * @param {string} options.ciudad - Ciudad
 * @param {string} options.nombreInstructor - Nombre del instructor
 * @param {string} options.firmaInstructorPath - Ruta de la imagen de la firma del instructor
 * @param {string} options.nombreCEO - Nombre del CEO
 * @param {string} options.firmaCEOPath - Ruta de la imagen de la firma del CEO
 * @param {string} options.logoPath - Ruta de la imagen del logo de la empresa
 * @param {string} options.outputPath - Ruta de salida del PDF
 * @returns {Promise<string>} Ruta del PDF generado
 */
function generarConstanciaPDF({
  nombreUsuario,
  nombreCertificacion,
  fecha,
  ciudad = 'Aguascalientes',
  nombreInstructor,
  firmaInstructorPath,
  nombreCEO,
  firmaCEOPath,
  logoPath,
  outputPath
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Logo
    if (logoPath) {
      doc.image(logoPath, 50, 40, { width: 100 });
    }

    // Título
    doc
      .fontSize(24)
      .text('CONSTANCIA DE ACREDITACIÓN', { align: 'center', underline: true });

    doc.moveDown(2);

    // Datos principales
    doc.fontSize(16).text(`Por la presente se certifica que:`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(nombreUsuario, { align: 'center', bold: true });
    doc.moveDown();
    doc.fontSize(16).text(`Ha acreditado satisfactoriamente el examen:`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(nombreCertificacion, { align: 'center', bold: true });
    doc.moveDown(2);

    doc.fontSize(14).text(`Fecha de acreditación: ${fecha}`, { align: 'center' });
    doc.text(`Ciudad: ${ciudad}`, { align: 'center' });
    doc.text(`Compañía: UniOne`, { align: 'center' });
    doc.moveDown(2);

    // Firmas
    doc.fontSize(14).text('Instructor:', 100, 500);
    doc.fontSize(14).text(nombreInstructor, 100, 520);
    if (firmaInstructorPath) {
      doc.image(firmaInstructorPath, 100, 540, { width: 100 });
    }

    doc.fontSize(14).text('CEO:', 350, 500);
    doc.fontSize(14).text(nombreCEO, 350, 520);
    if (firmaCEOPath) {
      doc.image(firmaCEOPath, 350, 540, { width: 100 });
    }

    doc.end();
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

module.exports = { generarConstanciaPDF };
