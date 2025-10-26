// Panel de Administración - Versión Simplificada
console.log("Cargando admin script...");

// Variables globales
let enviosData = [];
let currentUser = null;
let isInitialized = false;

// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM listo, iniciando admin...");

  // Evitar inicialización múltiple
  if (isInitialized) {
    console.log("Ya está inicializado, saliendo...");
    return;
  }
  isInitialized = true;

  // Verificar autenticación una sola vez
  if (!verificarAuth()) {
    return;
  }

  // Inicializar todo
  inicializarAdmin();
});

// Verificar autenticación simple
function verificarAuth() {
  try {
    // Limpiar datos inconsistentes del sistema anterior
    const oldLogin = localStorage.getItem("adminLoggedIn");
    const oldUser = localStorage.getItem("adminUser");

    if (oldLogin && typeof oldUser === "string" && !oldUser.startsWith("{")) {
      // Datos del sistema anterior, limpiar
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminLoginTime");
      localStorage.removeItem("adminUser");
      console.log("Limpiando datos de login antiguos...");
      window.location.replace("login.html");
      return false;
    }

    const user = localStorage.getItem("adminUser");
    if (!user) {
      console.log("No hay usuario, redirigiendo a login...");
      window.location.replace("login.html");
      return false;
    }

    currentUser = JSON.parse(user);

    // Verificar que el objeto tenga la estructura correcta
    if (!currentUser.username || !currentUser.name) {
      console.log("Datos de usuario inválidos, redirigiendo a login...");
      localStorage.removeItem("adminUser");
      window.location.replace("login.html");
      return false;
    }

    console.log("Usuario válido:", currentUser.username);
    return true;
  } catch (error) {
    console.error("Error de autenticación:", error);
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminLoginTime");
    window.location.replace("login.html");
    return false;
  }
}

// Inicializar admin
function inicializarAdmin() {
  console.log("🚀 Inicializando admin...");

  try {
    // Cargar datos
    console.log("📊 Cargando datos...");
    cargarDatos();

    // Configurar UI
    console.log("🎨 Configurando UI...");
    configurarUI();

    // Configurar navegación
    console.log("🧭 Configurando navegación...");
    configurarNavegacion();

    // Verificar que la navegación funciona
    const navItems = document.querySelectorAll(".nav-item");
    console.log(`🔍 Items de navegación encontrados: ${navItems.length}`);

    navItems.forEach((item, index) => {
      const section = item.getAttribute("data-section");
      console.log(`  ${index + 1}. ${section} - ${item.textContent.trim()}`);
    });

    // Inicializar gestores principales
    setTimeout(() => {
      if (!clientManager) {
        console.log("👥 Inicializando clientManager en startup...");
        clientManager = new ClientManager();
      }
    }, 1000);

    // Mostrar dashboard inicial
    console.log("🏠 Mostrando dashboard inicial...");
    mostrarSeccion("dashboard");

    console.log("✅ Admin inicializado correctamente");
  } catch (error) {
    console.error("❌ Error inicializando admin:", error);
    alert(
      "Error inicializando el panel de administración. Revisa la consola para más detalles."
    );
  }
}

// Cargar datos
function cargarDatos() {
  try {
    const envios = localStorage.getItem("enviosLogistica");
    enviosData = envios ? JSON.parse(envios) : [];
    console.log("Datos cargados:", enviosData.length, "envíos");
  } catch (error) {
    console.error("Error cargando datos:", error);
    enviosData = [];
  }
}

// Configurar UI
function configurarUI() {
  // Mostrar nombre de usuario
  const userNameEl = document.getElementById("userName");
  if (userNameEl && currentUser) {
    userNameEl.textContent =
      currentUser.name || currentUser.username || "Admin";
  }

  // Configurar botón de página principal
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.onclick = function (e) {
      e.preventDefault();
      irAPaginaPrincipal();
    };
  }

  // Configurar logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = function (e) {
      e.preventDefault();
      cerrarSesion();
    };
  }
}

// Configurar navegación
function configurarNavegacion() {
  console.log("🧭 Configurando navegación...");

  const navItems = document.querySelectorAll(".nav-item");
  console.log(`📋 Encontrados ${navItems.length} elementos de navegación`);

  if (navItems.length === 0) {
    console.error("❌ No se encontraron elementos .nav-item");
    return;
  }

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
        try {
          mostrarSeccion(seccion);
          actualizarNavActiva(this);
          console.log(`✅ Navegación a ${seccion} exitosa`);
        } catch (error) {
          console.error(`❌ Error navegando a ${seccion}:`, error);
        }
      } else {
        console.error("❌ No se encontró data-section en el elemento");
      }
    });
  });

  console.log("✅ Navegación configurada correctamente");
}

// Mostrar sección
function mostrarSeccion(nombreSeccion) {
  console.log("Mostrando sección:", nombreSeccion);

  // Ocultar todas las secciones
  const secciones = document.querySelectorAll(".content-section");
  secciones.forEach((seccion) => {
    seccion.classList.remove("active");
  });

  // Mostrar sección seleccionada
  const seccionTarget = document.getElementById(nombreSeccion + "-section");
  if (seccionTarget) {
    seccionTarget.classList.add("active");
  }

  // Actualizar título
  const titulo = document.getElementById("pageTitle");
  if (titulo) {
    const titulos = {
      dashboard: "Dashboard",
      envios: "Gestión de Envíos",
      clientes: "Gestión de Clientes",
      repartidores: "Gestión de Repartidores",
      reportes: "Reportes",
      configuracion: "Configuración",
    };
    titulo.textContent = titulos[nombreSeccion] || "Dashboard";
  }

  // Cargar contenido específico
  if (nombreSeccion === "dashboard") {
    actualizarDashboard();
  } else if (nombreSeccion === "envios") {
    cargarTablaEnviosConAsignaciones();
    initializeAssignments();
  } else if (nombreSeccion === "repartidores") {
    // Usar setTimeout para asegurar que el DOM esté listo
    setTimeout(() => {
      initializeRepartidoresSection();
    }, 100);
  } else if (nombreSeccion === "reportes") {
    setTimeout(() => {
      initializeReportesSection();
    }, 100);
  } else if (nombreSeccion === "clientes") {
    setTimeout(() => {
      initializeClientesSection();
    }, 100);
  }
}

// Actualizar navegación activa
function actualizarNavActiva(itemActivo) {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => item.classList.remove("active"));
  itemActivo.classList.add("active");
}

// Actualizar dashboard
function actualizarDashboard() {
  console.log("Actualizando dashboard...");

  try {
    // Estadísticas básicas
    const total = enviosData.length;
    const hoy = new Date().toDateString();
    const enviosHoy = enviosData.filter(
      (e) => new Date(e.fechaCreacion).toDateString() === hoy
    ).length;
    const pendientes = enviosData.filter(
      (e) => !e.estado || e.estado === "pendiente"
    ).length;
    const ingresos = enviosData
      .filter((e) => new Date(e.fechaCreacion).toDateString() === hoy)
      .reduce((sum, e) => sum + (e.precio || 0), 0);

    // Actualizar elementos
    actualizarElemento("totalEnvios", total);
    actualizarElemento("enviosHoy", enviosHoy);
    actualizarElemento("enviosPendientes", pendientes);
    actualizarElemento("ingresosHoy", `$${ingresos}`);

    // Actualizar tabla de recientes
    actualizarEnviosRecientes();

    // Actualizar gráfico de estados
    actualizarEstados();
  } catch (error) {
    console.error("Error actualizando dashboard:", error);
  }
}

// Actualizar elemento por ID
function actualizarElemento(id, valor) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.textContent = valor;
  }
}

// Actualizar envíos recientes
function actualizarEnviosRecientes() {
  const tbody = document.getElementById("recentEnviosBody");
  if (!tbody) return;

  if (enviosData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="no-data">No hay envíos recientes</td></tr>';
    return;
  }

  const recientes = enviosData.slice(-5).reverse();
  tbody.innerHTML = recientes
    .map(
      (envio) => `
    <tr>
      <td>${envio.numeroGuia}</td>
      <td>${envio.cliente?.nombre || "N/A"}</td>
      <td>${envio.origenCiudad} → ${envio.destinoCiudad}</td>
      <td><span class="status-badge status-${
        envio.estado || "pendiente"
      }">${obtenerTextoEstado(envio.estado)}</span></td>
      <td>${new Date(envio.fechaCreacion).toLocaleDateString()}</td>
    </tr>
  `
    )
    .join("");
}

// Actualizar estados
function actualizarEstados() {
  const pendientes = enviosData.filter(
    (e) => !e.estado || e.estado === "pendiente"
  ).length;
  const transito = enviosData.filter((e) => e.estado === "en_transito").length;
  const entregados = enviosData.filter((e) => e.estado === "entregado").length;

  actualizarElemento("statusPendientes", pendientes);
  actualizarElemento("statusTransito", transito);
  actualizarElemento("statusEntregados", entregados);
}

// Cargar tabla de envíos con asignaciones
function cargarTablaEnvios() {
  const tbody = document.getElementById("enviosTableBody");
  if (!tbody) return;

  if (enviosData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="11" class="no-data">No hay envíos registrados</td></tr>';
    return;
  }

  tbody.innerHTML = enviosData
    .map(
      (envio) => `
    <tr>
      <td>${envio.numeroGuia}</td>
      <td>${envio.cliente?.nombre || "N/A"}</td>
      <td>${envio.cliente?.telefono || "N/A"}</td>
      <td>${envio.origenCiudad}</td>
      <td>${envio.destinoCiudad}</td>
      <td>${envio.tipoEnvio} (${envio.unidades})</td>
      <td>$${envio.precio}</td>
      <td>
        <select onchange="cambiarEstado('${
          envio.numeroGuia
        }', this.value)" class="status-select">
          <option value="pendiente" ${
            (envio.estado || "pendiente") === "pendiente" ? "selected" : ""
          }>Pendiente</option>
          <option value="en_transito" ${
            envio.estado === "en_transito" ? "selected" : ""
          }>En Tránsito</option>
          <option value="entregado" ${
            envio.estado === "entregado" ? "selected" : ""
          }>Entregado</option>
        </select>
      </td>
      <td>${new Date(envio.fechaCreacion).toLocaleDateString()}</td>
      <td>
        <button onclick="verDetalle('${
          envio.numeroGuia
        }')" class="btn-action">Ver</button>
      </td>
    </tr>
  `
    )
    .join("");
}

// Cambiar estado de envío
function cambiarEstado(numeroGuia, nuevoEstado) {
  try {
    const index = enviosData.findIndex((e) => e.numeroGuia === numeroGuia);
    if (index !== -1) {
      enviosData[index].estado = nuevoEstado;
      enviosData[index].fechaActualizacion = new Date().toISOString();

      localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

      mostrarNotificacion(
        `Estado actualizado: ${obtenerTextoEstado(nuevoEstado)}`,
        "success"
      );

      // Actualizar dashboard si está visible
      if (
        document
          .getElementById("dashboard-section")
          .classList.contains("active")
      ) {
        actualizarDashboard();
      }
    }
  } catch (error) {
    console.error("Error cambiando estado:", error);
    mostrarNotificacion("Error al actualizar estado", "error");
  }
}

// Ver detalle de envío
function verDetalle(numeroGuia) {
  const envio = enviosData.find((e) => e.numeroGuia === numeroGuia);
  if (envio) {
    const detalle = `Envío: ${numeroGuia}
Cliente: ${envio.cliente?.nombre || "N/A"}
Origen: ${envio.origenCiudad}
Destino: ${envio.destinoCiudad}
Precio: $${envio.precio}
Estado: ${obtenerTextoEstado(envio.estado)}`;

    alert(detalle);
  }
}

// Obtener texto del estado
function obtenerTextoEstado(estado) {
  const estados = {
    pendiente: "Pendiente",
    en_transito: "En Tránsito",
    entregado: "Entregado",
  };
  return estados[estado] || "Pendiente";
}

// Ir a página principal
function irAPaginaPrincipal() {
  try {
    console.log("Navegando a página principal...");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error navegando a página principal:", error);
    window.open("index.html", "_blank");
  }
}

// Cerrar sesión
function cerrarSesion() {
  try {
    console.log("Cerrando sesión...");
    localStorage.removeItem("adminUser");
    window.location.replace("login.html");
  } catch (error) {
    console.error("Error cerrando sesión:", error);
    window.location.href = "login.html";
  }
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = "info") {
  // Remover notificación anterior
  const existente = document.querySelector(".notification");
  if (existente) {
    existente.remove();
  }

  // Crear notificación
  const notif = document.createElement("div");
  notif.className = "notification";
  notif.textContent = mensaje;

  // Estilos
  notif.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    max-width: 300px;
  `;

  // Color según tipo
  const colores = {
    success: "#27ae60",
    error: "#e74c3c",
    info: "#3498db",
  };
  notif.style.backgroundColor = colores[tipo] || "#95a5a6";

  document.body.appendChild(notif);

  // Remover después de 3 segundos
  setTimeout(() => {
    if (notif.parentNode) {
      notif.remove();
    }
  }, 3000);
}

// Funciones globales para HTML
window.mostrarSeccion = mostrarSeccion;
window.cambiarEstado = cambiarEstado;
window.verDetalle = verDetalle;

// Función de prueba para el modal de repartidores
window.testRepartidorModal = function () {
  console.log("Función de prueba ejecutada");
  if (!deliveryManager) {
    console.log("Creando deliveryManager desde función de prueba");
    deliveryManager = new DeliveryPersonnelManager();
  }
  console.log("Mostrando modal desde función de prueba");
  deliveryManager.showAddRepartidorModal();
};

console.log("Admin script cargado completamente");

// ==================== GESTIÓN DE REPARTIDORES ====================

// Variables para repartidores
let repartidoresData = [];
let currentRepartidorId = null;

// Clase para gestión de repartidores
class DeliveryPersonnelManager {
  constructor() {
    console.log("Inicializando DeliveryPersonnelManager...");
    this.loadRepartidores();
    this.initializeRepartidoresEvents();
  }

  // Cargar repartidores del localStorage
  loadRepartidores() {
    try {
      const stored = localStorage.getItem("repartidores");
      repartidoresData = stored ? JSON.parse(stored) : [];
      console.log("Repartidores cargados:", repartidoresData.length);
    } catch (error) {
      console.error("Error cargando repartidores:", error);
      repartidoresData = [];
    }
  }

  // Guardar repartidores en localStorage
  saveRepartidores() {
    try {
      localStorage.setItem("repartidores", JSON.stringify(repartidoresData));
      console.log("Repartidores guardados");
    } catch (error) {
      console.error("Error guardando repartidores:", error);
    }
  }

  // Inicializar eventos
  initializeRepartidoresEvents() {
    // Botón agregar repartidor
    const addBtn = document.getElementById("addRepartidorBtn");
    console.log("Buscando botón addRepartidorBtn:", addBtn);
    if (addBtn) {
      console.log("Configurando evento click para addRepartidorBtn");
      addBtn.addEventListener("click", () => {
        console.log("Click en botón agregar repartidor");
        this.showAddRepartidorModal();
      });
    } else {
      console.error("No se encontró el botón addRepartidorBtn");
    }

    // Modal eventos
    const modal = document.getElementById("repartidorModal");
    const closeBtn = document.getElementById("closeRepartidorModal");
    const cancelBtn = document.getElementById("cancelRepartidor");
    const form = document.getElementById("repartidorForm");

    if (closeBtn)
      closeBtn.addEventListener("click", () => this.closeRepartidorModal());
    if (cancelBtn)
      cancelBtn.addEventListener("click", () => this.closeRepartidorModal());
    if (form)
      form.addEventListener("submit", (e) => this.handleRepartidorSubmit(e));

    // Modal de vista
    const viewModal = document.getElementById("viewRepartidorModal");
    const closeViewBtn = document.getElementById("closeViewRepartidorModal");
    const closeViewBtn2 = document.getElementById("closeViewRepartidor");
    const editFromViewBtn = document.getElementById("editRepartidorFromView");

    if (closeViewBtn)
      closeViewBtn.addEventListener("click", () =>
        this.closeViewRepartidorModal()
      );
    if (closeViewBtn2)
      closeViewBtn2.addEventListener("click", () =>
        this.closeViewRepartidorModal()
      );
    if (editFromViewBtn)
      editFromViewBtn.addEventListener("click", () =>
        this.editRepartidorFromView()
      );

    // Filtros y búsqueda
    const searchInput = document.getElementById("searchRepartidores");
    const filterSelect = document.getElementById("filterEstadoRepartidor");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterRepartidores());
    }
    if (filterSelect) {
      filterSelect.addEventListener("change", () => this.filterRepartidores());
    }

    // Cerrar modales al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (e.target === modal) this.closeRepartidorModal();
      if (e.target === viewModal) this.closeViewRepartidorModal();
    });
  }

  // Mostrar modal para agregar repartidor
  showAddRepartidorModal() {
    console.log("Mostrando modal para agregar repartidor");
    currentRepartidorId = null;
    document.getElementById("repartidorModalTitle").textContent =
      "Agregar Repartidor";
    document.getElementById("saveRepartidorText").textContent =
      "Guardar Repartidor";

    // Limpiar formulario
    document.getElementById("repartidorForm").reset();

    // Generar ID de empleado automático
    const newId = this.generateEmployeeId();
    document.getElementById("repartidorEmpleadoId").value = newId;

    document.getElementById("repartidorModal").style.display = "block";
  }

  // Mostrar modal para editar repartidor
  showEditRepartidorModal(repartidorId) {
    const repartidor = repartidoresData.find((r) => r.id === repartidorId);
    if (!repartidor) return;

    currentRepartidorId = repartidorId;
    document.getElementById("repartidorModalTitle").textContent =
      "Editar Repartidor";
    document.getElementById("saveRepartidorText").textContent =
      "Actualizar Repartidor";

    // Llenar formulario con datos existentes
    this.fillRepartidorForm(repartidor);

    document.getElementById("repartidorModal").style.display = "block";
  }

  // Llenar formulario con datos del repartidor
  fillRepartidorForm(repartidor) {
    document.getElementById("repartidorNombre").value =
      repartidor.personalInfo.name || "";
    document.getElementById("repartidorApellido").value =
      repartidor.personalInfo.lastName || "";
    document.getElementById("repartidorEmpleadoId").value =
      repartidor.workInfo.employeeId || "";
    document.getElementById("vehiculoTipo").value =
      repartidor.workInfo.vehicleType || "";
    document.getElementById("vehiculoPlacas").value =
      repartidor.workInfo.vehicleDetails?.licensePlate || "";
  }

  // Cerrar modal de repartidor
  closeRepartidorModal() {
    document.getElementById("repartidorModal").style.display = "none";
    currentRepartidorId = null;
  }

  // Manejar envío del formulario
  handleRepartidorSubmit(e) {
    e.preventDefault();

    try {
      const formData = this.getFormData();

      if (currentRepartidorId) {
        this.updateRepartidor(currentRepartidorId, formData);
      } else {
        this.addRepartidor(formData);
      }

      this.closeRepartidorModal();
      this.renderRepartidoresTable();
    } catch (error) {
      console.error("Error al guardar repartidor:", error);
      alert("Error al guardar el repartidor. Por favor, revise los datos.");
    }
  }

  // Obtener datos del formulario
  getFormData() {
    return {
      personalInfo: {
        name: document.getElementById("repartidorNombre").value.trim(),
        lastName: document.getElementById("repartidorApellido").value.trim(),
        phone: "",
        email: "",
        address: "",
        emergencyContact: {
          name: "",
          phone: "",
          relationship: "",
        },
      },
      workInfo: {
        employeeId: document
          .getElementById("repartidorEmpleadoId")
          .value.trim(),
        status: "active",
        coverageZones: ["cdmx-centro"], // Zona por defecto
        vehicleType: document.getElementById("vehiculoTipo").value,
        vehicleDetails: {
          brand: "",
          model: "",
          year: null,
          licensePlate: document
            .getElementById("vehiculoPlacas")
            .value.trim()
            .toUpperCase(),
          color: "",
        },
      },
    };
  }

  // Agregar nuevo repartidor
  addRepartidor(formData) {
    const newRepartidor = {
      id: this.generateUniqueId(),
      ...formData,
      credentials: {
        username: this.generateUsername(
          formData.personalInfo.name,
          formData.personalInfo.lastName
        ),
        password: this.generatePassword(),
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
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        lastActive: null,
      },
    };

    // Agregar fecha de inicio si no existe
    if (!newRepartidor.workInfo.startDate) {
      newRepartidor.workInfo.startDate = new Date().toISOString();
    }

    repartidoresData.push(newRepartidor);
    this.saveRepartidores();

    console.log("Repartidor agregado:", newRepartidor);
    alert(
      `Repartidor agregado exitosamente.\nUsuario: ${newRepartidor.credentials.username}\nContraseña: ${newRepartidor.credentials.password}`
    );
  }

  // Actualizar repartidor existente
  updateRepartidor(id, formData) {
    const index = repartidoresData.findIndex((r) => r.id === id);
    if (index === -1) return;

    repartidoresData[index] = {
      ...repartidoresData[index],
      ...formData,
      timestamps: {
        ...repartidoresData[index].timestamps,
        updated: new Date().toISOString(),
      },
    };

    this.saveRepartidores();
    console.log("Repartidor actualizado:", repartidoresData[index]);
  }

  // Generar ID único
  generateUniqueId() {
    return "REP_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Generar ID de empleado
  generateEmployeeId() {
    const count = repartidoresData.length + 1;
    return "EMP" + count.toString().padStart(4, "0");
  }

  // Generar nombre de usuario
  generateUsername(name, lastName) {
    const cleanName = name.toLowerCase().replace(/[^a-z]/g, "");
    const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, "");
    const number = Math.floor(Math.random() * 999) + 1;
    return `${cleanName.substr(0, 3)}${cleanLastName.substr(0, 3)}${number}`;
  }

  // Generar contraseña temporal
  generatePassword() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Renderizar tabla de repartidores
  renderRepartidoresTable(filteredData = null) {
    const tbody = document.getElementById("repartidoresTableBody");
    if (!tbody) return;

    const dataToRender = filteredData || repartidoresData;

    if (dataToRender.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" class="no-data">No hay repartidores registrados</td></tr>';
      return;
    }

    tbody.innerHTML = dataToRender
      .map((repartidor) => {
        const fullName = `${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName}`;
        const vehicleType = this.getVehicleDisplay(
          repartidor.workInfo.vehicleType
        );
        const licensePlate =
          repartidor.workInfo.vehicleDetails?.licensePlate || "Sin asignar";

        return `
        <tr>
          <td><strong>${repartidor.workInfo.employeeId}</strong></td>
          <td>${fullName}</td>
          <td>${vehicleType}</td>
          <td><strong>${licensePlate}</strong></td>
          <td><span class="status-repartidor ${
            repartidor.workInfo.status
          }">${this.getStatusDisplay(repartidor.workInfo.status)}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn-action btn-view" onclick="deliveryManager.showRepartidorDetails('${
                repartidor.id
              }')" title="Ver detalles">👁️</button>
              <button class="btn-action btn-edit" onclick="deliveryManager.showEditRepartidorModal('${
                repartidor.id
              }')" title="Editar">✏️</button>
              <button class="btn-action btn-toggle ${
                repartidor.workInfo.status
              }" onclick="deliveryManager.toggleRepartidorStatus('${
          repartidor.id
        }')" title="Cambiar estado">${
          repartidor.workInfo.status === "active" ? "⏸️" : "▶️"
        }</button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");
  }

  // Renderizar etiquetas de zonas
  renderZoneTags(zones) {
    if (!zones || zones.length === 0)
      return '<span class="zone-tag">Sin asignar</span>';
    return zones
      .map((zone) => `<span class="zone-tag">${zone}</span>`)
      .join("");
  }

  // Renderizar calificación con estrellas
  renderRating(rating) {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push("★");
      } else if (i === fullStars && hasHalfStar) {
        stars.push("☆");
      } else {
        stars.push('<span class="empty">☆</span>');
      }
    }

    return `<span class="rating-stars">${stars.join(
      ""
    )}</span> (${rating.toFixed(1)})`;
  }

  // Obtener display del vehículo
  getVehicleDisplay(vehicleType) {
    const types = {
      motorcycle: "🏍️ Motocicleta",
      bicycle: "🚲 Bicicleta",
      car: "🚗 Automóvil",
      van: "🚐 Camioneta",
    };
    return types[vehicleType] || "No especificado";
  }

  // Obtener display del estado
  getStatusDisplay(status) {
    const statuses = {
      active: "Activo",
      inactive: "Inactivo",
      suspended: "Suspendido",
    };
    return statuses[status] || status;
  }

  // Mostrar detalles del repartidor
  showRepartidorDetails(repartidorId) {
    const repartidor = repartidoresData.find((r) => r.id === repartidorId);
    if (!repartidor) return;

    const detailsContainer = document.getElementById("repartidorDetails");
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
      <div class="detail-section">
        <h4>Información Personal</h4>
        <div class="detail-item">
          <span class="detail-label">Nombre Completo:</span>
          <span class="detail-value">${repartidor.personalInfo.name} ${
      repartidor.personalInfo.lastName
    }</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Teléfono:</span>
          <span class="detail-value">${repartidor.personalInfo.phone}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${repartidor.personalInfo.email}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Dirección:</span>
          <span class="detail-value">${
            repartidor.personalInfo.address || "No especificada"
          }</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Contacto de Emergencia</h4>
        <div class="detail-item">
          <span class="detail-label">Nombre:</span>
          <span class="detail-value">${
            repartidor.personalInfo.emergencyContact?.name || "No especificado"
          }</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Teléfono:</span>
          <span class="detail-value">${
            repartidor.personalInfo.emergencyContact?.phone || "No especificado"
          }</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Relación:</span>
          <span class="detail-value">${
            repartidor.personalInfo.emergencyContact?.relationship ||
            "No especificada"
          }</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Información Laboral</h4>
        <div class="detail-item">
          <span class="detail-label">ID Empleado:</span>
          <span class="detail-value">${repartidor.workInfo.employeeId}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Estado:</span>
          <span class="detail-value"><span class="status-repartidor ${
            repartidor.workInfo.status
          }">${this.getStatusDisplay(repartidor.workInfo.status)}</span></span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Fecha de Inicio:</span>
          <span class="detail-value">${new Date(
            repartidor.workInfo.startDate
          ).toLocaleDateString()}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Zonas de Cobertura:</span>
          <span class="detail-value">${
            repartidor.workInfo.coverageZones?.join(", ") || "No asignadas"
          }</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Vehículo</h4>
        <div class="detail-item">
          <span class="detail-label">Tipo:</span>
          <span class="detail-value">${this.getVehicleDisplay(
            repartidor.workInfo.vehicleType
          )}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Marca/Modelo:</span>
          <span class="detail-value">${
            repartidor.workInfo.vehicleDetails?.brand || ""
          } ${repartidor.workInfo.vehicleDetails?.model || ""}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Año:</span>
          <span class="detail-value">${
            repartidor.workInfo.vehicleDetails?.year || "No especificado"
          }</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Placas:</span>
          <span class="detail-value">${
            repartidor.workInfo.vehicleDetails?.licensePlate ||
            "No especificadas"
          }</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Color:</span>
          <span class="detail-value">${
            repartidor.workInfo.vehicleDetails?.color || "No especificado"
          }</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Credenciales de Acceso</h4>
        <div class="detail-item">
          <span class="detail-label">Usuario:</span>
          <span class="detail-value">${repartidor.credentials.username}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Último Acceso:</span>
          <span class="detail-value">${
            repartidor.credentials.lastLogin
              ? new Date(repartidor.credentials.lastLogin).toLocaleString()
              : "Nunca"
          }</span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Métricas de Rendimiento</h4>
        <div class="performance-metrics">
          <div class="metric-item">
            <div class="metric-value">${
              repartidor.performance.totalDeliveries
            }</div>
            <div class="metric-label">Total Entregas</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${
              repartidor.performance.completedDeliveries
            }</div>
            <div class="metric-label">Completadas</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${repartidor.performance.averageRating.toFixed(
              1
            )}</div>
            <div class="metric-label">Calificación</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${repartidor.performance.onTimeDeliveryRate.toFixed(
              1
            )}%</div>
            <div class="metric-label">Puntualidad</div>
          </div>
        </div>
      </div>
    `;

    // Guardar ID para edición
    currentRepartidorId = repartidorId;
    document.getElementById("viewRepartidorModal").style.display = "block";
  }

  // Cerrar modal de vista
  closeViewRepartidorModal() {
    document.getElementById("viewRepartidorModal").style.display = "none";
    currentRepartidorId = null;
  }

  // Editar desde vista
  editRepartidorFromView() {
    if (currentRepartidorId) {
      this.closeViewRepartidorModal();
      this.showEditRepartidorModal(currentRepartidorId);
    }
  }

  // Cambiar estado del repartidor
  toggleRepartidorStatus(repartidorId) {
    const repartidor = repartidoresData.find((r) => r.id === repartidorId);
    if (!repartidor) return;

    const currentStatus = repartidor.workInfo.status;
    let newStatus;

    if (currentStatus === "active") {
      newStatus = "inactive";
    } else {
      newStatus = "active";
    }

    repartidor.workInfo.status = newStatus;
    repartidor.timestamps.updated = new Date().toISOString();

    this.saveRepartidores();
    this.renderRepartidoresTable();

    console.log(`Estado de repartidor ${repartidorId} cambiado a ${newStatus}`);
  }

  // Filtrar repartidores
  filterRepartidores() {
    const searchTerm =
      document.getElementById("searchRepartidores")?.value.toLowerCase() || "";
    const statusFilter =
      document.getElementById("filterEstadoRepartidor")?.value || "";

    let filtered = repartidoresData;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((repartidor) => {
        const fullName =
          `${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName}`.toLowerCase();
        const employeeId = repartidor.workInfo.employeeId.toLowerCase();
        const email = repartidor.personalInfo.email.toLowerCase();

        return (
          fullName.includes(searchTerm) ||
          employeeId.includes(searchTerm) ||
          email.includes(searchTerm)
        );
      });
    }

    // Filtrar por estado
    if (statusFilter) {
      filtered = filtered.filter(
        (repartidor) => repartidor.workInfo.status === statusFilter
      );
    }

    this.renderRepartidoresTable(filtered);
  }

  // Obtener todos los repartidores
  getAllDeliveryPersonnel() {
    return repartidoresData;
  }

  // Obtener repartidor por ID
  getDeliveryPersonById(id) {
    return repartidoresData.find((r) => r.id === id);
  }

  // Obtener repartidores activos
  getActiveDeliveryPersonnel() {
    return repartidoresData.filter((r) => r.workInfo.status === "active");
  }

  // Obtener repartidores por zona
  getDeliveryPersonnelByZone(zone) {
    return repartidoresData.filter(
      (r) =>
        r.workInfo.status === "active" &&
        r.workInfo.coverageZones?.includes(zone)
    );
  }
}

// Inicializar gestor de repartidores cuando se carga la sección
let deliveryManager = null;

// Función para inicializar repartidores cuando se muestra la sección
function initializeRepartidoresSection() {
  console.log("Inicializando sección de repartidores...");
  if (!deliveryManager) {
    console.log("Creando nuevo DeliveryPersonnelManager...");
    deliveryManager = new DeliveryPersonnelManager();
  }
  console.log("Renderizando tabla de repartidores...");
  deliveryManager.renderRepartidoresTable();
}

// Función de respaldo para inicializar eventos de repartidores
function setupRepartidoresBackup() {
  const addBtn = document.getElementById("addRepartidorBtn");
  if (addBtn && !addBtn.hasAttribute("data-event-added")) {
    console.log("Configurando evento de respaldo para addRepartidorBtn");
    addBtn.setAttribute("data-event-added", "true");
    addBtn.addEventListener("click", function () {
      console.log("Evento de respaldo activado");
      if (!deliveryManager) {
        deliveryManager = new DeliveryPersonnelManager();
      }
      deliveryManager.showAddRepartidorModal();
    });
  }
}

// Ejecutar respaldo cuando se carga el DOM
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(setupRepartidoresBackup, 2000);
});

// También ejecutar cuando se hace clic en la navegación
document.addEventListener("click", function (e) {
  if (e.target.matches('[data-section="repartidores"]')) {
    setTimeout(setupRepartidoresBackup, 200);
  }
});
// ==================== ASIGNACIÓN DE REPARTIDORES ====================

// Variables para asignación
let currentEnvioId = null;

// Clase para gestión de asignaciones
class AssignmentManager {
  constructor() {
    this.initializeAssignmentEvents();
  }

  // Inicializar eventos de asignación
  initializeAssignmentEvents() {
    const modal = document.getElementById("asignarRepartidorModal");
    const closeBtn = document.getElementById("closeAsignarModal");
    const cancelBtn = document.getElementById("cancelAsignar");
    const form = document.getElementById("asignarRepartidorForm");

    if (closeBtn)
      closeBtn.addEventListener("click", () => this.closeAssignmentModal());
    if (cancelBtn)
      cancelBtn.addEventListener("click", () => this.closeAssignmentModal());
    if (form)
      form.addEventListener("submit", (e) => this.handleAssignmentSubmit(e));

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (e.target === modal) this.closeAssignmentModal();
    });
  }

  // Mostrar modal de asignación
  showAssignmentModal(envioId) {
    console.log("Buscando envío con ID:", envioId);
    console.log(
      "Envíos disponibles:",
      enviosData.map((e) => e.numeroGuia)
    );

    const envio = enviosData.find((e) => e.numeroGuia === envioId);
    if (!envio) {
      alert("Envío no encontrado");
      return;
    }

    console.log("Envío encontrado:", envio);

    currentEnvioId = envioId;

    // Llenar información del envío
    document.getElementById("asignarGuia").textContent = envio.numeroGuia;
    document.getElementById("asignarCliente").textContent =
      envio.cliente?.nombre || "N/A";
    document.getElementById("asignarOrigen").textContent = envio.origenCiudad;
    document.getElementById("asignarDestino").textContent = envio.destinoCiudad;

    // Cargar lista de repartidores activos
    this.loadRepartidoresList();

    // Mostrar modal
    document.getElementById("asignarRepartidorModal").style.display = "block";
  }

  // Cargar lista de repartidores en el select
  loadRepartidoresList() {
    const select = document.getElementById("selectRepartidor");
    if (!select) {
      console.error("No se encontró el elemento selectRepartidor");
      return;
    }

    // Limpiar opciones existentes
    select.innerHTML = '<option value="">Seleccionar repartidor...</option>';

    console.log("deliveryManager disponible:", !!deliveryManager);

    // Inicializar deliveryManager si no existe
    if (!deliveryManager) {
      console.log("Inicializando deliveryManager...");
      deliveryManager = new DeliveryPersonnelManager();
    }

    // Obtener repartidores activos
    let repartidoresActivos = deliveryManager.getActiveDeliveryPersonnel();

    // Si no hay repartidores, intentar cargar directamente desde localStorage
    if (repartidoresActivos.length === 0) {
      console.log(
        "Intentando cargar repartidores directamente desde localStorage..."
      );
      try {
        const stored = localStorage.getItem("repartidores");
        const allRepartidores = stored ? JSON.parse(stored) : [];
        repartidoresActivos = allRepartidores.filter(
          (r) => r.workInfo.status === "active"
        );
        console.log(
          "Repartidores cargados desde localStorage:",
          repartidoresActivos.length
        );
      } catch (error) {
        console.error("Error cargando desde localStorage:", error);
      }
    }

    console.log(
      "Repartidores activos encontrados:",
      repartidoresActivos.length
    );
    console.log("Repartidores:", repartidoresActivos);

    if (repartidoresActivos.length === 0) {
      select.innerHTML =
        '<option value="">No hay repartidores activos</option>';
      console.warn("No se encontraron repartidores activos");
      return;
    }

    // Agregar opciones de repartidores
    repartidoresActivos.forEach((repartidor) => {
      const option = document.createElement("option");
      option.value = repartidor.id;
      option.textContent = `${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName} (${repartidor.workInfo.employeeId})`;
      select.appendChild(option);
      console.log("Repartidor agregado al select:", option.textContent);
    });
  }

  // Cerrar modal de asignación
  closeAssignmentModal() {
    document.getElementById("asignarRepartidorModal").style.display = "none";
    document.getElementById("asignarRepartidorForm").reset();
    currentEnvioId = null;
  }

  // Manejar envío del formulario de asignación
  handleAssignmentSubmit(e) {
    e.preventDefault();

    const repartidorId = document.getElementById("selectRepartidor").value;
    const notas = document.getElementById("notasAsignacion").value.trim();

    if (!repartidorId) {
      alert("Por favor selecciona un repartidor");
      return;
    }

    if (!currentEnvioId) {
      alert("Error: No se ha seleccionado un envío");
      return;
    }

    // Asignar repartidor al envío
    this.assignRepartidorToEnvio(currentEnvioId, repartidorId, notas);
  }

  // Asignar repartidor a envío
  assignRepartidorToEnvio(envioId, repartidorId, notas) {
    try {
      console.log("Asignando repartidor:", repartidorId, "al envío:", envioId);

      // Encontrar el envío
      const envioIndex = enviosData.findIndex((e) => e.numeroGuia === envioId);
      if (envioIndex === -1) {
        console.error("Envío no encontrado. ID buscado:", envioId);
        console.error(
          "Envíos disponibles:",
          enviosData.map((e) => e.numeroGuia)
        );
        alert("Envío no encontrado");
        return;
      }

      console.log("Envío encontrado en índice:", envioIndex);

      // Encontrar el repartidor
      const repartidor = deliveryManager
        ? deliveryManager.getDeliveryPersonById(repartidorId)
        : null;

      if (!repartidor) {
        alert("Repartidor no encontrado");
        return;
      }

      // Actualizar el envío con la asignación
      enviosData[envioIndex].repartidorAsignado = {
        id: repartidorId,
        nombre: `${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName}`,
        empleadoId: repartidor.workInfo.employeeId,
        fechaAsignacion: new Date().toISOString(),
        notas: notas,
      };

      // Cambiar estado del envío si está pendiente
      if (enviosData[envioIndex].estado === "pendiente") {
        enviosData[envioIndex].estado = "asignado";
      }

      // Guardar cambios
      localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

      // Actualizar la tabla de envíos
      cargarTablaEnviosConAsignaciones();

      // Cerrar modal
      this.closeAssignmentModal();

      // Mostrar confirmación
      alert(
        `Envío ${envioId} asignado exitosamente a ${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName}`
      );

      console.log("Envío asignado:", enviosData[envioIndex]);
    } catch (error) {
      console.error("Error asignando repartidor:", error);
      alert("Error al asignar el repartidor. Por favor, intenta de nuevo.");
    }
  }

  // Desasignar repartidor de envío
  unassignRepartidorFromEnvio(envioId) {
    try {
      const envioIndex = enviosData.findIndex((e) => e.numeroGuia === envioId);
      if (envioIndex === -1) {
        alert("Envío no encontrado");
        return;
      }

      // Confirmar desasignación
      const confirmar = confirm(
        "¿Estás seguro de que quieres desasignar el repartidor de este envío?"
      );
      if (!confirmar) return;

      // Remover asignación
      delete enviosData[envioIndex].repartidorAsignado;

      // Cambiar estado de vuelta a pendiente si estaba asignado
      if (enviosData[envioIndex].estado === "asignado") {
        enviosData[envioIndex].estado = "pendiente";
      }

      // Guardar cambios
      localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

      // Actualizar tabla
      cargarTablaEnviosConAsignaciones();

      alert("Repartidor desasignado exitosamente");
    } catch (error) {
      console.error("Error desasignando repartidor:", error);
      alert("Error al desasignar el repartidor");
    }
  }
}

// Inicializar gestor de asignaciones
let assignmentManager = null;

// Función para inicializar asignaciones cuando se carga la sección de envíos
function initializeAssignments() {
  console.log("Inicializando asignaciones...");

  // Asegurar que deliveryManager esté inicializado
  if (!deliveryManager) {
    console.log("Inicializando deliveryManager para asignaciones...");
    deliveryManager = new DeliveryPersonnelManager();
  }

  if (!assignmentManager) {
    console.log("Inicializando assignmentManager...");
    assignmentManager = new AssignmentManager();
  }

  console.log("Asignaciones inicializadas correctamente");
}

// Funciones globales para HTML
window.asignarRepartidor = function (envioId) {
  if (!assignmentManager) {
    assignmentManager = new AssignmentManager();
  }
  assignmentManager.showAssignmentModal(envioId);
};

window.desasignarRepartidor = function (envioId) {
  if (!assignmentManager) {
    assignmentManager = new AssignmentManager();
  }
  assignmentManager.unassignRepartidorFromEnvio(envioId);
};
// ==================== DATOS DE PRUEBA ====================

// Función para crear envíos de prueba (solo para demostración)
function crearEnviosPrueba() {
  const enviosPrueba = [
    {
      numeroGuia: "LI001",
      cliente: { nombre: "Juan Pérez", telefono: "555-0001" },
      origenCiudad: "Ciudad de México",
      destinoCiudad: "Puebla",
      tipoEnvio: "Paquete pequeño",
      unidades: 1,
      precio: "$150 MXN",
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    },
    {
      numeroGuia: "LI002",
      cliente: { nombre: "María García", telefono: "555-0002" },
      origenCiudad: "Puebla",
      destinoCiudad: "Ciudad de México",
      tipoEnvio: "Sobre",
      unidades: 1,
      precio: "$85 MXN",
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    },
    {
      numeroGuia: "LI003",
      cliente: { nombre: "Carlos López", telefono: "555-0003" },
      origenCiudad: "Ciudad de México",
      destinoCiudad: "Puebla",
      tipoEnvio: "Paquete mediano",
      unidades: 1,
      precio: "$220 MXN",
      estado: "pendiente",
      fechaCreacion: new Date().toISOString(),
    },
  ];

  // Solo agregar si no hay envíos existentes
  if (enviosData.length === 0) {
    enviosData.push(...enviosPrueba);
    localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));
    console.log("Envíos de prueba creados:", enviosPrueba.length);
  }
}

// Función para crear repartidores de prueba
function crearRepartidoresPrueba() {
  if (!deliveryManager) return;

  const repartidoresExistentes = deliveryManager.getAllDeliveryPersonnel();

  // Solo crear si no hay repartidores
  if (repartidoresExistentes.length === 0) {
    const repartidoresPrueba = [
      {
        personalInfo: {
          name: "Miguel",
          lastName: "Rodríguez",
        },
        workInfo: {
          vehicleType: "motorcycle",
          vehicleDetails: {
            licensePlate: "ABC-123",
          },
        },
      },
      {
        personalInfo: {
          name: "Ana",
          lastName: "Martínez",
        },
        workInfo: {
          vehicleType: "car",
          vehicleDetails: {
            licensePlate: "XYZ-789",
          },
        },
      },
    ];

    repartidoresPrueba.forEach((repartidor) => {
      // Simular el formulario lleno
      document.getElementById("repartidorNombre").value =
        repartidor.personalInfo.name;
      document.getElementById("repartidorApellido").value =
        repartidor.personalInfo.lastName;
      document.getElementById("vehiculoTipo").value =
        repartidor.workInfo.vehicleType;
      document.getElementById("vehiculoPlacas").value =
        repartidor.workInfo.vehicleDetails.licensePlate;

      // Agregar el repartidor
      const formData = deliveryManager.getFormData();
      deliveryManager.addRepartidor(formData);
    });

    console.log("Repartidores de prueba creados");
  }
}

// Función global para crear datos de prueba
window.crearDatosPrueba = function () {
  crearEnviosPrueba();
  crearRepartidoresPrueba();

  // Actualizar las tablas
  cargarTablaEnviosConAsignaciones();
  if (deliveryManager) {
    deliveryManager.renderRepartidoresTable();
  }

  alert("Datos de prueba creados exitosamente");
};
// Nueva función para cargar tabla de envíos con asignaciones
function cargarTablaEnviosConAsignaciones() {
  const tbody = document.getElementById("enviosTableBody");
  if (!tbody) return;

  if (enviosData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="11" class="no-data">No hay envíos registrados</td></tr>';
    return;
  }

  tbody.innerHTML = enviosData
    .map((envio) => {
      // Información del repartidor asignado
      let repartidorInfo = "";
      let botonesAsignacion = "";

      if (envio.repartidorAsignado) {
        repartidorInfo = `<span class="repartidor-asignado">${envio.repartidorAsignado.nombre} (${envio.repartidorAsignado.empleadoId})</span>`;
        botonesAsignacion = `<button onclick="desasignarRepartidor('${envio.numeroGuia}')" class="btn-action btn-edit" title="Desasignar">❌</button>`;
      } else {
        repartidorInfo = '<span class="sin-asignar">Sin asignar</span>';
        botonesAsignacion = `<button onclick="asignarRepartidor('${envio.numeroGuia}')" class="btn-asignar" title="Asignar repartidor">👤 Asignar</button>`;
      }

      return `
        <tr>
          <td>${envio.numeroGuia}</td>
          <td>${envio.cliente?.nombre || "N/A"}</td>
          <td>${envio.cliente?.telefono || "N/A"}</td>
          <td>${envio.origenCiudad}</td>
          <td>${envio.destinoCiudad}</td>
          <td>${envio.tipoEnvio} (${envio.unidades})</td>
          <td>${envio.precio}</td>
          <td>
            <select onchange="cambiarEstado('${
              envio.numeroGuia
            }', this.value)" class="status-select">
              <option value="pendiente" ${
                (envio.estado || "pendiente") === "pendiente" ? "selected" : ""
              }>Pendiente</option>
              <option value="asignado" ${
                envio.estado === "asignado" ? "selected" : ""
              }>Asignado</option>
              <option value="en_transito" ${
                envio.estado === "en_transito" ? "selected" : ""
              }>En Tránsito</option>
              <option value="entregado" ${
                envio.estado === "entregado" ? "selected" : ""
              }>Entregado</option>
            </select>
          </td>
          <td>${repartidorInfo}</td>
          <td>${new Date(envio.fechaCreacion).toLocaleDateString()}</td>
          <td>
            <div class="action-buttons">
              <button onclick="verDetalle('${
                envio.numeroGuia
              }')" class="btn-action btn-view" title="Ver detalles">👁️</button>
              ${botonesAsignacion}
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}
// Hacer la función global
window.cargarTablaEnviosConAsignaciones = cargarTablaEnviosConAsignaciones;
// Función de debug para repartidores
window.debugRepartidores = function () {
  console.log("=== DEBUG REPARTIDORES ===");

  // Verificar localStorage
  const stored = localStorage.getItem("repartidores");
  console.log("Datos en localStorage:", stored);

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      console.log("Repartidores parseados:", parsed);
      console.log("Cantidad de repartidores:", parsed.length);

      parsed.forEach((r, index) => {
        console.log(`Repartidor ${index + 1}:`, {
          id: r.id,
          nombre: `${r.personalInfo.name} ${r.personalInfo.lastName}`,
          empleadoId: r.workInfo.employeeId,
          estado: r.workInfo.status,
        });
      });

      const activos = parsed.filter((r) => r.workInfo.status === "active");
      console.log("Repartidores activos:", activos.length);
    } catch (error) {
      console.error("Error parseando datos:", error);
    }
  } else {
    console.log("No hay datos de repartidores en localStorage");
  }

  // Verificar deliveryManager
  console.log("deliveryManager existe:", !!deliveryManager);
  if (deliveryManager) {
    console.log("repartidoresData en deliveryManager:", repartidoresData);
    const activos = deliveryManager.getActiveDeliveryPersonnel();
    console.log("Repartidores activos desde deliveryManager:", activos);
  }

  // Forzar recarga de la lista
  if (assignmentManager) {
    assignmentManager.loadRepartidoresList();
  }

  console.log("=== FIN DEBUG ===");
};
// ==================== ASIGNACIÓN AUTOMÁTICA ====================

// Clase para asignación automática
class AutoAssignmentManager {
  // Asignación automática aleatoria de todos los envíos pendientes
  static assignAllPendingRandomly() {
    console.log("Iniciando asignación automática aleatoria...");

    // Obtener envíos pendientes
    const enviosPendientes = enviosData.filter(
      (envio) =>
        !envio.repartidorAsignado &&
        (envio.estado === "pendiente" || !envio.estado)
    );

    console.log("Envíos pendientes encontrados:", enviosPendientes.length);

    if (enviosPendientes.length === 0) {
      alert("No hay envíos pendientes para asignar");
      return;
    }

    // Obtener repartidores activos
    let repartidoresActivos = [];

    if (deliveryManager) {
      repartidoresActivos = deliveryManager.getActiveDeliveryPersonnel();
    }

    // Fallback: cargar desde localStorage
    if (repartidoresActivos.length === 0) {
      try {
        const stored = localStorage.getItem("repartidores");
        const allRepartidores = stored ? JSON.parse(stored) : [];
        repartidoresActivos = allRepartidores.filter(
          (r) => r.workInfo.status === "active"
        );
      } catch (error) {
        console.error("Error cargando repartidores:", error);
      }
    }

    console.log(
      "Repartidores activos encontrados:",
      repartidoresActivos.length
    );

    if (repartidoresActivos.length === 0) {
      alert("No hay repartidores activos disponibles para asignar");
      return;
    }

    // Confirmar asignación
    const confirmar = confirm(
      `¿Deseas asignar automáticamente ${enviosPendientes.length} envíos pendientes a ${repartidoresActivos.length} repartidores activos de forma aleatoria?`
    );

    if (!confirmar) return;

    let asignacionesExitosas = 0;
    let errores = 0;

    // Asignar cada envío a un repartidor aleatorio
    enviosPendientes.forEach((envio) => {
      try {
        // Seleccionar repartidor aleatorio
        const repartidorAleatorio =
          this.selectRandomDeliveryPerson(repartidoresActivos);

        // Asignar
        const success = this.assignEnvioToRepartidor(
          envio,
          repartidorAleatorio
        );

        if (success) {
          asignacionesExitosas++;
        } else {
          errores++;
        }
      } catch (error) {
        console.error("Error asignando envío:", envio.numeroGuia, error);
        errores++;
      }
    });

    // Guardar cambios
    localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

    // Actualizar tabla
    cargarTablaEnviosConAsignaciones();

    // Mostrar resultado
    alert(
      `Asignación automática completada:\n✅ Exitosas: ${asignacionesExitosas}\n❌ Errores: ${errores}`
    );

    console.log(
      `Asignación automática completada. Exitosas: ${asignacionesExitosas}, Errores: ${errores}`
    );
  }

  // Seleccionar repartidor aleatorio con distribución equitativa
  static selectRandomDeliveryPerson(repartidoresActivos) {
    // Calcular carga de trabajo actual de cada repartidor
    const repartidoresConCarga = repartidoresActivos.map((repartidor) => {
      const enviosAsignados = enviosData.filter(
        (envio) =>
          envio.repartidorAsignado &&
          envio.repartidorAsignado.id === repartidor.id &&
          envio.estado !== "entregado"
      ).length;

      return {
        ...repartidor,
        cargaActual: enviosAsignados,
      };
    });

    // Ordenar por menor carga (para distribución más equitativa)
    repartidoresConCarga.sort((a, b) => a.cargaActual - b.cargaActual);

    // Seleccionar entre los que tienen menor carga (primeros 3 o todos si hay menos)
    const candidatos = repartidoresConCarga.slice(
      0,
      Math.min(3, repartidoresConCarga.length)
    );

    // Selección aleatoria entre los candidatos
    const indiceAleatorio = Math.floor(Math.random() * candidatos.length);

    console.log(
      "Repartidor seleccionado:",
      candidatos[indiceAleatorio].personalInfo.name,
      "Carga actual:",
      candidatos[indiceAleatorio].cargaActual
    );

    return candidatos[indiceAleatorio];
  }

  // Asignar envío específico a repartidor específico
  static assignEnvioToRepartidor(envio, repartidor) {
    try {
      const envioIndex = enviosData.findIndex(
        (e) => e.numeroGuia === envio.numeroGuia
      );

      if (envioIndex === -1) {
        console.error("Envío no encontrado:", envio.numeroGuia);
        return false;
      }

      // Actualizar el envío con la asignación
      enviosData[envioIndex].repartidorAsignado = {
        id: repartidor.id,
        nombre: `${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName}`,
        empleadoId: repartidor.workInfo.employeeId,
        fechaAsignacion: new Date().toISOString(),
        notas: "Asignación automática aleatoria",
        tipoAsignacion: "automatica",
      };

      // Cambiar estado del envío
      enviosData[envioIndex].estado = "asignado";

      console.log(
        `Envío ${envio.numeroGuia} asignado a ${repartidor.personalInfo.name}`
      );

      return true;
    } catch (error) {
      console.error("Error en asignación:", error);
      return false;
    }
  }

  // Asignación automática de un solo envío
  static assignSingleEnvioRandomly(envioId) {
    console.log("Asignando envío individual:", envioId);

    const envio = enviosData.find((e) => e.numeroGuia === envioId);
    if (!envio) {
      alert("Envío no encontrado");
      return;
    }

    if (envio.repartidorAsignado) {
      alert("Este envío ya tiene un repartidor asignado");
      return;
    }

    // Obtener repartidores activos
    let repartidoresActivos = [];

    if (deliveryManager) {
      repartidoresActivos = deliveryManager.getActiveDeliveryPersonnel();
    }

    if (repartidoresActivos.length === 0) {
      try {
        const stored = localStorage.getItem("repartidores");
        const allRepartidores = stored ? JSON.parse(stored) : [];
        repartidoresActivos = allRepartidores.filter(
          (r) => r.workInfo.status === "active"
        );
      } catch (error) {
        console.error("Error cargando repartidores:", error);
      }
    }

    if (repartidoresActivos.length === 0) {
      alert("No hay repartidores activos disponibles");
      return;
    }

    // Seleccionar repartidor aleatorio
    const repartidorSeleccionado =
      this.selectRandomDeliveryPerson(repartidoresActivos);

    // Asignar
    const success = this.assignEnvioToRepartidor(envio, repartidorSeleccionado);

    if (success) {
      // Guardar cambios
      localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

      // Actualizar tabla
      cargarTablaEnviosConAsignaciones();

      alert(
        `Envío ${envioId} asignado automáticamente a ${repartidorSeleccionado.personalInfo.name} ${repartidorSeleccionado.personalInfo.lastName}`
      );
    } else {
      alert("Error al asignar el envío");
    }
  }

  // Estadísticas de asignación
  static getAssignmentStats() {
    const stats = {
      totalEnvios: enviosData.length,
      enviosPendientes: enviosData.filter(
        (e) => !e.repartidorAsignado && (e.estado === "pendiente" || !e.estado)
      ).length,
      enviosAsignados: enviosData.filter((e) => e.repartidorAsignado).length,
      asignacionesAutomaticas: enviosData.filter(
        (e) =>
          e.repartidorAsignado &&
          e.repartidorAsignado.tipoAsignacion === "automatica"
      ).length,
      asignacionesManuales: enviosData.filter(
        (e) =>
          e.repartidorAsignado &&
          e.repartidorAsignado.tipoAsignacion !== "automatica"
      ).length,
    };

    return stats;
  }
}

// Funciones globales para HTML
window.asignacionAutomatica = function () {
  AutoAssignmentManager.assignAllPendingRandomly();
};

window.asignacionAutomaticaIndividual = function (envioId) {
  AutoAssignmentManager.assignSingleEnvioRandomly(envioId);
};

window.mostrarEstadisticasAsignacion = function () {
  const stats = AutoAssignmentManager.getAssignmentStats();

  const mensaje = `📊 Estadísticas de Asignación:
  
📦 Total de Envíos: ${stats.totalEnvios}
⏳ Pendientes: ${stats.enviosPendientes}
✅ Asignados: ${stats.enviosAsignados}

🎲 Asignaciones Automáticas: ${stats.asignacionesAutomaticas}
👤 Asignaciones Manuales: ${stats.asignacionesManuales}`;

  alert(mensaje);
};
// ==================== GESTIÓN DE CLIENTES ====================

// Variables para clientes
let clientesData = [];
let currentClienteId = null;

// Clase para gestión de clientes
class ClientManager {
  constructor() {
    console.log("Inicializando ClientManager...");
    this.loadClientes();
    this.initializeClientesEvents();
    console.log("ClientManager inicializado correctamente");
  }

  // Cargar clientes desde los envíos existentes y localStorage
  loadClientes() {
    try {
      // Primero cargar datos de envíos
      this.loadEnviosData();

      console.log(
        "Cargando clientes desde envíos. Total envíos:",
        enviosData.length
      );

      // Extraer clientes únicos de los envíos
      const clientesMap = new Map();

      enviosData.forEach((envio) => {
        if (envio.cliente && envio.cliente.nombre) {
          const clienteKey = `${envio.cliente.nombre}_${envio.cliente.telefono}`;

          if (!clientesMap.has(clienteKey)) {
            clientesMap.set(clienteKey, {
              id: this.generateClienteId(),
              nombre: envio.cliente.nombre,
              telefono: envio.cliente.telefono,
              email: envio.cliente.email || "",
              direccion: envio.cliente.direccion || "",
              notas: "",
              fechaRegistro: envio.fechaCreacion,
              envios: [],
              totalEnvios: 0,
              totalGastado: 0,
              ultimoEnvio: null,
              tipoCliente: "nuevo",
            });
          }

          const cliente = clientesMap.get(clienteKey);
          cliente.envios.push(envio);
        }
      });

      // Convertir Map a Array y calcular estadísticas
      clientesData = Array.from(clientesMap.values()).map((cliente) => {
        cliente.totalEnvios = cliente.envios.length;
        cliente.totalGastado = this.calculateTotalGastado(cliente.envios);
        cliente.ultimoEnvio = this.getUltimoEnvio(cliente.envios);
        cliente.tipoCliente = this.determinarTipoCliente(cliente);
        return cliente;
      });

      // Guardar datos procesados para próximas cargas
      this.saveClientesData();

      console.log("Clientes cargados y guardados:", clientesData.length);
    } catch (error) {
      console.error("Error cargando clientes:", error);
      clientesData = [];
    }
  }

  // Cargar datos de envíos desde localStorage
  loadEnviosData() {
    try {
      const stored = localStorage.getItem("enviosLogistica");
      if (stored) {
        const parsedData = JSON.parse(stored);
        enviosData = parsedData;
        console.log("✅ Datos de envíos cargados:", enviosData.length);

        // Verificar cuántos tienen clientes
        const conClientes = enviosData.filter(
          (e) => e.cliente && e.cliente.nombre
        ).length;
        console.log(
          `📊 Envíos con datos de cliente: ${conClientes} de ${enviosData.length}`
        );

        if (conClientes === 0 && enviosData.length > 0) {
          console.log(
            "⚠️ ADVERTENCIA: Hay envíos pero ninguno tiene datos de cliente"
          );
          console.log("Estructura del primer envío:", enviosData[0]);
        }
      } else {
        console.log("ℹ️ No hay datos de envíos en localStorage");
        enviosData = [];
      }
    } catch (error) {
      console.error("❌ Error cargando datos de envíos:", error);
      enviosData = [];
    }
  }

  // Guardar clientes procesados
  saveClientesData() {
    try {
      localStorage.setItem("clientesData", JSON.stringify(clientesData));
      console.log("Datos de clientes guardados:", clientesData.length);
    } catch (error) {
      console.error("Error guardando datos de clientes:", error);
    }
  }

  // Generar ID único para cliente
  generateClienteId() {
    return "CLI_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Calcular total gastado por cliente
  calculateTotalGastado(envios) {
    return envios.reduce((total, envio) => {
      const precio = parseFloat(envio.precio.replace(/[^0-9.]/g, "")) || 0;
      return total + precio;
    }, 0);
  }

  // Obtener último envío del cliente
  getUltimoEnvio(envios) {
    if (envios.length === 0) return null;

    return envios.reduce((ultimo, envio) => {
      const fechaEnvio = new Date(envio.fechaCreacion);
      const fechaUltimo = new Date(ultimo.fechaCreacion);
      return fechaEnvio > fechaUltimo ? envio : ultimo;
    });
  }

  // Determinar tipo de cliente
  determinarTipoCliente(cliente) {
    const totalEnvios = cliente.totalEnvios;
    const ultimoEnvio = cliente.ultimoEnvio;
    const diasSinEnvio = ultimoEnvio
      ? Math.floor(
          (Date.now() - new Date(ultimoEnvio.fechaCreacion)) /
            (1000 * 60 * 60 * 24)
        )
      : 999;

    if (totalEnvios >= 10 || cliente.totalGastado >= 2000) {
      return "vip";
    } else if (totalEnvios >= 3) {
      return "frecuente";
    } else if (diasSinEnvio > 30) {
      return "inactivo";
    } else {
      return "nuevo";
    }
  }

  // Inicializar eventos
  initializeClientesEvents() {
    // Modal de detalles
    const detalleModal = document.getElementById("clienteDetalleModal");
    const closeDetalleBtn = document.getElementById("closeClienteDetalleModal");
    const closeDetalleBtn2 = document.getElementById("closeClienteDetalle");
    const editFromDetalleBtn = document.getElementById(
      "editarClienteFromDetalle"
    );

    if (closeDetalleBtn)
      closeDetalleBtn.addEventListener("click", () => this.closeDetalleModal());
    if (closeDetalleBtn2)
      closeDetalleBtn2.addEventListener("click", () =>
        this.closeDetalleModal()
      );
    if (editFromDetalleBtn)
      editFromDetalleBtn.addEventListener("click", () =>
        this.editarClienteFromDetalle()
      );

    // Modal de edición
    const editModal = document.getElementById("editarClienteModal");
    const closeEditBtn = document.getElementById("closeEditarClienteModal");
    const cancelEditBtn = document.getElementById("cancelEditarCliente");
    const editForm = document.getElementById("editarClienteForm");

    if (closeEditBtn)
      closeEditBtn.addEventListener("click", () => this.closeEditModal());
    if (cancelEditBtn)
      cancelEditBtn.addEventListener("click", () => this.closeEditModal());
    if (editForm)
      editForm.addEventListener("submit", (e) => this.handleEditSubmit(e));

    // Filtros y búsqueda
    const searchInput = document.getElementById("searchClientes");
    const filterSelect = document.getElementById("filterTipoCliente");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.filterClientes());
    }
    if (filterSelect) {
      filterSelect.addEventListener("change", () => this.filterClientes());
    }

    // Cerrar modales al hacer clic fuera
    window.addEventListener("click", (e) => {
      if (e.target === detalleModal) this.closeDetalleModal();
      if (e.target === editModal) this.closeEditModal();
    });
  }

  // Renderizar tabla de clientes
  renderClientesTable(filteredData = null) {
    console.log("🎨 INICIANDO renderClientesTable");

    const tbody = document.getElementById("clientesTableBody");
    console.log("tbody encontrado:", !!tbody);
    if (!tbody) {
      console.error("❌ No se encontró elemento clientesTableBody");
      return;
    }

    const dataToRender = filteredData || clientesData;
    console.log(
      "Datos a renderizar:",
      dataToRender ? dataToRender.length : "null/undefined"
    );
    console.log(
      "clientesData global:",
      clientesData ? clientesData.length : "null/undefined"
    );

    if (!dataToRender || dataToRender.length === 0) {
      console.log("⚠️ No hay datos para mostrar");
      tbody.innerHTML =
        '<tr><td colspan="8" class="no-data">No hay clientes registrados</td></tr>';
      return;
    }

    console.log("✅ Renderizando", dataToRender.length, "clientes");

    tbody.innerHTML = dataToRender
      .map((cliente) => {
        const ultimoEnvioFecha = cliente.ultimoEnvio
          ? new Date(cliente.ultimoEnvio.fechaCreacion).toLocaleDateString()
          : "Nunca";

        return `
        <tr>
          <td><strong>${cliente.nombre}</strong></td>
          <td>${cliente.telefono}</td>
          <td>${cliente.email || "No registrado"}</td>
          <td><strong>${cliente.totalEnvios}</strong></td>
          <td>${ultimoEnvioFecha}</td>
          <td><strong>$${cliente.totalGastado.toFixed(2)}</strong></td>
          <td><span class="tipo-cliente ${
            cliente.tipoCliente
          }">${this.getTipoClienteDisplay(cliente.tipoCliente)}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn-action btn-view" onclick="clientManager.showClienteDetalle('${
                cliente.id
              }')" title="Ver detalles">👁️</button>
              <button class="btn-action btn-edit" onclick="clientManager.showEditClienteModal('${
                cliente.id
              }')" title="Editar">✏️</button>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");

    console.log("✅ HTML generado, longitud:", tbody.innerHTML.length);
    console.log("✅ Filas en tabla:", tbody.children.length);

    // Actualizar estadísticas
    this.updateClientesStats(dataToRender);

    console.log("🎨 FINALIZANDO renderClientesTable");
  }

  // Obtener display del tipo de cliente
  getTipoClienteDisplay(tipo) {
    const tipos = {
      nuevo: "Nuevo",
      frecuente: "Frecuente",
      vip: "VIP",
      inactivo: "Inactivo",
    };
    return tipos[tipo] || tipo;
  }

  // Actualizar estadísticas de clientes
  updateClientesStats(clientes = clientesData) {
    const stats = {
      total: clientes.length,
      frecuentes: clientes.filter(
        (c) => c.tipoCliente === "frecuente" || c.tipoCliente === "vip"
      ).length,
      nuevos: clientes.filter((c) => c.tipoCliente === "nuevo").length,
      ingresosTotales: clientes.reduce((total, c) => total + c.totalGastado, 0),
    };

    const totalClientesEl = document.getElementById("totalClientes");
    const frecuentesEl = document.getElementById("clientesFrecuentes");
    const nuevosEl = document.getElementById("clientesNuevos");
    const ingresosEl = document.getElementById("ingresosTotales");

    if (totalClientesEl) totalClientesEl.textContent = stats.total;
    if (frecuentesEl) frecuentesEl.textContent = stats.frecuentes;
    if (nuevosEl) nuevosEl.textContent = stats.nuevos;
    if (ingresosEl)
      ingresosEl.textContent = `$${stats.ingresosTotales.toFixed(2)}`;
  }

  // Mostrar detalles del cliente
  showClienteDetalle(clienteId) {
    const cliente = clientesData.find((c) => c.id === clienteId);
    if (!cliente) return;

    currentClienteId = clienteId;

    const content = document.getElementById("clienteDetalleContent");
    if (!content) return;

    content.innerHTML = `
      <div class="detail-section">
        <h4>Información Personal</h4>
        <div class="detail-item">
          <span class="detail-label">Nombre:</span>
          <span class="detail-value">${cliente.nombre}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Teléfono:</span>
          <span class="detail-value">${cliente.telefono}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Email:</span>
          <span class="detail-value">${cliente.email || "No registrado"}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Dirección:</span>
          <span class="detail-value">${
            cliente.direccion || "No registrada"
          }</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Tipo de Cliente:</span>
          <span class="detail-value"><span class="tipo-cliente ${
            cliente.tipoCliente
          }">${this.getTipoClienteDisplay(cliente.tipoCliente)}</span></span>
        </div>
      </div>

      <div class="detail-section">
        <h4>Estadísticas</h4>
        <div class="performance-metrics">
          <div class="metric-item">
            <div class="metric-value">${cliente.totalEnvios}</div>
            <div class="metric-label">Total Envíos</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">$${cliente.totalGastado.toFixed(2)}</div>
            <div class="metric-label">Total Gastado</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">$${(
              cliente.totalGastado / cliente.totalEnvios
            ).toFixed(2)}</div>
            <div class="metric-label">Promedio por Envío</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">${
              cliente.ultimoEnvio
                ? new Date(
                    cliente.ultimoEnvio.fechaCreacion
                  ).toLocaleDateString()
                : "Nunca"
            }</div>
            <div class="metric-label">Último Envío</div>
          </div>
        </div>
      </div>

      <div class="detail-section" style="grid-column: 1 / -1;">
        <h4>Historial de Envíos (${cliente.envios.length})</h4>
        <div class="table-container" style="max-height: 300px; overflow-y: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Guía</th>
                <th>Origen → Destino</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${cliente.envios
                .map(
                  (envio) => `
                <tr>
                  <td>${envio.numeroGuia}</td>
                  <td>${envio.origenCiudad} → ${envio.destinoCiudad}</td>
                  <td>${envio.precio}</td>
                  <td>${envio.estado || "pendiente"}</td>
                  <td>${new Date(envio.fechaCreacion).toLocaleDateString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("clienteDetalleModal").style.display = "block";
  }

  // Cerrar modal de detalles
  closeDetalleModal() {
    document.getElementById("clienteDetalleModal").style.display = "none";
    currentClienteId = null;
  }

  // Editar cliente desde detalles
  editarClienteFromDetalle() {
    if (currentClienteId) {
      this.closeDetalleModal();
      this.showEditClienteModal(currentClienteId);
    }
  }

  // Mostrar modal de edición
  showEditClienteModal(clienteId) {
    const cliente = clientesData.find((c) => c.id === clienteId);
    if (!cliente) return;

    currentClienteId = clienteId;

    // Llenar formulario
    document.getElementById("editClienteNombre").value = cliente.nombre;
    document.getElementById("editClienteTelefono").value = cliente.telefono;
    document.getElementById("editClienteEmail").value = cliente.email || "";
    document.getElementById("editClienteDireccion").value =
      cliente.direccion || "";
    document.getElementById("editClienteNotas").value = cliente.notas || "";

    document.getElementById("editarClienteModal").style.display = "block";
  }

  // Cerrar modal de edición
  closeEditModal() {
    document.getElementById("editarClienteModal").style.display = "none";
    document.getElementById("editarClienteForm").reset();
    currentClienteId = null;
  }

  // Manejar envío del formulario de edición
  handleEditSubmit(e) {
    e.preventDefault();

    if (!currentClienteId) return;

    const clienteIndex = clientesData.findIndex(
      (c) => c.id === currentClienteId
    );
    if (clienteIndex === -1) return;

    // Actualizar datos del cliente
    const datosActualizados = {
      nombre: document.getElementById("editClienteNombre").value.trim(),
      telefono: document.getElementById("editClienteTelefono").value.trim(),
      email: document.getElementById("editClienteEmail").value.trim(),
      direccion: document.getElementById("editClienteDireccion").value.trim(),
      notas: document.getElementById("editClienteNotas").value.trim(),
    };

    // Actualizar cliente
    Object.assign(clientesData[clienteIndex], datosActualizados);

    // Actualizar envíos relacionados
    enviosData.forEach((envio) => {
      if (
        envio.cliente &&
        envio.cliente.nombre === clientesData[clienteIndex].nombre &&
        envio.cliente.telefono === clientesData[clienteIndex].telefono
      ) {
        envio.cliente = {
          ...envio.cliente,
          ...datosActualizados,
        };
      }
    });

    // Guardar cambios
    localStorage.setItem("enviosLogistica", JSON.stringify(enviosData));

    // Cerrar modal y actualizar tabla
    this.closeEditModal();
    this.renderClientesTable();

    alert("Cliente actualizado exitosamente");
  }

  // Filtrar clientes
  filterClientes() {
    const searchTerm =
      document.getElementById("searchClientes")?.value.toLowerCase() || "";
    const tipoFilter =
      document.getElementById("filterTipoCliente")?.value || "";

    let filtered = clientesData;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((cliente) => {
        return (
          cliente.nombre.toLowerCase().includes(searchTerm) ||
          cliente.telefono.includes(searchTerm) ||
          (cliente.email && cliente.email.toLowerCase().includes(searchTerm))
        );
      });
    }

    // Filtrar por tipo
    if (tipoFilter) {
      if (tipoFilter === "frecuente") {
        filtered = filtered.filter((c) => c.totalEnvios >= 3);
      } else if (tipoFilter === "nuevo") {
        filtered = filtered.filter((c) => c.totalEnvios <= 2);
      } else if (tipoFilter === "inactivo") {
        filtered = filtered.filter((c) => c.tipoCliente === "inactivo");
      }
    }

    this.renderClientesTable(filtered);
  }

  // Exportar clientes (función básica)
  exportarClientes() {
    const csvContent = this.generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `clientes_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Generar CSV
  generateCSV() {
    const headers = [
      "Nombre",
      "Teléfono",
      "Email",
      "Total Envíos",
      "Total Gastado",
      "Último Envío",
      "Tipo Cliente",
    ];
    const rows = clientesData.map((cliente) => [
      cliente.nombre,
      cliente.telefono,
      cliente.email || "",
      cliente.totalEnvios,
      cliente.totalGastado.toFixed(2),
      cliente.ultimoEnvio
        ? new Date(cliente.ultimoEnvio.fechaCreacion).toLocaleDateString()
        : "",
      this.getTipoClienteDisplay(cliente.tipoCliente),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");
  }
}

// Inicializar gestor de clientes
let clientManager = null;

// Función para inicializar clientes cuando se muestra la sección
function initializeClientesSection() {
  console.log("🚀 Inicializando sección de clientes...");

  try {
    // Siempre crear un nuevo ClientManager para asegurar datos frescos
    console.log("Creando ClientManager...");
    clientManager = new ClientManager();

    // Verificar que se cargaron datos
    console.log(`📊 Clientes cargados: ${clientesData.length}`);

    // Si no hay clientes, intentar cargar desde localStorage directamente
    if (clientesData.length === 0) {
      console.log("⚠️ No se encontraron clientes, verificando localStorage...");

      const enviosLS = localStorage.getItem("enviosLogistica");
      if (enviosLS) {
        const envios = JSON.parse(enviosLS);
        console.log(`📦 Encontrados ${envios.length} envíos en localStorage`);

        // Contar envíos con clientes
        const enviosConCliente = envios.filter(
          (e) => e.cliente && e.cliente.nombre
        );
        console.log(
          `👥 Envíos con datos de cliente: ${enviosConCliente.length}`
        );

        if (enviosConCliente.length > 0) {
          console.log("🔄 Forzando recarga de clientes...");
          // Asegurar que enviosData esté actualizado
          enviosData = envios;
          clientManager.loadClientes();
        } else if (envios.length > 0) {
          console.log("⚠️ Hay envíos pero sin datos de cliente válidos");
          console.log("Estructura del primer envío:", envios[0]);
          mostrarNotificacion(
            `Hay ${envios.length} envíos pero sin datos de cliente`,
            "warning"
          );
        }
      }
    }

    // Renderizar tabla
    console.log("🎨 Renderizando tabla de clientes...");
    clientManager.renderClientesTable();

    // Si no hay clientes, usar la función que funciona
    if (clientesData.length === 0) {
      console.log("⚡ No hay clientes, usando función que funciona...");
      setTimeout(() => {
        window.mostrarClientesEncontrados();
      }, 500);
    }

    // Mostrar resultado
    const mensaje = `Sección inicializada. ${clientesData.length} clientes disponibles.`;
    console.log(`✅ ${mensaje}`);

    if (clientesData.length > 0) {
      mostrarNotificacion(
        `${clientesData.length} clientes cargados`,
        "success"
      );
    } else {
      mostrarNotificacion("Cargando clientes...", "info");
    }

    // Detección automática deshabilitada para evitar congelamiento
    // window.iniciarDeteccionAutomatica();
  } catch (error) {
    console.error("❌ Error inicializando sección de clientes:", error);
    mostrarNotificacion("Error al cargar clientes", "error");
  }
}

// Función global para cargar tabla de clientes
window.cargarTablaClientes = function () {
  console.log("Función cargarTablaClientes ejecutada");
  if (!clientManager) {
    console.log("Inicializando clientManager...");
    clientManager = new ClientManager();
  } else {
    console.log("Recargando datos de clientes...");
    clientManager.loadClientes();
  }
  clientManager.renderClientesTable();
  console.log(
    "Tabla de clientes actualizada. Total clientes:",
    clientesData.length
  );
};

// Función para notificar nuevos clientes desde la página principal
window.notificarNuevoCliente = function (nuevoCliente) {
  console.log(
    "Nuevo cliente detectado desde página principal:",
    nuevoCliente.nombre
  );

  // Si el panel de administración está abierto, actualizar automáticamente
  if (clientManager) {
    console.log("Actualizando lista de clientes automáticamente...");
    clientManager.loadClientes();
    clientManager.renderClientesTable();

    // Mostrar notificación visual (opcional)
    if (typeof showMessage === "function") {
      showMessage(
        `Nuevo cliente registrado: ${nuevoCliente.nombre}`,
        "success"
      );
    }
  }
};

// Función para auto-actualizar clientes cada cierto tiempo
window.autoActualizarClientes = function () {
  if (
    clientManager &&
    document.querySelector(".clientes-section")?.style.display !== "none"
  ) {
    console.log("Auto-actualizando clientes...");
    const clientesAnteriores = clientesData.length;
    clientManager.loadClientes();

    if (clientesData.length > clientesAnteriores) {
      console.log(
        `Nuevos clientes detectados: ${
          clientesData.length - clientesAnteriores
        }`
      );
      clientManager.renderClientesTable();
    }
  }
};

// Auto-actualización deshabilitada para evitar congelamiento
// setInterval(window.autoActualizarClientes, 30000);

// Función global para exportar clientes
window.exportarClientes = function () {
  console.log("🔄 Iniciando exportación de clientes...");

  try {
    // Asegurar que clientManager esté inicializado
    if (!clientManager) {
      console.log("Inicializando clientManager para exportación...");
      clientManager = new ClientManager();
    }

    // Asegurar que hay datos cargados
    if (!clientesData || clientesData.length === 0) {
      console.log("No hay clientes cargados, recargando datos...");
      clientManager.loadClientes();
    }

    // Verificar si ahora hay datos
    if (!clientesData || clientesData.length === 0) {
      mostrarNotificacion("No hay clientes para exportar", "error");
      console.log("❌ No hay clientes para exportar");
      return;
    }

    console.log(`📊 Exportando ${clientesData.length} clientes...`);
    clientManager.exportarClientes();
    mostrarNotificacion(
      `${clientesData.length} clientes exportados`,
      "success"
    );
  } catch (error) {
    console.error("Error en exportación:", error);
    mostrarNotificacion("Error al exportar clientes", "error");
  }
};
// ==================== EXPORTACIÓN AVANZADA ====================

// Funciones globales para exportación avanzada
window.mostrarOpcionesExportacion = function () {
  // Inicializar modal
  const modal = document.getElementById("exportacionModal");
  const closeBtn = document.getElementById("closeExportacionModal");
  const cancelBtn = document.getElementById("cancelExportacion");

  // Configurar eventos de cierre
  if (closeBtn) closeBtn.onclick = () => cerrarModalExportacion();
  if (cancelBtn) cancelBtn.onclick = () => cerrarModalExportacion();

  // Actualizar preview inicial
  actualizarPreviewExportacion();

  // Configurar eventos de cambio
  const filtros = ["incluirInactivos", "soloFrecuentes", "fechaDesde"];
  filtros.forEach((filtroId) => {
    const elemento = document.getElementById(filtroId);
    if (elemento) {
      elemento.addEventListener("change", actualizarPreviewExportacion);
    }
  });

  // Mostrar modal
  modal.style.display = "block";
};

window.cerrarModalExportacion = function () {
  document.getElementById("exportacionModal").style.display = "none";
};

window.actualizarPreviewExportacion = function () {
  if (!clientManager) return;

  const filtros = {
    incluirInactivos:
      document.getElementById("incluirInactivos")?.checked || false,
    soloFrecuentes: document.getElementById("soloFrecuentes")?.checked || false,
    fechaDesde: document.getElementById("fechaDesde")?.value || null,
  };

  const clientesFiltrados = clientManager.aplicarFiltrosExportacion(filtros);
  const countElement = document.getElementById("clientesCount");

  if (countElement) {
    countElement.textContent = clientesFiltrados.length;
  }
};

window.ejecutarExportacion = function () {
  if (!clientManager) {
    alert("Error: Sistema de clientes no inicializado");
    return;
  }

  // Obtener formato seleccionado
  const formatoSeleccionado =
    document.querySelector('input[name="exportFormat"]:checked')?.value ||
    "csv";

  // Obtener filtros
  const filtros = {
    incluirInactivos:
      document.getElementById("incluirInactivos")?.checked || false,
    soloFrecuentes: document.getElementById("soloFrecuentes")?.checked || false,
    fechaDesde: document.getElementById("fechaDesde")?.value || null,
  };

  // Validar que hay clientes para exportar
  const clientesFiltrados = clientManager.aplicarFiltrosExportacion(filtros);

  if (clientesFiltrados.length === 0) {
    alert("⚠️ No hay clientes que coincidan con los filtros seleccionados");
    return;
  }

  // Confirmar exportación
  const tiposFormato = {
    csv: "CSV estándar",
    excel: "Excel compatible",
    detallado: "Reporte detallado con historial",
  };

  const confirmar = confirm(
    `¿Deseas exportar ${clientesFiltrados.length} clientes en formato ${tiposFormato[formatoSeleccionado]}?`
  );

  if (!confirmar) return;

  // Ejecutar exportación
  try {
    clientManager.exportarClientes(formatoSeleccionado, filtros);
    cerrarModalExportacion();
  } catch (error) {
    console.error("Error en exportación:", error);
    alert("❌ Error al exportar los datos. Por favor, intenta de nuevo.");
  }
};

// Cerrar modal al hacer clic fuera
window.addEventListener("click", function (e) {
  const modal = document.getElementById("exportacionModal");
  if (e.target === modal) {
    cerrarModalExportacion();
  }
});
// Función simple para mostrar mensajes
function mostrarNotificacion(mensaje, tipo = "info") {
  console.log(`[${tipo.toUpperCase()}] ${mensaje}`);

  // Crear notificación visual simple
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  `;

  // Colores según tipo
  switch (tipo) {
    case "success":
      notification.style.backgroundColor = "#28a745";
      break;
    case "error":
      notification.style.backgroundColor = "#dc3545";
      break;
    case "info":
    default:
      notification.style.backgroundColor = "#007bff";
      break;
  }

  notification.textContent = mensaje;
  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Función para sincronización completa de clientes
window.sincronizarClientesCompleto = function () {
  console.log("=== SINCRONIZACIÓN COMPLETA DE CLIENTES ===");

  try {
    // Mostrar mensaje de carga
    mostrarNotificacion("Sincronizando clientes...", "info");

    // Forzar recarga de datos
    if (!clientManager) {
      console.log("Inicializando ClientManager para sincronización...");
      clientManager = new ClientManager();
    }

    // Limpiar datos anteriores
    clientesData = [];

    // Recargar todo desde cero
    console.log("Recargando datos de envíos...");
    clientManager.loadClientes();

    // Actualizar interfaz
    console.log("Actualizando interfaz...");
    clientManager.renderClientesTable();

    // Mostrar resultado
    const mensaje = `Sincronización completa. ${clientesData.length} clientes cargados.`;
    console.log(mensaje);
    mostrarNotificacion(mensaje, "success");

    // Actualizar estadísticas
    if (clientManager.updateClientesStats) {
      clientManager.updateClientesStats();
    }

    return true;
  } catch (error) {
    console.error("Error en sincronización completa:", error);
    mostrarNotificacion(
      "Error al sincronizar clientes: " + error.message,
      "error"
    );
    return false;
  }

  console.log("=== FIN SINCRONIZACIÓN ===");
};

// Función mejorada para detectar cambios en localStorage
window.detectarCambiosEnvios = function () {
  // Verificar si hay nuevos envíos
  try {
    const enviosActuales = JSON.parse(
      localStorage.getItem("enviosLogistica") || "[]"
    );
    const enviosAnteriores = enviosData.length;

    if (enviosActuales.length > enviosAnteriores) {
      console.log(
        `Nuevos envíos detectados: ${enviosActuales.length - enviosAnteriores}`
      );

      // Auto-sincronizar si el panel está abierto
      if (
        clientManager &&
        document.querySelector("#clientes-section")?.style.display !== "none"
      ) {
        console.log("Auto-sincronizando por nuevos envíos...");
        window.sincronizarClientesCompleto();
      }
    }
  } catch (error) {
    console.error("Error detectando cambios en envíos:", error);
  }
};

// Detección de cambios deshabilitada para evitar congelamiento
// setInterval(window.detectarCambiosEnvios, 15000);

// Función para mostrar estadísticas de sincronización
window.mostrarEstadisticasSincronizacion = function () {
  try {
    const enviosTotal = JSON.parse(
      localStorage.getItem("enviosLogistica") || "[]"
    ).length;
    const clientesTotal = clientesData.length;
    const clientesDirectos = JSON.parse(
      localStorage.getItem("clientesData") || "[]"
    ).length;

    console.log("=== ESTADÍSTICAS DE SINCRONIZACIÓN ===");
    console.log(`Total de envíos en localStorage: ${enviosTotal}`);
    console.log(`Total de clientes procesados: ${clientesTotal}`);
    console.log(`Clientes guardados directamente: ${clientesDirectos}`);
    console.log("=====================================");

    return {
      enviosTotal,
      clientesTotal,
      clientesDirectos,
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    return null;
  }
};

// Función de prueba para el botón de sincronizar
window.probarSincronizacion = function () {
  console.log("🔧 PRUEBA DE SINCRONIZACIÓN COMPLETA");

  // 1. Verificar variables globales
  console.log("=== VARIABLES GLOBALES ===");
  console.log("clientManager existe:", !!clientManager);
  console.log(
    "clientesData length:",
    clientesData ? clientesData.length : "undefined"
  );
  console.log(
    "enviosData length:",
    enviosData ? enviosData.length : "undefined"
  );

  // 2. Verificar localStorage
  console.log("=== LOCALSTORAGE ===");
  try {
    const enviosLS = localStorage.getItem("enviosLogistica");
    const clientesLS = localStorage.getItem("clientesData");

    if (enviosLS) {
      const enviosParsed = JSON.parse(enviosLS);
      console.log("Envíos en localStorage:", enviosParsed.length);
      if (enviosParsed.length > 0) {
        console.log("Primer envío:", enviosParsed[0]);
        console.log("¿Tiene cliente?:", !!enviosParsed[0].cliente);
        if (enviosParsed[0].cliente) {
          console.log("Datos del cliente:", enviosParsed[0].cliente);
        }
      }
    } else {
      console.log("No hay envíos en localStorage");
    }

    if (clientesLS) {
      const clientesParsed = JSON.parse(clientesLS);
      console.log("Clientes guardados directamente:", clientesParsed.length);
    } else {
      console.log("No hay clientes guardados directamente");
    }
  } catch (error) {
    console.error("Error leyendo localStorage:", error);
  }

  // 3. Verificar DOM
  console.log("=== DOM ===");
  const tabla = document.querySelector("#clientesTable tbody");
  console.log("Tabla de clientes existe:", !!tabla);
  if (tabla) {
    console.log("Filas en tabla:", tabla.children.length);
  }

  // 4. Forzar inicialización si es necesario
  console.log("=== INICIALIZACIÓN ===");
  if (!clientManager) {
    console.log("Creando clientManager...");
    clientManager = new ClientManager();
  }

  // 5. Ejecutar carga manual
  console.log("=== CARGA MANUAL ===");
  try {
    clientManager.loadClientes();
    console.log(
      "Después de loadClientes - clientesData length:",
      clientesData.length
    );

    if (clientesData.length > 0) {
      console.log("Primer cliente:", clientesData[0]);
    }

    // Renderizar tabla
    clientManager.renderClientesTable();
    console.log("Tabla renderizada");
  } catch (error) {
    console.error("Error en carga manual:", error);
  }

  console.log("🔧 FIN DE PRUEBA");
  return true;
};

// Función alternativa más simple para el botón
window.sincronizarSimple = function () {
  console.log("🔄 Sincronización simple iniciada");

  try {
    // Asegurar que clientManager existe
    if (!clientManager) {
      console.log("Creando clientManager...");
      clientManager = new ClientManager();
    }

    // Recargar datos
    console.log("Recargando clientes...");
    clientManager.loadClientes();
    clientManager.renderClientesTable();

    console.log(
      `✅ Sincronización completada. ${clientesData.length} clientes cargados.`
    );
    mostrarNotificacion(
      `${clientesData.length} clientes sincronizados`,
      "success"
    );

    return true;
  } catch (error) {
    console.error("❌ Error en sincronización simple:", error);
    mostrarNotificacion("Error al sincronizar", "error");
    return false;
  }
};
// Función para verificar el estado del sistema de clientes
window.verificarEstadoClientes = function () {
  console.log("=== VERIFICACIÓN DEL SISTEMA DE CLIENTES ===");

  // Verificar variables globales
  console.log("clientManager:", !!clientManager);
  console.log(
    "clientesData:",
    Array.isArray(clientesData) ? clientesData.length : "No es array"
  );
  console.log(
    "enviosData:",
    Array.isArray(enviosData) ? enviosData.length : "No es array"
  );

  // Verificar localStorage
  try {
    const enviosLS = localStorage.getItem("enviosLogistica");
    const clientesLS = localStorage.getItem("clientesData");

    console.log(
      "Envíos en localStorage:",
      enviosLS ? JSON.parse(enviosLS).length : 0
    );
    console.log(
      "Clientes en localStorage:",
      clientesLS ? JSON.parse(clientesLS).length : 0
    );
  } catch (error) {
    console.error("Error verificando localStorage:", error);
  }

  // Verificar elementos DOM
  const tablaClientes = document.querySelector("#clientesTable tbody");
  console.log("Tabla de clientes existe:", !!tablaClientes);

  console.log("=== FIN VERIFICACIÓN ===");
};

// Ejecutar verificación automática cuando se carga el script
setTimeout(() => {
  console.log("🚀 Inicializando sistema de clientes...");
  window.verificarEstadoClientes();
}, 1000);
// Función para crear datos de prueba de clientes
window.crearClientesPrueba = function () {
  console.log("🧪 Creando clientes de prueba...");

  const clientesPrueba = [
    {
      nombre: "Juan Pérez",
      telefono: "55-1234-5678",
      email: "juan.perez@email.com",
    },
    {
      nombre: "María González",
      telefono: "55-8765-4321",
      email: "maria.gonzalez@email.com",
    },
    {
      nombre: "Carlos López",
      telefono: "55-5555-1234",
      email: "carlos.lopez@email.com",
    },
  ];

  const enviosPrueba = clientesPrueba.map((cliente, index) => ({
    numeroGuia: `LI-2025-TEST-${String(index + 1).padStart(3, "0")}`,
    cliente: cliente,
    origenCiudad: "Ciudad de México, CDMX",
    destinoCiudad: "Puebla, Puebla",
    precio: 75 + index * 10,
    estado: "entregado",
    fechaCreacion: new Date(
      Date.now() - index * 24 * 60 * 60 * 1000
    ).toISOString(),
    metodoPago: "efectivo",
  }));

  // Agregar a localStorage
  let enviosExistentes = [];
  try {
    const stored = localStorage.getItem("enviosLogistica");
    if (stored) {
      enviosExistentes = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error leyendo envíos existentes:", error);
  }

  // Agregar solo si no existen ya
  const nuevosEnvios = enviosPrueba.filter(
    (nuevo) =>
      !enviosExistentes.some(
        (existente) => existente.numeroGuia === nuevo.numeroGuia
      )
  );

  if (nuevosEnvios.length > 0) {
    enviosExistentes.push(...nuevosEnvios);
    localStorage.setItem("enviosLogistica", JSON.stringify(enviosExistentes));
    console.log(`✅ ${nuevosEnvios.length} envíos de prueba agregados`);

    // Recargar clientes
    if (clientManager) {
      clientManager.loadClientes();
      clientManager.renderClientesTable();
    }

    mostrarNotificacion(
      `${nuevosEnvios.length} clientes de prueba creados`,
      "success"
    );
  } else {
    console.log("ℹ️ Los envíos de prueba ya existen");
    mostrarNotificacion("Los clientes de prueba ya existen", "info");
  }

  return nuevosEnvios.length;
};

// Función para limpiar todos los datos
window.limpiarTodosLosDatos = function () {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar TODOS los datos? Esta acción no se puede deshacer."
    )
  ) {
    localStorage.removeItem("enviosLogistica");
    localStorage.removeItem("clientesData");
    localStorage.removeItem("repartidores");

    // Limpiar variables
    enviosData = [];
    clientesData = [];

    // Recargar interfaz
    if (clientManager) {
      clientManager.renderClientesTable();
    }

    console.log("🗑️ Todos los datos eliminados");
    mostrarNotificacion("Todos los datos eliminados", "success");
  }
};
// Función específica para debuggear la tabla de clientes
window.debugTablaClientes = function () {
  console.log("🔍 DEBUG TABLA DE CLIENTES");

  // 1. Verificar elemento DOM
  const tbody = document.getElementById("clientesTableBody");
  console.log("Elemento tbody encontrado:", !!tbody);
  if (tbody) {
    console.log("Contenido actual del tbody:", tbody.innerHTML);
    console.log("Número de filas:", tbody.children.length);
  }

  // 2. Verificar datos
  console.log("clientesData existe:", !!clientesData);
  console.log("clientesData es array:", Array.isArray(clientesData));
  console.log(
    "clientesData length:",
    clientesData ? clientesData.length : "undefined"
  );

  if (clientesData && clientesData.length > 0) {
    console.log("Primer cliente:", clientesData[0]);
  }

  // 3. Verificar clientManager
  console.log("clientManager existe:", !!clientManager);
  if (clientManager) {
    console.log(
      "clientManager tiene renderClientesTable:",
      typeof clientManager.renderClientesTable
    );
  }

  // 4. Intentar renderizar manualmente
  console.log("=== INTENTANDO RENDERIZAR MANUALMENTE ===");
  try {
    if (clientManager && clientManager.renderClientesTable) {
      console.log("Ejecutando renderClientesTable...");
      clientManager.renderClientesTable();

      // Verificar resultado
      if (tbody) {
        console.log("Contenido después de renderizar:", tbody.innerHTML);
        console.log("Número de filas después:", tbody.children.length);
      }
    } else {
      console.log("❌ No se puede ejecutar renderClientesTable");
    }
  } catch (error) {
    console.error("❌ Error al renderizar:", error);
  }

  console.log("🔍 FIN DEBUG TABLA");
};

// Función para forzar renderizado con datos de prueba
window.forzarRenderizadoConDatos = function () {
  console.log("🔧 FORZANDO RENDERIZADO CON DATOS");

  // Crear datos de prueba directamente
  const datosPrueba = [
    {
      id: "test_1",
      nombre: "Cliente Prueba 1",
      telefono: "55-1111-1111",
      email: "prueba1@test.com",
      totalEnvios: 2,
      totalGastado: 150.0,
      ultimoEnvio: { fechaCreacion: new Date().toISOString() },
      tipoCliente: "nuevo",
    },
    {
      id: "test_2",
      nombre: "Cliente Prueba 2",
      telefono: "55-2222-2222",
      email: "prueba2@test.com",
      totalEnvios: 5,
      totalGastado: 375.5,
      ultimoEnvio: { fechaCreacion: new Date().toISOString() },
      tipoCliente: "frecuente",
    },
  ];

  // Asignar datos directamente
  clientesData = datosPrueba;
  console.log("Datos de prueba asignados:", clientesData.length);

  // Renderizar
  const tbody = document.getElementById("clientesTableBody");
  if (tbody && clientManager) {
    try {
      clientManager.renderClientesTable();
      console.log("✅ Tabla renderizada con datos de prueba");
      mostrarNotificacion("Tabla renderizada con datos de prueba", "success");
    } catch (error) {
      console.error("❌ Error renderizando:", error);
      mostrarNotificacion("Error al renderizar tabla", "error");
    }
  } else {
    console.log("❌ No se encontró tbody o clientManager");
  }
};
// Función para verificar visibilidad de la sección de clientes
window.verificarSeccionClientes = function () {
  console.log("👀 VERIFICANDO VISIBILIDAD DE SECCIÓN");

  const seccion = document.getElementById("clientes-section");
  console.log("Sección clientes encontrada:", !!seccion);

  if (seccion) {
    console.log("Display de la sección:", seccion.style.display);
    console.log("Clase de la sección:", seccion.className);
    console.log("Sección visible:", seccion.offsetHeight > 0);
  }

  const tabla = document.getElementById("clientesTable");
  console.log("Tabla encontrada:", !!tabla);

  if (tabla) {
    console.log("Display de la tabla:", tabla.style.display);
    console.log("Tabla visible:", tabla.offsetHeight > 0);
  }

  const tbody = document.getElementById("clientesTableBody");
  console.log("Tbody encontrado:", !!tbody);

  if (tbody) {
    console.log(
      "Contenido del tbody:",
      tbody.innerHTML.substring(0, 200) + "..."
    );
    console.log("Número de filas:", tbody.children.length);
  }
};

// Función para forzar mostrar la sección de clientes
window.forzarMostrarSeccionClientes = function () {
  console.log("🔧 FORZANDO MOSTRAR SECCIÓN DE CLIENTES");

  // Ocultar todas las secciones
  const secciones = document.querySelectorAll(".content-section");
  secciones.forEach((seccion) => {
    seccion.style.display = "none";
  });

  // Mostrar solo la sección de clientes
  const seccionClientes = document.getElementById("clientes-section");
  if (seccionClientes) {
    seccionClientes.style.display = "block";
    console.log("✅ Sección de clientes mostrada");

    // Inicializar la sección
    setTimeout(() => {
      initializeClientesSection();
    }, 100);
  } else {
    console.error("❌ No se encontró la sección de clientes");
  }
};
// Función para procesar específicamente los envíos existentes
window.procesarEnviosExistentes = function () {
  console.log("🔄 PROCESANDO ENVÍOS EXISTENTES");

  try {
    // Cargar envíos desde localStorage
    const enviosLS = localStorage.getItem("enviosLogistica");
    if (!enviosLS) {
      console.log("❌ No hay envíos en localStorage");
      mostrarNotificacion("No hay envíos en localStorage", "error");
      return;
    }

    const envios = JSON.parse(enviosLS);
    console.log(`📦 Total de envíos encontrados: ${envios.length}`);

    // Analizar cada envío
    envios.forEach((envio, index) => {
      console.log(`--- Envío ${index + 1} ---`);
      console.log("Número de guía:", envio.numeroGuia);
      console.log("¿Tiene cliente?:", !!envio.cliente);

      if (envio.cliente) {
        console.log("Datos del cliente:", {
          nombre: envio.cliente.nombre,
          telefono: envio.cliente.telefono,
          email: envio.cliente.email,
        });
      } else {
        console.log("❌ Este envío no tiene datos de cliente");
      }
    });

    // Contar envíos con clientes
    const enviosConCliente = envios.filter(
      (e) => e.cliente && e.cliente.nombre
    );
    console.log(
      `👥 Envíos con datos de cliente: ${enviosConCliente.length} de ${envios.length}`
    );

    if (enviosConCliente.length === 0) {
      console.log("❌ Ningún envío tiene datos de cliente válidos");
      mostrarNotificacion("Los envíos no tienen datos de cliente", "error");
      return;
    }

    // Procesar clientes únicos
    const clientesUnicos = new Map();

    enviosConCliente.forEach((envio) => {
      const key = `${envio.cliente.nombre}_${envio.cliente.telefono}`;

      if (!clientesUnicos.has(key)) {
        clientesUnicos.set(key, {
          nombre: envio.cliente.nombre,
          telefono: envio.cliente.telefono,
          email: envio.cliente.email || "",
          envios: [],
        });
      }

      clientesUnicos.get(key).envios.push(envio);
    });

    console.log(`🎯 Clientes únicos identificados: ${clientesUnicos.size}`);

    // Mostrar resumen de clientes
    Array.from(clientesUnicos.values()).forEach((cliente, index) => {
      console.log(
        `Cliente ${index + 1}: ${cliente.nombre} - ${
          cliente.envios.length
        } envíos`
      );
    });

    // Forzar actualización del sistema
    console.log("🔄 Forzando actualización del sistema...");

    // Asegurar que enviosData esté actualizado
    enviosData = envios;

    // Recrear clientManager
    if (clientManager) {
      console.log("Recargando clientManager...");
      clientManager.loadClientes();
      clientManager.renderClientesTable();
    } else {
      console.log("Creando nuevo clientManager...");
      clientManager = new ClientManager();
    }

    console.log(
      `✅ Procesamiento completado. ${clientesData.length} clientes cargados.`
    );
    mostrarNotificacion(
      `${clientesData.length} clientes procesados desde ${envios.length} envíos`,
      "success"
    );
  } catch (error) {
    console.error("❌ Error procesando envíos:", error);
    mostrarNotificacion("Error procesando envíos existentes", "error");
  }
};

// Función para verificar estructura de un envío específico
window.verificarEstructuraEnvio = function (numeroGuia) {
  console.log(`🔍 VERIFICANDO ENVÍO: ${numeroGuia}`);

  try {
    const enviosLS = localStorage.getItem("enviosLogistica");
    if (!enviosLS) {
      console.log("❌ No hay envíos en localStorage");
      return;
    }

    const envios = JSON.parse(enviosLS);
    const envio = envios.find((e) => e.numeroGuia === numeroGuia);

    if (!envio) {
      console.log("❌ Envío no encontrado");
      return;
    }

    console.log("📋 Estructura completa del envío:");
    console.log(JSON.stringify(envio, null, 2));

    console.log("🔍 Análisis específico:");
    console.log("- Tiene numeroGuia:", !!envio.numeroGuia);
    console.log("- Tiene cliente:", !!envio.cliente);

    if (envio.cliente) {
      console.log("- Cliente.nombre:", envio.cliente.nombre);
      console.log("- Cliente.telefono:", envio.cliente.telefono);
      console.log("- Cliente.email:", envio.cliente.email);
    }

    console.log("- Tiene fechaCreacion:", !!envio.fechaCreacion);
    console.log("- Tiene precio:", !!envio.precio);
  } catch (error) {
    console.error("❌ Error verificando envío:", error);
  }
};
// Función para inspeccionar la estructura real de los envíos
window.inspeccionarEnviosReales = function () {
  console.log("🔍 INSPECCIÓN DETALLADA DE ENVÍOS REALES");

  try {
    const enviosLS = localStorage.getItem("enviosLogistica");
    if (!enviosLS) {
      console.log("❌ No hay envíos en localStorage");
      mostrarNotificacion("No hay envíos en localStorage", "error");
      return;
    }

    const envios = JSON.parse(enviosLS);
    console.log(`📦 Total de envíos: ${envios.length}`);

    // Separar envíos de prueba de envíos reales
    const enviosPrueba = envios.filter(
      (e) => e.numeroGuia && e.numeroGuia.includes("TEST")
    );
    const enviosReales = envios.filter(
      (e) => !e.numeroGuia || !e.numeroGuia.includes("TEST")
    );

    console.log(`🧪 Envíos de prueba: ${enviosPrueba.length}`);
    console.log(`📋 Envíos reales: ${enviosReales.length}`);

    if (enviosReales.length === 0) {
      console.log("⚠️ No se encontraron envíos reales (no de prueba)");
      mostrarNotificacion("Solo hay envíos de prueba", "warning");
      return;
    }

    console.log("=== ANÁLISIS DE ENVÍOS REALES ===");

    enviosReales.forEach((envio, index) => {
      console.log(`\n--- Envío Real ${index + 1} ---`);
      console.log("Número de guía:", envio.numeroGuia || "NO DEFINIDO");

      // Verificar todas las posibles ubicaciones de datos de cliente
      console.log("¿Tiene 'cliente'?:", !!envio.cliente);
      console.log("¿Tiene 'clienteNombre'?:", !!envio.clienteNombre);
      console.log("¿Tiene 'clienteTelefono'?:", !!envio.clienteTelefono);
      console.log("¿Tiene 'clienteEmail'?:", !!envio.clienteEmail);

      // Mostrar todas las propiedades del envío
      console.log("Propiedades del envío:", Object.keys(envio));

      // Buscar cualquier propiedad que contenga datos de cliente
      Object.keys(envio).forEach((key) => {
        if (
          key.toLowerCase().includes("cliente") ||
          key.toLowerCase().includes("nombre") ||
          key.toLowerCase().includes("telefono") ||
          key.toLowerCase().includes("email")
        ) {
          console.log(`${key}:`, envio[key]);
        }
      });

      // Mostrar estructura completa del primer envío real
      if (index === 0) {
        console.log("📋 ESTRUCTURA COMPLETA DEL PRIMER ENVÍO REAL:");
        console.log(JSON.stringify(envio, null, 2));
      }
    });

    // Intentar extraer clientes con diferentes estructuras
    console.log("\n=== INTENTANDO EXTRAER CLIENTES ===");

    const clientesEncontrados = [];

    enviosReales.forEach((envio) => {
      let cliente = null;

      // Método 1: Estructura estándar
      if (envio.cliente && envio.cliente.nombre) {
        cliente = {
          nombre: envio.cliente.nombre,
          telefono: envio.cliente.telefono,
          email: envio.cliente.email,
          fuente: "envio.cliente",
        };
      }
      // Método 2: Propiedades separadas
      else if (envio.clienteNombre) {
        cliente = {
          nombre: envio.clienteNombre,
          telefono: envio.clienteTelefono,
          email: envio.clienteEmail,
          fuente: "propiedades separadas",
        };
      }
      // Método 3: Buscar en todas las propiedades
      else {
        const keys = Object.keys(envio);
        const nombreKey = keys.find((k) => k.toLowerCase().includes("nombre"));
        const telefonoKey = keys.find((k) =>
          k.toLowerCase().includes("telefono")
        );
        const emailKey = keys.find((k) => k.toLowerCase().includes("email"));

        if (nombreKey && envio[nombreKey]) {
          cliente = {
            nombre: envio[nombreKey],
            telefono: envio[telefonoKey] || "",
            email: envio[emailKey] || "",
            fuente: "búsqueda automática",
          };
        }
      }

      if (cliente) {
        clientesEncontrados.push(cliente);
        console.log(`✅ Cliente encontrado (${cliente.fuente}):`, cliente);
      } else {
        console.log(
          `❌ No se pudo extraer cliente del envío:`,
          envio.numeroGuia
        );
      }
    });

    console.log(
      `\n🎯 RESUMEN: ${clientesEncontrados.length} clientes extraídos de ${enviosReales.length} envíos reales`
    );

    if (clientesEncontrados.length > 0) {
      mostrarNotificacion(
        `${clientesEncontrados.length} clientes encontrados en envíos reales`,
        "success"
      );
    } else {
      mostrarNotificacion(
        "No se pudieron extraer clientes de los envíos reales",
        "error"
      );
    }

    return {
      enviosReales: enviosReales.length,
      clientesEncontrados: clientesEncontrados.length,
      clientes: clientesEncontrados,
    };
  } catch (error) {
    console.error("❌ Error inspeccionando envíos:", error);
    mostrarNotificacion("Error al inspeccionar envíos", "error");
  }
};

// Función para convertir envíos reales al formato esperado
window.convertirEnviosReales = function () {
  console.log("🔄 CONVIRTIENDO ENVÍOS REALES AL FORMATO CORRECTO");

  try {
    const resultado = window.inspeccionarEnviosReales();
    if (!resultado || resultado.clientesEncontrados === 0) {
      console.log("❌ No hay clientes para convertir");
      return;
    }

    const enviosLS = localStorage.getItem("enviosLogistica");
    const envios = JSON.parse(enviosLS);

    let enviosModificados = 0;

    envios.forEach((envio) => {
      // Solo procesar envíos reales (no de prueba)
      if (envio.numeroGuia && envio.numeroGuia.includes("TEST")) {
        return;
      }

      // Si ya tiene la estructura correcta, saltar
      if (envio.cliente && envio.cliente.nombre) {
        return;
      }

      // Intentar extraer datos de cliente
      let clienteData = null;

      if (envio.clienteNombre) {
        clienteData = {
          nombre: envio.clienteNombre,
          telefono: envio.clienteTelefono || "",
          email: envio.clienteEmail || "",
        };
      } else {
        // Buscar en todas las propiedades
        const keys = Object.keys(envio);
        const nombreKey = keys.find((k) => k.toLowerCase().includes("nombre"));
        const telefonoKey = keys.find((k) =>
          k.toLowerCase().includes("telefono")
        );
        const emailKey = keys.find((k) => k.toLowerCase().includes("email"));

        if (nombreKey && envio[nombreKey]) {
          clienteData = {
            nombre: envio[nombreKey],
            telefono: envio[telefonoKey] || "",
            email: envio[emailKey] || "",
          };
        }
      }

      if (clienteData) {
        envio.cliente = clienteData;
        enviosModificados++;
        console.log(`✅ Envío ${envio.numeroGuia} convertido:`, clienteData);
      }
    });

    if (enviosModificados > 0) {
      // Guardar envíos modificados
      localStorage.setItem("enviosLogistica", JSON.stringify(envios));
      console.log(`✅ ${enviosModificados} envíos convertidos y guardados`);

      // Recargar sistema de clientes
      enviosData = envios;

      // Forzar recarga completa
      setTimeout(() => {
        if (clientManager) {
          console.log("🔄 Recargando clientManager...");
          clientManager.loadClientes();
          clientManager.renderClientesTable();

          console.log(
            `📊 Clientes después de conversión: ${clientesData.length}`
          );
        }
      }, 500);

      mostrarNotificacion(
        `${enviosModificados} envíos convertidos correctamente`,
        "success"
      );
    } else {
      console.log("ℹ️ No se encontraron envíos para convertir");
      mostrarNotificacion("No se encontraron envíos para convertir", "info");
    }
  } catch (error) {
    console.error("❌ Error convirtiendo envíos:", error);
    mostrarNotificacion("Error al convertir envíos", "error");
  }
};
// Función mejorada para mostrar clientes encontrados en pantalla
window.mostrarClientesEncontrados = function () {
  console.log("📋 MOSTRANDO CLIENTES ENCONTRADOS EN PANTALLA");

  try {
    // Primero inspeccionar para obtener los datos
    const resultado = window.inspeccionarEnviosReales();

    if (!resultado || resultado.clientesEncontrados === 0) {
      mostrarNotificacion("No se encontraron clientes", "error");
      return;
    }

    console.log(`✅ ${resultado.clientesEncontrados} clientes encontrados`);

    // Crear datos de clientes en el formato correcto
    const clientesProcesados = resultado.clientes.map((cliente, index) => ({
      id: `real_${Date.now()}_${index}`,
      nombre: cliente.nombre,
      telefono: cliente.telefono || "No registrado",
      email: cliente.email || "No registrado",
      totalEnvios: 1, // Por ahora 1, se calculará correctamente después
      totalGastado: 0, // Se calculará después
      ultimoEnvio: { fechaCreacion: new Date().toISOString() },
      tipoCliente: "nuevo",
      envios: [],
    }));

    // Asignar directamente a clientesData
    clientesData = clientesProcesados;

    console.log("📊 Clientes asignados a clientesData:", clientesData.length);

    // Forzar renderizado
    if (clientManager) {
      console.log("🎨 Forzando renderizado de tabla...");
      clientManager.renderClientesTable();

      // Actualizar estadísticas
      if (clientManager.updateClientesStats) {
        clientManager.updateClientesStats();
      }
    }

    mostrarNotificacion(
      `${clientesProcesados.length} clientes mostrados en pantalla`,
      "success"
    );

    return clientesProcesados;
  } catch (error) {
    console.error("❌ Error mostrando clientes:", error);
    mostrarNotificacion("Error al mostrar clientes", "error");
  }
};

// Función para forzar actualización completa del sistema
window.actualizacionCompletaClientes = function () {
  console.log("🔄 ACTUALIZACIÓN COMPLETA DEL SISTEMA DE CLIENTES");

  try {
    // Paso 1: Convertir envíos al formato correcto
    console.log("Paso 1: Convirtiendo envíos...");
    window.convertirEnviosReales();

    // Paso 2: Esperar un momento y recargar
    setTimeout(() => {
      console.log("Paso 2: Recargando sistema...");

      // Limpiar datos anteriores
      clientesData = [];

      // Recrear clientManager
      clientManager = new ClientManager();

      // Renderizar
      clientManager.renderClientesTable();

      console.log(
        `✅ Sistema actualizado. ${clientesData.length} clientes cargados.`
      );
      mostrarNotificacion(
        `Sistema actualizado: ${clientesData.length} clientes`,
        "success"
      );
    }, 1000);
  } catch (error) {
    console.error("❌ Error en actualización completa:", error);
    mostrarNotificacion("Error en actualización completa", "error");
  }
};
// Función para detectar y mostrar nuevos clientes automáticamente
window.detectarNuevosClientes = function () {
  console.log("🔍 Detectando nuevos clientes...");

  try {
    // Obtener envíos actuales
    const enviosLS = localStorage.getItem("enviosLogistica");
    if (!enviosLS) return;

    const enviosActuales = JSON.parse(enviosLS);
    const totalEnviosActuales = enviosActuales.length;

    // Comparar con el número anterior
    if (!window.ultimoNumeroEnvios) {
      window.ultimoNumeroEnvios = totalEnviosActuales;
      return;
    }

    if (totalEnviosActuales > window.ultimoNumeroEnvios) {
      const nuevosEnvios = totalEnviosActuales - window.ultimoNumeroEnvios;
      console.log(`📦 ${nuevosEnvios} nuevos envíos detectados`);

      // Actualizar contador
      window.ultimoNumeroEnvios = totalEnviosActuales;

      // Si estamos en la sección de clientes, actualizar automáticamente
      const seccionClientes = document.getElementById("clientes-section");
      if (seccionClientes && seccionClientes.style.display !== "none") {
        console.log("🔄 Actualizando lista de clientes automáticamente...");

        // Usar la función que ya funciona
        setTimeout(() => {
          window.mostrarClientesEncontrados();
        }, 1000);

        mostrarNotificacion(`${nuevosEnvios} nuevos envíos detectados`, "info");
      }
    }
  } catch (error) {
    console.error("❌ Error detectando nuevos clientes:", error);
  }
};

// Función para inicializar la detección automática
window.iniciarDeteccionAutomatica = function () {
  console.log("🚀 Iniciando detección automática de nuevos clientes...");

  // Establecer contador inicial
  try {
    const enviosLS = localStorage.getItem("enviosLogistica");
    if (enviosLS) {
      const envios = JSON.parse(enviosLS);
      window.ultimoNumeroEnvios = envios.length;
      console.log(`📊 Contador inicial: ${window.ultimoNumeroEnvios} envíos`);
    }
  } catch (error) {
    console.error("Error inicializando contador:", error);
    window.ultimoNumeroEnvios = 0;
  }

  // Verificar cada 5 segundos
  if (window.intervalDeteccion) {
    clearInterval(window.intervalDeteccion);
  }

  // Intervalo deshabilitado para evitar congelamiento
  // window.intervalDeteccion = setInterval(window.detectarNuevosClientes, 5000);
  console.log("✅ Detección automática iniciada (cada 5 segundos)");
};

// Función para actualizar clientes (botón principal)
window.actualizacionRapidaClientes = function () {
  console.log("🔄 Actualizando lista de clientes...");

  try {
    // Mostrar mensaje de carga
    mostrarNotificacion("Actualizando clientes...", "info");

    // Asegurar que clientManager existe
    if (!clientManager) {
      console.log("Inicializando clientManager...");
      clientManager = new ClientManager();
    }

    // Cargar datos frescos
    clientManager.loadClientes();

    // Si no hay clientes, usar la función que funciona
    if (clientesData.length === 0) {
      console.log("No hay clientes, usando función alternativa...");
      window.mostrarClientesEncontrados();
    } else {
      // Renderizar tabla con datos existentes
      clientManager.renderClientesTable();
    }

    // Actualizar estadísticas
    if (clientManager.updateClientesStats) {
      clientManager.updateClientesStats();
    }

    // Mostrar resultado
    const mensaje = `Lista actualizada: ${clientesData.length} clientes`;
    console.log(`✅ ${mensaje}`);
    mostrarNotificacion(mensaje, "success");
  } catch (error) {
    console.error("❌ Error actualizando clientes:", error);
    mostrarNotificacion("Error al actualizar clientes", "error");
  }
};

// Detección automática deshabilitada para evitar congelamiento
// setTimeout(() => {
//   window.iniciarDeteccionAutomatica();
// }, 2000);
// Función para analizar exactamente por qué solo aparecen 6 de 9 clientes
window.analizarTodosLosEnvios = function () {
  console.log("🔍 ANÁLISIS COMPLETO DE TODOS LOS ENVÍOS");

  try {
    const enviosLS = localStorage.getItem("enviosLogistica");
    if (!enviosLS) {
      console.log("❌ No hay envíos en localStorage");
      return;
    }

    const todosLosEnvios = JSON.parse(enviosLS);
    console.log(`📦 Total de envíos en localStorage: ${todosLosEnvios.length}`);

    // Separar por tipo
    const enviosPrueba = todosLosEnvios.filter(
      (e) => e.numeroGuia && e.numeroGuia.includes("TEST")
    );
    const enviosReales = todosLosEnvios.filter(
      (e) => !e.numeroGuia || !e.numeroGuia.includes("TEST")
    );

    console.log(`🧪 Envíos de prueba: ${enviosPrueba.length}`);
    console.log(`📋 Envíos reales: ${enviosReales.length}`);

    console.log("\n=== ANÁLISIS DETALLADO DE CADA ENVÍO ===");

    let enviosConCliente = 0;
    let enviosSinCliente = 0;
    let clientesUnicos = new Set();
    let problemasEncontrados = [];

    todosLosEnvios.forEach((envio, index) => {
      console.log(`\n--- Envío ${index + 1} ---`);
      console.log("Número de guía:", envio.numeroGuia || "NO DEFINIDO");
      console.log(
        "Tipo:",
        envio.numeroGuia && envio.numeroGuia.includes("TEST")
          ? "PRUEBA"
          : "REAL"
      );

      // Verificar datos de cliente
      let tieneCliente = false;
      let datosCliente = null;

      // Método 1: envio.cliente
      if (envio.cliente && envio.cliente.nombre) {
        tieneCliente = true;
        datosCliente = envio.cliente;
        console.log(
          "✅ Cliente encontrado en envio.cliente:",
          datosCliente.nombre
        );
      }
      // Método 2: propiedades separadas
      else if (envio.clienteNombre) {
        tieneCliente = true;
        datosCliente = {
          nombre: envio.clienteNombre,
          telefono: envio.clienteTelefono,
          email: envio.clienteEmail,
        };
        console.log(
          "✅ Cliente encontrado en propiedades separadas:",
          datosCliente.nombre
        );
      }
      // Método 3: buscar en todas las propiedades
      else {
        const keys = Object.keys(envio);
        const nombreKey = keys.find(
          (k) => k.toLowerCase().includes("nombre") && envio[k]
        );

        if (nombreKey) {
          tieneCliente = true;
          datosCliente = {
            nombre: envio[nombreKey],
            telefono:
              envio[keys.find((k) => k.toLowerCase().includes("telefono"))] ||
              "",
            email:
              envio[keys.find((k) => k.toLowerCase().includes("email"))] || "",
          };
          console.log(
            "✅ Cliente encontrado por búsqueda:",
            datosCliente.nombre
          );
        }
      }

      if (tieneCliente && datosCliente) {
        enviosConCliente++;

        // Crear clave única para el cliente
        const claveCliente = `${datosCliente.nombre}_${datosCliente.telefono}`;
        clientesUnicos.add(claveCliente);

        console.log("📞 Teléfono:", datosCliente.telefono);
        console.log("📧 Email:", datosCliente.email);
      } else {
        enviosSinCliente++;
        console.log("❌ NO tiene datos de cliente válidos");

        // Mostrar qué propiedades tiene
        console.log("Propiedades disponibles:", Object.keys(envio));
        problemasEncontrados.push({
          envio: index + 1,
          numeroGuia: envio.numeroGuia,
          problema: "Sin datos de cliente",
          propiedades: Object.keys(envio),
        });
      }
    });

    console.log("\n=== RESUMEN FINAL ===");
    console.log(`📊 Total de envíos: ${todosLosEnvios.length}`);
    console.log(`✅ Envíos con cliente: ${enviosConCliente}`);
    console.log(`❌ Envíos sin cliente: ${enviosSinCliente}`);
    console.log(`👥 Clientes únicos: ${clientesUnicos.size}`);

    if (problemasEncontrados.length > 0) {
      console.log("\n⚠️ PROBLEMAS ENCONTRADOS:");
      problemasEncontrados.forEach((problema) => {
        console.log(
          `- Envío ${problema.envio} (${problema.numeroGuia}): ${problema.problema}`
        );
        console.log(`  Propiedades: ${problema.propiedades.join(", ")}`);
      });
    }

    console.log("\n🎯 CLIENTES ÚNICOS IDENTIFICADOS:");
    Array.from(clientesUnicos).forEach((cliente, index) => {
      console.log(`${index + 1}. ${cliente}`);
    });

    // Mostrar notificación con el resultado
    mostrarNotificacion(
      `Análisis: ${todosLosEnvios.length} envíos, ${enviosConCliente} con cliente, ${clientesUnicos.size} únicos`,
      "info"
    );

    return {
      totalEnvios: todosLosEnvios.length,
      enviosConCliente,
      enviosSinCliente,
      clientesUnicos: clientesUnicos.size,
      problemas: problemasEncontrados,
    };
  } catch (error) {
    console.error("❌ Error analizando envíos:", error);
    mostrarNotificacion("Error al analizar envíos", "error");
  }
};

// Función para intentar recuperar los 3 clientes faltantes
window.recuperarClientesFaltantes = function () {
  console.log("🔧 INTENTANDO RECUPERAR CLIENTES FALTANTES");

  try {
    const analisis = window.analizarTodosLosEnvios();

    if (!analisis) {
      console.log("❌ No se pudo realizar el análisis");
      return;
    }

    console.log(
      `\n🎯 Esperados: 9 envíos → ${analisis.clientesUnicos} clientes únicos`
    );
    console.log(
      `📊 Encontrados: ${analisis.enviosConCliente} envíos con cliente`
    );

    if (analisis.problemas.length > 0) {
      console.log("\n🔧 INTENTANDO REPARAR ENVÍOS PROBLEMÁTICOS:");

      const enviosLS = localStorage.getItem("enviosLogistica");
      const envios = JSON.parse(enviosLS);
      let reparados = 0;

      analisis.problemas.forEach((problema) => {
        const envio = envios[problema.envio - 1];
        console.log(`\nReparando envío ${problema.envio}:`, envio.numeroGuia);

        // Intentar diferentes estrategias de reparación
        let clienteReparado = null;

        // Estrategia 1: Buscar cualquier campo que parezca un nombre
        const posiblesNombres = problema.propiedades.filter(
          (prop) =>
            prop.toLowerCase().includes("nombre") ||
            prop.toLowerCase().includes("client") ||
            prop === "nombre"
        );

        if (posiblesNombres.length > 0 && envio[posiblesNombres[0]]) {
          clienteReparado = {
            nombre: envio[posiblesNombres[0]],
            telefono: envio.telefono || envio.clienteTelefono || "",
            email: envio.email || envio.clienteEmail || "",
          };
        }

        // Estrategia 2: Si tiene datos básicos, crear cliente genérico
        if (!clienteReparado && envio.numeroGuia) {
          clienteReparado = {
            nombre: `Cliente ${envio.numeroGuia}`,
            telefono: "No registrado",
            email: "No registrado",
          };
        }

        if (clienteReparado) {
          envio.cliente = clienteReparado;
          reparados++;
          console.log(`✅ Reparado: ${clienteReparado.nombre}`);
        }
      });

      if (reparados > 0) {
        localStorage.setItem("enviosLogistica", JSON.stringify(envios));
        console.log(`✅ ${reparados} envíos reparados y guardados`);

        // Actualizar lista
        setTimeout(() => {
          window.mostrarClientesEncontrados();
        }, 500);

        mostrarNotificacion(`${reparados} clientes recuperados`, "success");
      }
    }
  } catch (error) {
    console.error("❌ Error recuperando clientes:", error);
    mostrarNotificacion("Error al recuperar clientes", "error");
  }
};
// Función para probar que los botones principales funcionen
window.probarBotonesPrincipales = function () {
  console.log("🧪 PROBANDO BOTONES PRINCIPALES DE CLIENTES");

  let resultados = {
    actualizarClientes: false,
    exportarClientes: false,
  };

  // Probar botón Actualizar Clientes
  try {
    if (typeof window.actualizacionRapidaClientes === "function") {
      console.log("✅ Función actualizacionRapidaClientes disponible");
      resultados.actualizarClientes = true;
    } else {
      console.log("❌ Función actualizacionRapidaClientes NO disponible");
    }
  } catch (error) {
    console.error("❌ Error probando actualizacionRapidaClientes:", error);
  }

  // Probar botón Exportar
  try {
    if (typeof window.mostrarOpcionesExportacion === "function") {
      console.log("✅ Función mostrarOpcionesExportacion disponible");
      resultados.exportarClientes = true;
    } else {
      console.log("❌ Función mostrarOpcionesExportacion NO disponible");
    }
  } catch (error) {
    console.error("❌ Error probando mostrarOpcionesExportacion:", error);
  }

  // Verificar elementos DOM
  const botonActualizar = document.querySelector(
    'button[onclick*="actualizacionRapidaClientes"]'
  );
  const botonExportar = document.querySelector(
    'button[onclick*="mostrarOpcionesExportacion"]'
  );

  console.log("🔘 Botón Actualizar Clientes en DOM:", !!botonActualizar);
  console.log("🔘 Botón Exportar en DOM:", !!botonExportar);

  // Resumen
  const todoFunciona =
    resultados.actualizarClientes &&
    resultados.exportarClientes &&
    botonActualizar &&
    botonExportar;

  if (todoFunciona) {
    console.log("🎉 ¡AMBOS BOTONES FUNCIONAN CORRECTAMENTE!");
    mostrarNotificacion(
      "Botones principales verificados correctamente",
      "success"
    );
  } else {
    console.log("⚠️ Algunos botones tienen problemas");
    mostrarNotificacion("Verificar configuración de botones", "error");
  }

  return {
    funcionesDisponibles: resultados,
    elementosDOM: {
      botonActualizar: !!botonActualizar,
      botonExportar: !!botonExportar,
    },
    todoFunciona,
  };
};
// Función manual para actualizar clientes (sin intervalos automáticos)
window.actualizarClientesManual = function () {
  console.log("🔄 Actualización manual de clientes");

  try {
    // Asegurar que clientManager existe
    if (!clientManager) {
      clientManager = new ClientManager();
    }

    // Cargar datos
    clientManager.loadClientes();

    // Si no hay datos, usar función alternativa
    if (clientesData.length === 0) {
      window.mostrarClientesEncontrados();
    } else {
      clientManager.renderClientesTable();
    }

    console.log(`✅ ${clientesData.length} clientes actualizados manualmente`);
  } catch (error) {
    console.error("❌ Error en actualización manual:", error);
  }
};
///
//==================== SISTEMA DE REPORTES ====================

// Clase principal para gestión de reportes
class ReportManager {
  constructor() {
    this.enviosData = [];
    this.clientesData = [];
    this.repartidoresData = [];
    this.cargarDatos();
  }

  // Cargar todos los datos necesarios
  cargarDatos() {
    try {
      // Cargar envíos
      const enviosLS = localStorage.getItem("enviosLogistica");
      this.enviosData = enviosLS ? JSON.parse(enviosLS) : [];

      // Cargar clientes
      const clientesLS = localStorage.getItem("clientesData");
      this.clientesData = clientesLS ? JSON.parse(clientesLS) : [];

      // Cargar repartidores
      const repartidoresLS = localStorage.getItem("repartidores");
      this.repartidoresData = repartidoresLS ? JSON.parse(repartidoresLS) : [];

      console.log(
        `📊 Datos cargados: ${this.enviosData.length} envíos, ${this.clientesData.length} clientes`
      );
    } catch (error) {
      console.error("Error cargando datos para reportes:", error);
    }
  }

  // Calcular KPIs principales
  calcularKPIs(periodo = "mes") {
    const fechaFiltro = this.obtenerFechaFiltro(periodo);
    const enviosFiltrados = this.filtrarEnviosPorFecha(
      this.enviosData,
      fechaFiltro
    );

    const kpis = {
      totalEnvios: enviosFiltrados.length,
      ingresosTotales: this.calcularIngresosTotales(enviosFiltrados),
      clientesNuevos: this.contarClientesNuevos(fechaFiltro),
      tasaEntrega: this.calcularTasaEntrega(enviosFiltrados),
      promedioEnvio: this.calcularPromedioEnvio(enviosFiltrados),
    };
  } // Calcular cambios porcentuales
}
// ==================== SISTEMA DE REPORTES ====================

// Clase principal para gestión de reportes
class ReportManager {
  constructor() {
    this.enviosData = [];
    this.clientesData = [];
    this.repartidoresData = [];
    this.cargarDatos();
  }

  // Cargar todos los datos necesarios
  cargarDatos() {
    try {
      // Cargar envíos
      const enviosLS = localStorage.getItem("enviosLogistica");
      this.enviosData = enviosLS ? JSON.parse(enviosLS) : [];

      // Cargar clientes
      const clientesLS = localStorage.getItem("clientesData");
      this.clientesData = clientesLS ? JSON.parse(clientesLS) : [];

      // Cargar repartidores
      const repartidoresLS = localStorage.getItem("repartidores");
      this.repartidoresData = repartidoresLS ? JSON.parse(repartidoresLS) : [];

      console.log(
        `📊 Datos cargados: ${this.enviosData.length} envíos, ${this.clientesData.length} clientes, ${this.repartidoresData.length} repartidores`
      );
    } catch (error) {
      console.error("Error cargando datos para reportes:", error);
    }
  }

  // Generar reporte según período
  generarReporte(periodo = "hoy") {
    console.log(`📈 Generando reporte para: ${periodo}`);

    const fechaFin = new Date();
    let fechaInicio = new Date();

    // Calcular fecha de inicio según período
    switch (periodo) {
      case "hoy":
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case "semana":
        fechaInicio.setDate(fechaFin.getDate() - 7);
        break;
      case "mes":
        fechaInicio.setMonth(fechaFin.getMonth() - 1);
        break;
      case "trimestre":
        fechaInicio.setMonth(fechaFin.getMonth() - 3);
        break;
      case "año":
        fechaInicio.setFullYear(fechaFin.getFullYear() - 1);
        break;
    }

    // Filtrar envíos por período
    const enviosPeriodo = this.enviosData.filter((envio) => {
      const fechaEnvio = new Date(envio.fechaCreacion);
      return fechaEnvio >= fechaInicio && fechaEnvio <= fechaFin;
    });

    // Generar métricas
    const metricas = this.calcularMetricas(enviosPeriodo);

    // Actualizar interfaz
    this.actualizarKPIs(metricas);
    this.actualizarGraficos(enviosPeriodo, periodo);
    this.actualizarTablas(enviosPeriodo);

    return metricas;
  }

  // Calcular métricas principales
  calcularMetricas(envios) {
    const total = envios.length;
    const ingresos = envios.reduce(
      (sum, envio) => sum + (parseFloat(envio.precio) || 0),
      0
    );
    const promedio = total > 0 ? ingresos / total : 0;

    // Estados
    const pendientes = envios.filter(
      (e) => !e.estado || e.estado === "pendiente"
    ).length;
    const enTransito = envios.filter((e) => e.estado === "en_transito").length;
    const entregados = envios.filter((e) => e.estado === "entregado").length;

    // Zonas
    const zonas = this.analizarPorZonas(envios);

    // Clientes únicos
    const clientesUnicos = new Set(
      envios.map((e) => e.cliente?.telefono).filter(Boolean)
    ).size;

    return {
      totalEnvios: total,
      ingresosTotales: ingresos,
      ingresoPromedio: promedio,
      clientesUnicos,
      pendientes,
      enTransito,
      entregados,
      tasaEntrega: total > 0 ? (entregados / total) * 100 : 0,
      zonas,
    };
  }

  // Analizar envíos por zonas
  analizarPorZonas(envios) {
    const zonas = {};

    envios.forEach((envio) => {
      let zona = "Otros";

      if (envio.origenCiudad && envio.destinoCiudad) {
        const origen = envio.origenCiudad.toLowerCase();
        const destino = envio.destinoCiudad.toLowerCase();

        if (origen.includes("cdmx") || origen.includes("ciudad de mexico")) {
          if (destino.includes("puebla")) {
            zona = "CDMX → Puebla";
          } else if (
            destino.includes("cdmx") ||
            destino.includes("ciudad de mexico")
          ) {
            zona = "CDMX Local";
          }
        } else if (origen.includes("puebla")) {
          if (
            destino.includes("cdmx") ||
            destino.includes("ciudad de mexico")
          ) {
            zona = "Puebla → CDMX";
          } else if (destino.includes("puebla")) {
            zona = "Puebla Local";
          }
        }
      }

      if (!zonas[zona]) {
        zonas[zona] = { cantidad: 0, ingresos: 0 };
      }

      zonas[zona].cantidad++;
      zonas[zona].ingresos += parseFloat(envio.precio) || 0;
    });

    return zonas;
  }

  // Actualizar KPIs en la interfaz
  actualizarKPIs(metricas) {
    // KPIs principales
    this.actualizarElemento("kpiTotalEnvios", metricas.totalEnvios);
    this.actualizarElemento(
      "kpiIngresosTotales",
      `$${metricas.ingresosTotales.toFixed(2)}`
    );
    this.actualizarElemento(
      "kpiIngresoPromedio",
      `$${metricas.ingresoPromedio.toFixed(2)}`
    );
    this.actualizarElemento("kpiClientesUnicos", metricas.clientesUnicos);
    this.actualizarElemento(
      "kpiTasaEntrega",
      `${metricas.tasaEntrega.toFixed(1)}%`
    );

    // Estados
    this.actualizarElemento("estadoPendientes", metricas.pendientes);
    this.actualizarElemento("estadoTransito", metricas.enTransito);
    this.actualizarElemento("estadoEntregados", metricas.entregados);
  }

  // Actualizar gráficos
  actualizarGraficos(envios, periodo) {
    // Gráfico de envíos por tiempo
    this.generarGraficoTemporal(envios, periodo);

    // Gráfico de ingresos por zona
    this.generarGraficoZonas(envios);

    // Gráfico de estados
    this.generarGraficoEstados(envios);
  }

  // Generar gráfico temporal simple (sin librerías externas)
  generarGraficoTemporal(envios, periodo) {
    const contenedor = document.getElementById("graficoEnviosTiempo");
    if (!contenedor) return;

    // Agrupar por días/semanas según período
    const agrupados = this.agruparPorTiempo(envios, periodo);

    // Crear gráfico simple con barras CSS
    let html = '<div class="grafico-barras">';
    const maxValor = Math.max(...Object.values(agrupados));

    Object.entries(agrupados).forEach(([fecha, cantidad]) => {
      const altura = maxValor > 0 ? (cantidad / maxValor) * 100 : 0;
      html += `
        <div class="barra-container">
          <div class="barra" style="height: ${altura}%" title="${cantidad} envíos"></div>
          <div class="barra-label">${fecha}</div>
        </div>
      `;
    });

    html += "</div>";
    contenedor.innerHTML = html;
  }

  // Agrupar envíos por tiempo
  agruparPorTiempo(envios, periodo) {
    const agrupados = {};

    envios.forEach((envio) => {
      const fecha = new Date(envio.fechaCreacion);
      let clave;

      switch (periodo) {
        case "hoy":
          clave = fecha.getHours() + ":00";
          break;
        case "semana":
          const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
          clave = dias[fecha.getDay()];
          break;
        case "mes":
          clave = fecha.getDate().toString();
          break;
        default:
          clave = fecha.toLocaleDateString();
      }

      agrupados[clave] = (agrupados[clave] || 0) + 1;
    });

    return agrupados;
  }

  // Generar gráfico de zonas
  generarGraficoZonas(envios) {
    const contenedor = document.getElementById("graficoIngresosZona");
    if (!contenedor) return;

    const zonas = this.analizarPorZonas(envios);

    let html = '<div class="lista-zonas">';
    Object.entries(zonas).forEach(([zona, datos]) => {
      const porcentaje =
        envios.length > 0 ? (datos.cantidad / envios.length) * 100 : 0;
      html += `
        <div class="zona-item">
          <div class="zona-info">
            <span class="zona-nombre">${zona}</span>
            <span class="zona-stats">${
              datos.cantidad
            } envíos - $${datos.ingresos.toFixed(2)}</span>
          </div>
          <div class="zona-barra">
            <div class="zona-progreso" style="width: ${porcentaje}%"></div>
          </div>
        </div>
      `;
    });
    html += "</div>";

    contenedor.innerHTML = html;
  }

  // Generar gráfico de estados
  generarGraficoEstados(envios) {
    const contenedor = document.getElementById("graficoEstados");
    if (!contenedor) return;

    const estados = {
      Pendientes: envios.filter((e) => !e.estado || e.estado === "pendiente")
        .length,
      "En Tránsito": envios.filter((e) => e.estado === "en_transito").length,
      Entregados: envios.filter((e) => e.estado === "entregado").length,
    };

    const total = envios.length;
    let html = '<div class="estados-lista">';

    Object.entries(estados).forEach(([estado, cantidad]) => {
      const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;
      html += `
        <div class="estado-item">
          <span class="estado-nombre">${estado}</span>
          <span class="estado-cantidad">${cantidad}</span>
          <span class="estado-porcentaje">${porcentaje.toFixed(1)}%</span>
        </div>
      `;
    });

    html += "</div>";
    contenedor.innerHTML = html;
  }

  // Actualizar tablas
  actualizarTablas(envios) {
    this.actualizarTopClientes(envios);
    this.actualizarRendimientoRepartidores(envios);
    this.actualizarAnalisisZonas(envios);
  }

  // Top clientes
  actualizarTopClientes(envios) {
    const contenedor = document.getElementById("topClientesLista");
    if (!contenedor) return;

    // Agrupar por cliente
    const clientes = {};
    envios.forEach((envio) => {
      if (envio.cliente && envio.cliente.nombre) {
        const key = envio.cliente.nombre;
        if (!clientes[key]) {
          clientes[key] = {
            nombre: envio.cliente.nombre,
            telefono: envio.cliente.telefono,
            envios: 0,
            total: 0,
          };
        }
        clientes[key].envios++;
        clientes[key].total += parseFloat(envio.precio) || 0;
      }
    });

    // Ordenar por total gastado
    const topClientes = Object.values(clientes)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    let html = "";
    topClientes.forEach((cliente, index) => {
      html += `
        <div class="cliente-item">
          <span class="cliente-posicion">#${index + 1}</span>
          <div class="cliente-info">
            <div class="cliente-nombre">${cliente.nombre}</div>
            <div class="cliente-stats">${
              cliente.envios
            } envíos - $${cliente.total.toFixed(2)}</div>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML =
      html || "<p>No hay datos de clientes disponibles</p>";
  }

  // Rendimiento de repartidores
  actualizarRendimientoRepartidores(envios) {
    const contenedor = document.getElementById("rendimientoRepartidores");
    if (!contenedor) return;

    // Agrupar por repartidor
    const repartidores = {};
    envios.forEach((envio) => {
      if (envio.repartidorAsignado && envio.repartidorAsignado.nombre) {
        const key = envio.repartidorAsignado.nombre;
        if (!repartidores[key]) {
          repartidores[key] = {
            nombre: envio.repartidorAsignado.nombre,
            envios: 0,
            entregados: 0,
          };
        }
        repartidores[key].envios++;
        if (envio.estado === "entregado") {
          repartidores[key].entregados++;
        }
      }
    });

    let html = "";
    Object.values(repartidores).forEach((repartidor) => {
      const eficiencia =
        repartidor.envios > 0
          ? (repartidor.entregados / repartidor.envios) * 100
          : 0;
      html += `
        <div class="repartidor-item">
          <div class="repartidor-info">
            <div class="repartidor-nombre">${repartidor.nombre}</div>
            <div class="repartidor-stats">
              ${repartidor.envios} asignados | ${
        repartidor.entregados
      } entregados | ${eficiencia.toFixed(1)}% eficiencia
            </div>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML =
      html || "<p>No hay datos de repartidores disponibles</p>";
  }

  // Análisis por zonas
  actualizarAnalisisZonas(envios) {
    const contenedor = document.getElementById("analisisZonas");
    if (!contenedor) return;

    const zonas = this.analizarPorZonas(envios);

    let html = "";
    Object.entries(zonas).forEach(([zona, datos]) => {
      const promedio = datos.cantidad > 0 ? datos.ingresos / datos.cantidad : 0;
      html += `
        <div class="zona-analisis">
          <div class="zona-titulo">${zona}</div>
          <div class="zona-metricas">
            <span>📦 ${datos.cantidad} envíos</span>
            <span>💰 $${datos.ingresos.toFixed(2)}</span>
            <span>📊 $${promedio.toFixed(2)} promedio</span>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = html || "<p>No hay datos de zonas disponibles</p>";
  }

  // Función auxiliar para actualizar elementos
  actualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
    }
  }

  // Generar resumen ejecutivo
  generarResumenEjecutivo(periodo) {
    const metricas = this.generarReporte(periodo);

    const resumen = `
      <div class="resumen-ejecutivo">
        <h3>📋 Resumen Ejecutivo - ${
          periodo.charAt(0).toUpperCase() + periodo.slice(1)
        }</h3>
        
        <div class="resumen-metricas">
          <div class="metrica-principal">
            <h4>📊 Métricas Principales</h4>
            <ul>
              <li><strong>Total de Envíos:</strong> ${metricas.totalEnvios}</li>
              <li><strong>Ingresos Totales:</strong> $${metricas.ingresosTotales.toFixed(
                2
              )}</li>
              <li><strong>Ingreso Promedio:</strong> $${metricas.ingresoPromedio.toFixed(
                2
              )}</li>
              <li><strong>Clientes Únicos:</strong> ${
                metricas.clientesUnicos
              }</li>
              <li><strong>Tasa de Entrega:</strong> ${metricas.tasaEntrega.toFixed(
                1
              )}%</li>
            </ul>
          </div>
          
          <div class="metrica-estados">
            <h4>📈 Estados de Envíos</h4>
            <ul>
              <li><strong>Pendientes:</strong> ${metricas.pendientes}</li>
              <li><strong>En Tránsito:</strong> ${metricas.enTransito}</li>
              <li><strong>Entregados:</strong> ${metricas.entregados}</li>
            </ul>
          </div>
        </div>
        
        <div class="resumen-conclusiones">
          <h4>💡 Conclusiones</h4>
          <ul>
            ${this.generarConclusiones(metricas)}
          </ul>
        </div>
      </div>
    `;

    const contenedor = document.getElementById("resumenContenido");
    if (contenedor) {
      contenedor.innerHTML = resumen;
    }
  }

  // Generar conclusiones automáticas
  generarConclusiones(metricas) {
    const conclusiones = [];

    if (metricas.tasaEntrega >= 90) {
      conclusiones.push(
        "<li>✅ Excelente tasa de entrega, el servicio es muy confiable</li>"
      );
    } else if (metricas.tasaEntrega >= 70) {
      conclusiones.push(
        "<li>⚠️ Tasa de entrega aceptable, hay oportunidades de mejora</li>"
      );
    } else {
      conclusiones.push(
        "<li>🚨 Tasa de entrega baja, requiere atención inmediata</li>"
      );
    }

    if (metricas.ingresoPromedio > 100) {
      conclusiones.push(
        "<li>💰 Ingreso promedio por envío es alto, buen margen</li>"
      );
    } else if (metricas.ingresoPromedio > 50) {
      conclusiones.push(
        "<li>📊 Ingreso promedio moderado, considerar optimización</li>"
      );
    }

    if (metricas.clientesUnicos > 0) {
      const enviosPorCliente = metricas.totalEnvios / metricas.clientesUnicos;
      if (enviosPorCliente > 2) {
        conclusiones.push(
          "<li>🎯 Buena fidelización de clientes, envíos recurrentes</li>"
        );
      } else {
        conclusiones.push(
          "<li>📈 Oportunidad de mejorar retención de clientes</li>"
        );
      }
    }

    return conclusiones.join("");
  }
}

// Instancia global del gestor de reportes
let reportManager = null;

// Función para generar reporte (llamada desde HTML)
window.generarReporte = function () {
  console.log("📊 Generando reporte...");

  try {
    // Inicializar gestor si no existe
    if (!reportManager) {
      reportManager = new ReportManager();
    }

    // Obtener período seleccionado
    const periodoSelect = document.getElementById("periodoReporte");
    const periodo = periodoSelect ? periodoSelect.value : "hoy";

    // Generar reporte
    const metricas = reportManager.generarReporte(periodo);

    // Generar resumen ejecutivo
    reportManager.generarResumenEjecutivo(periodo);

    // Mostrar notificación
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(
        `Reporte generado: ${metricas.totalEnvios} envíos analizados`,
        "success"
      );
    }

    console.log("✅ Reporte generado exitosamente");
  } catch (error) {
    console.error("❌ Error generando reporte:", error);
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Error al generar reporte", "error");
    }
  }
};

// Función para exportar reporte (llamada desde HTML)
window.exportarReporte = function () {
  console.log("📄 Exportando reporte...");

  try {
    if (!reportManager) {
      reportManager = new ReportManager();
    }

    const periodoSelect = document.getElementById("periodoReporte");
    const periodo = periodoSelect ? periodoSelect.value : "hoy";

    // Generar datos del reporte
    const metricas = reportManager.generarReporte(periodo);

    // Crear contenido CSV
    let csvContent = "Reporte de Logistica Integral\\n\\n";
    csvContent += `Periodo: ${periodo}\\n`;
    csvContent += `Fecha de generacion: ${new Date().toLocaleString()}\\n\\n`;
    csvContent += "METRICAS PRINCIPALES\\n";
    csvContent += `Total de Envios,${metricas.totalEnvios}\\n`;
    csvContent += `Ingresos Totales,$${metricas.ingresosTotales.toFixed(2)}\\n`;
    csvContent += `Ingreso Promedio,$${metricas.ingresoPromedio.toFixed(2)}\\n`;
    csvContent += `Clientes Unicos,${metricas.clientesUnicos}\\n`;
    csvContent += `Tasa de Entrega,${metricas.tasaEntrega.toFixed(1)}%\\n\\n`;
    csvContent += "ESTADOS DE ENVIOS\\n";
    csvContent += `Pendientes,${metricas.pendientes}\\n`;
    csvContent += `En Transito,${metricas.enTransito}\\n`;
    csvContent += `Entregados,${metricas.entregados}\\n`;

    // Crear y descargar archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `reporte_${periodo}_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Reporte exportado exitosamente", "success");
    }

    console.log("✅ Reporte exportado exitosamente");
  } catch (error) {
    console.error("❌ Error exportando reporte:", error);
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Error al exportar reporte", "error");
    }
  }
};

// Función para inicializar sección de reportes
function initializeReportesSection() {
  console.log("📊 Inicializando sección de reportes...");

  try {
    // Cargar datos frescos
    cargarDatos();

    // Generar reporte inicial
    reportManager.generarReporte("hoy");

    console.log("✅ Sección de reportes inicializada");
  } catch (error) {
    console.error("❌ Error inicializando reportes:", error);
  }
}

console.log("✅ Sistema de reportes cargado correctamente");

// Función principal para generar reportes
function generarReporte() {
  console.log("📊 Generando reporte...");

  try {
    // Obtener período seleccionado
    const periodo = document.getElementById("periodoReporte")?.value || "mes";

    // Filtrar datos según período
    const datosFiltrados = filtrarDatosPorPeriodo(enviosData, periodo);

    console.log(
      `📈 Datos filtrados para ${periodo}:`,
      datosFiltrados.length,
      "envíos"
    );

    // Actualizar todas las secciones del reporte
    actualizarEnviosPorPeriodo(datosFiltrados);
    actualizarIngresosPorZona(datosFiltrados);
    actualizarEstadosEnvios(datosFiltrados);
    actualizarTopClientes(datosFiltrados);
    actualizarRendimientoRepartidores(datosFiltrados);
    actualizarAnalisisZonas(datosFiltrados);
    actualizarResumenEjecutivo(datosFiltrados, periodo);

    console.log("✅ Reporte generado exitosamente");

    // Mostrar notificación
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(
        `Reporte generado: ${datosFiltrados.length} envíos analizados`,
        "success"
      );
    }
  } catch (error) {
    console.error("❌ Error generando reporte:", error);
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Error generando reporte", "error");
    }
  }
}

// Función para filtrar datos por período
function filtrarDatosPorPeriodo(datos, periodo) {
  const ahora = new Date();
  const inicioDelDia = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate()
  );

  return datos.filter((envio) => {
    const fechaEnvio = new Date(envio.fechaCreacion);

    switch (periodo) {
      case "hoy":
        return fechaEnvio >= inicioDelDia;

      case "semana":
        const inicioSemana = new Date(inicioDelDia);
        inicioSemana.setDate(inicioDelDia.getDate() - inicioDelDia.getDay());
        return fechaEnvio >= inicioSemana;

      case "mes":
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        return fechaEnvio >= inicioMes;

      case "trimestre":
        const mesActual = ahora.getMonth();
        const inicioTrimestre = new Date(
          ahora.getFullYear(),
          Math.floor(mesActual / 3) * 3,
          1
        );
        return fechaEnvio >= inicioTrimestre;

      case "año":
        const inicioAño = new Date(ahora.getFullYear(), 0, 1);
        return fechaEnvio >= inicioAño;

      default:
        return true; // Todos los datos
    }
  });
}

// Actualizar gráfico de envíos por período
function actualizarEnviosPorPeriodo(datos) {
  const contenedor = document.getElementById("enviosPorTiempo");
  if (!contenedor) return;

  // Agrupar por fecha
  const enviosPorFecha = {};
  datos.forEach((envio) => {
    const fecha = new Date(envio.fechaCreacion).toLocaleDateString();
    enviosPorFecha[fecha] = (enviosPorFecha[fecha] || 0) + 1;
  });

  // Crear visualización simple
  let html = '<div class="chart-simple">';
  Object.entries(enviosPorFecha).forEach(([fecha, cantidad]) => {
    const porcentaje =
      (cantidad / Math.max(...Object.values(enviosPorFecha))) * 100;
    html += `
      <div class="chart-bar">
        <div class="bar-label">${fecha}</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${porcentaje}%"></div>
          <span class="bar-value">${cantidad}</span>
        </div>
      </div>
    `;
  });
  html += "</div>";

  contenedor.innerHTML = html;
}

// Actualizar ingresos por zona
function actualizarIngresosPorZona(datos) {
  const contenedor = document.getElementById("ingresosPorZona");
  if (!contenedor) return;

  // Agrupar por zona (ciudad origen)
  const ingresosPorZona = {};
  datos.forEach((envio) => {
    const zona = envio.origenCiudad || "Sin especificar";
    ingresosPorZona[zona] = (ingresosPorZona[zona] || 0) + (envio.precio || 0);
  });

  // Crear visualización
  let html = '<div class="chart-simple">';
  Object.entries(ingresosPorZona)
    .sort(([, a], [, b]) => b - a)
    .forEach(([zona, ingreso]) => {
      const porcentaje =
        (ingreso / Math.max(...Object.values(ingresosPorZona))) * 100;
      html += `
        <div class="chart-bar">
          <div class="bar-label">${zona}</div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${porcentaje}%"></div>
            <span class="bar-value">$${ingreso.toLocaleString()}</span>
          </div>
        </div>
      `;
    });
  html += "</div>";

  contenedor.innerHTML = html;
}

// Actualizar estados de envíos
function actualizarEstadosEnvios(datos) {
  const contenedor = document.getElementById("estadosEnvios");
  if (!contenedor) return;

  // Contar por estado
  const estadosCount = {};
  datos.forEach((envio) => {
    const estado = envio.estado || "pendiente";
    estadosCount[estado] = (estadosCount[estado] || 0) + 1;
  });

  // Crear visualización
  let html = '<div class="stats-grid">';
  Object.entries(estadosCount).forEach(([estado, cantidad]) => {
    const porcentaje =
      datos.length > 0 ? ((cantidad / datos.length) * 100).toFixed(1) : 0;
    html += `
      <div class="stat-card">
        <div class="stat-value">${cantidad}</div>
        <div class="stat-label">${estado.replace("_", " ").toUpperCase()}</div>
        <div class="stat-percentage">${porcentaje}%</div>
      </div>
    `;
  });
  html += "</div>";

  contenedor.innerHTML = html;
}

// Actualizar top clientes
function actualizarTopClientes(datos) {
  const contenedor = document.getElementById("topClientes");
  if (!contenedor) return;

  // Agrupar por cliente
  const clientesStats = {};
  datos.forEach((envio) => {
    const clienteNombre = envio.cliente?.nombre || "Cliente Anónimo";
    if (!clientesStats[clienteNombre]) {
      clientesStats[clienteNombre] = {
        envios: 0,
        ingresos: 0,
        email: envio.cliente?.email || "N/A",
      };
    }
    clientesStats[clienteNombre].envios++;
    clientesStats[clienteNombre].ingresos += envio.precio || 0;
  });

  // Ordenar por número de envíos
  const topClientes = Object.entries(clientesStats)
    .sort(([, a], [, b]) => b.envios - a.envios)
    .slice(0, 10);

  // Crear tabla
  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Envíos</th>
          <th>Ingresos</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
  `;

  topClientes.forEach(([nombre, stats]) => {
    html += `
      <tr>
        <td>${nombre}</td>
        <td>${stats.envios}</td>
        <td>$${stats.ingresos.toLocaleString()}</td>
        <td>${stats.email}</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  contenedor.innerHTML = html;
}

// Actualizar rendimiento de repartidores
function actualizarRendimientoRepartidores(datos) {
  const contenedor = document.getElementById("rendimientoRepartidores");
  if (!contenedor) return;

  // Obtener datos de repartidores
  const repartidoresData = JSON.parse(
    localStorage.getItem("repartidoresData") || "[]"
  );

  // Calcular estadísticas por repartidor
  const statsRepartidores = {};

  // Inicializar con todos los repartidores
  repartidoresData.forEach((repartidor) => {
    statsRepartidores[repartidor.id] = {
      nombre: `${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName}`,
      enviosAsignados: 0,
      enviosCompletados: 0,
      zona: repartidor.workInfo.coverageZones?.[0] || "N/A",
    };
  });

  // Contar envíos por repartidor
  datos.forEach((envio) => {
    if (envio.repartidorAsignado) {
      if (statsRepartidores[envio.repartidorAsignado]) {
        statsRepartidores[envio.repartidorAsignado].enviosAsignados++;
        if (envio.estado === "entregado") {
          statsRepartidores[envio.repartidorAsignado].enviosCompletados++;
        }
      }
    }
  });

  // Crear tabla
  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Repartidor</th>
          <th>Zona</th>
          <th>Asignados</th>
          <th>Completados</th>
          <th>Eficiencia</th>
        </tr>
      </thead>
      <tbody>
  `;

  Object.values(statsRepartidores).forEach((stats) => {
    const eficiencia =
      stats.enviosAsignados > 0
        ? ((stats.enviosCompletados / stats.enviosAsignados) * 100).toFixed(1)
        : "0";

    html += `
      <tr>
        <td>${stats.nombre}</td>
        <td>${stats.zona}</td>
        <td>${stats.enviosAsignados}</td>
        <td>${stats.enviosCompletados}</td>
        <td>${eficiencia}%</td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  contenedor.innerHTML = html;
}

// Actualizar análisis por zonas
function actualizarAnalisisZonas(datos) {
  const contenedor = document.getElementById("analisisZonas");
  if (!contenedor) return;

  // Agrupar por rutas (origen -> destino)
  const rutasStats = {};
  datos.forEach((envio) => {
    const ruta = `${envio.origenCiudad || "N/A"} → ${
      envio.destinoCiudad || "N/A"
    }`;
    if (!rutasStats[ruta]) {
      rutasStats[ruta] = {
        envios: 0,
        ingresos: 0,
        tiempoPromedio: 0,
      };
    }
    rutasStats[ruta].envios++;
    rutasStats[ruta].ingresos += envio.precio || 0;
  });

  // Crear tabla
  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Ruta</th>
          <th>Envíos</th>
          <th>Ingresos</th>
          <th>Promedio por Envío</th>
        </tr>
      </thead>
      <tbody>
  `;

  Object.entries(rutasStats)
    .sort(([, a], [, b]) => b.envios - a.envios)
    .forEach(([ruta, stats]) => {
      const promedio =
        stats.envios > 0 ? (stats.ingresos / stats.envios).toFixed(2) : "0";
      html += `
        <tr>
          <td>${ruta}</td>
          <td>${stats.envios}</td>
          <td>$${stats.ingresos.toLocaleString()}</td>
          <td>$${promedio}</td>
        </tr>
      `;
    });

  html += "</tbody></table>";
  contenedor.innerHTML = html;
}

// Actualizar resumen ejecutivo
function actualizarResumenEjecutivo(datos, periodo) {
  const contenedor = document.getElementById("resumenContenido");
  if (!contenedor) return;

  // Calcular métricas principales
  const totalEnvios = datos.length;
  const ingresosTotales = datos.reduce(
    (sum, envio) => sum + (envio.precio || 0),
    0
  );
  const promedioIngresoPorEnvio =
    totalEnvios > 0 ? (ingresosTotales / totalEnvios).toFixed(2) : "0";

  // Contar estados
  const entregados = datos.filter((e) => e.estado === "entregado").length;
  const enTransito = datos.filter((e) => e.estado === "en_transito").length;
  const pendientes = datos.filter((e) => e.estado === "pendiente").length;

  // Calcular tasa de entrega
  const tasaEntrega =
    totalEnvios > 0 ? ((entregados / totalEnvios) * 100).toFixed(1) : "0";

  // Clientes únicos
  const clientesUnicos = new Set(
    datos.map((e) => e.cliente?.nombre).filter(Boolean)
  ).size;

  const html = `
    <div class="resumen-ejecutivo">
      <h3>📊 Resumen Ejecutivo - ${periodo.toUpperCase()}</h3>
      
      <div class="resumen-grid">
        <div class="resumen-card">
          <div class="resumen-numero">${totalEnvios}</div>
          <div class="resumen-label">Total Envíos</div>
        </div>
        
        <div class="resumen-card">
          <div class="resumen-numero">$${ingresosTotales.toLocaleString()}</div>
          <div class="resumen-label">Ingresos Totales</div>
        </div>
        
        <div class="resumen-card">
          <div class="resumen-numero">$${promedioIngresoPorEnvio}</div>
          <div class="resumen-label">Promedio por Envío</div>
        </div>
        
        <div class="resumen-card">
          <div class="resumen-numero">${tasaEntrega}%</div>
          <div class="resumen-label">Tasa de Entrega</div>
        </div>
        
        <div class="resumen-card">
          <div class="resumen-numero">${clientesUnicos}</div>
          <div class="resumen-label">Clientes Únicos</div>
        </div>
        
        <div class="resumen-card">
          <div class="resumen-numero">${pendientes}</div>
          <div class="resumen-label">Pendientes</div>
        </div>
      </div>
      
      <div class="resumen-texto">
        <p><strong>Análisis del período:</strong></p>
        <ul>
          <li>Se procesaron <strong>${totalEnvios}</strong> envíos generando <strong>$${ingresosTotales.toLocaleString()}</strong> en ingresos</li>
          <li>La tasa de entrega exitosa fue del <strong>${tasaEntrega}%</strong></li>
          <li>Se atendieron <strong>${clientesUnicos}</strong> clientes únicos</li>
          <li>Actualmente hay <strong>${pendientes}</strong> envíos pendientes y <strong>${enTransito}</strong> en tránsito</li>
        </ul>
      </div>
    </div>
  `;

  contenedor.innerHTML = html;
}

// Función para exportar reportes
function exportarReporte() {
  console.log("📤 Exportando reporte...");

  try {
    const periodo = document.getElementById("periodoReporte")?.value || "mes";
    const datosFiltrados = filtrarDatosPorPeriodo(enviosData, periodo);

    // Crear contenido del reporte
    const reporte = {
      fecha: new Date().toISOString(),
      periodo: periodo,
      totalEnvios: datosFiltrados.length,
      ingresosTotales: datosFiltrados.reduce(
        (sum, envio) => sum + (envio.precio || 0),
        0
      ),
      datos: datosFiltrados,
    };

    // Crear y descargar archivo JSON
    const blob = new Blob([JSON.stringify(reporte, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-${periodo}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Reporte exportado exitosamente", "success");
    }
  } catch (error) {
    console.error("❌ Error exportando reporte:", error);
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Error exportando reporte", "error");
    }
  }
}

// Función para actualizar reportes cuando cambia el período
document.addEventListener("DOMContentLoaded", function () {
  const periodoSelect = document.getElementById("periodoReporte");
  if (periodoSelect) {
    periodoSelect.addEventListener("change", function () {
      console.log("📅 Período cambiado a:", this.value);
      generarReporte();
    });
  }
});
// ==========================================
// EXPOSICIÓN DE FUNCIONES GLOBALES
// ==========================================

// Exponer funciones principales al objeto window para asegurar accesibilidad
window.mostrarSeccion = mostrarSeccion;
window.inicializarAdmin = inicializarAdmin;
window.configurarNavegacion = configurarNavegacion;
window.cargarDatos = cargarDatos;
window.configurarUI = configurarUI;
window.generarReporte = generarReporte;
window.initializeReportesSection = initializeReportesSection;
window.exportarReporte = exportarReporte;

// Variables globales también
window.enviosData = enviosData;
window.currentUser = currentUser;
window.isInitialized = isInitialized;

console.log("✅ Funciones globales expuestas correctamente");
console.log("📋 Funciones disponibles:", {
  mostrarSeccion: typeof window.mostrarSeccion,
  inicializarAdmin: typeof window.inicializarAdmin,
  configurarNavegacion: typeof window.configurarNavegacion,
  generarReporte: typeof window.generarReporte,
  initializeReportesSection: typeof window.initializeReportesSection,
});
// ==========================================
// FUNCIÓN DE DEBUG AUTOMÁTICO
// ==========================================

// Función de debug que se ejecuta automáticamente
function debugAdmin() {
  console.log("🔧 DEBUG ADMIN - Verificando estado del sistema");

  // Verificar elementos DOM críticos
  const elementosCriticos = [
    "sidebar",
    "dashboard-section",
    "envios-section",
    "clientes-section",
    "repartidores-section",
    "reportes-section",
  ];

  console.log("📊 Verificando elementos DOM:");
  elementosCriticos.forEach((id) => {
    const elemento = document.getElementById(id);
    console.log(
      `${elemento ? "✅" : "❌"} ${id}:`,
      elemento ? "Encontrado" : "NO ENCONTRADO"
    );
  });

  // Verificar navegación
  const navItems = document.querySelectorAll(".nav-item");
  console.log(`🧭 Items de navegación encontrados: ${navItems.length}`);

  navItems.forEach((item, index) => {
    const seccion = item.getAttribute("data-section");
    console.log(
      `  ${index + 1}. ${seccion} - ${
        item.onclick ? "Con evento" : "SIN EVENTO"
      }`
    );
  });

  // Verificar funciones
  const funcionesCriticas = [
    "mostrarSeccion",
    "configurarNavegacion",
    "inicializarAdmin",
  ];

  console.log("⚙️ Verificando funciones críticas:");
  funcionesCriticas.forEach((func) => {
    console.log(
      `${typeof window[func] === "function" ? "✅" : "❌"} ${func}:`,
      typeof window[func]
    );
  });

  // Verificar datos
  console.log("📦 Datos cargados:");
  console.log(
    `  - enviosData: ${
      Array.isArray(enviosData) ? enviosData.length : "NO ES ARRAY"
    } elementos`
  );
  console.log(`  - currentUser:`, currentUser);
  console.log(`  - isInitialized:`, isInitialized);
}

// Ejecutar debug automáticamente después de un delay
setTimeout(() => {
  debugAdmin();
}, 2000);

// También exponer la función de debug
window.debugAdmin = debugAdmin;

// ==========================================
// FUNCIONES DE DEBUG GLOBALES
// ==========================================

// Función para debug completo del sistema
window.debugAdmin = function () {
  console.log("🔧 === DEBUG COMPLETO DEL ADMIN ===");

  // 1. Verificar funciones principales
  console.log("📋 1. FUNCIONES PRINCIPALES:");
  const funciones = [
    "mostrarSeccion",
    "configurarNavegacion",
    "inicializarAdmin",
    "cargarDatos",
  ];
  funciones.forEach((func) => {
    console.log(
      `  ${func}: ${typeof window[func] === "function" ? "✅" : "❌"}`
    );
  });

  // 2. Verificar variables globales
  console.log("📊 2. VARIABLES GLOBALES:");
  console.log(
    `  enviosData: ${
      Array.isArray(enviosData)
        ? enviosData.length + " elementos"
        : typeof enviosData
    }`
  );
  console.log(
    `  currentUser: ${currentUser ? "✅ Definido" : "❌ No definido"}`
  );
  console.log(`  isInitialized: ${isInitialized}`);

  // 3. Verificar elementos DOM
  console.log("🎨 3. ELEMENTOS DOM:");
  const navItems = document.querySelectorAll(".nav-item");
  console.log(`  .nav-item: ${navItems.length} elementos`);

  const sections = document.querySelectorAll(".content-section");
  console.log(`  .content-section: ${sections.length} secciones`);

  // 4. Verificar datos en localStorage
  console.log("💾 4. DATOS EN LOCALSTORAGE:");
  const keys = [
    "enviosLogistica",
    "clientesData",
    "repartidoresData",
    "adminUser",
  ];
  keys.forEach((key) => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(
          `  ${key}: ${
            Array.isArray(parsed) ? parsed.length + " elementos" : "objeto"
          }`
        );
      } catch (e) {
        console.log(`  ${key}: string de ${data.length} caracteres`);
      }
    } else {
      console.log(`  ${key}: ❌ No encontrado`);
    }
  });

  console.log("🔧 === FIN DEBUG ===");
};

// Función para forzar reinicialización
window.reinicializarAdmin = function () {
  console.log("🔄 Reinicializando admin...");

  try {
    // Resetear variables
    isInitialized = false;

    // Reinicializar
    inicializarAdmin();

    console.log("✅ Admin reinicializado");
  } catch (error) {
    console.error("❌ Error reinicializando:", error);
  }
};

// Función para probar navegación manualmente
window.testNavegacion = function (seccion = "dashboard") {
  console.log(`🧪 Probando navegación a: ${seccion}`);

  try {
    mostrarSeccion(seccion);
    console.log(`✅ Navegación a ${seccion} exitosa`);
  } catch (error) {
    console.error(`❌ Error navegando a ${seccion}:`, error);
  }
};

// Función para verificar eventos de navegación
window.verificarEventosNav = function () {
  console.log("🔍 Verificando eventos de navegación...");

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item, index) => {
    const seccion = item.getAttribute("data-section");
    const hasClick = item.onclick !== null;
    const hasEventListener = item.hasAttribute("data-event-configured");

    console.log(
      `  ${index + 1}. ${seccion}: onclick=${
        hasClick ? "✅" : "❌"
      }, listener=${hasEventListener ? "✅" : "❌"}`
    );
  });
};

console.log("🛠️ Funciones de debug cargadas:");
console.log("  - debugAdmin() - Debug completo");
console.log("  - reinicializarAdmin() - Reinicializar sistema");
console.log("  - testNavegacion('seccion') - Probar navegación");
console.log("  - verificarEventosNav() - Verificar eventos");
