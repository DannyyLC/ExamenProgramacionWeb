// Cargar Header Principal con Navegación
function cargarHeader() {
    const headerContainer = document.getElementById('header');
    if (!headerContainer) return;
    
    const usuario = obtenerUsuario();
    const logueado = estaLogueado();
    
    // Detectar si estamos en la raíz o en pages/
    const currentPath = window.location.pathname;
    const isInRoot = currentPath.endsWith('index.html') || currentPath.endsWith('/');
    const pathPrefix = isInRoot ? '' : '../';
    const pagesPrefix = isInRoot ? 'pages/' : '';
    
    const headerHTML = `
        <header class="header">
            <div class="header-container">
                <!-- Logo y Marca -->
                <a href="${pathPrefix}index.html" class="header-logo">
                    <img src="${pathPrefix}images/UniOneLogo.png" alt="${CONFIG.EMPRESA.nombre}" class="header-logo-img">
                </a>
                
                <!-- Botón Hamburguesa (Mobile) -->
                <button class="menu-toggle" id="menuToggle" aria-label="Menú">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <!-- Navegación -->
                <nav class="header-nav" id="headerNav">
                    <ul class="nav-links">
                        <li><a href="${pathPrefix}index.html" class="nav-link" data-page="index">Inicio</a></li>
                        <li><a href="${pagesPrefix}certifications.html" class="nav-link" data-page="certifications">Certificaciones</a></li>
                        <li><a href="${pagesPrefix}contact.html" class="nav-link" data-page="contact">Contacto</a></li>
                        <li><a href="${pagesPrefix}about.html" class="nav-link" data-page="about">Nosotros</a></li>
                    </ul>
                    
                    <!-- Sección de Usuario -->
                    <div class="header-user">
                        ${logueado ? `
                            <div class="user-info">
                                <div class="user-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <span class="user-name">${usuario?.nombreCompleto || usuario?.username || 'Usuario'}</span>
                            </div>
                            <button onclick="cerrarSesion()" class="btn-logout">Cerrar Sesión</button>
                        ` : `
                            <a href="${pagesPrefix}login.html" class="btn-login">Iniciar Sesión</a>
                        `}
                    </div>
                </nav>
            </div>
        </header>
    `;
    
    headerContainer.innerHTML = headerHTML;
    
    // Marcar la página activa
    marcarPaginaActiva();
    
    // Inicializar menú hamburguesa
    inicializarMenuMobile();
}

// Cargar Header del Examen
function cargarHeaderExamen() {
    const headerContainer = document.getElementById('header-exam');
    if (!headerContainer) return;
    
    const headerHTML = `
        <header class="header-exam">
            <div class="header-exam-container">
                <div class="header-exam-logo">
                    <img src="../images/UniOneLogo.png" alt="${CONFIG.EMPRESA.nombre}" class="header-exam-logo-img">
                </div>
            </div>
        </header>
    `;
    
    headerContainer.innerHTML = headerHTML;
}

// Cargar Footer
function cargarFooter() {
    const footerContainer = document.getElementById('footer');
    if (!footerContainer) return;
    
    // Detectar si estamos en la raíz o en pages/
    const currentPath = window.location.pathname;
    const isInRoot = currentPath.endsWith('index.html') || currentPath.endsWith('/');
    const pathPrefix = isInRoot ? '' : '../';
    const pagesPrefix = isInRoot ? 'pages/' : '';
    
    const currentYear = new Date().getFullYear();
    
    const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-content">
                    <!-- Sección: Acerca de -->
                    <div class="footer-section">
                        <h4>Acerca de ${CONFIG.EMPRESA.nombre}</h4>
                        <p>
                            La Universidad en línea líder en certificaciones de tecnología y programación. 
                            Ofrecemos certificaciones reconocidas internacionalmente que impulsan tu carrera profesional.
                        </p>
                        <p style="margin-top: 12px;">
                            <strong>${CONFIG.EMPRESA.eslogan}</strong>
                        </p>
                    </div>
                    
                    <!-- Sección: Enlaces Rápidos -->
                    <div class="footer-section">
                        <h4>Enlaces Rápidos</h4>
                        <ul class="footer-links">
                            <li><a href="${pathPrefix}index.html">Inicio</a></li>
                            <li><a href="${pagesPrefix}certifications.html">Certificaciones</a></li>
                            <li><a href="${pagesPrefix}contact.html">Contacto</a></li>
                            <li><a href="${pagesPrefix}about.html">Nosotros</a></li>
                        </ul>
                    </div>
                    
                    <!-- Sección: Certificaciones -->
                    <div class="footer-section">
                        <h4>Certificaciones</h4>
                        <ul class="footer-links">
                            <li><a href="${pagesPrefix}certifications.html#cpp">C++</a></li>
                            <li><a href="${pagesPrefix}certifications.html#csharp">C#</a></li>
                            <li><a href="${pagesPrefix}certifications.html#python">Python</a></li>
                            <li><a href="${pagesPrefix}certifications.html#java">Java</a></li>
                        </ul>
                    </div>
                    
                    <!-- Sección: Contacto y Redes -->
                    <div class="footer-section">
                        <h4>Síguenos</h4>
                        <p>Conéctate con nosotros en redes sociales</p>
                        <div class="footer-social">
                            ${CONFIG.EMPRESA.github ? `
                            <a href="${CONFIG.EMPRESA.github}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            ` : ''}
                            ${CONFIG.EMPRESA.instagram ? `
                            <a href="${CONFIG.EMPRESA.instagram}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            ` : ''}
                            ${CONFIG.EMPRESA.linkedin ? `
                            <a href="${CONFIG.EMPRESA.linkedin}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Footer Bottom -->
                <div class="footer-bottom">
                    <p>&copy; ${currentYear} ${CONFIG.EMPRESA.nombre}. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    `;
    
    footerContainer.innerHTML = footerHTML;
}

// Marcar la página activa en el menú de navegación
function marcarPaginaActiva() {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('active');
        }
    });
}

// Inicializar menú hamburguesa para móviles
function inicializarMenuMobile() {
    const menuToggle = document.getElementById('menuToggle');
    const headerNav = document.getElementById('headerNav');
    
    if (!menuToggle || !headerNav) return;
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        headerNav.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            headerNav.classList.remove('active');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = headerNav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnToggle && headerNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            headerNav.classList.remove('active');
        }
    });
}

// Cargar componentes automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si existe el contenedor de header normal
    if (document.getElementById('header')) {
        cargarHeader();
    }
    
    // Verificar si existe el contenedor de header de examen
    if (document.getElementById('header-exam')) {
        cargarHeaderExamen();
    }
    
    // Verificar si existe el contenedor de footer
    if (document.getElementById('footer')) {
        cargarFooter();
    }
});