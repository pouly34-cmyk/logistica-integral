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
      '<tr><td colspan="6" class="no-data">No hay repartidores registrados</td></tr>';
    return;
  }

  tbody.innerHTML = repartidoresData
    .map(
      (repartidor) => `
    <tr>
      <td>${repartidor.id || "N/A"}</td>
      <td>${repartidor.personalInfo?.name || "N/A"} ${
        repartidor.personalInfo?.lastName || ""
      }</td>
      <td>${repartidor.workInfo?.vehicleType || "N/A"}</td>
      <td>${repartidor.workInfo?.vehicleDetails?.licensePlate || "N/A"}</td>
      <td><span class="status-badge status-${
        repartidor.workInfo?.status || "active"
      }">${
        repartidor.workInfo?.status === "active"
          ? "Activo"
          : repartidor.workInfo?.status === "inactive"
          ? "Inactivo"
          : "Activo"
      }</span></td>
      <td>
        <button onclick="verRepartidor('${
          repartidor.id
        }')" class="btn-small btn-primary" title="Ver Detalles">
          👁️ Ver
        </button>
        <button onclick="editarRepartidor('${
          repartidor.id
        }')" class="btn-small btn-secondary" title="Editar">
          ✏️ Editar
        </button>
      </td>
    </tr>
  `
    )
    .join("");

  console.log(
    `✅ Tabla de repartidores cargada: ${repartidoresData.length} registros`
  );

  // Configurar botón agregar repartidor
  configurarBotonAgregarRepartidor();
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
// ==========================================
// GESTIÓN DE REPARTIDORES
// ==========================================

// Configurar botón agregar repartidor
function configurarBotonAgregarRepartidor() {
  const addBtn = document.getElementById("addRepartidorBtn");
  if (addBtn) {
    // Remover eventos anteriores
    addBtn.onclick = null;

    // Agregar nuevo evento
    addBtn.addEventListener("click", function () {
      console.log("➕ Abriendo modal agregar repartidor");
      mostrarModalAgregarRepartidor();
    });

    console.log("✅ Botón agregar repartidor configurado");
  } else {
    console.warn("⚠️ Botón addRepartidorBtn no encontrado");
  }
}

// Mostrar modal para agregar repartidor
function mostrarModalAgregarRepartidor() {
  const modal = crearModalRepartidor();
  document.body.appendChild(modal);
  modal.style.display = "flex";
}

// Crear modal de repartidor
function crearModalRepartidor(repartidor = null) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modalRepartidor";

  const isEdit = repartidor !== null;
  const titulo = isEdit ? "✏️ Editar Repartidor" : "➕ Agregar Repartidor";

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h3>${titulo}</h3>
        <button class="modal-close" onclick="cerrarModalRepartidor()">&times;</button>
      </div>
      
      <div class="modal-body">
        <form id="formRepartidor">
          <div class="form-grid">
            <div class="form-group">
              <label for="repartidorNombre">👤 Nombre *</label>
              <input type="text" id="repartidorNombre" class="form-input" required 
                     value="${
                       repartidor?.personalInfo?.name || ""
                     }" placeholder="Nombre del repartidor">
            </div>
            
            <div class="form-group">
              <label for="repartidorApellido">👤 Apellido *</label>
              <input type="text" id="repartidorApellido" class="form-input" required 
                     value="${
                       repartidor?.personalInfo?.lastName || ""
                     }" placeholder="Apellido del repartidor">
            </div>
            
            <div class="form-group">
              <label for="repartidorTelefono">📱 Teléfono *</label>
              <input type="tel" id="repartidorTelefono" class="form-input" required 
                     value="${
                       repartidor?.personalInfo?.phone || ""
                     }" placeholder="Número de teléfono">
            </div>
            
            <div class="form-group">
              <label for="repartidorEmail">📧 Email</label>
              <input type="email" id="repartidorEmail" class="form-input" 
                     value="${
                       repartidor?.personalInfo?.email || ""
                     }" placeholder="Correo electrónico">
            </div>
            
            <div class="form-group">
              <label for="repartidorVehiculo">🚗 Tipo de Vehículo *</label>
              <select id="repartidorVehiculo" class="form-select" required>
                <option value="">Seleccionar vehículo</option>
                <option value="motorcycle" ${
                  repartidor?.workInfo?.vehicleType === "motorcycle"
                    ? "selected"
                    : ""
                }>🏍️ Motocicleta</option>
                <option value="bicycle" ${
                  repartidor?.workInfo?.vehicleType === "bicycle"
                    ? "selected"
                    : ""
                }>🚲 Bicicleta</option>
                <option value="car" ${
                  repartidor?.workInfo?.vehicleType === "car" ? "selected" : ""
                }>🚗 Automóvil</option>
                <option value="van" ${
                  repartidor?.workInfo?.vehicleType === "van" ? "selected" : ""
                }>🚐 Camioneta</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="repartidorPlaca">🔢 Placa del Vehículo</label>
              <input type="text" id="repartidorPlaca" class="form-input" 
                     value="${
                       repartidor?.workInfo?.vehicleDetails?.licensePlate || ""
                     }" 
                     placeholder="Número de placa" style="text-transform: uppercase;">
            </div>
            
            <div class="form-group">
              <label for="repartidorZona">📍 Zona de Cobertura *</label>
              <select id="repartidorZona" class="form-select" required>
                <option value="">Seleccionar zona</option>
                <option value="CDMX Norte" ${
                  repartidor?.workInfo?.coverageZones?.[0] === "CDMX Norte"
                    ? "selected"
                    : ""
                }>CDMX Norte</option>
                <option value="CDMX Sur" ${
                  repartidor?.workInfo?.coverageZones?.[0] === "CDMX Sur"
                    ? "selected"
                    : ""
                }>CDMX Sur</option>
                <option value="CDMX Centro" ${
                  repartidor?.workInfo?.coverageZones?.[0] === "CDMX Centro"
                    ? "selected"
                    : ""
                }>CDMX Centro</option>
                <option value="CDMX Oriente" ${
                  repartidor?.workInfo?.coverageZones?.[0] === "CDMX Oriente"
                    ? "selected"
                    : ""
                }>CDMX Oriente</option>
                <option value="CDMX Poniente" ${
                  repartidor?.workInfo?.coverageZones?.[0] === "CDMX Poniente"
                    ? "selected"
                    : ""
                }>CDMX Poniente</option>
                <option value="Puebla Centro" ${
                  repartidor?.workInfo?.coverageZones?.[0] === "Puebla Centro"
                    ? "selected"
                    : ""
                }>Puebla Centro</option>
                <option value="Puebla Norte" ${
                  repartidor?.workInfo?.coverageZones?.[0] === "Puebla Norte"
                    ? "selected"
                    : ""
                }>Puebla Norte</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="repartidorEstado">⚡ Estado</label>
              <select id="repartidorEstado" class="form-select">
                <option value="active" ${
                  repartidor?.workInfo?.status === "active" || !repartidor
                    ? "selected"
                    : ""
                }>✅ Activo</option>
                <option value="inactive" ${
                  repartidor?.workInfo?.status === "inactive" ? "selected" : ""
                }>❌ Inactivo</option>
                <option value="suspended" ${
                  repartidor?.workInfo?.status === "suspended" ? "selected" : ""
                }>⏸️ Suspendido</option>
              </select>
            </div>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button onclick="cerrarModalRepartidor()" class="btn-secondary">Cancelar</button>
        <button onclick="guardarRepartidor(${
          isEdit ? `'${repartidor?.id}'` : "null"
        })" class="btn-primary">
          ${isEdit ? "💾 Actualizar" : "➕ Agregar"} Repartidor
        </button>
      </div>
    </div>
  `;

  return modal;
}

// Guardar repartidor (nuevo o editado)
function guardarRepartidor(repartidorId = null) {
  console.log("💾 Guardando repartidor...");

  try {
    // Obtener datos del formulario
    const nombre = document.getElementById("repartidorNombre").value.trim();
    const apellido = document.getElementById("repartidorApellido").value.trim();
    const telefono = document.getElementById("repartidorTelefono").value.trim();
    const email = document.getElementById("repartidorEmail").value.trim();
    const vehiculo = document.getElementById("repartidorVehiculo").value;
    const placa = document
      .getElementById("repartidorPlaca")
      .value.trim()
      .toUpperCase();
    const zona = document.getElementById("repartidorZona").value;
    const estado = document.getElementById("repartidorEstado").value;

    // Validaciones
    if (!nombre || !apellido || !telefono || !vehiculo || !zona) {
      mostrarNotificacion(
        "Por favor completa todos los campos obligatorios",
        "warning"
      );
      return;
    }

    // Crear objeto repartidor
    const repartidorData = {
      id: repartidorId || `REP-${Date.now()}`,
      personalInfo: {
        name: nombre,
        lastName: apellido,
        phone: telefono,
        email: email || null,
        address: "",
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
      },
      workInfo: {
        employeeId: repartidorId || `EMP-${Date.now()}`,
        startDate: new Date().toISOString(),
        status: estado,
        coverageZones: [zona],
        vehicleType: vehiculo,
        vehicleDetails: {
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          licensePlate: placa,
          color: "",
        },
      },
      credentials: {
        username: `${nombre.toLowerCase()}.${apellido.toLowerCase()}`,
        password: "repartidor123",
        lastLogin: null,
      },
      performance: {
        totalDeliveries: 0,
        completedDeliveries: 0,
        averageRating: 0,
        onTimeDeliveryRate: 0,
        currentAssignedShipments: [],
      },
      timestamps: {
        created: repartidorId ? undefined : new Date().toISOString(),
        updated: new Date().toISOString(),
        lastActive: null,
      },
    };

    // Agregar o actualizar repartidor
    if (repartidorId) {
      // Actualizar existente
      const index = repartidoresData.findIndex((r) => r.id === repartidorId);
      if (index !== -1) {
        // Mantener datos originales importantes
        repartidorData.timestamps.created =
          repartidoresData[index].timestamps?.created;
        repartidorData.performance =
          repartidoresData[index].performance || repartidorData.performance;

        repartidoresData[index] = repartidorData;
        console.log(`✅ Repartidor ${repartidorId} actualizado`);
      }
    } else {
      // Agregar nuevo
      repartidoresData.push(repartidorData);
      console.log(`✅ Nuevo repartidor agregado: ${repartidorData.id}`);
    }

    // Guardar en localStorage
    localStorage.setItem("repartidoresData", JSON.stringify(repartidoresData));

    // Actualizar tabla
    cargarTablaRepartidores();

    // Cerrar modal
    cerrarModalRepartidor();

    // Mostrar confirmación
    const accion = repartidorId ? "actualizado" : "agregado";
    mostrarNotificacion(
      `Repartidor ${accion} exitosamente: ${nombre} ${apellido}`,
      "success"
    );
  } catch (error) {
    console.error("❌ Error guardando repartidor:", error);
    mostrarNotificacion("Error al guardar repartidor", "error");
  }
}

// Ver detalles del repartidor
function verRepartidor(repartidorId) {
  console.log(`👁️ Ver repartidor: ${repartidorId}`);

  const repartidor = repartidoresData.find((r) => r.id === repartidorId);
  if (!repartidor) {
    mostrarNotificacion("Repartidor no encontrado", "error");
    return;
  }

  const modal = crearModalDetalleRepartidor(repartidor);
  document.body.appendChild(modal);
  modal.style.display = "flex";
}

// Crear modal de detalle del repartidor
function crearModalDetalleRepartidor(repartidor) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "modalDetalleRepartidor";

  const estadoColor = {
    active: "🟢",
    inactive: "🔴",
    suspended: "🟡",
  };

  const estadoTexto = {
    active: "Activo",
    inactive: "Inactivo",
    suspended: "Suspendido",
  };

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h3>👁️ Detalles del Repartidor</h3>
        <button class="modal-close" onclick="cerrarModalDetalleRepartidor()">&times;</button>
      </div>
      
      <div class="modal-body">
        <div class="repartidor-detalle">
          <div class="detalle-section">
            <h4>👤 Información Personal</h4>
            <p><strong>ID:</strong> ${repartidor.id}</p>
            <p><strong>Nombre:</strong> ${
              repartidor.personalInfo?.name || "N/A"
            } ${repartidor.personalInfo?.lastName || ""}</p>
            <p><strong>Teléfono:</strong> ${
              repartidor.personalInfo?.phone || "N/A"
            }</p>
            <p><strong>Email:</strong> ${
              repartidor.personalInfo?.email || "No especificado"
            }</p>
          </div>
          
          <div class="detalle-section">
            <h4>🚗 Información Laboral</h4>
            <p><strong>Estado:</strong> ${
              estadoColor[repartidor.workInfo?.status] || "🟢"
            } ${estadoTexto[repartidor.workInfo?.status] || "Activo"}</p>
            <p><strong>Zona:</strong> ${
              repartidor.workInfo?.coverageZones?.[0] || "N/A"
            }</p>
            <p><strong>Vehículo:</strong> ${
              repartidor.workInfo?.vehicleType || "N/A"
            }</p>
            <p><strong>Placa:</strong> ${
              repartidor.workInfo?.vehicleDetails?.licensePlate || "N/A"
            }</p>
            <p><strong>Fecha de ingreso:</strong> ${
              repartidor.workInfo?.startDate
                ? new Date(repartidor.workInfo.startDate).toLocaleDateString()
                : "N/A"
            }</p>
          </div>
          
          <div class="detalle-section">
            <h4>📊 Rendimiento</h4>
            <p><strong>Entregas totales:</strong> ${
              repartidor.performance?.totalDeliveries || 0
            }</p>
            <p><strong>Entregas completadas:</strong> ${
              repartidor.performance?.completedDeliveries || 0
            }</p>
            <p><strong>Envíos asignados:</strong> ${
              repartidor.performance?.currentAssignedShipments?.length || 0
            }</p>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button onclick="cerrarModalDetalleRepartidor()" class="btn-secondary">Cerrar</button>
        <button onclick="editarRepartidor('${
          repartidor.id
        }')" class="btn-primary">✏️ Editar</button>
      </div>
    </div>
  `;

  return modal;
}

// Editar repartidor
function editarRepartidor(repartidorId) {
  console.log(`✏️ Editar repartidor: ${repartidorId}`);

  // Cerrar modal de detalle si está abierto
  cerrarModalDetalleRepartidor();

  const repartidor = repartidoresData.find((r) => r.id === repartidorId);
  if (!repartidor) {
    mostrarNotificacion("Repartidor no encontrado", "error");
    return;
  }

  const modal = crearModalRepartidor(repartidor);
  document.body.appendChild(modal);
  modal.style.display = "flex";
}

// Cerrar modales
function cerrarModalRepartidor() {
  const modal = document.getElementById("modalRepartidor");
  if (modal) {
    modal.remove();
  }
}

function cerrarModalDetalleRepartidor() {
  const modal = document.getElementById("modalDetalleRepartidor");
  if (modal) {
    modal.remove();
  }
}

console.log("✅ Funciones de gestión de repartidores cargadas");
