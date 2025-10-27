// Panel de Administración - Versión Funcional
console.log("🚀 Cargando admin script...");

// Variables globales
let enviosData = [];
let clientesData = [];
let repartidoresData = [];
let currentUser = null;

// Inicialización cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  console.log("📋 DOM listo, iniciando admin...");

  // Verificar autenticación
  if (!verificarAuth()) {
    return;
  }

  // Inicializar admin
  inicializarAdmin();
});

// Verificar autenticación
function verificarAuth() {
  const user = localStorage.getItem("adminUser");
  if (!user) {
    console.log("❌ No hay usuario, redirigiendo a login...");
    window.location.replace("login.html");
    return false;
  }

  try {
    currentUser = JSON.parse(user);
    console.log("✅ Usuario autenticado:", currentUser.username);
    return true;
  } catch (error) {
    console.error("❌ Error parseando usuario:", error);
    localStorage.removeItem("adminUser");
    window.location.replace("login.html");
    return false;
  }
}

// Inicializar admin
function inicializarAdmin() {
  console.log("🔧 Inicializando admin...");

  // Cargar datos
  cargarDatos();

  // Configurar navegación
  configurarNavegacion();

  // Configurar botones
  configurarBotones();

  // Mostrar dashboard inicial
  mostrarSeccion("dashboard");

  console.log("✅ Admin inicializado correctamente");
}

// Cargar datos desde localStorage
function cargarDatos() {
  try {
    // Cargar envíos
    const envios = localStorage.getItem("enviosLogistica");
    enviosData = envios ? JSON.parse(envios) : [];

    // Cargar clientes
    const clientes = localStorage.getItem("clientesData");
    clientesData = clientes ? JSON.parse(clientes) : [];

    // Cargar repartidores
    const repartidores = localStorage.getItem("repartidoresData");
    repartidoresData = repartidores ? JSON.parse(repartidores) : [];

    console.log(
      `📊 Datos cargados: ${enviosData.length} envíos, ${clientesData.length} clientes, ${repartidoresData.length} repartidores`
    );
  } catch (error) {
    console.error("❌ Error cargando datos:", error);
    enviosData = [];
    clientesData = [];
    repartidoresData = [];
  }
}

// Configurar navegación
function configurarNavegacion() {
  console.log("🧭 Configurando navegación...");

  const navItems = document.querySelectorAll(".nav-item");
  console.log(`📋 Encontrados ${navItems.length} elementos de navegación`);

  navItems.forEach((item, index) => {
    const seccion = item.getAttribute("data-section");
    console.log(`  ${index + 1}. Configurando: ${seccion}`);

    // Remover eventos anteriores
    item.onclick = null;

    // Agregar nuevo evento
    item.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(`🖱️ Click en navegación: ${seccion}`);

      if (seccion) {
        mostrarSeccion(seccion);
        actualizarNavActiva(this);
      }
    });
  });

  console.log("✅ Navegación configurada");
}

// Mostrar sección
function mostrarSeccion(nombreSeccion) {
  console.log(`📄 Mostrando sección: ${nombreSeccion}`);

  // Ocultar todas las secciones
  const secciones = document.querySelectorAll(".content-section");
  secciones.forEach((seccion) => {
    seccion.classList.remove("active");
  });

  // Mostrar sección seleccionada
  const seccionTarget = document.getElementById(nombreSeccion + "-section");
  if (seccionTarget) {
    seccionTarget.classList.add("active");
    console.log(`✅ Sección ${nombreSeccion} mostrada`);
  } else {
    console.error(`❌ Sección ${nombreSeccion}-section no encontrada`);
  }

  // Cargar contenido específico
  switch (nombreSeccion) {
    case "dashboard":
      actualizarDashboard();
      break;
    case "envios":
      cargarTablaEnvios();
      break;
    case "clientes":
      cargarTablaClientes();
      break;
    case "repartidores":
      cargarTablaRepartidores();
      break;
    case "reportes":
      generarReportes();
      break;
    case "configuracion":
      cargarConfiguracion();
      break;
  }
}

// Actualizar navegación activa
function actualizarNavActiva(itemActivo) {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));
  itemActivo.classList.add("active");
}

// Configurar botones
function configurarBotones() {
  // Botón home
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  // Botón logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("adminUser");
      window.location.href = "login.html";
    });
  }

  // Botón sidebar toggle
  const sidebarToggle = document.getElementById("sidebarToggle");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        sidebar.classList.toggle("collapsed");
      }
    });
  }
}

// Actualizar dashboard
function actualizarDashboard() {
  console.log("📊 Actualizando dashboard...");

  // Estadísticas básicas
  const totalEnvios = enviosData.length;
  const enviosHoy = enviosData.filter((envio) => {
    const hoy = new Date().toDateString();
    const fechaEnvio = new Date(envio.fechaCreacion).toDateString();
    return fechaEnvio === hoy;
  }).length;

  const ingresosTotales = enviosData.reduce(
    (total, envio) => total + (envio.precio || 0),
    0
  );
  const clientesUnicos = new Set(
    enviosData.map((e) => e.cliente?.nombre).filter(Boolean)
  ).size;

  // Actualizar elementos
  actualizarElemento("totalEnvios", totalEnvios);
  actualizarElemento("enviosHoy", enviosHoy);
  actualizarElemento("ingresosTotales", `$${ingresosTotales.toLocaleString()}`);
  actualizarElemento("clientesUnicos", clientesUnicos);

  // Estados de envíos
  const pendientes = enviosData.filter((e) => e.estado === "pendiente").length;
  const transito = enviosData.filter((e) => e.estado === "en_transito").length;
  const entregados = enviosData.filter((e) => e.estado === "entregado").length;

  actualizarElemento("statusPendientes", pendientes);
  actualizarElemento("statusTransito", transito);
  actualizarElemento("statusEntregados", entregados);

  // Tabla de envíos recientes
  renderEnviosRecientes();

  console.log("✅ Dashboard actualizado");
}

// Función auxiliar para actualizar elementos
function actualizarElemento(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.textContent = valor;
    console.log(`✅ ${id}: ${valor}`);
  } else {
    console.warn(`⚠️ Elemento ${id} no encontrado`);
  }
}

// Renderizar envíos recientes
function renderEnviosRecientes() {
  const tbody = document.getElementById("recentShipmentsBody");
  if (!tbody) return;

  if (enviosData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="no-data">No hay envíos recientes</td></tr>';
    return;
  }

  const recentShipments = enviosData
    .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
    .slice(0, 5);

  tbody.innerHTML = recentShipments
    .map(
      (envio) => `
    <tr>
      <td>${envio.numeroGuia}</td>
      <td>${envio.cliente?.nombre || "N/A"}</td>
      <td>${envio.origenCiudad} → ${envio.destinoCiudad}</td>
      <td><span class="status-badge status-${envio.estado || "pendiente"}">${
        envio.estado || "Pendiente"
      }</span></td>
      <td>${new Date(envio.fechaCreacion).toLocaleDateString()}</td>
    </tr>
  `
    )
    .join("");
}

// Cargar tabla de envíos
function cargarTablaEnvios() {
  console.log("📦 Cargando tabla de envíos...");

  const tbody = document.getElementById("enviosTableBody");
  if (!tbody) {
    console.warn("⚠️ Tabla de envíos no encontrada");
    return;
  }

  if (enviosData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="no-data">No hay envíos registrados</td></tr>';
    return;
  }

  tbody.innerHTML = enviosData
    .map(
      (envio) => `
    <tr>
      <td>${envio.numeroGuia}</td>
      <td>${envio.cliente?.nombre || "N/A"}</td>
      <td>${envio.origenCiudad} → ${envio.destinoCiudad}</td>
      <td><span class="status-badge status-${envio.estado || "pendiente"}">${
        envio.estado || "Pendiente"
      }</span></td>
      <td>$${(envio.precio || 0).toLocaleString()}</td>
      <td>${new Date(envio.fechaCreacion).toLocaleDateString()}</td>
    </tr>
  `
    )
    .join("");

  console.log(`✅ Tabla de envíos cargada: ${enviosData.length} registros`);
}

// Cargar tabla de clientes
function cargarTablaClientes() {
  console.log("👥 Cargando tabla de clientes...");

  const tbody = document.getElementById("clientesTableBody");
  if (!tbody) {
    console.warn("⚠️ Tabla de clientes no encontrada");
    return;
  }

  if (clientesData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="no-data">No hay clientes registrados</td></tr>';
    return;
  }

  tbody.innerHTML = clientesData
    .map(
      (cliente) => `
    <tr>
      <td>${cliente.nombre}</td>
      <td>${cliente.email}</td>
      <td>${cliente.telefono}</td>
      <td>${cliente.enviosRealizados || 0}</td>
    </tr>
  `
    )
    .join("");

  console.log(`✅ Tabla de clientes cargada: ${clientesData.length} registros`);
}

// Cargar tabla de repartidores
function cargarTablaRepartidores() {
  console.log("🚚 Cargando tabla de repartidores...");

  const tbody = document.getElementById("repartidoresTableBody");
  if (!tbody) {
    console.warn("⚠️ Tabla de repartidores no encontrada");
    return;
  }

  if (repartidoresData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="no-data">No hay repartidores registrados</td></tr>';
    return;
  }

  tbody.innerHTML = repartidoresData
    .map(
      (repartidor) => `
    <tr>
      <td>${repartidor.personalInfo?.name || "N/A"} ${
        repartidor.personalInfo?.lastName || ""
      }</td>
      <td>${repartidor.personalInfo?.phone || "N/A"}</td>
      <td>${repartidor.workInfo?.coverageZones?.[0] || "N/A"}</td>
      <td><span class="status-badge status-${
        repartidor.workInfo?.status || "active"
      }">${repartidor.workInfo?.status || "Activo"}</span></td>
      <td>${repartidor.performance?.totalDeliveries || 0}</td>
    </tr>
  `
    )
    .join("");

  console.log(
    `✅ Tabla de repartidores cargada: ${repartidoresData.length} registros`
  );
}

// Generar reportes
function generarReportes() {
  console.log("📈 Generando reportes...");

  const contenedor = document.getElementById("reportesContenido");
  if (!contenedor) {
    console.warn("⚠️ Contenedor de reportes no encontrado");
    return;
  }

  const totalEnvios = enviosData.length;
  const ingresosTotales = enviosData.reduce(
    (total, envio) => total + (envio.precio || 0),
    0
  );
  const promedioIngreso =
    totalEnvios > 0 ? (ingresosTotales / totalEnvios).toFixed(2) : 0;

  contenedor.innerHTML = `
    <div class="reportes-grid">
      <div class="reporte-card">
        <h3>📊 Resumen General</h3>
        <p><strong>Total Envíos:</strong> ${totalEnvios}</p>
        <p><strong>Ingresos Totales:</strong> $${ingresosTotales.toLocaleString()}</p>
        <p><strong>Promedio por Envío:</strong> $${promedioIngreso}</p>
        <p><strong>Clientes Únicos:</strong> ${
          new Set(enviosData.map((e) => e.cliente?.nombre).filter(Boolean)).size
        }</p>
      </div>
      
      <div class="reporte-card">
        <h3>📈 Estados de Envíos</h3>
        <p><strong>Pendientes:</strong> ${
          enviosData.filter((e) => e.estado === "pendiente").length
        }</p>
        <p><strong>En Tránsito:</strong> ${
          enviosData.filter((e) => e.estado === "en_transito").length
        }</p>
        <p><strong>Entregados:</strong> ${
          enviosData.filter((e) => e.estado === "entregado").length
        }</p>
      </div>
    </div>
  `;

  console.log("✅ Reportes generados");
}

// Cargar configuración
function cargarConfiguracion() {
  console.log("⚙️ Cargando configuración...");

  const contenedor = document.getElementById("configuracionContenido");
  if (!contenedor) {
    console.warn("⚠️ Contenedor de configuración no encontrado");
    return;
  }

  contenedor.innerHTML = `
    <div class="config-section">
      <h3>👤 Información del Usuario</h3>
      <p><strong>Usuario:</strong> ${currentUser?.username || "N/A"}</p>
      <p><strong>Rol:</strong> Administrador</p>
      <p><strong>Último acceso:</strong> ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="config-section">
      <h3>🔧 Configuración del Sistema</h3>
      <p><strong>Versión:</strong> 1.0.0</p>
      <p><strong>Base de datos:</strong> LocalStorage</p>
      <p><strong>Estado:</strong> Operativo</p>
    </div>
  `;

  console.log("✅ Configuración cargada");
}

// Funciones de debug globales
window.debugAdmin = function () {
  console.log("🔧 === DEBUG ADMIN ===");
  console.log("📊 Datos:", {
    enviosData: enviosData.length,
    clientesData: clientesData.length,
    repartidoresData: repartidoresData.length,
  });
  console.log("👤 Usuario:", currentUser);
  console.log(
    "🧭 Navegación:",
    document.querySelectorAll(".nav-item").length,
    "elementos"
  );
};

window.testNavegacion = function (seccion = "dashboard") {
  console.log(`🧪 Probando navegación a: ${seccion}`);
  mostrarSeccion(seccion);
};

console.log("✅ Admin script cargado completamente");
console.log(
  "🛠️ Funciones de debug disponibles: debugAdmin(), testNavegacion('seccion')"
);
// ==========================================
// FUNCIONES DE ASIGNACIÓN DE REPARTIDORES
// ==========================================

// Función para asignación automática de repartidores
function asignacionAutomatica() {
  console.log("🎲 Iniciando asignación automática...");

  try {
    // Filtrar envíos sin repartidor asignado
    const enviosSinAsignar = enviosData.filter(
      (envio) => !envio.repartidorAsignado
    );

    if (enviosSinAsignar.length === 0) {
      mostrarNotificacion("No hay envíos sin asignar", "info");
      return;
    }

    if (repartidoresData.length === 0) {
      mostrarNotificacion("No hay repartidores disponibles", "error");
      return;
    }

    let asignados = 0;

    enviosSinAsignar.forEach((envio) => {
      // Buscar repartidores activos
      const repartidoresActivos = repartidoresData.filter(
        (r) => r.workInfo?.status === "active" || !r.workInfo?.status
      );

      if (repartidoresActivos.length > 0) {
        // Asignar aleatoriamente
        const repartidorAleatorio =
          repartidoresActivos[
            Math.floor(Math.random() * repartidoresActivos.length)
          ];
        envio.repartidorAsignado = repartidorAleatorio.id;
        asignados++;

        console.log(
          `✅ Envío ${envio.numeroGuia} asignado a ${repartidorAleatorio.personalInfo?.name}`
        );
      }
    });

    // Guardar cambios
    localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

    // Actualizar tabla
    cargarTablaEnvios();

    // Mostrar resultado
    mostrarNotificacion(
      `${asignados} envíos asignados automáticamente`,
      "success"
    );

    console.log(
      `🎉 Asignación automática completada: ${asignados} envíos asignados`
    );
  } catch (error) {
    console.error("❌ Error en asignación automática:", error);
    mostrarNotificacion("Error en la asignación automática", "error");
  }
}

// Función para asignación manual de repartidor
function asignarRepartidorManual(numeroGuia) {
  console.log(`👤 Asignación manual para envío: ${numeroGuia}`);

  try {
    // Encontrar el envío
    const envio = enviosData.find((e) => e.numeroGuia === numeroGuia);
    if (!envio) {
      mostrarNotificacion("Envío no encontrado", "error");
      return;
    }

    // Crear modal de selección de repartidor
    const modal = crearModalAsignacion(envio);
    document.body.appendChild(modal);

    // Mostrar modal
    modal.style.display = "flex";
  } catch (error) {
    console.error("❌ Error en asignación manual:", error);
    mostrarNotificacion("Error en la asignación manual", "error");
  }
}

// Crear modal de asignación
function crearModalAsignacion(envio) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modalAsignacion";

  const repartidoresOptions = repartidoresData
    .filter((r) => r.workInfo?.status === "active" || !r.workInfo?.status)
    .map(
      (r) => `
      <option value="${r.id}">
        ${r.personalInfo?.name || "N/A"} ${r.personalInfo?.lastName || ""} 
        - ${r.workInfo?.coverageZones?.[0] || "Sin zona"}
      </option>
    `
    )
    .join("");

  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>👤 Asignar Repartidor</h3>
        <button class="modal-close" onclick="cerrarModalAsignacion()">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="envio-info">
          <h4>📦 Información del Envío</h4>
          <p><strong>Guía:</strong> ${envio.numeroGuia}</p>
          <p><strong>Cliente:</strong> ${envio.cliente?.nombre || "N/A"}</p>
          <p><strong>Ruta:</strong> ${envio.origenCiudad} → ${
    envio.destinoCiudad
  }</p>
          <p><strong>Estado:</strong> ${envio.estado || "Pendiente"}</p>
        </div>
        
        <div class="asignacion-form">
          <label for="selectRepartidor">🚚 Seleccionar Repartidor:</label>
          <select id="selectRepartidor" class="form-select">
            <option value="">-- Seleccionar Repartidor --</option>
            ${repartidoresOptions}
          </select>
        </div>
      </div>
      
      <div class="modal-footer">
        <button onclick="cerrarModalAsignacion()" class="btn-secondary">Cancelar</button>
        <button onclick="confirmarAsignacion('${
          envio.numeroGuia
        }')" class="btn-primary">✅ Asignar</button>
      </div>
    </div>
  `;

  return modal;
}

// Confirmar asignación
function confirmarAsignacion(numeroGuia) {
  const selectRepartidor = document.getElementById("selectRepartidor");
  const repartidorId = selectRepartidor.value;

  if (!repartidorId) {
    mostrarNotificacion("Selecciona un repartidor", "warning");
    return;
  }

  try {
    // Encontrar y actualizar el envío
    const envio = enviosData.find((e) => e.numeroGuia === numeroGuia);
    if (envio) {
      envio.repartidorAsignado = repartidorId;

      // Guardar cambios
      localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

      // Actualizar tabla
      cargarTablaEnvios();

      // Cerrar modal
      cerrarModalAsignacion();

      // Mostrar confirmación
      const repartidor = repartidoresData.find((r) => r.id === repartidorId);
      const nombreRepartidor = `${repartidor.personalInfo?.name || ""} ${
        repartidor.personalInfo?.lastName || ""
      }`.trim();

      mostrarNotificacion(
        `Envío ${numeroGuia} asignado a ${nombreRepartidor}`,
        "success"
      );

      console.log(
        `✅ Envío ${numeroGuia} asignado manualmente a ${nombreRepartidor}`
      );
    }
  } catch (error) {
    console.error("❌ Error confirmando asignación:", error);
    mostrarNotificacion("Error al asignar repartidor", "error");
  }
}

// Cerrar modal de asignación
function cerrarModalAsignacion() {
  const modal = document.getElementById("modalAsignacion");
  if (modal) {
    modal.remove();
  }
}

// Función para cambiar estado de envío
function cambiarEstadoEnvio(numeroGuia) {
  console.log(`🔄 Cambiar estado del envío: ${numeroGuia}`);

  try {
    const envio = enviosData.find((e) => e.numeroGuia === numeroGuia);
    if (!envio) {
      mostrarNotificacion("Envío no encontrado", "error");
      return;
    }

    // Estados disponibles
    const estados = [
      { value: "pendiente", label: "📋 Pendiente" },
      { value: "en_transito", label: "🚚 En Tránsito" },
      { value: "en_reparto", label: "📦 En Reparto" },
      { value: "entregado", label: "✅ Entregado" },
      { value: "cancelado", label: "❌ Cancelado" },
    ];

    const estadoActual = envio.estado || "pendiente";
    const nuevosEstados = estados.filter((e) => e.value !== estadoActual);

    const opciones = nuevosEstados
      .map((e) => `<option value="${e.value}">${e.label}</option>`)
      .join("");

    const nuevoEstado = prompt(
      `Estado actual: ${estadoActual}\n\nSelecciona nuevo estado:\n${nuevosEstados
        .map((e, i) => `${i + 1}. ${e.label}`)
        .join("\n")}\n\nEscribe el número:`
    );

    if (
      nuevoEstado &&
      nuevoEstado >= 1 &&
      nuevoEstado <= nuevosEstados.length
    ) {
      const estadoSeleccionado = nuevosEstados[nuevoEstado - 1];
      envio.estado = estadoSeleccionado.value;

      // Guardar cambios
      localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

      // Actualizar tabla
      cargarTablaEnvios();

      mostrarNotificacion(
        `Estado cambiado a: ${estadoSeleccionado.label}`,
        "success"
      );

      console.log(
        `✅ Estado del envío ${numeroGuia} cambiado a: ${estadoSeleccionado.value}`
      );
    }
  } catch (error) {
    console.error("❌ Error cambiando estado:", error);
    mostrarNotificacion("Error al cambiar estado", "error");
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "info") {
  // Crear elemento de notificación
  const notificacion = document.createElement("div");
  notificacion.className = `notification notification-${tipo}`;

  const iconos = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  notificacion.innerHTML = `
    <span class="notification-icon">${iconos[tipo] || iconos.info}</span>
    <span class="notification-message">${mensaje}</span>
  `;

  // Agregar estilos si no existen
  if (!document.getElementById("notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
      }
      
      .notification-success { background: #27ae60; }
      .notification-error { background: #e74c3c; }
      .notification-warning { background: #f39c12; }
      .notification-info { background: #3498db; }
      
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(styles);
  }

  // Agregar al DOM
  document.body.appendChild(notificacion);

  // Auto-remover después de 4 segundos
  setTimeout(() => {
    notificacion.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      if (notificacion.parentNode) {
        notificacion.parentNode.removeChild(notificacion);
      }
    }, 300);
  }, 4000);

  console.log(`📢 Notificación (${tipo}): ${mensaje}`);
}

console.log("✅ Funciones de asignación de repartidores cargadas");
