# 🧪 Instrucciones para Ejecutar Pruebas del Sistema

## 📋 Archivos de Prueba Creados

1. **`test-funcionalidad.html`** - Interfaz web completa de pruebas
2. **`test-admin.js`** - Pruebas específicas del panel de administración
3. **`verificar-funcionamiento.js`** - Verificación rápida del funcionamiento
4. **`INSTRUCCIONES-PRUEBAS.md`** - Este archivo de instrucciones

## 🚀 Cómo Ejecutar las Pruebas

### Opción 1: Pruebas Visuales Completas (Recomendado)

1. **Abrir el archivo de pruebas:**

   ```
   Abrir test-funcionalidad.html en tu navegador
   ```

2. **Ejecutar todas las pruebas:**

   - Hacer clic en "🚀 Ejecutar Todas las Pruebas"
   - Esperar a que se completen (aprox. 3-5 segundos)
   - Revisar los resultados en pantalla

3. **Ejecutar pruebas individuales:**
   - Hacer clic en "▶️ Ejecutar Prueba" en cada sección
   - Revisar resultados específicos

### Opción 2: Pruebas desde la Consola del Navegador

#### Para la Página Principal (index.html):

1. **Abrir index.html en el navegador**
2. **Abrir la consola (F12)**
3. **Cargar el script de verificación:**

   ```javascript
   // Copiar y pegar este código en la consola:
   const script = document.createElement("script");
   script.src = "verificar-funcionamiento.js";
   document.head.appendChild(script);
   ```

4. **O ejecutar verificación manual:**

   ```javascript
   // Verificar funciones básicas
   console.log(
     "Probando calcularPrecio:",
     typeof calcularPrecio === "function"
   );
   console.log("Probando validarEmail:", typeof validarEmail === "function");
   console.log(
     "Probando generarNumeroGuia:",
     typeof generarNumeroGuia === "function"
   );

   // Probar cálculo de precio
   if (typeof calcularPrecio === "function") {
     const precio = calcularPrecio({
       origenCiudad: "Ciudad de Mexico",
       destinoCiudad: "Puebla",
       tipoEnvio: "sobre",
       peso: 0.5,
       unidades: 1,
       tipoServicio: "normal",
     });
     console.log("Precio calculado:", precio);
   }
   ```

#### Para el Panel de Administración (admin.html):

1. **Abrir admin.html en el navegador**
2. **Abrir la consola (F12)**
3. **Cargar el script de pruebas del admin:**

   ```javascript
   const script = document.createElement("script");
   script.src = "test-admin.js";
   document.head.appendChild(script);
   ```

4. **O ejecutar pruebas manuales:**

   ```javascript
   // Verificar variables del admin
   console.log(
     "enviosData:",
     typeof enviosData !== "undefined" ? enviosData.length : "No definido"
   );
   console.log(
     "clientesData:",
     typeof clientesData !== "undefined" ? clientesData.length : "No definido"
   );
   console.log(
     "clientManager:",
     typeof clientManager !== "undefined" ? "Definido" : "No definido"
   );

   // Probar funciones del admin
   if (typeof window.mostrarClientesEncontrados === "function") {
     console.log("✅ Función mostrarClientesEncontrados disponible");
   }

   if (typeof window.debugTablaClientes === "function") {
     console.log("✅ Función debugTablaClientes disponible");
   }
   ```

## 📊 Qué Verifican las Pruebas

### 1. Pruebas de Archivos Principales

- ✅ Existencia de archivos CSS y JS
- ✅ Estructura HTML básica
- ✅ Configuración de charset y viewport

### 2. Pruebas de Elementos DOM

- ✅ Elementos críticos (header, nav, main, footer)
- ✅ Secciones principales (hero, servicios, seguimiento, contacto)
- ✅ Modales (cotización, pago, comprobante)
- ✅ Formularios y botones

### 3. Pruebas de Funciones JavaScript

- ✅ Funciones críticas definidas
- ✅ Cálculo de precios funcional
- ✅ Validación de email
- ✅ Generación de números de guía

### 4. Pruebas de LocalStorage

- ✅ Disponibilidad de localStorage
- ✅ Operaciones de escritura/lectura
- ✅ Datos existentes de envíos y clientes

### 5. Pruebas de Estilos CSS

- ✅ Aplicación de estilos básicos
- ✅ Configuración responsive
- ✅ Estilos específicos de componentes

### 6. Pruebas de Flujo Completo

- ✅ Simulación de cotización
- ✅ Generación de números de guía
- ✅ Guardado de envíos

### 7. Pruebas Específicas del Admin

- ✅ Variables globales del admin
- ✅ Funciones de gestión de clientes
- ✅ Tablas y elementos de interfaz
- ✅ Sistema de navegación

## 🎯 Resultados Esperados

### ✅ Pruebas Exitosas (Verde)

- Todas las funciones básicas funcionan
- No hay errores de JavaScript
- Los elementos DOM existen
- LocalStorage funciona correctamente

### ⚠️ Advertencias (Amarillo)

- Funciones opcionales no disponibles
- Elementos no críticos faltantes
- Configuraciones menores

### ❌ Errores (Rojo)

- Funciones críticas no funcionan
- Errores de JavaScript
- Elementos esenciales faltantes

## 🔧 Solución de Problemas

### Si las pruebas fallan:

1. **Verificar que todos los archivos estén en el mismo directorio**
2. **Abrir la consola del navegador (F12) para ver errores específicos**
3. **Verificar que no hay errores de sintaxis en JavaScript**
4. **Comprobar que los archivos CSS se están cargando correctamente**

### Errores Comunes:

- **"Función no definida"**: Verificar que el archivo JS se está cargando
- **"Elemento no encontrado"**: Verificar que el HTML tiene los IDs correctos
- **"LocalStorage no disponible"**: Verificar configuración del navegador

## 📈 Interpretación de Resultados

- **90-100% éxito**: ✅ Sistema funcionando perfectamente
- **70-89% éxito**: ⚠️ Sistema funcional con mejoras menores
- **50-69% éxito**: 🔧 Sistema requiere atención
- **<50% éxito**: 🚨 Sistema requiere revisión completa

## 🎉 Después de las Correcciones Tipográficas

Las pruebas verifican específicamente que:

1. **✅ No hay palabras con acentos** en el código
2. **✅ Los errores tipográficos fueron corregidos** (nDescargar → Descargar, Envtiar → Enviar)
3. **✅ Toda la funcionalidad sigue funcionando** después de los cambios
4. **✅ Los estilos CSS siguen aplicándose** correctamente
5. **✅ JavaScript funciona** sin errores

## 📞 Soporte

Si encuentras problemas con las pruebas:

1. Revisar la consola del navegador para errores específicos
2. Verificar que todos los archivos estén en el directorio correcto
3. Comprobar que el navegador soporta las funciones utilizadas
4. Ejecutar las pruebas en un navegador diferente para comparar

---

**¡Las pruebas están listas para verificar que todo funciona correctamente después de las correcciones tipográficas!** 🎉
