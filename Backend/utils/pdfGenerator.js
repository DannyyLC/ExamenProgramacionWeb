const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Genera un PDF de constancia de acreditación de examen usando Puppeteer
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
async function generarConstanciaPDF({
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
  // Convertir imágenes a base64
  const logoBase64 = fs.existsSync(logoPath) 
    ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}` 
    : '';
  const firmaInstructorBase64 = fs.existsSync(firmaInstructorPath) 
    ? `data:image/png;base64,${fs.readFileSync(firmaInstructorPath).toString('base64')}` 
    : '';
  const firmaCEOBase64 = fs.existsSync(firmaCEOPath) 
    ? `data:image/png;base64,${fs.readFileSync(firmaCEOPath).toString('base64')}` 
    : '';

  // Generar HTML del certificado
  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Constancia de Acreditación</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #0a0f14 0%, #0d0d0d 50%, #1c1c1c 100%);
            width: 100vw;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 30px;
            position: relative;
            overflow: hidden;
        }
        
        /* Efectos de fondo decorativos */
        body::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
        }
        
        .certificate-container {
            background: rgba(20, 20, 20, 0.95);
            border: 2px solid rgba(59, 130, 246, 0.3);
            border-radius: 20px;
            padding: 25px 40px;
            width: 100%;
            height: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 
                        0 0 100px rgba(59, 130, 246, 0.1),
                        inset 0 0 60px rgba(59, 130, 246, 0.05);
            position: relative;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        
        /* Borde decorativo interior */
        .certificate-container::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 1px solid rgba(59, 130, 246, 0.15);
            border-radius: 12px;
            pointer-events: none;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 30px;
            border-bottom: 4px solid rgba(59, 130, 246, 0.2);
            flex-shrink: 0;
        }
        
        .logo {
            width: 180px;
            height: auto;
            margin: 0 auto 20px;
            display: block;
            filter: drop-shadow(0 8px 24px rgba(59, 130, 246, 0.3));
        }
        
        .title {
            font-size: 76px;
            font-weight: 700;
            color: #f5f5f5;
            margin-bottom: 12px;
            letter-spacing: 4px;
            text-transform: uppercase;
            text-shadow: 0 0 40px rgba(59, 130, 246, 0.5);
        }
        
        .subtitle {
            font-size: 28px;
            color: #9ca3af;
            font-weight: 400;
            letter-spacing: 2px;
        }
        
        .content {
            text-align: center;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 10px 0;
        }
        
        .content p {
            font-size: 28px;
            color: #d1d5db;
            margin-bottom: 16px;
            line-height: 1.4;
        }
        
        .user-name {
            font-size: 76px;
            font-weight: 700;
            color: #3b82f6;
            margin: 30px 0;
            text-shadow: 0 0 60px rgba(59, 130, 246, 0.5);
            letter-spacing: 2px;
        }
        
        .certification-name {
            font-size: 48px;
            font-weight: 600;
            color: #f5f5f5;
            margin: 30px auto;
            padding: 40px 80px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 24px;
            border: 2px solid rgba(59, 130, 246, 0.3);
            display: inline-block;
            max-width: 85%;
            line-height: 1.3;
        }
        
        .details {
            display: flex;
            justify-content: center;
            gap: 120px;
            margin: 30px 0 0;
            font-size: 28px;
            color: #9ca3af;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #d1d5db;
        }
        
        .signatures {
            display: flex;
            justify-content: space-around;
            padding: 18px 0 12px;
            border-top: 2px solid rgba(59, 130, 246, 0.2);
            flex-shrink: 0;
            gap: 80px;
        }
        
        .signature {
            text-align: center;
            flex: 1;
        }
        
        .signature-title {
            font-size: 18px;
            color: #9ca3af;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .signature-name {
            font-size: 24px;
            font-weight: 600;
            color: #d1d5db;
            margin-bottom: 10px;
        }
        
        .signature-image {
            width: 200px;
            height: auto;
            max-height: 50px;
            margin: 0 auto;
            display: block;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
        }
        
        .footer {
            text-align: center;
            padding-top: 10px;
            border-top: 1px solid rgba(38, 38, 38, 0.5);
            flex-shrink: 0;
        }
        
        .footer-text {
            font-size: 13px;
            color: #6b7280;
            letter-spacing: 0.5px;
        }
        
        .footer-logo {
            display: inline-block;
            font-weight: 600;
            color: #3b82f6;
        }
        
        /* Decoraciones esquinas */
        .corner-decoration {
            position: absolute;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(59, 130, 246, 0.3);
        }
        
        .corner-decoration.top-left {
            top: 15px;
            left: 15px;
            border-right: none;
            border-bottom: none;
            border-top-left-radius: 10px;
        }
        
        .corner-decoration.top-right {
            top: 15px;
            right: 15px;
            border-left: none;
            border-bottom: none;
            border-top-right-radius: 10px;
        }
        
        .corner-decoration.bottom-left {
            bottom: 15px;
            left: 15px;
            border-right: none;
            border-top: none;
            border-bottom-left-radius: 10px;
        }
        
        .corner-decoration.bottom-right {
            bottom: 15px;
            right: 15px;
            border-left: none;
            border-top: none;
            border-bottom-right-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="corner-decoration top-left"></div>
        <div class="corner-decoration top-right"></div>
        <div class="corner-decoration bottom-left"></div>
        <div class="corner-decoration bottom-right"></div>
        
        <div class="header">
            ${logoBase64 ? `<img src="${logoBase64}" alt="UniOne Logo" class="logo">` : ''}
            <h1 class="title">Constancia de Acreditación</h1>
            <p class="subtitle">Certificación Profesional</p>
        </div>
        
        <div class="content">
            <p>Por la presente se certifica que</p>
            <div class="user-name">${nombreUsuario}</div>
            <p>Ha acreditado satisfactoriamente el examen:</p>
            <div class="certification-name">${nombreCertificacion}</div>
            
            <div class="details">
                <div class="detail-item">
                    <span class="detail-label">Fecha:</span>
                    <span>${fecha}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Ciudad:</span>
                    <span>${ciudad}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Compañía:</span>
                    <span>UniOne</span>
                </div>
            </div>
        </div>
        
        <div class="signatures">
            <div class="signature">
                <p class="signature-title">Instructor</p>
                <p class="signature-name">${nombreInstructor}</p>
                ${firmaInstructorBase64 ? `<img src="${firmaInstructorBase64}" alt="Firma Instructor" class="signature-image">` : ''}
            </div>
            
            <div class="signature">
                <p class="signature-title">CEO</p>
                <p class="signature-name">${nombreCEO}</p>
                ${firmaCEOBase64 ? `<img src="${firmaCEOBase64}" alt="Firma CEO" class="signature-image">` : ''}
            </div>
        </div>
    </div>
</body>
</html>
  `;

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport exacto para carta horizontal (11" x 8.5" = 1056px x 816px a 76 DPI)
    await page.setViewport({
      width: 1056,
      height: 816,
      deviceScaleFactor: 1
    });
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      landscape: true,
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    });
    
    await browser.close();
    
    return outputPath;
  } catch (error) {
    throw new Error(`Error al generar el PDF: ${error.message}`);
  }
}

module.exports = { generarConstanciaPDF };