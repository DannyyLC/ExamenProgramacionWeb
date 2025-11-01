// Cargar Header Principal con Navegación
function cargarHeader() {
    const headerContainer = document.getElementById('header');
    if (!headerContainer) return;
    
    const usuario = obtenerUsuario();
    const logueado = estaLogueado();
    
    const headerHTML = `
        <header class="header">
            <div class="header-container">
                <!-- Logo y Marca -->
                <a href="home.html" class="header-logo">
                    <img src="../images/logo.svg" alt="${CONFIG.EMPRESA.nombre}" class="header-logo-img">
                    <span class="header-brand-name">${CONFIG.EMPRESA.nombre}</span>
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
                        <li><a href="home.html" class="nav-link" data-page="home">Inicio</a></li>
                        <li><a href="certificaciones.html" class="nav-link" data-page="certificaciones">Certificaciones</a></li>
                        <li><a href="contacto.html" class="nav-link" data-page="contacto">Contacto</a></li>
                        <li><a href="nosotros.html" class="nav-link" data-page="nosotros">Nosotros</a></li>
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
                            <a href="../index.html" class="btn-login">Iniciar Sesión</a>
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
                    <img src="../images/logo.svg" alt="${CONFIG.EMPRESA.nombre}" class="header-exam-logo-img">
                    <span class="header-exam-brand-name">${CONFIG.EMPRESA.nombre}</span>
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
    
    const currentYear = new Date().getFullYear();
    
    const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-content">
                    <!-- Sección: Acerca de -->
                    <div class="footer-section">
                        <h4>Acerca de ${CONFIG.EMPRESA.nombre}</h4>
                        <p>
                            Plataforma líder en certificaciones de tecnología y programación. 
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
                            <li><a href="home.html">Inicio</a></li>
                            <li><a href="certificaciones.html">Certificaciones</a></li>
                            <li><a href="contacto.html">Contacto</a></li>
                            <li><a href="nosotros.html">Nosotros</a></li>
                        </ul>
                    </div>
                    
                    <!-- Sección: Certificaciones -->
                    <div class="footer-section">
                        <h4>Certificaciones</h4>
                        <ul class="footer-links">
                            <li><a href="certificaciones.html#javascript">JavaScript</a></li>
                            <li><a href="certificaciones.html#python">Python</a></li>
                            <li><a href="certificaciones.html#react">React</a></li>
                            <li><a href="certificaciones.html#nodejs">Node.js</a></li>
                        </ul>
                    </div>
                    
                    <!-- Sección: Contacto y Redes -->
                    <div class="footer-section">
                        <h4>Síguenos</h4>
                        <p>Conéctate con nosotros en redes sociales</p>
                        <div class="footer-social">
                            <a href="${CONFIG.EMPRESA.redSocial}" target="_blank" class="social-link" aria-label="LinkedIn">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a href="#" target="_blank" class="social-link" aria-label="Twitter">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                            <a href="#" target="_blank" class="social-link" aria-label="GitHub">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
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