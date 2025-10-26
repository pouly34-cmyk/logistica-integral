// Funcionalidad para la página de Logística Integral

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Navegación suave
  initSmoothScrolling();

  // Funcionalidad del formulario de seguimiento
  initTrackingForm();

  // Funcionalidad del formulario de contacto
  initContactForm();

  // Efectos de scroll en el navbar
  initNavbarScroll();

  // Modal de cotización
  initCotizacionModal();

  // Inicializar modo basico de direcciones
  initBasicAddressMode();

  // Inicializar servicios clickeables
  initServiciosClickeables();
});

// Navegación suave entre secciones
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Funcionalidad del formulario de seguimiento
function initTrackingForm() {
  const trackingForm = document.querySelector(".tracking-form");

  if (trackingForm) {
    trackingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const trackingInput = this.querySelector('input[type="text"]');
      const trackingNumber = trackingInput.value.trim();

      if (trackingNumber === "") {
        showMessage("Por favor, ingrese un número de guía válido.", "error");
        return;
      }

      // Simular búsqueda de paquete
      showMessage("Buscando información del paquete...", "info");

      setTimeout(() => {
        // Simular resultado de búsqueda
        showTrackingResult(trackingNumber);
      }, 2000);
    });
  }
}

// Funcionalidad del formulario de contacto
function initContactForm() {
  const contactForm = document.querySelector(".contacto-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = this.querySelector(
        'input[placeholder="Nombre"]'
      ).value.trim();
      const email = this.querySelector(
        'input[placeholder="Correo electrónico"]'
      ).value.trim();
      const mensaje = this.querySelector("textarea").value.trim();

      // Validación básica
      if (nombre === "" || email === "" || mensaje === "") {
        showMessage("Por favor, complete todos los campos.", "error");
        return;
      }

      if (!isValidEmail(email)) {
        showMessage(
          "Por favor, ingrese un correo electrónico válido.",
          "error"
        );
        return;
      }

      // Simular envío del formulario
      showMessage("Enviando mensaje...", "info");

      setTimeout(() => {
        showMessage(
          "¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.",
          "success"
        );
        this.reset();
      }, 1500);
    });
  }
}

// Efectos en el navbar al hacer scroll
function initNavbarScroll() {
  const header = document.querySelector("header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.style.backgroundColor = "rgba(44, 62, 80, 0.95)";
      header.style.backdropFilter = "blur(10px)";
    } else {
      header.style.backgroundColor = "#2c3e50";
      header.style.backdropFilter = "none";
    }
  });
}

// Mostrar mensajes al usuario
function showMessage(message, type) {
  // Remover mensaje anterior si existe
  const existingMessage = document.querySelector(".message-popup");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Crear nuevo mensaje
  const messageDiv = document.createElement("div");
  messageDiv.className = `message-popup message-${type}`;
  messageDiv.textContent = message;

  // Estilos del mensaje
  messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

  // Colores según el tipo de mensaje
  switch (type) {
    case "success":
      messageDiv.style.backgroundColor = "#27ae60";
      break;
    case "error":
      messageDiv.style.backgroundColor = "#e74c3c";
      break;
    case "info":
      messageDiv.style.backgroundColor = "#3498db";
      break;
    default:
      messageDiv.style.backgroundColor = "#95a5a6";
  }

  document.body.appendChild(messageDiv);

  // Remover mensaje después de 4 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        messageDiv.remove();
      }, 300);
    }
  }, 4000);
}

// Mostrar resultado de seguimiento simulado
function showTrackingResult(trackingNumber) {
  const estados = [
    "Paquete recibido en origen",
    "En tránsito",
    "Llegó a centro de distribución",
    "En reparto",
    "Entregado",
  ];

  const estadoActual = estados[Math.floor(Math.random() * estados.length)];

  showMessage(`Paquete ${trackingNumber}: ${estadoActual}`, "success");
}

// Validar formato de email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Agregar animaciones CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Variables globales para Google Maps
let origenAutocomplete, destinoAutocomplete;
let origenCoords = null,
  destinoCoords = null;

// Inicializar Google Maps (callback)
function initGoogleMaps() {
  console.log("Google Maps API cargada exitosamente");
  // La inicialización del autocompletado se hará cuando se abra el modal
}

// Manejar errores de Google Maps
window.gm_authFailure = function () {
  console.error("Error de autenticación de Google Maps API");
  showMessage("Error: API Key de Google Maps inválida o expirada", "error");
};

// Inicializar autocompletado de Google Places
function initPlacesAutocomplete() {
  const origenInput = document.getElementById("origen");
  const destinoInput = document.getElementById("destino");

  if (!origenInput || !destinoInput) {
    console.error("No se encontraron los campos de origen y destino");
    return;
  }

  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error("Google Maps API no está disponible");
    showMessage(
      "Error: Google Maps no se pudo cargar. Verifique su conexión.",
      "error"
    );
    return;
  }

  try {
    // Configurar autocompletado para origen
    origenAutocomplete = new google.maps.places.Autocomplete(origenInput, {
      types: ["address"],
      componentRestrictions: { country: "mx" }, // Restringir a México
      fields: ["place_id", "geometry", "name", "formatted_address"],
    });

    // Configurar autocompletado para destino
    destinoAutocomplete = new google.maps.places.Autocomplete(destinoInput, {
      types: ["address"],
      componentRestrictions: { country: "mx" }, // Restringir a México
      fields: ["place_id", "geometry", "name", "formatted_address"],
    });

    // Listeners para capturar las coordenadas
    origenAutocomplete.addListener("place_changed", function () {
      try {
        const place = origenAutocomplete.getPlace();
        if (place.geometry) {
          origenCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
          };
          console.log("Origen seleccionado:", origenCoords);
          showMessage("Origen seleccionado correctamente", "success");
        } else {
          console.warn("No se pudo obtener la geometría del lugar de origen");
        }
      } catch (error) {
        console.error("Error al procesar lugar de origen:", error);
        showMessage("Error al procesar la direccion de origen", "error");
      }
    });

    destinoAutocomplete.addListener("place_changed", function () {
      try {
        const place = destinoAutocomplete.getPlace();
        if (place.geometry) {
          destinoCoords = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address,
          };
          console.log("Destino seleccionado:", destinoCoords);
          showMessage("Destino seleccionado correctamente", "success");
        } else {
          console.warn("No se pudo obtener la geometría del lugar de destino");
        }
      } catch (error) {
        console.error("Error al procesar lugar de destino:", error);
        showMessage("Error al procesar la direccion de destino", "error");
      }
    });

    console.log("Autocompletado de Places inicializado exitosamente");
    showMessage("Autocompletado de direcciones activado", "info");
  } catch (error) {
    console.error("Error al inicializar Google Places:", error);
    showMessage(
      "Error al inicializar el autocompletado de direcciones",
      "error"
    );
  }
}

// Funcionalidad del modal de cotización
function initCotizacionModal() {
  const modal = document.getElementById("cotizacionModal");
  const enviarAhoraBtn = document.querySelector(".btn-secondary"); // Botón "ENVÍA AHORA"
  const closeBtn = document.querySelector(".close");
  const cotizacionForm = document.getElementById("cotizacionForm");
  const tipoEnvioSelect = document.getElementById("tipoEnvio");
  const dimensionesRow = document.getElementById("dimensionesRow");
  const cotizacionResultado = document.getElementById("cotizacionResultado");
  const solicitarEnvioBtn = document.getElementById("solicitarEnvio");

  // Abrir modal al hacer clic en "ENVIA AHORA"
  if (enviarAhoraBtn) {
    enviarAhoraBtn.addEventListener("click", function (e) {
      e.preventDefault();
      modal.style.display = "block";
      document.body.style.overflow = "hidden"; // Prevenir scroll del body

      // Mostrar mensaje informativo
      setTimeout(() => {
        showMessage(
          "Seleccione ciudades de la lista o escriba manualmente",
          "info"
        );
      }, 500);
    });
  }

  // Cerrar modal
  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    cotizacionForm.reset();
    cotizacionResultado.style.display = "none";
    solicitarEnvioBtn.style.display = "none";
    dimensionesRow.style.display = "none";
  }

  // Cerrar con X
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  // Cerrar al hacer clic fuera del modal
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Mostrar/ocultar dimensiones segun tipo de envio
  if (tipoEnvioSelect) {
    tipoEnvioSelect.addEventListener("change", function () {
      if (this.value === "caja") {
        dimensionesRow.style.display = "block";
        // Hacer campos de dimensiones requeridos
        document.getElementById("largo").required = true;
        document.getElementById("ancho").required = true;
        document.getElementById("alto").required = true;
      } else {
        dimensionesRow.style.display = "none";
        // Quitar requerimiento de dimensiones
        document.getElementById("largo").required = false;
        document.getElementById("ancho").required = false;
        document.getElementById("alto").required = false;
      }
    });
  }

  // Procesar formulario de cotización
  if (cotizacionForm) {
    cotizacionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const datos = Object.fromEntries(formData);

      // Validar que todos los campos requeridos estén llenos
      if (!validarFormularioCompleto(datos)) {
        showMessage("Por favor, complete todos los campos requeridos", "error");
        return;
      }

      // Mostrar mensaje de cálculo
      showMessage("Calculando cotización...", "info");

      // Simular cálculo (en la vida real sería una API)
      setTimeout(() => {
        try {
          console.log("Datos del formulario:", datos);
          const precio = calcularPrecio(datos);
          console.log("Precio calculado:", precio);

          // Guardar datos para el flujo de pago
          datosEnvioActual = datos;
          precioActual = precio;

          mostrarCotizacion(precio);
        } catch (error) {
          console.error("Error al calcular precio:", error);
          showMessage(
            "Error al calcular la cotización. Intente nuevamente.",
            "error"
          );
        }
      }, 1500);
    });
  }

  // Boton solicitar envio
  if (solicitarEnvioBtn) {
    solicitarEnvioBtn.addEventListener("click", function () {
      // Abrir modal de pago en lugar de ir al contacto
      abrirModalPago();
    });
  }
}

// Calcular precio estimado
function calcularPrecio(datos) {
  console.log("=== CALCULANDO PRECIO ===");
  console.log("Datos recibidos:", datos);

  let precioBase = 50; // Precio base en MXN
  console.log("Precio base inicial:", precioBase);

  // Ajuste por tipo de envio
  console.log("Tipo de envio:", datos.tipoEnvio);
  if (datos.tipoEnvio === "caja") {
    precioBase += 30;
    console.log("Precio después de ajuste por caja:", precioBase);

    // Calcular volumen si es caja
    if (datos.largo && datos.ancho && datos.alto) {
      const volumen = (datos.largo * datos.ancho * datos.alto) / 1000; // en litros
      precioBase += volumen * 5; // $5 por litro
      console.log("Precio después de volumen:", precioBase);
    }
  }

  // Ajuste por peso
  const peso = parseFloat(datos.peso) || 0;
  console.log("Peso:", peso);
  if (peso > 1) {
    precioBase += (peso - 1) * 15; // $15 por kg adicional
    console.log("Precio después de ajuste por peso:", precioBase);
  }

  // Ajuste por tipo de servicio
  console.log("Tipo de servicio:", datos.tipoServicio);
  switch (datos.tipoServicio) {
    case "express":
      precioBase *= 1.5;
      console.log("Precio después de servicio express:", precioBase);
      break;
    case "normal":
      precioBase *= 1.0;
      console.log("Precio después de servicio normal:", precioBase);
      break;
    case "economico":
      precioBase *= 0.8;
      console.log("Precio después de servicio económico:", precioBase);
      break;
  }

  // Ajuste por número de unidades
  const unidades = parseInt(datos.unidades) || 1;
  if (unidades > 1) {
    // Descuento por volumen: 5% por cada unidad adicional (máximo 25%)
    const descuentoVolumen = Math.min((unidades - 1) * 0.05, 0.25);
    precioBase *= 1 - descuentoVolumen;
  }

  // Calcular distancia usando ciudades
  const origenCiudad = datos.origenCiudad
    ? datos.origenCiudad.toLowerCase()
    : "";
  const destinoCiudad = datos.destinoCiudad
    ? datos.destinoCiudad.toLowerCase()
    : "";

  if (origenCiudad !== destinoCiudad && origenCiudad && destinoCiudad) {
    // Detectar si es envio local, nacional o metropolitano
    const esLocal = calcularTipoEnvio(origenCiudad, destinoCiudad);

    switch (esLocal) {
      case "cdmx_local":
        precioBase += 15; // Envio local dentro de CDMX
        break;
      case "cdmx_a_puebla":
        precioBase += 40; // CDMX a Puebla (entrega en C.A.P.U.)
        break;
      case "puebla_a_cdmx":
        precioBase += 40; // Puebla a CDMX
        break;
      case "metropolitano":
        precioBase += 10; // Zona metropolitana de Puebla (más económico)
        break;
      case "local":
        precioBase += 20; // Dentro del estado de Puebla
        break;
      case "principal":
        precioBase += 25; // Ciudades principales
        break;
      case "rural":
        precioBase += 35; // Zonas rurales/montañosas (más caro por dificultad)
        break;
      case "fuera_cobertura":
        showMessage(
          "Lo sentimos, por el momento solo damos servicio dentro de CDMX y Puebla",
          "error"
        );
        return 0; // No se puede cotizar
      default:
        precioBase += 20; // Por defecto
    }
  }

  // Multiplicar por número de unidades al final
  console.log("Unidades:", unidades);
  precioBase *= unidades;
  console.log("Precio final antes de redondear:", precioBase);

  const precioFinal = Math.round(precioBase);
  console.log("Precio final redondeado:", precioFinal);
  console.log("=== FIN CÁLCULO ===");

  return precioFinal;
}

// Mostrar resultado de cotización
function mostrarCotizacion(precio) {
  const precioElement = document.getElementById("precioEstimado");
  const resultadoDiv = document.getElementById("cotizacionResultado");
  const solicitarBtn = document.getElementById("solicitarEnvio");

  if (precioElement && resultadoDiv && solicitarBtn && datosEnvioActual) {
    // Mostrar precio
    precioElement.textContent = `$${precio}`;

    // Calcular información adicional
    const tipoZona = calcularTipoEnvio(
      datosEnvioActual.origenCiudad,
      datosEnvioActual.destinoCiudad
    );
    const tiempoEntrega = calcularTiempoEntrega(
      tipoZona,
      datosEnvioActual.tipoServicio
    );
    const descripcionZona = obtenerDescripcionZona(tipoZona);

    // Agregar información de entrega si no existe
    let infoEntrega = resultadoDiv.querySelector(".info-entrega");
    if (!infoEntrega) {
      infoEntrega = document.createElement("div");
      infoEntrega.className = "info-entrega";
      resultadoDiv.appendChild(infoEntrega);
    }

    // Solo mostrar información si está dentro de cobertura
    if (tipoZona !== "fuera_cobertura") {
      infoEntrega.innerHTML = `
        <div class="entrega-detalle">
          <p><strong>🚚 Tiempo de entrega:</strong> ${tiempoEntrega} ${
        tiempoEntrega === 1 ? "día hábil" : "días hábiles"
      }</p>
          <p><strong>📍 Tipo de zona:</strong> ${descripcionZona}</p>
          <p><strong>📦 Servicio:</strong> ${
            datosEnvioActual.tipoServicio.charAt(0).toUpperCase() +
            datosEnvioActual.tipoServicio.slice(1)
          }</p>
        </div>
      `;

      resultadoDiv.style.display = "block";
      solicitarBtn.style.display = "inline-block";

      // Scroll suave al resultado
      resultadoDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

      showMessage("¡Cotización calculada exitosamente!", "success");
    } else {
      // Ocultar resultado si está fuera de cobertura
      resultadoDiv.style.display = "none";
      solicitarBtn.style.display = "none";
    }
  }
}

// Calcular distancia entre dos puntos usando fórmula de Haversine
function calcularDistanciaHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
}
// Modo básico sin Google Maps
function initBasicAddressMode() {
  const origenCiudadInput = document.getElementById("origenCiudad");
  const destinoCiudadInput = document.getElementById("destinoCiudad");
  const origenCPInput = document.getElementById("origenCP");
  const destinoCPInput = document.getElementById("destinoCP");

  if (origenCiudadInput && destinoCiudadInput) {
    console.log("Modo basico de direcciones activado");

    // Agregar validación básica para ciudades
    origenCiudadInput.addEventListener("input", function () {
      validateCityInput(this);
    });

    destinoCiudadInput.addEventListener("input", function () {
      validateCityInput(this);
    });
  }

  // Validación de códigos postales
  if (origenCPInput) {
    origenCPInput.addEventListener("input", function () {
      validatePostalCode(this);
    });
  }

  if (destinoCPInput) {
    destinoCPInput.addEventListener("input", function () {
      validatePostalCode(this);
    });
  }

  // Inicializar validación de unidades y peso
  initPackageValidation();
}

// Validar entrada de ciudad
function validateCityInput(input) {
  const value = input.value.trim();
  if (value.length > 2) {
    // Buscar coincidencias en la lista de ciudades
    const datalist = document.getElementById("ciudades-list");
    const options = datalist.querySelectorAll("option");
    let found = false;

    options.forEach((option) => {
      if (option.value.toLowerCase().includes(value.toLowerCase())) {
        found = true;
      }
    });

    // Cambiar estilo según si se encuentra la ciudad
    if (found || value.includes(",")) {
      input.style.borderColor = "#27ae60";
    } else {
      input.style.borderColor = "#f39c12";
    }
  } else {
    input.style.borderColor = "#ecf0f1";
  }
}
// Validar código postal
function validatePostalCode(input) {
  const value = input.value.trim();
  const isValid = /^[0-9]{5}$/.test(value);

  if (value.length === 0) {
    input.style.borderColor = "#ecf0f1";
  } else if (isValid) {
    input.style.borderColor = "#27ae60";
  } else {
    input.style.borderColor = "#e74c3c";
  }
}

// Inicializar validación de paquetes
function initPackageValidation() {
  const unidadesInput = document.getElementById("unidades");
  const pesoInput = document.getElementById("peso");
  const tipoEnvioSelect = document.getElementById("tipoEnvio");

  if (unidadesInput && pesoInput && tipoEnvioSelect) {
    // Calcular peso sugerido basado en unidades y tipo
    function calcularPesoSugerido() {
      const unidades = parseInt(unidadesInput.value) || 0;
      const tipo = tipoEnvioSelect.value;

      if (unidades > 0 && tipo) {
        let pesoUnitario = tipo === "sobre" ? 0.1 : 0.5; // kg por unidad
        let pesoSugerido = unidades * pesoUnitario;

        // Mostrar sugerencia
        const hint = pesoInput.nextElementSibling;
        if (hint && hint.classList.contains("field-hint")) {
          hint.textContent = `Peso sugerido: ${pesoSugerido.toFixed(
            1
          )} kg (${pesoUnitario} kg por ${tipo})`;
          hint.style.color = "#3498db";
        }
      }
    }

    unidadesInput.addEventListener("input", calcularPesoSugerido);
    tipoEnvioSelect.addEventListener("change", calcularPesoSugerido);

    // Validar que el peso sea razonable
    pesoInput.addEventListener("input", function () {
      const peso = parseFloat(this.value) || 0;
      const unidades = parseInt(unidadesInput.value) || 1;
      const tipo = tipoEnvioSelect.value;

      if (peso > 0 && unidades > 0 && tipo) {
        const pesoPromedio = peso / unidades;
        const pesoMinimo = tipo === "sobre" ? 0.05 : 0.1;
        const pesoMaximo = tipo === "sobre" ? 2 : 30;

        if (pesoPromedio < pesoMinimo || pesoPromedio > pesoMaximo) {
          this.style.borderColor = "#f39c12";
        } else {
          this.style.borderColor = "#27ae60";
        }
      }
    });
  }
}
// Calcular tipo de envio basado en ciudades
function calcularTipoEnvio(origen, destino) {
  const origenLower = origen.toLowerCase();
  const destinoLower = destino.toLowerCase();

  // Verificar si es envio dentro de CDMX
  const esCDMXOrigen =
    origenLower.includes("cdmx") || origenLower.includes("ciudad de mexico");
  const esCDMXDestino =
    destinoLower.includes("cdmx") || destinoLower.includes("ciudad de mexico");

  // Verificar si es envio dentro de Puebla
  const esPueblaOrigen = origenLower.includes("puebla");
  const esPueblaDestino = destinoLower.includes("puebla");

  // Envio local dentro de CDMX
  if (esCDMXOrigen && esCDMXDestino) {
    return "cdmx_local";
  }

  // Envio de CDMX a Puebla (va a C.A.P.U.)
  if (esCDMXOrigen && esPueblaDestino) {
    return "cdmx_a_puebla";
  }

  // Envio de Puebla a CDMX
  if (esPueblaOrigen && esCDMXDestino) {
    return "puebla_a_cdmx";
  }

  // Verificar que ambas ciudades sean de Puebla para envios locales en Puebla
  if (!esPueblaOrigen || !esPueblaDestino) {
    return "fuera_cobertura";
  }

  // Zona Metropolitana de Puebla (envios mas rapidos y economicos)
  const zonaMetropolitana = [
    "puebla",
    "san pedro cholula",
    "san andrés cholula",
    "cuautlancingo",
    "coronango",
    "amozoc",
  ];

  // Ciudades principales (envios regulares)
  const ciudadesPrincipales = [
    "tehuacán",
    "atlixco",
    "san martín texmelucan",
    "huauchinango",
    "zacatlán",
    "chignahuapan",
  ];

  // Zonas rurales/montañosas (envíos especiales)
  const zonasRurales = [
    "cuetzalan",
    "tetela de ocampo",
    "tlatlauquitepec",
    "zacapoaxtla",
    "xicotepec",
  ];

  // Verificar si ambos están en zona metropolitana
  const origenMetro = zonaMetropolitana.some((ciudad) =>
    origenLower.includes(ciudad)
  );
  const destinoMetro = zonaMetropolitana.some((ciudad) =>
    destinoLower.includes(ciudad)
  );

  if (origenMetro && destinoMetro) {
    return "metropolitano";
  }

  // Verificar si alguno está en zona rural
  const origenRural = zonasRurales.some((ciudad) =>
    origenLower.includes(ciudad)
  );
  const destinoRural = zonasRurales.some((ciudad) =>
    destinoLower.includes(ciudad)
  );

  if (origenRural || destinoRural) {
    return "rural";
  }

  // Verificar si están en ciudades principales
  const origenPrincipal = ciudadesPrincipales.some((ciudad) =>
    origenLower.includes(ciudad)
  );
  const destinoPrincipal = ciudadesPrincipales.some((ciudad) =>
    destinoLower.includes(ciudad)
  );

  if (origenPrincipal || destinoPrincipal) {
    return "principal";
  }

  // Por defecto, envío local dentro de Puebla
  return "local";
}

// Extraer estado de la cadena de ciudad
function extraerEstado(ciudadCompleta) {
  const estados = {
    cdmx: "cdmx",
    "ciudad de méxico": "cdmx",
    jalisco: "jalisco",
    "nuevo león": "nuevo león",
    puebla: "puebla",
    "baja california": "baja california",
    guanajuato: "guanajuato",
    chihuahua: "chihuahua",
    coahuila: "coahuila",
    querétaro: "querétaro",
    "san luis potosí": "san luis potosí",
    yucatán: "yucatán",
    aguascalientes: "aguascalientes",
    morelos: "morelos",
    veracruz: "veracruz",
    tamaulipas: "tamaulipas",
    michoacán: "michoacán",
    "estado de méxico": "estado de méxico",
    "quintana roo": "quintana roo",
    hidalgo: "hidalgo",
    oaxaca: "oaxaca",
    guerrero: "guerrero",
    "baja california sur": "baja california sur",
  };

  for (const [estado, codigo] of Object.entries(estados)) {
    if (ciudadCompleta.includes(estado)) {
      return codigo;
    }
  }

  return "desconocido";
}
// Validar que el formulario esté completo
function validarFormularioCompleto(datos) {
  const camposRequeridos = [
    "origenCiudad",
    "origenCalle",
    "origenNumero",
    "origenCP",
    "destinoCiudad",
    "destinoCalle",
    "destinoNumero",
    "destinoCP",
    "tipoEnvio",
    "unidades",
    "peso",
    "tipoServicio",
  ];

  for (const campo of camposRequeridos) {
    if (!datos[campo] || datos[campo].trim() === "") {
      console.error(`Campo requerido faltante: ${campo}`);
      return false;
    }
  }

  // Validaciones adicionales
  if (parseInt(datos.unidades) < 1) {
    console.error("Unidades debe ser mayor a 0");
    return false;
  }

  if (parseFloat(datos.peso) < 0.1) {
    console.error("Peso debe ser mayor a 0.1 kg");
    return false;
  }

  if (
    !/^[0-9]{5}$/.test(datos.origenCP) ||
    !/^[0-9]{5}$/.test(datos.destinoCP)
  ) {
    console.error("Códigos postales deben tener 5 dígitos");
    return false;
  }

  return true;
}
// Variables globales para el flujo de pago
let datosEnvioActual = null;
let precioActual = 0;

// Abrir modal de pago
function abrirModalPago() {
  const pagoModal = document.getElementById("pagoModal");
  const cotizacionModal = document.getElementById("cotizacionModal");

  if (pagoModal && datosEnvioActual && precioActual) {
    // Cerrar modal de cotización
    cotizacionModal.style.display = "none";

    // Llenar resumen del envío
    llenarResumenEnvio();

    // Mostrar modal de pago
    pagoModal.style.display = "block";

    // Inicializar eventos del modal de pago
    initModalPago();
  }
}

// Llenar resumen del envío
function llenarResumenEnvio() {
  const resumenDiv = document.getElementById("resumenDetalles");
  const precioSpan = document.getElementById("precioFinalPago");

  if (resumenDiv && precioSpan && datosEnvioActual) {
    const datos = datosEnvioActual;

    resumenDiv.innerHTML = `
      <div class="resumen-item">
        <strong>📍 Origen:</strong> ${datos.origenCalle} ${
      datos.origenNumero
    }, ${datos.origenCiudad}
      </div>
      <div class="resumen-item">
        <strong>🎯 Destino:</strong> ${datos.destinoCalle} ${
      datos.destinoNumero
    }, ${datos.destinoCiudad}
      </div>
      <div class="resumen-item">
        <strong>📦 Tipo:</strong> ${datos.unidades} ${datos.tipoEnvio}(s) - ${
      datos.peso
    } kg
      </div>
      <div class="resumen-item">
        <strong>🚚 Servicio:</strong> ${
          datos.tipoServicio.charAt(0).toUpperCase() +
          datos.tipoServicio.slice(1)
        }
      </div>
    `;

    precioSpan.textContent = `$${precioActual}`;
  }
}

// Inicializar eventos del modal de pago
function initModalPago() {
  const closePagoBtn = document.querySelector(".close-pago");
  const cancelarBtn = document.getElementById("cancelarPago");
  const confirmarBtn = document.getElementById("confirmarPago");

  // Cerrar modal
  if (closePagoBtn) {
    closePagoBtn.addEventListener("click", cerrarModalPago);
  }

  if (cancelarBtn) {
    cancelarBtn.addEventListener("click", cerrarModalPago);
  }

  // Confirmar pago
  if (confirmarBtn) {
    confirmarBtn.addEventListener("click", procesarPago);
  }

  // Manejar cambios en método de pago
  const metodoPagoRadios = document.querySelectorAll(
    'input[name="metodoPago"]'
  );
  metodoPagoRadios.forEach((radio) => {
    radio.addEventListener("change", manejarCambioMetodoPago);
  });

  // Inicializar validación de tarjeta
  initValidacionTarjeta();

  // Cerrar al hacer clic fuera
  window.addEventListener("click", function (e) {
    const pagoModal = document.getElementById("pagoModal");
    if (e.target === pagoModal) {
      cerrarModalPago();
    }
  });
}

// Cerrar modal de pago
function cerrarModalPago() {
  const pagoModal = document.getElementById("pagoModal");
  if (pagoModal) {
    pagoModal.style.display = "none";
  }
}

// Procesar pago
function procesarPago() {
  const nombre = document.getElementById("clienteNombre").value.trim();
  const telefono = document.getElementById("clienteTelefono").value.trim();
  const email = document.getElementById("clienteEmail").value.trim();
  const metodoPago = document.querySelector(
    'input[name="metodoPago"]:checked'
  ).value;

  // Validar datos del cliente
  if (!nombre || !telefono || !email) {
    showMessage("Por favor, complete todos los datos del cliente", "error");
    return;
  }

  if (!validarEmail(email)) {
    showMessage("Por favor, ingrese un email válido", "error");
    return;
  }

  // Validar datos de tarjeta si es necesario
  if (metodoPago === "tarjeta") {
    const numeroTarjeta = document
      .getElementById("numeroTarjeta")
      .value.replace(/\s/g, "");
    const nombreTarjeta = document.getElementById("nombreTarjeta").value.trim();
    const mesVencimiento = document.getElementById("mesVencimiento").value;
    const anoVencimiento = document.getElementById("anoVencimiento").value;
    const cvv = document.getElementById("cvv").value;

    if (
      !numeroTarjeta ||
      !nombreTarjeta ||
      !mesVencimiento ||
      !anoVencimiento ||
      !cvv
    ) {
      showMessage("Por favor, complete todos los datos de la tarjeta", "error");
      return;
    }

    if (!validarNumeroTarjeta(numeroTarjeta)) {
      showMessage("Número de tarjeta inválido", "error");
      return;
    }

    if (cvv.length < 3) {
      showMessage("CVV inválido", "error");
      return;
    }

    // Validar fecha de vencimiento
    const fechaActual = new Date();
    const fechaVencimiento = new Date(
      parseInt(anoVencimiento),
      parseInt(mesVencimiento) - 1
    );

    if (fechaVencimiento <= fechaActual) {
      showMessage("La tarjeta está vencida", "error");
      return;
    }
  }

  // Mostrar procesando pago
  showMessage("Procesando pago...", "info");

  // Simular procesamiento
  setTimeout(() => {
    const numeroGuia = generarNumeroGuia();
    const datosCompletos = {
      ...datosEnvioActual,
      cliente: { nombre, telefono, email },
      metodoPago,
      precio: precioActual,
      numeroGuia,
      fechaCreacion: new Date(),
    };

    // Guardar en localStorage para seguimiento
    guardarEnvio(datosCompletos);

    // Mostrar comprobante
    mostrarComprobante(datosCompletos);

    showMessage("¡Pago procesado exitosamente!", "success");
  }, 2000);
}

// Generar número de guía único
function generarNumeroGuia() {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const hora = String(fecha.getHours()).padStart(2, "0");
  const minuto = String(fecha.getMinutes()).padStart(2, "0");
  const segundo = String(fecha.getSeconds()).padStart(2, "0");

  return `LI-${año}${mes}${dia}-${hora}${minuto}${segundo}`;
}

// Guardar envío en localStorage
function guardarEnvio(datos) {
  let envios = JSON.parse(localStorage.getItem("enviosLogistica") || "[]");
  envios.push(datos);
  localStorage.setItem("enviosLogistica", JSON.stringify(envios));

  // Actualizar automáticamente la lista de clientes
  actualizarClientesDesdeEnvios(datos.cliente);

  // Notificación al panel deshabilitada para evitar congelamiento
  // if (typeof window.detectarNuevosClientes === "function") {
  //   setTimeout(() => {
  //     window.detectarNuevosClientes();
  //   }, 1000);
  // }
}

// Función para actualizar automáticamente los clientes
function actualizarClientesDesdeEnvios(nuevoCliente) {
  try {
    // Obtener clientes existentes
    let clientesExistentes = JSON.parse(
      localStorage.getItem("clientesData") || "[]"
    );

    // Verificar si el cliente ya existe (por teléfono como identificador único)
    const clienteExistente = clientesExistentes.find(
      (c) => c.telefono === nuevoCliente.telefono
    );

    if (!clienteExistente) {
      // Crear nuevo cliente
      const clienteNuevo = {
        id: `cliente_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nombre: nuevoCliente.nombre,
        telefono: nuevoCliente.telefono,
        email: nuevoCliente.email,
        fechaRegistro: new Date().toISOString(),
        tipoCliente: "nuevo", // Se actualizará automáticamente según envíos
        totalEnvios: 1,
        totalGastado: 0,
        ultimoEnvio: new Date().toISOString(),
        envios: [],
      };

      clientesExistentes.push(clienteNuevo);

      // Guardar en localStorage
      localStorage.setItem("clientesData", JSON.stringify(clientesExistentes));

      console.log(
        "Nuevo cliente guardado automáticamente:",
        clienteNuevo.nombre
      );
    } else {
      console.log(
        "Cliente ya existe, se actualizará con el próximo refresh de datos"
      );
    }

    // Notificar al panel de administración si está abierto
    if (typeof window.notificarNuevoCliente === "function") {
      window.notificarNuevoCliente(nuevoCliente);
    }
  } catch (error) {
    console.error("Error actualizando clientes automáticamente:", error);
  }
}

// Mostrar comprobante
function mostrarComprobante(datos) {
  const pagoModal = document.getElementById("pagoModal");
  const comprobanteModal = document.getElementById("comprobanteModal");

  // Cerrar modal de pago
  pagoModal.style.display = "none";

  // Llenar datos del comprobante
  llenarComprobante(datos);

  // Mostrar modal de comprobante
  comprobanteModal.style.display = "block";

  // Inicializar eventos del comprobante
  initModalComprobante();
}

// Llenar datos del comprobante
function llenarComprobante(datos) {
  const detallesDiv = document.getElementById("comprobanteDetalles");
  const numeroGuiaSpan = document.getElementById("numeroGuia");
  const pagoDiv = document.getElementById("comprobantePago");

  if (detallesDiv) {
    detallesDiv.innerHTML = `
      <div class="detalle-item"><strong>Origen:</strong> ${datos.origenCalle} ${datos.origenNumero}, ${datos.origenCiudad}, CP: ${datos.origenCP}</div>
      <div class="detalle-item"><strong>Destino:</strong> ${datos.destinoCalle} ${datos.destinoNumero}, ${datos.destinoCiudad}, CP: ${datos.destinoCP}</div>
      <div class="detalle-item"><strong>Paquete:</strong> ${datos.unidades} ${datos.tipoEnvio}(s) - ${datos.peso} kg</div>
      <div class="detalle-item"><strong>Servicio:</strong> ${datos.tipoServicio}</div>
      <div class="detalle-item"><strong>Cliente:</strong> ${datos.cliente.nombre}</div>
      <div class="detalle-item"><strong>Teléfono:</strong> ${datos.cliente.telefono}</div>
      <div class="detalle-item"><strong>Email:</strong> ${datos.cliente.email}</div>
    `;
  }

  if (numeroGuiaSpan) {
    numeroGuiaSpan.textContent = datos.numeroGuia;
  }

  if (pagoDiv) {
    const metodosTexto = {
      efectivo: "Efectivo - Pago al momento de recolección",
      transferencia: "Transferencia Bancaria - BBVA: 1234567890",
      tarjeta: "Tarjeta de Crédito/Débito - Pago procesado",
    };

    pagoDiv.innerHTML = `
      <div class="pago-item"><strong>Método:</strong> ${
        metodosTexto[datos.metodoPago]
      }</div>
      <div class="pago-item"><strong>Monto:</strong> $${datos.precio} MXN</div>
      <div class="pago-item"><strong>Fecha:</strong> ${datos.fechaCreacion.toLocaleString(
        "es-MX"
      )}</div>
      <div class="pago-item"><strong>Estado:</strong> ${
        datos.metodoPago === "efectivo" ? "Pendiente de pago" : "Pagado"
      }</div>
    `;
  }
}

// Inicializar modal de comprobante
function initModalComprobante() {
  const closeComprobanteBtn = document.querySelector(".close-comprobante");

  if (closeComprobanteBtn) {
    closeComprobanteBtn.addEventListener("click", cerrarModalComprobante);
  }

  window.addEventListener("click", function (e) {
    const comprobanteModal = document.getElementById("comprobanteModal");
    if (e.target === comprobanteModal) {
      cerrarModalComprobante();
    }
  });
}

// Cerrar modal de comprobante
function cerrarModalComprobante() {
  const comprobanteModal = document.getElementById("comprobanteModal");
  if (comprobanteModal) {
    comprobanteModal.style.display = "none";
  }
}

// Funciones para los botones del comprobante
function copiarGuia() {
  const numeroGuia = document.getElementById("numeroGuia").textContent;
  navigator.clipboard.writeText(numeroGuia).then(() => {
    showMessage("Número de guía copiado al portapapeles", "success");
  });
}

function descargarComprobante() {
  showMessage("Generando PDF...", "info");

  try {
    // Verificar si jsPDF está disponible
    if (!window.jspdf) {
      console.error("jsPDF no está disponible");
      showMessage(
        "Error: Librería PDF no cargada. Intente descargar como imagen.",
        "error"
      );
      return;
    }

    // Obtener datos del comprobante
    const numeroGuia = document.getElementById("numeroGuia").textContent;
    const clienteNombre = datosEnvioActual?.cliente?.nombre || "Cliente";

    // Verificar que tenemos los datos necesarios
    if (!datosEnvioActual) {
      showMessage("Error: No se encontraron los datos del envío", "error");
      return;
    }

    // Crear nuevo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurar fuente
    doc.setFont("helvetica");

    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("LOGÍSTICA INTEGRAL", 105, 20, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(127, 140, 141);
    doc.text("Comprobante de Pago y Guía de Envío", 105, 30, {
      align: "center",
    });

    // Línea separadora
    doc.setDrawColor(52, 152, 219);
    doc.setLineWidth(1);
    doc.line(20, 35, 190, 35);

    // Información del envío
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let yPos = 50;

    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DEL ENVÍO", 20, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    doc.text(`Número de Guía: ${numeroGuia}`, 20, yPos);
    yPos += 8;
    doc.text(`Cliente: ${datosEnvioActual.cliente.nombre}`, 20, yPos);
    yPos += 8;
    doc.text(`Teléfono: ${datosEnvioActual.cliente.telefono}`, 20, yPos);
    yPos += 8;
    doc.text(`Email: ${datosEnvioActual.cliente.email}`, 20, yPos);
    yPos += 15;

    // Direcciones
    doc.setFont("helvetica", "bold");
    doc.text("DIRECCIONES", 20, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    doc.text("Origen:", 20, yPos);
    yPos += 6;
    doc.text(
      `${datosEnvioActual.origenCalle} ${datosEnvioActual.origenNumero}`,
      25,
      yPos
    );
    yPos += 6;
    doc.text(
      `${datosEnvioActual.origenCiudad}, CP: ${datosEnvioActual.origenCP}`,
      25,
      yPos
    );
    yPos += 10;

    doc.text("Destino:", 20, yPos);
    yPos += 6;
    doc.text(
      `${datosEnvioActual.destinoCalle} ${datosEnvioActual.destinoNumero}`,
      25,
      yPos
    );
    yPos += 6;
    doc.text(
      `${datosEnvioActual.destinoCiudad}, CP: ${datosEnvioActual.destinoCP}`,
      25,
      yPos
    );
    yPos += 15;

    // Detalles del paquete
    doc.setFont("helvetica", "bold");
    doc.text("DETALLES DEL PAQUETE", 20, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    doc.text(
      `Tipo: ${datosEnvioActual.unidades} ${datosEnvioActual.tipoEnvio}(s)`,
      20,
      yPos
    );
    yPos += 8;
    doc.text(`Peso total: ${datosEnvioActual.peso} kg`, 20, yPos);
    yPos += 8;
    doc.text(`Servicio: ${datosEnvioActual.tipoServicio}`, 20, yPos);
    yPos += 15;

    // Información de pago
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN DE PAGO", 20, yPos);
    yPos += 10;

    doc.setFont("helvetica", "normal");
    const metodosTexto = {
      efectivo: "Efectivo - Pago al momento de recolección",
      transferencia: "Transferencia Bancaria - BBVA: 1234567890",
      tarjeta: "Tarjeta de Crédito/Débito",
    };
    doc.text(`Método: ${metodosTexto[datosEnvioActual.metodoPago]}`, 20, yPos);
    yPos += 8;
    doc.text(`Monto: $${precioActual} MXN`, 20, yPos);
    yPos += 8;
    doc.text(`Fecha: ${new Date().toLocaleString("es-MX")}`, 20, yPos);
    yPos += 8;
    doc.text(
      `Estado: ${
        datosEnvioActual.metodoPago === "efectivo"
          ? "Pendiente de pago"
          : "Pagado"
      }`,
      20,
      yPos
    );

    // Footer
    yPos = 250;
    doc.setFontSize(10);
    doc.setTextColor(127, 140, 141);
    doc.text(
      "Logística Integral - Conectando corazones, entregando confianza",
      105,
      yPos,
      { align: "center" }
    );
    doc.text(
      "Teléfono: (123) 456-7890 | Email: info@logisticaintegral.com",
      105,
      yPos + 5,
      { align: "center" }
    );

    // Descargar PDF
    doc.save(`Comprobante-${numeroGuia}.pdf`);

    showMessage("PDF descargado exitosamente", "success");
  } catch (error) {
    console.error("Error al generar PDF:", error);
    showMessage("Error al generar el PDF. Intente nuevamente.", "error");
  }
}

function enviarPorEmail() {
  const email =
    datosEnvioActual?.cliente?.email ||
    document.getElementById("clienteEmail")?.value;

  if (!email) {
    showMessage("No se encontró el email del cliente", "error");
    return;
  }

  showMessage(`Enviando comprobante a ${email}...`, "info");

  try {
    // Crear el contenido del email
    const numeroGuia = document.getElementById("numeroGuia").textContent;
    const asunto = `Comprobante de Envío - Guía ${numeroGuia}`;

    const cuerpoEmail = `
Estimado/a ${datosEnvioActual.cliente.nombre},

¡Gracias por confiar en Logística Integral!

Su envío ha sido registrado exitosamente. A continuación encontrará los detalles:

NÚMERO DE GUÍA: ${numeroGuia}

INFORMACIÓN DEL ENVÍO:
• Origen: ${datosEnvioActual.origenCalle} ${datosEnvioActual.origenNumero}, ${
      datosEnvioActual.origenCiudad
    }
• Destino: ${datosEnvioActual.destinoCalle} ${
      datosEnvioActual.destinoNumero
    }, ${datosEnvioActual.destinoCiudad}
• Tipo: ${datosEnvioActual.unidades} ${datosEnvioActual.tipoEnvio}(s)
• Peso: ${datosEnvioActual.peso} kg
• Servicio: ${datosEnvioActual.tipoServicio}

INFORMACIÓN DE PAGO:
• Método: ${
      datosEnvioActual.metodoPago === "efectivo"
        ? "Efectivo (pago al momento de recolección)"
        : datosEnvioActual.metodoPago
    }
• Monto: $${precioActual} MXN
• Estado: ${
      datosEnvioActual.metodoPago === "efectivo"
        ? "Pendiente de pago"
        : "Pagado"
    }

Para rastrear su paquete, visite nuestra página web e ingrese el número de guía en la sección de seguimiento.

¡Gracias por elegirnos!

Logística Integral
Teléfono: (123) 456-7890
Email: info@logisticaintegral.com
    `.trim();

    // Crear enlace mailto (funciona en la mayoría de dispositivos)
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      asunto
    )}&body=${encodeURIComponent(cuerpoEmail)}`;

    // Abrir cliente de email
    window.open(mailtoLink);

    // También intentar usar EmailJS si está disponible (opcional)
    if (window.emailjs) {
      enviarConEmailJS(email, asunto, cuerpoEmail);
    } else {
      setTimeout(() => {
        showMessage(
          "Se abrió su cliente de email. Complete el envío desde allí.",
          "success"
        );
      }, 1000);
    }
  } catch (error) {
    console.error("Error al preparar email:", error);
    showMessage("Error al preparar el email. Intente nuevamente.", "error");
  }
}

// Función auxiliar para EmailJS (opcional)
function enviarConEmailJS(email, asunto, cuerpo) {
  // Esta función requiere configurar EmailJS
  // Por ahora solo mostramos el mensaje
  setTimeout(() => {
    showMessage("Email enviado exitosamente", "success");
  }, 2000);
}

function rastrearPaquete() {
  const numeroGuia = document.getElementById("numeroGuia").textContent;
  cerrarModalComprobante();

  // Ir a la sección de seguimiento y llenar el campo
  document.getElementById("seguimiento").scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    const trackingInput = document.querySelector(".tracking-form input");
    if (trackingInput) {
      trackingInput.value = numeroGuia;
      trackingInput.focus();
    }
    showMessage("Puede rastrear su paquete con el número de guía", "info");
  }, 1000);
}

// Validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Actualizar la función mostrarCotizacion para guardar los datos
function mostrarCotizacionActualizada(precio, datos) {
  // Guardar datos para usar en el pago
  datosEnvioActual = datos;
  precioActual = precio;

  // Llamar a la función original
  mostrarCotizacion(precio);
}
// Función alternativa para descargar como imagen
function descargarComoImagen() {
  showMessage("Generando imagen...", "info");

  try {
    const comprobanteContent = document.querySelector(".comprobante-content");

    if (!comprobanteContent) {
      showMessage(
        "Error: No se encontró el contenido del comprobante",
        "error"
      );
      return;
    }

    // Usar html2canvas para convertir a imagen
    html2canvas(comprobanteContent, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    })
      .then((canvas) => {
        // Crear enlace de descarga
        const link = document.createElement("a");
        link.download = `Comprobante-${
          document.getElementById("numeroGuia").textContent
        }.png`;
        link.href = canvas.toDataURL();

        // Descargar
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showMessage("Imagen descargada exitosamente", "success");
      })
      .catch((error) => {
        console.error("Error al generar imagen:", error);
        showMessage("Error al generar la imagen", "error");
      });
  } catch (error) {
    console.error("Error en descargarComoImagen:", error);
    showMessage("Error al generar la imagen", "error");
  }
}

// Función para compartir por WhatsApp
function compartirPorWhatsApp() {
  const numeroGuia = document.getElementById("numeroGuia").textContent;
  const telefono = datosEnvioActual?.cliente?.telefono || "";

  const mensaje = `
🚚 *LOGÍSTICA INTEGRAL*
📋 *Comprobante de Envío*

*Número de Guía:* ${numeroGuia}

*Cliente:* ${datosEnvioActual.cliente.nombre}
*Teléfono:* ${datosEnvioActual.cliente.telefono}

*Origen:* ${datosEnvioActual.origenCalle} ${datosEnvioActual.origenNumero}, ${datosEnvioActual.origenCiudad}
*Destino:* ${datosEnvioActual.destinoCalle} ${datosEnvioActual.destinoNumero}, ${datosEnvioActual.destinoCiudad}

*Paquete:* ${datosEnvioActual.unidades} ${datosEnvioActual.tipoEnvio}(s) - ${datosEnvioActual.peso} kg
*Servicio:* ${datosEnvioActual.tipoServicio}

*Pago:* $${precioActual} MXN (${datosEnvioActual.metodoPago})

¡Gracias por confiar en nosotros! 🙏
  `.trim();

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappUrl, "_blank");

  showMessage("Se abrió WhatsApp para compartir", "success");
}
// Manejar cambio de método de pago
function manejarCambioMetodoPago() {
  const metodoPago = document.querySelector(
    'input[name="metodoPago"]:checked'
  ).value;
  const formularioTarjeta = document.getElementById("formularioTarjeta");

  if (metodoPago === "tarjeta") {
    formularioTarjeta.style.display = "block";
  } else {
    formularioTarjeta.style.display = "none";
  }
}

// Inicializar validación de tarjeta
function initValidacionTarjeta() {
  const numeroTarjeta = document.getElementById("numeroTarjeta");
  const nombreTarjeta = document.getElementById("nombreTarjeta");
  const cvv = document.getElementById("cvv");

  if (numeroTarjeta) {
    numeroTarjeta.addEventListener("input", function () {
      // Formatear número de tarjeta (agregar espacios)
      let valor = this.value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
      let valorFormateado = valor.match(/.{1,4}/g)?.join(" ") || valor;
      this.value = valorFormateado;

      // Validar número de tarjeta
      if (validarNumeroTarjeta(valor)) {
        this.classList.add("valido");
        this.classList.remove("invalido");
      } else {
        this.classList.add("invalido");
        this.classList.remove("valido");
      }
    });
  }

  if (nombreTarjeta) {
    nombreTarjeta.addEventListener("input", function () {
      // Solo letras y espacios, convertir a mayúsculas
      this.value = this.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase();
    });
  }

  if (cvv) {
    cvv.addEventListener("input", function () {
      // Solo números, máximo 4 dígitos
      this.value = this.value.replace(/[^0-9]/g, "");

      if (this.value.length >= 3) {
        this.classList.add("valido");
        this.classList.remove("invalido");
      } else {
        this.classList.add("invalido");
        this.classList.remove("valido");
      }
    });
  }
}

// Validar número de tarjeta (algoritmo de Luhn simplificado)
function validarNumeroTarjeta(numero) {
  if (numero.length < 13 || numero.length > 19) return false;

  // Algoritmo de Luhn básico
  let suma = 0;
  let alternar = false;

  for (let i = numero.length - 1; i >= 0; i--) {
    let digito = parseInt(numero.charAt(i));

    if (alternar) {
      digito *= 2;
      if (digito > 9) {
        digito = (digito % 10) + 1;
      }
    }

    suma += digito;
    alternar = !alternar;
  }

  return suma % 10 === 0;
}
// Calcular tiempo de entrega estimado para Puebla
function calcularTiempoEntrega(tipoZona, tipoServicio) {
  let tiempoBase = 0;

  // Tiempo base según zona
  switch (tipoZona) {
    case "cdmx_local":
      tiempoBase = 1; // 1 día (local CDMX)
      break;
    case "cdmx_a_puebla":
      tiempoBase = 2; // 2 días (CDMX a C.A.P.U. Puebla)
      break;
    case "puebla_a_cdmx":
      tiempoBase = 2; // 2 días (Puebla a CDMX)
      break;
    case "metropolitano":
      tiempoBase = 1; // 1 día
      break;
    case "local":
      tiempoBase = 2; // 2 días
      break;
    case "principal":
      tiempoBase = 2; // 2 días
      break;
    case "rural":
      tiempoBase = 3; // 3 días (zonas de difícil acceso)
      break;
    default:
      tiempoBase = 2;
  }

  // Ajuste según tipo de servicio
  switch (tipoServicio) {
    case "express":
      // Express reduce el tiempo a la mitad (mínimo 1 día)
      return Math.max(1, Math.floor(tiempoBase / 2));
    case "normal":
      return tiempoBase;
    case "economico":
      // Económico agrega 1 día adicional
      return tiempoBase + 1;
    default:
      return tiempoBase;
  }
}

// Obtener descripción de la zona de entrega
function obtenerDescripcionZona(tipoZona) {
  switch (tipoZona) {
    case "cdmx_local":
      return "Envío Local en Ciudad de México";
    case "cdmx_a_puebla":
      return "CDMX a Puebla (Entrega en C.A.P.U.)";
    case "puebla_a_cdmx":
      return "Puebla a Ciudad de México";
    case "metropolitano":
      return "Zona Metropolitana de Puebla";
    case "local":
      return "Municipio dentro de Puebla";
    case "principal":
      return "Ciudad Principal de Puebla";
    case "rural":
      return "Zona Rural/Sierra de Puebla";
    case "fuera_cobertura":
      return "Fuera de nuestra área de cobertura";
    default:
      return "Zona no identificada";
  }
}
// Inicializar servicios clickeables
function initServiciosClickeables() {
  const servicios = document.querySelectorAll(".servicio-clickeable");

  servicios.forEach((servicio) => {
    servicio.addEventListener("click", function () {
      const tipoServicio = this.getAttribute("data-servicio");
      abrirModalConServicio(tipoServicio);
    });

    // También manejar el botón específicamente
    const btnServicio = servicio.querySelector(".btn-servicio");
    if (btnServicio) {
      btnServicio.addEventListener("click", function (e) {
        e.stopPropagation(); // Evitar doble clic
        const tipoServicio = servicio.getAttribute("data-servicio");
        abrirModalConServicio(tipoServicio);
      });
    }
  });
}

// Abrir modal con configuración específica del servicio
function abrirModalConServicio(tipoServicio) {
  const modal = document.getElementById("cotizacionModal");

  if (modal) {
    // Mostrar modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden";

    // Configurar campos según el tipo de servicio
    setTimeout(() => {
      configurarModalParaServicio(tipoServicio);
      initPlacesAutocomplete();
    }, 100);

    // Mostrar mensaje informativo
    setTimeout(() => {
      const mensajes = {
        cdmx: "Servicio CDMX - Envíos locales y conexión con Puebla vía C.A.P.U.",
        metropolitano:
          "Servicio para Zona Metropolitana de Puebla - Entregas rápidas y económicas",
        principales:
          "Servicio para Ciudades Principales - Cobertura amplia en Puebla",
        rural:
          "Servicio para Sierra y Zonas Rurales - Llegamos a comunidades de difícil acceso",
      };

      showMessage(
        mensajes[tipoServicio] || "Seleccione ciudades de la lista",
        "info"
      );
    }, 500);
  }
}

// Configurar modal según el tipo de servicio
function configurarModalParaServicio(tipoServicio) {
  const origenInput = document.getElementById("origenCiudad");
  const destinoInput = document.getElementById("destinoCiudad");

  // Configurar placeholders y sugerencias según el servicio
  switch (tipoServicio) {
    case "cdmx":
      if (origenInput) origenInput.placeholder = "Ej: Ciudad de México, CDMX";
      if (destinoInput)
        destinoInput.placeholder = "Ej: Benito Juárez, CDMX o Puebla, Puebla";
      break;

    case "metropolitano":
      if (origenInput) origenInput.placeholder = "Ej: Puebla, Puebla";
      if (destinoInput)
        destinoInput.placeholder = "Ej: San Pedro Cholula, Puebla";
      break;

    case "principales":
      if (origenInput) origenInput.placeholder = "Ej: Tehuacán, Puebla";
      if (destinoInput) destinoInput.placeholder = "Ej: Atlixco, Puebla";
      break;

    case "rural":
      if (origenInput) origenInput.placeholder = "Ej: Cuetzalan, Puebla";
      if (destinoInput) destinoInput.placeholder = "Ej: Zacatlán, Puebla";
      break;
  }

  // Pre-seleccionar tipo de servicio si es apropiado
  const tipoServicioSelect = document.getElementById("tipoServicio");
  if (tipoServicioSelect) {
    // Para zonas rurales, sugerir servicio normal o económico
    if (tipoServicio === "rural") {
      tipoServicioSelect.value = "normal";
    }
    // Para metropolitano, sugerir express
    else if (tipoServicio === "metropolitano") {
      tipoServicioSelect.value = "express";
    }
  }
}

// Función mejorada para sugerir ciudades según el servicio
function sugerirCiudadesPorServicio(tipoServicio) {
  const sugerencias = {
    metropolitano: [
      "Puebla, Puebla",
      "San Pedro Cholula, Puebla",
      "San Andrés Cholula, Puebla",
      "Cuautlancingo, Puebla",
      "Coronango, Puebla",
      "Amozoc, Puebla",
    ],
    principales: [
      "Tehuacán, Puebla",
      "Atlixco, Puebla",
      "San Martín Texmelucan, Puebla",
      "Huauchinango, Puebla",
      "Zacatlán, Puebla",
      "Chignahuapan, Puebla",
    ],
    rural: [
      "Cuetzalan, Puebla",
      "Tetela de Ocampo, Puebla",
      "Tlatlauquitepec, Puebla",
      "Zacapoaxtla, Puebla",
      "Xicotepec, Puebla",
    ],
  };

  return sugerencias[tipoServicio] || [];
}
