import { useRef } from 'react'
import './style.css'
import { useWelcomeAnimation } from './useWelcomeAnimation.js'

function App() {
  const welcomeTextRef = useRef(null)
  const welcomeNameRef = useRef(null)
  const welcomeDescriptionRef = useRef(null)
  const loaderRef = useRef(null)

  useWelcomeAnimation({
    welcomeTextRef,
    welcomeNameRef,
    welcomeDescriptionRef,
    loaderRef,
  })

  return (
    <>
      <nav className="navbar" id="navbar" aria-label="Navegación principal">
        <div className="navbar-inner">
          <a href="#welcome" className="navbar-logo">Emanuel Rangel</a>
          <ul className="navbar-links">
            <li><a href="#welcome">Inicio</a></li>
            <li><a href="#sobre-mi">Sobre mí</a></li>
            <li><a href="#habilidades">Habilidades</a></li>
            <li><a href="#proyectos">Proyectos</a></li>
            <li><a href="#educacion">Educación</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>
      </nav>

      <section className="welcome" id="welcome">
        <div className="welcome-content">
          <p className="welcome-text" ref={welcomeTextRef}>BIENVENIDO</p>
          <h1 id="welcome-name" ref={welcomeNameRef}>Emanuel Rangel</h1>
          <p className="welcome-description" ref={welcomeDescriptionRef}>Portafolio personal</p>
          <div className="loader" ref={loaderRef} aria-hidden="true" />
        </div>
      </section>

      <main>
        <section className="section" id="sobre-mi">
          <div className="section-inner about-grid">
            <div className="about-photo" aria-hidden="true"><span>EA</span></div>
            <div className="about-text">
              <p className="section-label">Sobre mí</p>
              <h2>Estudiante de informática, aprendiendo construyendo</h2>
              <p>
                Escribe aquí un párrafo breve sobre quién eres, qué estás estudiando
                y qué tipo de proyectos te gusta construir. Dos o tres frases son
                suficientes: lo importante es que suene a ti.
              </p>
            </div>
          </div>
        </section>

        <section className="section" id="habilidades">
          <div className="section-inner">
            <p className="section-label">Habilidades</p>
            <h2>Con qué trabajo</h2>
            <ul className="skills-list">
              <li>Python</li>
              <li>HTML / CSS</li>
              <li>MySQL</li>
              <li>Django</li>
            </ul>
          </div>
        </section>

        <section className="section" id="proyectos">
          <div className="section-inner">
            <p className="section-label">Proyectos</p>
            <h2>Algunas cosas que he construido</h2>
            <div className="projects-grid">
              <article className="project-card">
                <span className="project-number">01</span>
                <h3>Nombre del proyecto</h3>
                <p>Breve descripción de qué hace el proyecto y qué problema resuelve.</p>
                <div className="project-tags"><span>Python</span><span>Django</span></div>
                <a href="#" className="project-link">Ver proyecto</a>
              </article>
              <article className="project-card">
                <span className="project-number">02</span>
                <h3>Nombre del proyecto</h3>
                <p>Breve descripción de qué hace el proyecto y qué problema resuelve.</p>
                <div className="project-tags"><span>MySQL</span><span>HTML/CSS</span></div>
                <a href="#" className="project-link">Ver proyecto</a>
              </article>
              <article className="project-card">
                <span className="project-number">03</span>
                <h3>Nombre del proyecto</h3>
                <p>Breve descripción de qué hace el proyecto y qué problema resuelve.</p>
                <div className="project-tags"><span>Python</span><span>MySQL</span></div>
                <a href="#" className="project-link">Ver proyecto</a>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="educacion">
          <div className="section-inner">
            <p className="section-label">Educación</p>
            <h2>Formación</h2>
            <ul className="timeline">
              <li>
                <span className="timeline-date">2023 — presente</span>
                <span className="timeline-title">Nombre de la institución</span>
                <span className="timeline-detail">Programa de informática</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="contacto">
          <div className="section-inner">
            <p className="section-label">Contacto</p>
            <h2>Hablemos</h2>
            <p>
              Si quieres escribirme sobre un proyecto, una oportunidad o simplemente
              saludar, aquí me encuentras.
            </p>
            <ul className="contact-list">
              <li><a href="mailto:tucorreo@ejemplo.com">tucorreo@ejemplo.com</a></li>
              <li><a href="#" target="_blank" rel="noopener">GitHub</a></li>
              <li><a href="#" target="_blank" rel="noopener">LinkedIn</a></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2026 Emanuel Rangel. Todos los derechos reservados.</p>
      </footer>
    </>
  )
}

export default App