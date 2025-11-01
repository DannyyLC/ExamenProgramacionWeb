// Configuración global de la aplicación
const CONFIG = {
    // URL base del backend API
    API_URL: 'http://localhost:3000/api',
    
    // Información de la empresa
    EMPRESA: {
        nombre: 'TechCert Pro',
        eslogan: 'Certifica tu futuro tecnológico',
        redSocial: 'https://linkedin.com/company/techcert-pro'
    },
    
    // Rutas de las páginas
    RUTAS: {
        login: 'pages/login.html',
        home: 'index.html',
        certifications: 'pages/certifications.html',
        contact: 'pages/contact.html',
        about: 'pages/about.html',
        exam: 'pages/exam.html',
        results: 'pages/results.html'
    },
    
    // Certificaciones disponibles
    CERTIFICACIONES: {
        cpp: {
            nombre: 'C++',
            disponible: false,
            fechaDisponible: 'Enero 2026'
        },
        csharp: {
            nombre: 'C#',
            disponible: false,
            fechaDisponible: 'Febrero 2026'
        },
        python: {
            nombre: 'Python',
            disponible: false,
            fechaDisponible: 'Marzo 2026'
        },
        java: {
            nombre: 'Java',
            disponible: true,
            fechaDisponible: 'Ahora'
        }
    }
};