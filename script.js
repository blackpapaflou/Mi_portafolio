/* ==========================================================
   PORTAFOLIO: script.js (v8, bosque)
   Índice:
   1) Tus datos (cambia aquí tus textos, enlaces y proyectos)
   2) Ayudas
   3) Letras de la bienvenida
   4) Recorrido horizontal (rueda, teclado, botones)
   5) Lo que pasa al hacer scroll (portada, letras, paisaje, sección activa)
   6) Barra lateral y tema claro / oscuro
   7) Aparición al entrar
   8) Proyectos: tarjetas, filtros y ventana
   9) Demostraciones que sí funcionan
  10) Contacto y formulario
   ========================================================== */
(function () {
    "use strict";

    /* 1) TUS DATOS ------------------------------------------ */
    var PERFIL = {
        correo: "emanuel.rangel.mira@gmail.com",
        redes: [
            { nombre: "GitHub", url: "https://github.com/blackpapaflou", icono: "i-github" },
            { nombre: "LinkedIn", url: "#", icono: "i-linkedin" }
        ],
        cv: "" // ruta de tu CV, por ejemplo "cv.pdf". Si la dejas vacía, no aparece el botón.
    };

    // demo: "tareas", "propinas", "claves" o null (sin demostración en el navegador)
    var PROYECTOS = [
        {
            titulo: "Lista de tareas",
            imagen: "img/proyectos/lista-tareas.jpg",
            detalle: "Agrega, marca y borra pendientes. Lo que escribes se guarda en este navegador, así que sigue ahí al recargar la página.",
            tags: ["JavaScript", "HTML y CSS"],
            icono: "i-lista",
            enlaces: [{ texto: "Código en GitHub", url: "#" }],
            demo: "tareas"
        },
        {
            titulo: "Calculadora de propinas",
            imagen: "img/proyectos/calculadora-propinas.jpg",
            detalle: "Escribe el monto de la cuenta, elige el porcentaje y el número de personas. Te dice cuánto pagar cada quien.",
            tags: ["JavaScript", "HTML y CSS"],
            icono: "i-calc",
            enlaces: [{ texto: "Código en GitHub", url: "#" }],
            demo: "propinas"
        },
        {
            titulo: "Generador de contraseñas",
            imagen: "img/proyectos/generador-claves.jpg",
            detalle: "Elige la longitud y los tipos de caracteres. La contraseña se crea en tu navegador y no se envía a ningún lado.",
            tags: ["JavaScript", "Seguridad"],
            icono: "i-llave",
            enlaces: [{ texto: "Código en GitHub", url: "#" }],
            demo: "claves"
        },
        {
            titulo: "Sistema de inventario",
            imagen: "img/proyectos/sistema-inventario.jpg",
            detalle: "Aplicación para registrar productos, existencias y movimientos. Los datos viven en MySQL y las pantallas se hacen con Django.",
            tags: ["Python", "Django", "MySQL"],
            icono: "i-folder",
            enlaces: [{ texto: "Código en GitHub", url: "#" }],
            demo: null
        }
    ];

    /* 2) AYUDAS ---------------------------------------------- */
    var $ = function (id) { return document.getElementById(id); };
    var root = document.documentElement;
    var pista = $("pista");
    var progreso = $("progreso");
    var portada = $("portada");
    var mundo = $("mundo");
    var bienvenida = $("welcome-content");
    var nombre = $("welcome-name");
    var campoSeccion = $("campo-seccion");
    var sidebar = $("sidebar");
    var sbToggle = $("sb-toggle");
    var temaSwitch = $("tema-switch");
    var modal = $("modal");
    var reduceMovimiento = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function crear(tag, attrs, hijos) {
        var n = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach(function (k) {
                if (k === "text") n.textContent = attrs[k];
                else n.setAttribute(k, attrs[k]);
            });
        }
        (hijos || []).forEach(function (h) {
            if (h === null || h === undefined) return;
            n.appendChild(typeof h === "string" ? document.createTextNode(h) : h);
        });
        return n;
    }

    function icono(id) {
        var ns = "http://www.w3.org/2000/svg";
        var svg = document.createElementNS(ns, "svg");
        svg.setAttribute("class", "ic");
        svg.setAttribute("aria-hidden", "true");
        var use = document.createElementNS(ns, "use");
        use.setAttribute("href", "#" + id);
        svg.appendChild(use);
        return svg;
    }

    function leerLista(clave) {
        try {
            var v = JSON.parse(localStorage.getItem(clave));
            return Array.isArray(v) ? v : [];
        } catch (e) { return []; }
    }

    function escribirLista(clave, lista) {
        try { localStorage.setItem(clave, JSON.stringify(lista)); } catch (e) { /* sin almacenamiento: no pasa nada */ }
    }

    function copiarTexto(texto) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(texto);
        }
        return new Promise(function (ok, no) {
            var t = crear("textarea");
            t.value = texto;
            document.body.appendChild(t);
            t.select();
            try { document.execCommand("copy") ? ok() : no(); } catch (e) { no(e); }
            t.remove();
        });
    }

    /* 3) LETRAS DE LA BIENVENIDA ------------------------------
       Cada línea del nombre se separa en letras. Cada letra recibe
       --o (su posición) y cada línea --mitad (el centro de la línea). */
    document.querySelectorAll("[data-letras]").forEach(function (linea) {
        var texto = linea.textContent;
        var mitad = (Array.from(texto).length - 1) / 2;
        linea.textContent = "";
        linea.setAttribute("aria-hidden", "true");
        linea.style.setProperty("--mitad", mitad);
        Array.from(texto).forEach(function (c, i) {
            var s = crear("span", { "class": "letra", text: c });
            s.style.setProperty("--o", i);
            linea.appendChild(s);
        });
    });

    /* 4) RECORRIDO HORIZONTAL -------------------------------- */
    var secciones = Array.prototype.slice.call(pista.querySelectorAll("[data-seccion]"));

    function indiceActual() {
        return Math.round(pista.scrollLeft / Math.max(1, pista.clientWidth));
    }

    function irA(id, instantaneo) {
        var el = $(id);
        if (!el) return;
        pista.scrollTo({ left: el.offsetLeft, behavior: (instantaneo || reduceMovimiento) ? "auto" : "smooth" });
    }

    function irAIndice(i) {
        i = Math.max(0, Math.min(secciones.length - 1, i));
        irA(secciones[i].id);
    }

    // la rueda del ratón se convierte en desplazamiento horizontal,
    // salvo dentro de un panel que tenga su propio scroll vertical
    pista.addEventListener("wheel", function (e) {
        if (e.ctrlKey) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        var panel = e.target.closest ? e.target.closest(".panel") : null;
        if (panel && panel.scrollHeight > panel.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(panel).overflowY)) {
            var puedeSubir = panel.scrollTop > 0;
            var puedeBajar = panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1;
            if ((e.deltaY > 0 && puedeBajar) || (e.deltaY < 0 && puedeSubir)) return;
        }
        e.preventDefault();
        pista.scrollLeft += e.deltaY;
    }, { passive: false });

    document.addEventListener("keydown", function (e) {
        var activo = document.activeElement;
        if (modal.open || (activo && /^(INPUT|TEXTAREA|SELECT)$/.test(activo.tagName))) return;
        if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); irAIndice(indiceActual() + 1); }
        else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); irAIndice(indiceActual() - 1); }
        else if (e.key === "Home") { e.preventDefault(); irAIndice(0); }
        else if (e.key === "End") { e.preventDefault(); irAIndice(secciones.length - 1); }
    });

    // enlaces que llevan a una sección (menú, botones, "Saltar al contenido")
    document.addEventListener("click", function (e) {
        var a = e.target.closest ? e.target.closest("[data-ir]") : null;
        if (!a) return;
        e.preventDefault();
        // con el menú cerrado, todo el logo sirve para abrirlo
        if (a.classList.contains("sb-logo") && sidebar.getAttribute("data-abierta") === "false") {
            abrirMenu(true);
            return;
        }
        irA(a.getAttribute("data-ir"));
    });

    /* 5) LO QUE PASA AL HACER SCROLL ------------------------- */
    var capas = Array.prototype.slice.call(document.querySelectorAll("[data-vel]"));
    var activa = null;
    var pendiente = false;

    function marcarActivo(id) {
        document.querySelectorAll(".sb-item[data-ir]").forEach(function (a) {
            var on = a.getAttribute("data-ir") === id;
            a.classList.toggle("activo", on);
            if (on) a.setAttribute("aria-current", "page");
            else a.removeAttribute("aria-current");
        });
    }

    function alMover() {
        pendiente = false;
        var ancho = Math.max(1, pista.clientWidth);
        var sl = pista.scrollLeft;
        var max = Math.max(1, pista.scrollWidth - ancho);
        var p = Math.min(1, sl / max);

        progreso.style.transform = "scaleX(" + p.toFixed(4) + ")";

        var sec = secciones[Math.min(secciones.length - 1, Math.round(sl / ancho))];
        if (sec && sec !== activa) {
            activa = sec;
            campoSeccion.textContent = sec.getAttribute("data-nombre");
            marcarActivo(sec.id);
        }

        // la bienvenida se va hacia la izquierda y sus letras se dispersan
        var t = Math.min(1, sl / (ancho * 0.9));
        nombre.style.setProperty("--t", t.toFixed(3));
        portada.style.transform = "translate3d(" + (-t * 14).toFixed(2) + "vw,0,0) scale(" + (1 - t * 0.04).toFixed(3) + ")";
        bienvenida.style.opacity = (1 - t).toFixed(3);
        bienvenida.classList.toggle("oculta", t >= 1);
        mundo.style.opacity = Math.max(0, 1 - sl / (ancho * 0.8)).toFixed(3);

        // paisaje con profundidad: cada capa se mueve a su velocidad
        capas.forEach(function (c) {
            var v = parseFloat(c.getAttribute("data-vel")) || 0;
            c.style.transform = "translate3d(" + (-p * v * 0.15 * ancho).toFixed(1) + "px,0,0)";
        });
    }

    pista.addEventListener("scroll", function () {
        if (!pendiente) {
            pendiente = true;
            requestAnimationFrame(alMover);
        }
    }, { passive: true });
    window.addEventListener("resize", alMover);

    /* 6) BARRA LATERAL Y TEMA -------------------------------- */
    function abrirMenu(abrir) {
        sidebar.setAttribute("data-abierta", abrir ? "true" : "false");
        sbToggle.setAttribute("aria-expanded", abrir ? "true" : "false");
    }
    sbToggle.addEventListener("click", function () {
        abrirMenu(sidebar.getAttribute("data-abierta") !== "true");
    });

    var meta = document.querySelector('meta[name="theme-color"]');
    function aplicarTema(t) {
        root.setAttribute("data-tema", t);
        temaSwitch.setAttribute("aria-checked", t === "oscuro" ? "true" : "false");
        if (meta) meta.setAttribute("content", t === "oscuro" ? "#0C324A" : "#FEF1D5");
        try { localStorage.setItem("tema", t); } catch (e) { /* sin almacenamiento: el tema solo dura esta visita */ }
    }
    temaSwitch.addEventListener("click", function () {
        aplicarTema(root.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro");
    });

    /* 7) APARICIÓN AL ENTRAR --------------------------------- */
    function observarAparicion() {
        var elementos = document.querySelectorAll("[data-anim]");
        if (!("IntersectionObserver" in window) || reduceMovimiento) {
            elementos.forEach(function (el) { el.classList.add("in"); });
            return;
        }
        var io = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add("in");
                    io.unobserve(en.target);
                }
            });
        }, { root: pista, threshold: 0.2 });
        elementos.forEach(function (el) { io.observe(el); });
    }

    /* 8) PROYECTOS ------------------------------------------- */
    var tarjetas = [];
    var filtroActual = "Todos";
    var actual = 0;

    /* escena decorativa (montañas en SVG) para cada proyecto */
    function escenaSVG(i) {
        var espejo = i % 2 ? ' transform="translate(400 0) scale(-1 1)"' : "";
        return '<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
            '<circle cx="300" cy="96" r="52" fill="rgba(254, 241, 213,0.38)"/>' +
            '<g' + espejo + '>' +
            '<path d="M0 230 L72 150 L124 206 L196 112 L268 196 L330 140 L400 222 V300 H0Z" fill="rgba(12, 50, 74,0.22)"/>' +
            '<path d="M0 268 L90 204 L166 258 L246 186 L336 262 L400 232 V300 H0Z" fill="rgba(12, 50, 74,0.42)"/>' +
            '</g></svg>';
    }

    function filaVisible(i) {
        return filtroActual === "Todos" || PROYECTOS[i].tags.indexOf(filtroActual) >= 0;
    }

    /* carpetas: cada proyecto es una carpeta de cristal; al abrirla sale su hoja y el proyecto se muestra adelante */
    var COLORES_CARPETA = [
        { fondo: "#C11720", tinta: "#0C324A" },
        { fondo: "#FEF1D5", tinta: "#0C324A" },
        { fondo: "#0C324A", tinta: "#FEF1D5" }
    ];

    function pintarProyectos() {
        var grid = $("proy-grid");
        grid.innerHTML = "";
        grid.classList.add("carpetas");
        tarjetas.length = 0;
        PROYECTOS.forEach(function (p, i) {
            var color = COLORES_CARPETA[i % COLORES_CARPETA.length];
            var hoja = crear("span", { "class": "carpeta-hoja" });
            if (p.imagen) hoja.style.backgroundImage = 'url("' + p.imagen + '")';
            else hoja.innerHTML = escenaSVG(i);
            var carpeta = crear("button", {
                type: "button",
                "class": "carpeta",
                "aria-label": "Abrir proyecto " + p.titulo
            }, [
                crear("span", { "class": "carpeta-cuerpo" }, [
                    crear("span", { "class": "carpeta-tras", "aria-hidden": "true" }),
                    crear("span", { "class": "carpeta-pestana", "aria-hidden": "true" }),
                    hoja,
                    crear("span", { "class": "carpeta-frente" }, [
                        crear("span", { "class": "carpeta-tags", text: p.tags.join(" · ") }),
                        crear("span", { "class": "carpeta-titulo", text: p.titulo }),
                        crear("span", { "class": "carpeta-marca", "aria-hidden": "true" }, [icono("i-arrow")])
                    ])
                ])
            ]);
            carpeta.style.setProperty("--fondo", color.fondo);
            carpeta.style.setProperty("--tinta", color.tinta);
            carpeta.addEventListener("click", function () { abrirCarpeta(i, carpeta); });
            tarjetas.push(carpeta);
            grid.appendChild(carpeta);
        });
    }

    function abrirCarpeta(i, carpeta) {
        var r = carpeta.getBoundingClientRect();
        modal.style.setProperty("--ox", (r.left + r.width / 2 - window.innerWidth / 2) + "px");
        modal.style.setProperty("--oy", (r.top + r.height / 2 - window.innerHeight / 2) + "px");
        carpeta.classList.add("abriendo");
        setTimeout(function () {
            abrirProyecto(i);
            carpeta.classList.remove("abriendo");
        }, 420);
    }

    function pintarFiltros() {
        var cont = $("filtros");
        var etiquetas = ["Todos"];
        PROYECTOS.forEach(function (p) {
            p.tags.forEach(function (t) { if (etiquetas.indexOf(t) < 0) etiquetas.push(t); });
        });
        etiquetas.forEach(function (t) {
            var b = crear("button", { type: "button", "class": "filtro", text: t, "aria-pressed": String(t === filtroActual) });
            b.addEventListener("click", function () { filtroActual = t; aplicarFiltro(); });
            cont.appendChild(b);
        });
    }

    function aplicarFiltro() {
        document.querySelectorAll(".filtro").forEach(function (b) {
            b.setAttribute("aria-pressed", String(b.textContent === filtroActual));
        });
        var visibles = 0;
        PROYECTOS.forEach(function (p, i) {
            var muestra = filtroActual === "Todos" || p.tags.indexOf(filtroActual) >= 0;
            tarjetas[i].hidden = !muestra;
            if (muestra) visibles++;
        });
        $("proy-vacio").hidden = visibles > 0;
    }

    function abrirProyecto(i) {
        actual = i;
        pintarModal();
        if (!modal.open) modal.showModal();
        $("m-cerrar").focus();
    }

    function pintarModal() {
        var p = PROYECTOS[actual];
        $("modal-titulo").textContent = p.titulo;
        $("m-detalle").textContent = p.detalle;

        var tags = $("m-tags");
        tags.innerHTML = "";
        p.tags.forEach(function (t) { tags.appendChild(crear("span", { text: t })); });

        var enl = $("m-enlaces");
        enl.innerHTML = "";
        p.enlaces.forEach(function (l) {
            enl.appendChild(crear("a", { "class": "boton boton-2 boton-peq", href: l.url, target: "_blank", rel: "noopener", text: l.texto }));
        });

        var demo = $("demo");
        demo.innerHTML = "";
        if (p.demo && DEMOS[p.demo]) {
            DEMOS[p.demo](demo);
        } else {
            demo.appendChild(crear("p", { "class": "d-vacio", text: "Este proyecto corre en un servidor, así que aquí solo puedes leer lo que hace. El código está en GitHub." }));
        }
    }

    $("m-prev").addEventListener("click", function () {
        actual = (actual - 1 + PROYECTOS.length) % PROYECTOS.length;
        pintarModal();
    });
    $("m-next").addEventListener("click", function () {
        actual = (actual + 1) % PROYECTOS.length;
        pintarModal();
    });
    $("m-cerrar").addEventListener("click", function () { modal.close(); });
    modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });
    modal.addEventListener("close", function () {
        if (tarjetas[actual]) tarjetas[actual].focus({ preventScroll: true });
    });

    /* 9) DEMOSTRACIONES -------------------------------------- */
    var DEMOS = { tareas: demoTareas, propinas: demoPropinas, claves: demoClaves };

    function demoTareas(cont) {
        var clave = "demo-tareas";
        var tareas = leerLista(clave).filter(function (t) { return t && typeof t.texto === "string"; });

        var campo = crear("input", { type: "text", maxlength: "80", placeholder: "Escribe una tarea", "aria-label": "Nueva tarea", autocomplete: "off" });
        var agregar = crear("button", { type: "submit", "class": "boton boton-peq", text: "Agregar" });
        var form = crear("form", { "class": "d-fila", novalidate: "" }, [campo, agregar]);
        var ul = crear("ul", { "class": "tareas" });
        var cuenta = crear("span", { "aria-live": "polite" });
        var limpiar = crear("button", { type: "button", "class": "btn-txt", text: "Borrar las hechas" });
        var pie = crear("div", { "class": "d-pie" }, [cuenta, limpiar]);
        cont.appendChild(form);
        cont.appendChild(ul);
        cont.appendChild(pie);

        function guardar() { escribirLista(clave, tareas); }

        function pintar() {
            ul.innerHTML = "";
            if (!tareas.length) {
                ul.appendChild(crear("li", { "class": "d-vacio", text: "Todavía no hay tareas. Escribe una arriba." }));
            }
            tareas.forEach(function (t, i) {
                var cb = crear("input", { type: "checkbox", "aria-label": "Marcar como hecha: " + t.texto });
                cb.checked = !!t.hecha;
                cb.addEventListener("change", function () { t.hecha = cb.checked; guardar(); pintar(); });
                var borrar = crear("button", { type: "button", "aria-label": "Borrar: " + t.texto }, [icono("i-trash")]);
                borrar.addEventListener("click", function () { tareas.splice(i, 1); guardar(); pintar(); });
                ul.appendChild(crear("li", { "class": "tarea" + (t.hecha ? " hecha" : "") }, [cb, crear("span", { text: t.texto }), borrar]));
            });
            var hechas = tareas.filter(function (t) { return t.hecha; }).length;
            cuenta.textContent = hechas + " de " + tareas.length + " hechas";
            limpiar.disabled = hechas === 0;
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var texto = campo.value.trim();
            if (!texto) { campo.focus(); return; }
            tareas.push({ texto: texto, hecha: false });
            campo.value = "";
            guardar();
            pintar();
            campo.focus();
        });

        limpiar.addEventListener("click", function () {
            for (var i = tareas.length - 1; i >= 0; i--) {
                if (tareas[i].hecha) tareas.splice(i, 1);
            }
            guardar();
            pintar();
        });

        pintar();
    }

    function demoPropinas(cont) {
        var porcentajes = [10, 15, 20];
        var pct = 15;
        var personas = 2;

        var monto = crear("input", { id: "p-monto", type: "number", min: "0", step: "0.01", inputmode: "decimal", placeholder: "0.00" });
        var botones = porcentajes.map(function (v) {
            var b = crear("button", { type: "button", "class": "d-chip", "aria-pressed": "false", text: v + "%" });
            b.addEventListener("click", function () { pct = v; actualizar(); });
            return b;
        });
        var menos = crear("button", { type: "button", "class": "icono-btn", "aria-label": "Quitar una persona" }, [icono("i-menos")]);
        var mas = crear("button", { type: "button", "class": "icono-btn", "aria-label": "Agregar una persona" }, [icono("i-plus")]);
        var salida = crear("output", { "aria-live": "polite" });
        menos.addEventListener("click", function () { personas = Math.max(1, personas - 1); actualizar(); });
        mas.addEventListener("click", function () { personas = Math.min(20, personas + 1); actualizar(); });

        var rPropina = crear("strong");
        var rTotal = crear("strong");
        var rCada = crear("strong");
        function res(texto, valor, grande) {
            return crear("div", { "class": "res" + (grande ? " grande" : "") }, [crear("small", { text: texto }), valor]);
        }

        cont.appendChild(crear("div", { "class": "d-grid" }, [
            crear("div", { "class": "campo" }, [crear("label", { "for": "p-monto", text: "Monto de la cuenta" }), monto]),
            crear("div", { "class": "d-chips", role: "group", "aria-label": "Porcentaje de propina" }, botones),
            crear("div", { "class": "d-paso" }, [menos, salida, mas]),
            crear("div", { "class": "resultado" }, [
                res("Propina", rPropina),
                res("Total", rTotal),
                res("Cada quien", rCada, true)
            ])
        ]));

        function dinero(n) {
            return "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        function actualizar() {
            botones.forEach(function (b, i) { b.setAttribute("aria-pressed", String(porcentajes[i] === pct)); });
            salida.textContent = String(personas);
            var m = parseFloat(monto.value);
            if (isNaN(m) || m < 0) m = 0;
            var propina = m * pct / 100;
            var total = m + propina;
            rPropina.textContent = dinero(propina);
            rTotal.textContent = dinero(total);
            rCada.textContent = dinero(total / personas);
        }

        monto.addEventListener("input", actualizar);
        actualizar();
    }

    function azar(n) {
        try {
            var a = new Uint32Array(1);
            window.crypto.getRandomValues(a);
            return a[0] % n;
        } catch (e) {
            return Math.floor(Math.random() * n);
        }
    }

    function demoClaves(cont) {
        var GRUPOS = [
            { txt: "Mayúsculas", chars: "ABCDEFGHJKLMNPQRSTUVWXYZ" },
            { txt: "Minúsculas", chars: "abcdefghijkmnopqrstuvwxyz" },
            { txt: "Números", chars: "23456789" },
            { txt: "Símbolos", chars: "!@#$%&*+-=?" }
        ];
        var cajas = GRUPOS.map(function () {
            var cb = crear("input", { type: "checkbox" });
            cb.checked = true;
            cb.addEventListener("change", generar);
            return cb;
        });

        var rango = crear("input", { type: "range", min: "8", max: "32", value: "16", "aria-label": "Longitud de la contraseña" });
        var etiquetaRango = crear("span", { text: "Longitud: 16" });
        var codigo = crear("code", { "aria-live": "polite" });
        var copiar = crear("button", { type: "button", "class": "icono-btn", "aria-label": "Copiar contraseña" }, [icono("i-copy")]);
        var barra = crear("i");
        var fuerzaTxt = crear("p", { "class": "fuerza-txt", "aria-live": "polite" });
        var error = crear("p", { "class": "error", role: "alert" });
        var otra = crear("button", { type: "button", "class": "boton boton-peq" }, [crear("span", { text: "Generar otra" })]);

        var opciones = crear("div", { "class": "opciones" }, GRUPOS.map(function (g, i) {
            return crear("label", null, [cajas[i], g.txt]);
        }));

        cont.appendChild(crear("div", { "class": "clave" }, [codigo, copiar]));
        cont.appendChild(crear("div", { "class": "fuerza" }, [barra]));
        cont.appendChild(fuerzaTxt);
        cont.appendChild(crear("div", { "class": "d-paso" }, [rango, etiquetaRango]));
        cont.appendChild(opciones);
        cont.appendChild(error);
        cont.appendChild(otra);

        function generar() {
            var activos = GRUPOS.filter(function (g, i) { return cajas[i].checked; });
            error.textContent = "";
            if (!activos.length) {
                error.textContent = "Elige al menos un tipo de caracter.";
                codigo.textContent = "";
                barra.style.transform = "scaleX(0)";
                fuerzaTxt.textContent = "";
                return;
            }
            var largo = parseInt(rango.value, 10);
            etiquetaRango.textContent = "Longitud: " + largo;
            var todos = activos.map(function (g) { return g.chars; }).join("");
            var salida = [];
            // al menos un caracter de cada tipo elegido
            activos.forEach(function (g) { salida.push(g.chars[azar(g.chars.length)]); });
            while (salida.length < largo) salida.push(todos[azar(todos.length)]);
            // mezclar para que los primeros caracteres no sigan un orden
            for (var i = salida.length - 1; i > 0; i--) {
                var j = azar(i + 1);
                var t = salida[i];
                salida[i] = salida[j];
                salida[j] = t;
            }
            codigo.textContent = salida.join("");
            var puntaje = Math.min(1, largo / 24 * 0.7 + activos.length / 4 * 0.3);
            barra.style.transform = "scaleX(" + puntaje.toFixed(2) + ")";
            fuerzaTxt.textContent = puntaje > 0.75 ? "Fuerte" : (puntaje > 0.5 ? "Media" : "Débil");
        }

        rango.addEventListener("input", generar);
        otra.addEventListener("click", generar);
        copiar.addEventListener("click", function () {
            if (!codigo.textContent) return;
            copiarTexto(codigo.textContent).then(function () {
                copiar.setAttribute("aria-label", "Contraseña copiada");
            }, function () {
                copiar.setAttribute("aria-label", "No se pudo copiar");
            });
        });

        generar();
    }

    /* 10) CONTACTO Y FORMULARIO ------------------------------ */
    function iniciarContacto() {
        var correo = $("correo");
        correo.textContent = PERFIL.correo;
        $("correo-visible").textContent = PERFIL.correo;
        correo.setAttribute("href", "mailto:" + PERFIL.correo);

        var copiar = $("copiar");
        var texto = $("copiar-texto");
        var tiempo = null;
        copiar.addEventListener("click", function () {
            copiarTexto(PERFIL.correo).then(function () {
                texto.textContent = "Correo copiado";
                clearTimeout(tiempo);
                tiempo = setTimeout(function () { texto.textContent = "Copiar correo"; }, 2200);
            }, function () {
                texto.textContent = "No se pudo copiar";
            });
        });

        var redes = $("redes");
        PERFIL.redes.forEach(function (r) {
            redes.appendChild(crear("li", null, [
                crear("a", { href: r.url, target: "_blank", rel: "noopener", "aria-label": r.nombre }, [icono(r.icono)])
            ]));
        });
    }

    function marcar(idCampo, idError, falla, texto) {
        var input = $(idCampo);
        input.closest(".campo").classList.toggle("mal", falla);
        input.setAttribute("aria-invalid", String(falla));
        $(idError).textContent = falla ? texto : "";
        return falla;
    }

    function iniciarFormulario() {
        var form = $("formulario");
        var estado = $("estado-form");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var nombreV = $("f-nombre").value.trim();
            var correoV = $("f-correo").value.trim();
            var mensajeV = $("f-mensaje").value.trim();
            var errores = [
                marcar("f-nombre", "e-nombre", !nombreV, "Escribe tu nombre."),
                marcar("f-correo", "e-correo", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoV), "Escribe un correo válido, por ejemplo nombre@correo.com."),
                marcar("f-mensaje", "e-mensaje", mensajeV.length < 10, "El mensaje necesita al menos 10 caracteres.")
            ];
            if (errores.indexOf(true) >= 0) {
                estado.textContent = "Revisa los campos marcados.";
                var primero = document.querySelector(".campo.mal input, .campo.mal textarea");
                if (primero) primero.focus();
                return;
            }
            estado.textContent = "Mensaje listo. Falta conectar este formulario a un servicio de envío para que llegue a tu correo.";
            form.reset();
        });
    }

    /* ARRANQUE ---------------------------------------------- */
    pintarProyectos();
    pintarFiltros();
    aplicarFiltro();
    iniciarContacto();
    iniciarFormulario();
    observarAparicion();

    $("sb-cuenta").textContent = String(PROYECTOS.length);
    if (PERFIL.cv) {
        $("sb-pie").hidden = false;
        var cv = $("sb-cv");
        cv.setAttribute("href", PERFIL.cv);
    }

    aplicarTema(root.getAttribute("data-tema") || "oscuro");
    alMover();
    if (location.hash && $(location.hash.slice(1))) irA(location.hash.slice(1), true);

    /* ajusta cada sección a la altura de la pantalla (escritorio): sin desplazarse por dentro */
    function ajustarPaneles() {
        var escritorio = window.matchMedia("(min-width: 721px)").matches;
        document.querySelectorAll(".panel").forEach(function (p) {
            var w = p.querySelector(":scope > .panel-ajuste");
            if (!w) {
                w = document.createElement("div");
                w.className = "panel-ajuste";
                while (p.firstChild) w.appendChild(p.firstChild);
                p.appendChild(w);
            }
            w.style.zoom = "";
            w.style.width = "";
            w.style.maxWidth = "";
            w.style.margin = "";
            if (!escritorio) return;
            var cs = getComputedStyle(p);
            var disponible = p.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
            var natural = w.offsetHeight;
            var r = natural > disponible ? Math.max(0.5, (disponible / natural) * 0.99) : 1;
            if (r < 1) {
                w.style.zoom = String(r);
                w.style.width = (100 / r) + "%";
                w.style.maxWidth = (1180 / r) + "px";
                w.style.margin = "0 auto";
            }
        });
    }
    var ajusteTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(ajusteTimer);
        ajusteTimer = setTimeout(ajustarPaneles, 120);
    });
    window.addEventListener("load", ajustarPaneles);
    ajustarPaneles();
})();
