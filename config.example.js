// Archivo de configuración de ejemplo
// Copia este archivo como 'config.js' y personaliza los valores

const CONFIG = {
  // Configuración de Google Maps
  GOOGLE_MAPS: {
    API_KEY: "TU_API_KEY_AQUI", // Obtén tu API key en https://console.cloud.google.com/
    ENABLED: false, // Cambiar a true cuando tengas la API key
    FALLBACK_CITIES: [
      "Ciudad de México, CDMX",
      "Puebla, Puebla",
      "Guadalajara, Jalisco",
      "Monterrey, Nuevo León",
      "Tijuana, Baja California",
    ],
  },

  // Configuración de la aplicación
  APP: {
    NAME: "Logística Integral",
    VERSION: "1.0.0",
    DESCRIPTION: "Sistema de paquetería CDMX-Puebla",
    CONTACT_EMAIL: "contacto@logistica-integral.com",
    SUPPORT_PHONE: "+52 55 1234 5678",
  },

  // Configuración de precios
  PRICING: {
    BASE_PRICE: 65, // Precio base en MXN
    PRICE_PER_KM: 2.5, // Precio por kilómetro
    PACKAGE_MULTIPLIERS: {
      sobre: 1.0,
      pequeno: 1.2,
      mediano: 1.5,
      grande: 2.0,
    },
    SERVICE_MULTIPLIERS: {
      normal: 1.0,
      express: 1.5,
      overnight: 2.0,
    },
    SPECIAL_ROUTES: {
      "cdmx-puebla": {
        base_price: 85,
        express_multiplier: 1.3,
      },
    },
  },

  // Configuración de administración
  ADMIN: {
    DEFAULT_USERNAME: "admin",
    DEFAULT_PASSWORD: "admin123", // CAMBIAR EN PRODUCCIÓN
    SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
    MAX_LOGIN_ATTEMPTS: 3,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutos
  },

  // Configuración de reportes
  REPORTS: {
    DEFAULT_PERIOD: "mes",
    EXPORT_FORMATS: ["json", "csv"], // Formatos disponibles para exportar
    MAX_RECORDS_PER_EXPORT: 10000,
    CHART_COLORS: {
      primary: "#3498db",
      secondary: "#2ecc71",
      warning: "#f39c12",
      danger: "#e74c3c",
    },
  },

  // Configuración de notificaciones
  NOTIFICATIONS: {
    ENABLED: true,
    AUTO_HIDE_DELAY: 5000, // 5 segundos
    TYPES: {
      success: { icon: "✅", color: "#2ecc71" },
      error: { icon: "❌", color: "#e74c3c" },
      warning: { icon: "⚠️", color: "#f39c12" },
      info: { icon: "ℹ️", color: "#3498db" },
    },
  },

  // Configuración de desarrollo
  DEVELOPMENT: {
    DEBUG_MODE: true, // Cambiar a false en producción
    CONSOLE_LOGS: true,
    MOCK_DATA: true, // Usar datos de ejemplo
    API_DELAY: 500, // Simular delay de API en milisegundos
  },

  // URLs y endpoints (para futuras integraciones)
  API: {
    BASE_URL: "https://api.logistica-integral.com",
    ENDPOINTS: {
      shipments: "/api/v1/shipments",
      clients: "/api/v1/clients",
      drivers: "/api/v1/drivers",
      reports: "/api/v1/reports",
      auth: "/api/v1/auth",
    },
  },

  // Configuración de almacenamiento
  STORAGE: {
    PREFIX: "logistica_", // Prefijo para keys de localStorage
    KEYS: {
      shipments: "enviosLogistica",
      clients: "clientesData",
      drivers: "repartidoresData",
      admin_user: "adminUser",
      admin_session: "adminSession",
    },
  },
};

// Exportar configuración (para uso futuro con módulos)
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}

// Hacer disponible globalmente
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
