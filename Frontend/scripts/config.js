// Configuración global de la aplicación
const CONFIG = {
    // URL base del backend API
    API_URL: 'http://10.13.131.82:3000/api',
    
    // Información de la empresa
    EMPRESA: {
        nombre: 'UniOne',
        eslogan: 'Educación a Un Click',
        github: 'https://github.com/DannyyLC',
        instagram: 'https://www.instagram.com/carlosquintanar_26?igsh=NmM0MGVuNmFvcGI4',
        linkedin: ''
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
    
    // Certificaciones disponibles con IDs
    CERTIFICACIONES: {
        'cert-001': {
            id: 'cert-001',
            nombre: 'Certificación Java Professional',
            lenguaje: 'Java',
            descripcion: 'Domina Java desde fundamentos hasta aplicaciones empresariales. Aprende POO, colecciones, streams, multithreading y las mejores prácticas de la industria.',
            ventajas: [
                'Valida tus conocimientos en Java SE y Java EE',
                'Reconocimiento internacional por empresas Fortune 500',
                'Acceso a comunidad exclusiva de desarrolladores Java',
                'Certificado digital descargable en PDF'
            ],
            puntuacionMinima: 70,
            tiempoExamen: 60, // minutos
            costo: 1500, // MXN
            disponible: true,
            fechaDisponible: 'Disponible ahora',
            nivel: 'Intermedio-Avanzado',
            totalPreguntas: 8
        },
        'cert-002': {
            id: 'cert-002',
            nombre: 'Certificación C++ Expert',
            lenguaje: 'C++',
            descripcion: 'Conviértete en experto en C++ moderno. Aprende desde sintaxis básica hasta características avanzadas como templates, STL, smart pointers y C++20.',
            ventajas: [
                'Certifica tu expertise en C++ moderno (C++11 a C++20)',
                'Ideal para desarrollo de sistemas y videojuegos',
                'Reconocido por empresas de tecnología punta',
                'Incluye mejores prácticas de performance y optimización'
            ],
            puntuacionMinima: 75,
            tiempoExamen: 75,
            costo: 1800,
            disponible: false,
            fechaDisponible: 'Disponible en Enero 2026',
            nivel: 'Avanzado',
            totalPreguntas: 8
        },
        'cert-003': {
            id: 'cert-003',
            nombre: 'Certificación C# Developer',
            lenguaje: 'C#',
            descripcion: 'Domina C# y el ecosistema .NET. Aprende desarrollo de aplicaciones desktop, web y móviles con el lenguaje más versátil de Microsoft.',
            ventajas: [
                'Certificación oficial en C# y .NET Framework',
                'Perfecto para desarrollo empresarial con Microsoft',
                'Incluye ASP.NET, Entity Framework y LINQ',
                'Válido para Azure y desarrollo cloud'
            ],
            puntuacionMinima: 70,
            tiempoExamen: 65,
            costo: 1600,
            disponible: false,
            fechaDisponible: 'Disponible en Febrero 2026',
            nivel: 'Intermedio',
            totalPreguntas: 8
        },
        'cert-004': {
            id: 'cert-004',
            nombre: 'Certificación Python Master',
            lenguaje: 'Python',
            descripcion: 'Conviértete en maestro de Python. Desde scripting básico hasta Machine Learning, Data Science y desarrollo web con Django/Flask.',
            ventajas: [
                'Certificación en el lenguaje más demandado del mercado',
                'Incluye Data Science, ML y desarrollo web',
                'Reconocido por empresas tech y startups',
                'Ideal para Data Scientists y Backend Developers'
            ],
            puntuacionMinima: 70,
            tiempoExamen: 70,
            costo: 1700,
            disponible: false,
            fechaDisponible: 'Disponible en Marzo 2026',
            nivel: 'Intermedio-Avanzado',
            totalPreguntas: 8
        }
    }
};