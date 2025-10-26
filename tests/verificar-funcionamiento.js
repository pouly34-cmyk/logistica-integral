// Script de verificación rápida del funcionamiento
console.log("🔍 Iniciando verificación de funcionamiento...");

// Función principal de verificación
function verificarFuncionamiento() {
  const resultados = {
    errores: [],
    advertencias: [],
    exitos: [],
  };

  function verificar(nombre, condicion, tipo = "error") {
    try {
      const resultado =
        typeof condicion === "function" ? condicion() : condicion;
      if (resultado) {
        resultados.exitos.push(`✅ ${nombre}`);
        console.log(`✅ ${nombre}`);
      } else {
        if (tipo === "error") {
          resultados.errores.push(`❌ ${nombre}`);
          console.error(`❌ ${nombre}`);
        } else {
          resultados.advertencias.push(`⚠️ ${nombre}`);
          console.warn(`⚠️ ${nombre}`);
        }
      }
    } catch (error) {
      resultados.errores.push(`💥 ${nombre}: ${error.message}`);
      console.error(`💥 ${nombre}:`, error);
    }
  }

  console.log("\n=== VERIFICACIÓN BÁSICA DE FUNCIONAMIENTO ===\n");

  // 1. Verificar que JavaScript básico funciona
  verificar("JavaScript básico funciona", () => {
    const test = [1, 2, 3];
    return test.length === 3 && test.map((x) => x * 2).join(",") === "2,4,6";
  });

  // 2. Verificar DOM básico
  verificar("DOM está disponible", () => typeof document !== "undefined");
  verificar("Body existe", () => document.body !== null);
  verificar("Head existe", () => document.head !== null);

  // 3. Verificar localStorage
  verificar("LocalStorage disponible", () => typeof Storage !== "undefined");

  if (typeof Storage !== "undefined") {
    verificar("LocalStorage funcional", () => {
      const testKey = "test_" + Date.now();
      localStorage.setItem(testKey, "test");
      const result = localStorage.getItem(testKey) === "test";
      localStorage.removeItem(testKey);
      return result;
    });
  }

  // 4. Verificar funciones críticas del sistema principal
  const funcionesCriticas = [
    "calcularPrecio",
    "calcularTipoEnvio",
    "validarEmail",
    "generarNumeroGuia",
  ];

  funcionesCriticas.forEach((func) => {
    verificar(
      `Función ${func} existe`,
      () => typeof window[func] === "function",
      "advertencia"
    );
  });

  // 5. Verificar elementos DOM críticos
  const elementosCriticos = [
    { selector: "#cotizacionModal", nombre: "Modal de cotización" },
    { selector: "#pagoModal", nombre: "Modal de pago" },
    { selector: ".hero-section", nombre: "Sección hero" },
    { selector: "#servicios", nombre: "Sección servicios" },
  ];

  elementosCriticos.forEach((elemento) => {
    verificar(
      `${elemento.nombre} existe`,
      () => document.querySelector(elemento.selector) !== null,
      "advertencia"
    );
  });

  // 6. Probar funciones básicas
  if (typeof calcularPrecio === "function") {
    verificar("Función calcularPrecio funciona", () => {
      const datos = {
        origenCiudad: "Ciudad de Mexico",
        destinoCiudad: "Puebla",
        tipoEnvio: "sobre",
        peso: 0.5,
        unidades: 1,
        tipoServicio: "normal",
      };
      const precio = calcularPrecio(datos);
      return typeof precio === "number" && precio > 0;
    });
  }

  if (typeof validarEmail === "function") {
    verificar("Función validarEmail funciona", () => {
      return (
        validarEmail("test@example.com") === true &&
        validarEmail("email-invalido") === false
      );
    });
  }

  if (typeof generarNumeroGuia === "function") {
    verificar("Función generarNumeroGuia funciona", () => {
      const guia = generarNumeroGuia();
      return typeof guia === "string" && guia.startsWith("LI-");
    });
  }

  // 7. Verificar que no hay errores de JavaScript en consola
  const erroresConsola = [];
  const originalError = console.error;
  console.error = function (...args) {
    erroresConsola.push(args.join(" "));
    originalError.apply(console, args);
  };

  setTimeout(() => {
    console.error = originalError;
    verificar(
      "Sin errores críticos en consola",
      () => erroresConsola.length === 0,
      "advertencia"
    );
  }, 1000);

  // 8. Resumen
  setTimeout(() => {
    console.log("\n📊 RESUMEN DE VERIFICACIÓN:");
    console.log(`✅ Éxitos: ${resultados.exitos.length}`);
    console.log(`⚠️ Advertencias: ${resultados.advertencias.length}`);
    console.log(`❌ Errores: ${resultados.errores.length}`);

    if (resultados.errores.length === 0) {
      console.log("\n🎉 ¡SISTEMA FUNCIONANDO CORRECTAMENTE!");
    } else {
      console.log("\n🚨 ERRORES ENCONTRADOS:");
      resultados.errores.forEach((error) => console.log(error));
    }

    if (resultados.advertencias.length > 0) {
      console.log("\n⚠️ ADVERTENCIAS:");
      resultados.advertencias.forEach((advertencia) =>
        console.log(advertencia)
      );
    }

    return resultados;
  }, 1500);

  return resultados;
}

// Función específica para verificar correcciones tipográficas
function verificarCorreccionesTipograficas() {
  console.log("\n📝 VERIFICANDO CORRECCIONES TIPOGRÁFICAS...");

  const erroresComunes = [
    "Logística",
    "Envíos",
    "Gestión",
    "Configuración",
    "Dirección",
    "Información",
    "Teléfono",
    "Número",
    "Código",
    "Administración",
    "Cotización",
  ];

  let erroresEncontrados = 0;

  // Verificar en el HTML
  const htmlContent = document.documentElement.outerHTML;

  erroresComunes.forEach((palabra) => {
    if (htmlContent.includes(palabra)) {
      console.warn(`⚠️ Palabra con acento encontrada: "${palabra}"`);
      erroresEncontrados++;
    }
  });

  // Verificar errores tipográficos específicos
  const erroresTipograficos = ["nDescargar", "Envtiar"];
  erroresTipograficos.forEach((error) => {
    if (htmlContent.includes(error)) {
      console.error(`❌ Error tipográfico encontrado: "${error}"`);
      erroresEncontrados++;
    }
  });

  if (erroresEncontrados === 0) {
    console.log(
      "✅ No se encontraron palabras con acentos ni errores tipográficos"
    );
  } else {
    console.log(
      `❌ Se encontraron ${erroresEncontrados} problemas tipográficos`
    );
  }

  return erroresEncontrados === 0;
}

// Función para verificar que los estilos siguen funcionando
function verificarEstilos() {
  console.log("\n🎨 VERIFICANDO ESTILOS CSS...");

  const elementosConEstilo = [
    { selector: "body", propiedad: "fontFamily" },
    { selector: ".btn", propiedad: "cursor" },
    { selector: ".modal", propiedad: "display" },
  ];

  let estilosOK = 0;

  elementosConEstilo.forEach((elemento) => {
    const el = document.querySelector(elemento.selector);
    if (el) {
      const styles = window.getComputedStyle(el);
      if (
        styles[elemento.propiedad] &&
        styles[elemento.propiedad] !== "initial"
      ) {
        console.log(`✅ Estilos aplicados a ${elemento.selector}`);
        estilosOK++;
      } else {
        console.warn(`⚠️ Estilos no aplicados a ${elemento.selector}`);
      }
    } else {
      console.warn(`⚠️ Elemento ${elemento.selector} no encontrado`);
    }
  });

  return estilosOK > 0;
}

// Ejecutar verificación completa
function ejecutarVerificacionCompleta() {
  console.log("🚀 EJECUTANDO VERIFICACIÓN COMPLETA...\n");

  const funcionamiento = verificarFuncionamiento();
  const tipografia = verificarCorreccionesTipograficas();
  const estilos = verificarEstilos();

  setTimeout(() => {
    console.log("\n🏁 VERIFICACIÓN COMPLETA FINALIZADA");
    console.log("📋 Resumen:");
    console.log(
      `- Funcionamiento básico: ${
        funcionamiento.errores.length === 0 ? "✅" : "❌"
      }`
    );
    console.log(`- Correcciones tipográficas: ${tipografia ? "✅" : "❌"}`);
    console.log(`- Estilos CSS: ${estilos ? "✅" : "❌"}`);

    if (funcionamiento.errores.length === 0 && tipografia && estilos) {
      console.log(
        "\n🎉 ¡TODO FUNCIONANDO CORRECTAMENTE DESPUÉS DE LAS CORRECCIONES!"
      );
    } else {
      console.log("\n⚠️ Algunos aspectos requieren atención");
    }
  }, 2000);
}

// Auto-ejecutar al cargar
if (typeof window !== "undefined") {
  window.verificarFuncionamiento = verificarFuncionamiento;
  window.verificarCorreccionesTipograficas = verificarCorreccionesTipograficas;
  window.ejecutarVerificacionCompleta = ejecutarVerificacionCompleta;

  // Ejecutar automáticamente después de un breve delay
  setTimeout(ejecutarVerificacionCompleta, 1000);
}

console.log("✅ Script de verificación cargado");
