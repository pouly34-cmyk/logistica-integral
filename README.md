# 🚚 Logística Integral - Sistema de Paquetería

Sistema web completo para gestión de envíos y paquetería con cobertura CDMX-Puebla. Incluye interfaz de cliente, panel de administración y sistema de seguimiento en tiempo real.

## 🌟 Características Principales

### Para Clientes

- 📦 **Cotización instantánea** de envíos
- 🗺️ **Integración con Google Maps** para autocompletado de direcciones
- 💳 **Múltiples métodos de pago** (tarjeta, transferencia, efectivo)
- 📱 **Seguimiento en tiempo real** de paquetes
- 📱 **Diseño responsive** para móviles y tablets

### Para Administradores

- 📊 **Dashboard completo** con métricas y estadísticas
- 📋 **Gestión de envíos** (crear, editar, actualizar estados)
- 👥 **Gestión de clientes** con historial completo
- 🚚 **Gestión de repartidores** y asignación de rutas
- 📈 **Reportes detallados** con análisis por períodos
- 🔐 **Sistema de autenticación** seguro

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Almacenamiento**: LocalStorage (desarrollo), preparado para base de datos
- **APIs**: Google Maps Places API
- **Arquitectura**: SPA (Single Page Application)
- **Estilos**: CSS Grid, Flexbox, Responsive Design

## 🚀 Instalación y Uso

### Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación Rápida

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/tu-usuario/logistica-integral.git
   cd logistica-integral
   ```

2. **Abre el proyecto:**

   - Opción 1: Abre `index.html` directamente en tu navegador
   - Opción 2: Usa un servidor local:

     ```bash
     # Con Python
     python -m http.server 8000

     # Con Node.js (si tienes http-server instalado)
     npx http-server

     # Con PHP
     php -S localhost:8000
     ```

3. **Accede a la aplicación:**
   - **Página principal**: `http://localhost:8000/index.html`
   - **Panel de administración**: `http://localhost:8000/admin.html`
   - **Login de admin**: `http://localhost:8000/login.html`

## 📋 Estructura del Proyecto

```
logistica-integral/
├── 📄 index.html              # Página principal del cliente
├── 📄 admin.html              # Panel de administración
├── 📄 login.html              # Sistema de login
├── 📄 script.js               # Lógica de la interfaz cliente
├── 📄 admin-script.js         # Lógica del panel admin
├── 📄 login-script.js         # Lógica de autenticación
├── 📄 style.css               # Estilos de la interfaz cliente
├── 📄 admin-style.css         # Estilos del panel admin
├── 📁 img/                    # Imágenes y recursos
│   ├── logo_globalTech.png
│   ├── envios-locales.png
│   └── ...
├── 📁 docs/                   # Documentación adicional
│   ├── INSTRUCCIONES-PRUEBAS.md
│   └── especificaciones/
├── 📁 tests/                  # Archivos de prueba
│   ├── test-funcionalidad.html
│   ├── test-navegacion.html
│   └── ...
└── 📄 README.md               # Este archivo
```

## 🎯 Funcionalidades Detalladas

### Sistema de Cotización

- Cálculo automático de precios por distancia y tipo de paquete
- Soporte para diferentes tipos de envío (sobre, paquete pequeño, mediano, grande)
- Tarifas especiales para ruta CDMX-Puebla
- Estimación de tiempo de entrega

### Panel de Administración

- **Dashboard**: Métricas en tiempo real, gráficos de rendimiento
- **Gestión de Envíos**: CRUD completo, actualización de estados, asignación de repartidores
- **Gestión de Clientes**: Registro, edición, historial de envíos
- **Gestión de Repartidores**: Alta, baja, asignación por zonas, métricas de rendimiento
- **Reportes**: Análisis por períodos, exportación de datos, estadísticas detalladas

### Sistema de Seguimiento

- Números de guía únicos
- Estados de envío en tiempo real
- Historial completo de movimientos
- Notificaciones automáticas

## 🔐 Credenciales de Acceso

### Panel de Administración

- **Usuario**: `admin`
- **Contraseña**: `admin123`

_Nota: En producción, cambiar estas credenciales por unas seguras_

## 🧪 Testing y Desarrollo

### Archivos de Prueba Incluidos

- `test-funcionalidad.html` - Pruebas completas del sistema
- `test-navegacion.html` - Pruebas específicas de navegación
- `test-admin.js` - Pruebas del panel de administración

### Ejecutar Pruebas

1. Abre cualquier archivo `test-*.html` en tu navegador
2. Ejecuta las pruebas automáticas
3. Revisa los resultados en pantalla y consola

### Debug del Sistema

Funciones disponibles en la consola del navegador:

```javascript
debugAdmin(); // Debug completo del sistema
reinicializarAdmin(); // Reinicializar panel admin
testNavegacion("seccion"); // Probar navegación específica
verificarEventosNav(); // Verificar eventos de navegación
```

## 📊 Datos de Ejemplo

El sistema incluye datos de ejemplo para demostración:

- Envíos de muestra con diferentes estados
- Clientes de ejemplo
- Repartidores configurados
- Rutas CDMX-Puebla predefinidas

## 🔧 Configuración

### Google Maps API (Opcional)

Para habilitar el autocompletado de direcciones:

1. Obtén una API key de Google Maps
2. Edita `script.js` y reemplaza `YOUR_API_KEY`:
   ```javascript
   const GOOGLE_MAPS_API_KEY = "tu-api-key-aqui";
   ```

### Personalización

- **Colores**: Edita las variables CSS en `style.css` y `admin-style.css`
- **Logo**: Reemplaza las imágenes en la carpeta `img/`
- **Tarifas**: Modifica la función `calcularPrecio()` en `script.js`

## 🚀 Despliegue en Producción

### Preparación

1. **Configurar API de Google Maps** con tu propia key
2. **Cambiar credenciales** de administrador
3. **Configurar base de datos** (reemplazar localStorage)
4. **Configurar HTTPS** para seguridad

### Opciones de Hosting

- **GitHub Pages** (para demo)
- **Netlify** (recomendado para proyectos estáticos)
- **Vercel** (con funciones serverless)
- **Servidor tradicional** (Apache, Nginx)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/logistica-integral/issues)
- **Documentación**: Ver carpeta `docs/`
- **Email**: tu-email@ejemplo.com

## 🎉 Agradecimientos

- Diseño inspirado en las mejores prácticas de UX/UI
- Iconos de emojis para mejor experiencia visual
- Comunidad de desarrolladores por feedback y sugerencias

---

**¡Gracias por usar Logística Integral!** 🚚✨

_Desarrollado con ❤️ para facilitar la gestión de envíos y paquetería_
