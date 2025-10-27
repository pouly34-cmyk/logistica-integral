// Panel de Administración - Versión Final Funcional
console.log("🚀 Cargando admin script final...");

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

    // Si no hay repartidores, crear algunos de ejemplo
    if (repartidoresData.length === 0) {
      crearRepartidoresEjemplo();
    }
  } catch (error) {
    console.error("❌ Error cargando datos:", error);
    enviosData = [];
    clientesData = [];
    repartidoresData = [];
  }
}

// Crear repartidores de ejemplo si no existen
function crearRepartidoresEjemplo() {
  console.log("📝 Creando repartidores de ejemplo...");

  const repartidoresEjemplo = [
    {
      id: "REP-001",
      personalInfo: {
        name: "Carlos",
        lastName: "Rodríguez",
        phone: "55-1234-5678",
        email: "carlos.rodriguez@logistica.com",
      },
      workInfo: {
        employeeId: "EMP-001",
        startDate: "2024-01-15",
        status: "active",
        coverageZones: ["CDMX Norte"],
        vehicleType: "motorcycle",
        vehicleDetails: {
          licensePlate: "ABC-123",
          brand: "Honda",
          model: "Wave",
          year: 2023,
          color: "Rojo",
        },
      },
      performance: {
        totalDeliveries: 45,
        completedDeliveries: 42,
        averageRating: 4.8,
        onTimeDeliveryRate: 93,
        currentAssignedShipments: [],
      },
      timestamps: {
        created: "2024-01-15T10:00:00Z",
        updated: new Date().toISOString(),
      },
    },
    {
      id: "REP-002",
      personalInfo: {
        name: "María",
        lastName: "González",
        phone: "55-9876-5432",
        email: "maria.gonzalez@logistica.com",
      },
      workInfo: {
        employeeId: "EMP-002",
        startDate: "2024-02-01",
        status: "active",
        coverageZones: ["CDMX Sur"],
        vehicleType: "car",
        vehicleDetails: {
          licensePlate: "XYZ-789",
          brand: "Nissan",
          model: "Versa",
          year: 2022,
          color: "Blanco",
        },
      },
      performance: {
        totalDeliveries: 38,
        completedDeliveries: 36,
        averageRating: 4.9,
        onTimeDeliveryRate: 95,
        currentAssignedShipments: [],
      },
      timestamps: {
        created: "2024-02-01T09:00:00Z",
        updated: new Date().toISOString(),
      },
    },
  ];

  repartidoresData = repartidoresEjemplo;
  localStorage.setItem("repartidoresData", JSON.stringify(repartidoresData));
  console.log("✅ Repartidores de ejemplo creados");
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
      '<tr><td colspan="11" class="no-data">No hay envíos registrados</td></tr>';
    return;
  }

  tbody.innerHTML = enviosData
    .map((envio) => {
      const repartidorAsignado = repartidoresData.find(
        (r) => r.id === envio.repartidorAsignado
      );
      const nombreRepartidor = repartidorAsignado
        ? `${repartidorAsignado.personalInfo?.name || ""} ${
            repartidorAsignado.personalInfo?.lastName || ""
          }`.trim()
        : "Sin asignar";

      return `
      <tr>
        <td>${envio.numeroGuia}</td>
        <td>${envio.cliente?.nombre || "N/A"}</td>
        <td>${envio.cliente?.telefono || "N/A"}</td>
        <td>${envio.origenCiudad}</td>
        <td>${envio.destinoCiudad}</td>
        <td>${envio.tipoEnvio || "N/A"}</td>
        <td>$${(envio.precio || 0).toLocaleString()}</td>
        <td><span class="status-badge status-${envio.estado || "pendiente"}">${
        envio.estado || "Pendiente"
      }</span></td>
        <td>${nombreRepartidor}</td>
        <td>${new Date(envio.fechaCreacion).toLocaleDateString()}</td>
        <td>
          <button onclick="asignarRepartidorManual('${
            envio.numeroGuia
          }')" class="btn-small btn-primary" title="Asignar Repartidor">
            👤 Asignar
          </button>
          <button onclick="cambiarEstadoEnvio('${
            envio.numeroGuia
          }')" class="btn-small btn-secondary" title="Cambiar Estado">
            🔄 Estado
          </button>
        </td>
      </tr>
    `;
    })
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

  console.log(`📊 Repartidores disponibles: ${repartidoresData.length}`);

  if (repartidoresData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="no-data">No hay repartidores registrados</td></tr>';
    return;
  }

  tbody.innerHTML = repartidoresData
    .map((repartidor) => {
      console.log(`📋 Procesando repartidor:`, repartidor);

      return `
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
    `;
    })
    .join("");

  console.log(
    `✅ Tabla de repartidores cargada: ${repartidoresData.length} registros`
  );

  // Configurar botón agregar repartidor
  configurarBotonAgregarRepartidor();
}

// Configurar botón agregar repartidor
function configurarBotonAgregarRepartidor() {
  const addBtn = document.getElementById("addRepartidorBtn");
  if (addBtn) {
    console.log("🔧 Configurando botón agregar repartidor...");

    // Remover eventos anteriores
    addBtn.onclick = null;
    addBtn.removeEventListener("click", mostrarModalAgregarRepartidor);

    // Agregar nuevo evento
    addBtn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("➕ Click en agregar repartidor");
      mostrarModalAgregarRepartidor();
    });

    console.log("✅ Botón agregar repartidor configurado");
  } else {
    console.warn("⚠️ Botón addRepartidorBtn no encontrado");
  }
}

// Mostrar modal para agregar repartidor
function mostrarModalAgregarRepartidor() {
  console.log("📝 Mostrando modal agregar repartidor...");

  // Crear modal simple
  const modal = document.createElement("div");
  modal.id = "modalRepartidor";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `;

  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 10px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3 style="margin: 0;">➕ Agregar Repartidor</h3>
        <button onclick="cerrarModalRepartidor()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
      </div>
      
      <form id="formRepartidor" style="display: grid; gap: 15px;">
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">👤 Nombre *</label>
          <input type="text" id="repartidorNombre" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Nombre del repartidor">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">👤 Apellido *</label>
          <input type="text" id="repartidorApellido" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Apellido del repartidor">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">📱 Teléfono *</label>
          <input type="tel" id="repartidorTelefono" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" placeholder="Número de teléfono">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">🚗 Tipo de Vehículo *</label>
          <select id="repartidorVehiculo" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="">Seleccionar vehículo</option>
            <option value="motorcycle">🏍️ Motocicleta</option>
            <option value="bicycle">🚲 Bicicleta</option>
            <option value="car">🚗 Automóvil</option>
            <option value="van">🚐 Camioneta</option>
          </select>
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">🔢 Placa del Vehículo</label>
          <input type="text" id="repartidorPlaca" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; text-transform: uppercase;" placeholder="Número de placa">
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; font-weight: bold;">📍 Zona de Cobertura *</label>
          <select id="repartidorZona" required style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="">Seleccionar zona</option>
            <option value="CDMX Norte">CDMX Norte</option>
            <option value="CDMX Sur">CDMX Sur</option>
            <option value="CDMX Centro">CDMX Centro</option>
            <option value="CDMX Oriente">CDMX Oriente</option>
            <option value="CDMX Poniente">CDMX Poniente</option>
            <option value="Puebla Centro">Puebla Centro</option>
            <option value="Puebla Norte">Puebla Norte</option>
          </select>
        </div>
      </form>
      
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button onclick="cerrarModalRepartidor()" style="padding: 10px 20px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancelar</button>
        <button onclick="guardarRepartidor()" style="padding: 10px 20px; border: none; background: #3498db; color: white; border-radius: 4px; cursor: pointer;">➕ Agregar Repartidor</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  console.log("✅ Modal agregado al DOM");
}

// Guardar repartidor
function guardarRepartidor() {
  console.log("💾 Guardando repartidor...");

  try {
    // Obtener datos del formulario
    const nombre = document.getElementById("repartidorNombre").value.trim();
    const apellido = document.getElementById("repartidorApellido").value.trim();
    const telefono = document.getElementById("repartidorTelefono").value.trim();
    const vehiculo = document.getElementById("repartidorVehiculo").value;
    const placa = document
      .getElementById("repartidorPlaca")
      .value.trim()
      .toUpperCase();
    const zona = document.getElementById("repartidorZona").value;

    // Validaciones
    if (!nombre || !apellido || !telefono || !vehiculo || !zona) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Crear objeto repartidor
    const nuevoRepartidor = {
      id: `REP-${Date.now()}`,
      personalInfo: {
        name: nombre,
        lastName: apellido,
        phone: telefono,
        email: "",
      },
      workInfo: {
        employeeId: `EMP-${Date.now()}`,
        startDate: new Date().toISOString(),
        status: "active",
        coverageZones: [zona],
        vehicleType: vehiculo,
        vehicleDetails: {
          licensePlate: placa,
          brand: "",
          model: "",
          year: new Date().getFullYear(),
          color: "",
        },
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
      },
    };

    // Agregar a la lista
    repartidoresData.push(nuevoRepartidor);

    // Guardar en localStorage
    localStorage.setItem("repartidoresData", JSON.stringify(repartidoresData));

    // Actualizar tabla
    cargarTablaRepartidores();

    // Cerrar modal
    cerrarModalRepartidor();

    // Mostrar confirmación
    alert(`Repartidor agregado exitosamente: ${nombre} ${apellido}`);

    console.log(`✅ Repartidor agregado: ${nuevoRepartidor.id}`);
  } catch (error) {
    console.error("❌ Error guardando repartidor:", error);
    alert("Error al guardar repartidor");
  }
}

// Cerrar modal de repartidor
function cerrarModalRepartidor() {
  const modal = document.getElementById("modalRepartidor");
  if (modal) {
    modal.remove();
    console.log("✅ Modal cerrado");
  }
}

// Ver repartidor (función placeholder)
function verRepartidor(id) {
  const repartidor = repartidoresData.find((r) => r.id === id);
  if (repartidor) {
    alert(
      `Repartidor: ${repartidor.personalInfo.name} ${repartidor.personalInfo.lastName}\nTeléfono: ${repartidor.personalInfo.phone}\nZona: ${repartidor.workInfo.coverageZones[0]}\nVehículo: ${repartidor.workInfo.vehicleType}`
    );
  }
}

// Editar repartidor (función placeholder)
function editarRepartidor(id) {
  alert(`Función de editar repartidor ${id} - En desarrollo`);
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
        <p><strong>Repartidores Activos:</strong> ${
          repartidoresData.filter((r) => r.workInfo?.status === "active").length
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
      <p><strong>Repartidores registrados:</strong> ${
        repartidoresData.length
      }</p>
    </div>
  `;

  console.log("✅ Configuración cargada");
}

// Funciones de asignación (simplificadas)
function asignacionAutomatica() {
  console.log("🎲 Asignación automática...");
  alert("Función de asignación automática - En desarrollo");
}

function asignarRepartidorManual(numeroGuia) {
  console.log(`👤 Asignación manual para: ${numeroGuia}`);
  alert(`Asignación manual para envío ${numeroGuia} - En desarrollo`);
}

function cambiarEstadoEnvio(numeroGuia) {
  console.log(`🔄 Cambiar estado de: ${numeroGuia}`);
  alert(`Cambiar estado del envío ${numeroGuia} - En desarrollo`);
}

// Alias para compatibilidad
function cargarTablaEnviosConAsignaciones() {
  cargarTablaEnvios();
}

// Funciones de debug globales
window.debugAdmin = function () {
  console.log("🔧 === DEBUG ADMIN ===");
  console.log("📊 Datos:", {
    envios: enviosData.length,
    clientes: clientesData.length,
    repartidores: repartidoresData.length,
  });
  console.log("👤 Usuario:", currentUser);
  console.log(
    "🧭 Navegación:",
    document.querySelectorAll(".nav-item").length,
    "elementos"
  );
  console.log("🚚 Repartidores:", repartidoresData);
};

window.testNavegacion = function (seccion = "dashboard") {
  console.log(`🧪 Probando navegación a: ${seccion}`);
  mostrarSeccion(seccion);
};

window.testRepartidores = function () {
  console.log("🧪 Test de repartidores:");
  console.log("Datos:", repartidoresData);
  console.log("Botón:", document.getElementById("addRepartidorBtn"));
  cargarTablaRepartidores();
};

console.log("✅ Admin script final cargado completamente");
console.log(
  "🛠️ Funciones de debug: debugAdmin(), testNavegacion('seccion'), testRepartidores()"
);
