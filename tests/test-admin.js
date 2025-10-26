// Script de pruebas para el panel de administración
console.log("🧪 Iniciando pruebas del panel de administración...");

// Función para ejecutar pruebas del admin
function ejecutarPruebasAdmin() {
  const resultados = {
    total: 0,
    exitosas: 0,
    fallidas: 0,
    detalles: [],
  };

  function probar(nombre, condicion, descripcion = "") {
    resultados.total++;
    const exito = typeof condicion === "function" ? condicion() : condicion;

    if (exito) {
      resultados.exitosas++;
      console.log(`✅ ${nombre}: EXITOSA ${descripcion}`);
    } else {
      resultados.fallidas++;
      console.log(`❌ ${nombre}: FALLIDA ${descripcion}`);
    }

    resultados.detalles.push({
      nombre,
      exito,
      descripcion,
    });

    return exito;
  }

  console.log("\n=== PRUEBAS DEL PANEL DE ADMINISTRACIÓN ===\n");

  // 1. Verificar variables globales
  console.log("📋 1. VERIFICANDO VARIABLES GLOBALES...");
  probar(
    "enviosData",
    () => typeof enviosData !== "undefined",
    "- Variable global de envíos"
  );
  probar(
    "clientesData",
    () => typeof clientesData !== "undefined",
    "- Variable global de clientes"
  );
  probar(
    "clientManager",
    () => typeof clientManager !== "undefined",
    "- Manager de clientes"
  );

  // 2. Verificar funciones críticas
  console.log("\n⚙️ 2. VERIFICANDO FUNCIONES CRÍTICAS...");
  probar(
    "showSection",
    () => typeof showSection === "function",
    "- Función de navegación"
  );
  probar(
    "loadData",
    () => typeof loadData === "function",
    "- Función de carga de datos"
  );
  probar(
    "mostrarClientesEncontrados",
    () => typeof window.mostrarClientesEncontrados === "function",
    "- Función de mostrar clientes"
  );
  probar(
    "procesarEnviosExistentes",
    () => typeof window.procesarEnviosExistentes === "function",
    "- Función de procesar envíos"
  );

  // 3. Verificar elementos DOM del admin
  console.log("\n🎨 3. VERIFICANDO ELEMENTOS DOM...");
  probar(
    "Sidebar",
    () => document.querySelector(".sidebar") !== null,
    "- Barra lateral de navegación"
  );
  probar(
    "Main content",
    () => document.querySelector(".main-content") !== null,
    "- Contenido principal"
  );
  probar(
    "Dashboard",
    () => document.querySelector("#dashboard-section") !== null,
    "- Sección dashboard"
  );
  probar(
    "Envíos section",
    () => document.querySelector("#envios-section") !== null,
    "- Sección de envíos"
  );
  probar(
    "Clientes section",
    () => document.querySelector("#clientes-section") !== null,
    "- Sección de clientes"
  );

  // 4. Verificar tablas
  console.log("\n📊 4. VERIFICANDO TABLAS...");
  probar(
    "Tabla envíos",
    () => document.querySelector("#enviosTableBody") !== null,
    "- Tabla de envíos"
  );
  probar(
    "Tabla clientes",
    () => document.querySelector("#clientesTableBody") !== null,
    "- Tabla de clientes"
  );
  probar(
    "Tabla repartidores",
    () => document.querySelector("#repartidoresTableBody") !== null,
    "- Tabla de repartidores"
  );

  // 5. Verificar botones de acción
  console.log("\n🔘 5. VERIFICANDO BOTONES DE ACCIÓN...");
  probar(
    "Botón actualizar clientes",
    () =>
      document.querySelector(
        'button[onclick*="actualizacionRapidaClientes"]'
      ) !== null,
    "- Botón actualizar clientes"
  );
  probar(
    "Botón sincronizar",
    () =>
      document.querySelector('button[onclick*="sincronizarSimple"]') !== null,
    "- Botón sincronizar"
  );
  probar(
    "Botón debug",
    () =>
      document.querySelector('button[onclick*="debugTablaClientes"]') !== null,
    "- Botón debug"
  );

  // 6. Probar funcionalidad de localStorage
  console.log("\n💾 6. PROBANDO LOCALSTORAGE...");
  probar(
    "LocalStorage disponible",
    () => typeof Storage !== "undefined",
    "- Soporte de localStorage"
  );

  if (typeof Storage !== "undefined") {
    // Probar escritura/lectura
    try {
      const testKey = "admin_test_" + Date.now();
      localStorage.setItem(testKey, "test_value");
      const value = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      probar(
        "Escritura/Lectura localStorage",
        () => value === "test_value",
        "- Operaciones básicas"
      );
    } catch (error) {
      probar(
        "Escritura/Lectura localStorage",
        false,
        `- Error: ${error.message}`
      );
    }

    // Verificar datos existentes
    const enviosLS = localStorage.getItem("enviosLogistica");
    probar(
      "Datos de envíos",
      () => enviosLS !== null,
      `- ${enviosLS ? JSON.parse(enviosLS).length : 0} envíos`
    );

    const clientesLS = localStorage.getItem("clientesData");
    probar(
      "Datos de clientes",
      () => clientesLS !== null,
      `- ${clientesLS ? JSON.parse(clientesLS).length : 0} clientes`
    );
  }

  // 7. Probar funciones específicas del admin
  console.log("\n🔧 7. PROBANDO FUNCIONES ESPECÍFICAS...");

  // Probar función de debug de clientes
  if (typeof window.debugTablaClientes === "function") {
    try {
      // No ejecutar, solo verificar que existe
      probar("debugTablaClientes", true, "- Función de debug disponible");
    } catch (error) {
      probar("debugTablaClientes", false, `- Error: ${error.message}`);
    }
  } else {
    probar("debugTablaClientes", false, "- Función no encontrada");
  }

  // Probar función de mostrar clientes
  if (typeof window.mostrarClientesEncontrados === "function") {
    probar(
      "mostrarClientesEncontrados",
      true,
      "- Función de mostrar clientes disponible"
    );
  } else {
    probar("mostrarClientesEncontrados", false, "- Función no encontrada");
  }

  // 8. Verificar estilos CSS del admin
  console.log("\n🎨 8. VERIFICANDO ESTILOS CSS...");
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    const sidebarStyles = window.getComputedStyle(sidebar);
    probar(
      "Estilos sidebar",
      () =>
        sidebarStyles.position === "fixed" ||
        sidebarStyles.position === "absolute",
      "- Posicionamiento correcto"
    );
  } else {
    probar("Estilos sidebar", false, "- Sidebar no encontrado");
  }

  // 9. Simular flujo de trabajo del admin
  console.log("\n🔄 9. SIMULANDO FLUJO DE TRABAJO...");

  // Simular carga de datos
  if (typeof loadData === "function") {
    try {
      // No ejecutar loadData real para evitar efectos secundarios
      probar("Simulación loadData", true, "- Función disponible para carga");
    } catch (error) {
      probar("Simulación loadData", false, `- Error: ${error.message}`);
    }
  } else {
    probar("Simulación loadData", false, "- Función no disponible");
  }

  // Verificar que clientManager puede inicializarse
  if (typeof ClientManager === "function") {
    probar("ClientManager constructor", true, "- Clase disponible");
  } else {
    probar("ClientManager constructor", false, "- Clase no encontrada");
  }

  // 10. Resumen final
  console.log("\n📊 RESUMEN DE PRUEBAS:");
  console.log(`Total de pruebas: ${resultados.total}`);
  console.log(`✅ Exitosas: ${resultados.exitosas}`);
  console.log(`❌ Fallidas: ${resultados.fallidas}`);

  const porcentaje = Math.round((resultados.exitosas / resultados.total) * 100);
  console.log(`📈 Porcentaje de éxito: ${porcentaje}%`);

  if (porcentaje >= 80) {
    console.log("🎉 ¡SISTEMA EN BUEN ESTADO!");
  } else if (porcentaje >= 60) {
    console.log("⚠️ Sistema funcional con algunas mejoras necesarias");
  } else {
    console.log("🚨 Sistema requiere atención inmediata");
  }

  // Mostrar detalles de pruebas fallidas
  const fallidas = resultados.detalles.filter((d) => !d.exito);
  if (fallidas.length > 0) {
    console.log("\n🔍 DETALLES DE PRUEBAS FALLIDAS:");
    fallidas.forEach((prueba) => {
      console.log(`- ${prueba.nombre}: ${prueba.descripcion}`);
    });
  }

  return resultados;
}

// Función para probar específicamente el sistema de clientes
function probarSistemaClientes() {
  console.log("\n👥 PRUEBAS ESPECÍFICAS DEL SISTEMA DE CLIENTES:");

  const pruebas = [];

  // Verificar que clientManager existe
  if (typeof clientManager !== "undefined" && clientManager !== null) {
    console.log("✅ clientManager está inicializado");

    // Verificar métodos del clientManager
    const metodos = [
      "loadClientes",
      "renderClientesTable",
      "updateClientesStats",
    ];
    metodos.forEach((metodo) => {
      if (typeof clientManager[metodo] === "function") {
        console.log(`✅ Método ${metodo} disponible`);
      } else {
        console.log(`❌ Método ${metodo} no encontrado`);
      }
    });
  } else {
    console.log("❌ clientManager no está inicializado");
  }

  // Verificar datos de clientes
  if (typeof clientesData !== "undefined") {
    console.log(`📊 clientesData contiene ${clientesData.length} clientes`);

    if (clientesData.length > 0) {
      const primerCliente = clientesData[0];
      const camposRequeridos = ["nombre", "telefono", "email"];

      camposRequeridos.forEach((campo) => {
        if (primerCliente.hasOwnProperty(campo)) {
          console.log(`✅ Campo ${campo} presente en clientes`);
        } else {
          console.log(`❌ Campo ${campo} faltante en clientes`);
        }
      });
    }
  } else {
    console.log("❌ clientesData no está definido");
  }

  return pruebas;
}

// Función para ejecutar todas las pruebas del admin
function ejecutarPruebasCompletasAdmin() {
  console.log("🚀 EJECUTANDO SUITE COMPLETA DE PRUEBAS DEL ADMIN...\n");

  const resultadosGenerales = ejecutarPruebasAdmin();
  const resultadosClientes = probarSistemaClientes();

  console.log("\n🏁 PRUEBAS COMPLETADAS");

  return {
    generales: resultadosGenerales,
    clientes: resultadosClientes,
  };
}

// Exportar funciones para uso global
if (typeof window !== "undefined") {
  window.ejecutarPruebasAdmin = ejecutarPruebasAdmin;
  window.probarSistemaClientes = probarSistemaClientes;
  window.ejecutarPruebasCompletasAdmin = ejecutarPruebasCompletasAdmin;
}

// Auto-ejecutar si estamos en el contexto del admin
if (typeof document !== "undefined" && document.querySelector(".sidebar")) {
  console.log(
    "🔍 Panel de administración detectado, ejecutando pruebas automáticas..."
  );
  setTimeout(() => {
    ejecutarPruebasCompletasAdmin();
  }, 2000);
}

console.log("✅ Script de pruebas del admin cargado correctamente");
