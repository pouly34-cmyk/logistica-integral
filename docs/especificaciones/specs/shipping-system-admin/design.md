# Documento de Diseño

## Resumen

El sistema de paquetería es una aplicación basada en web construida con HTML, CSS y JavaScript vanilla que proporciona servicios integrales de entrega de paquetes. El sistema consiste en una interfaz orientada al cliente para cotizaciones y pagos, y un panel administrativo para la gestión de envíos. La arquitectura enfatiza la confiabilidad, experiencia del usuario y mantenibilidad.

## Arquitectura

### Componentes del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Interfaz       │    │   Panel de      │    │  APIs Externas  │
│  Cliente        │    │   Administración│    │                 │
│ • Cotización    │    │ • Dashboard     │    │ • Google Maps   │
│ • Pago          │    │ • Envíos        │    │ • Procesadores  │
│ • Seguimiento   │    │ • Reportes      │    │   de Pago       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Servicios Base  │
                    │                 │
                    │ • Almacenamiento│
                    │ • Lógica de     │
                    │   Negocio       │
                    │ • Validación    │
                    └─────────────────┘
```

### Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Almacenamiento**: LocalStorage para persistencia de datos del cliente
- **APIs Externas**: Google Maps Places API, Pasarelas de pago
- **Servidor**: Servicio de archivos estáticos (desarrollo: servidor HTTP Python)

## Components and Interfaces

### 1. Customer Interface (index.html)

**Purpose**: Main customer-facing interface for package shipping services

**Key Components**:

- Address input with Google Maps autocomplete
- Package details form (size, weight, type)
- Real-time quotation calculator
- Payment processing modal
- Tracking number lookup

**Interface Design**:

```javascript
// Main quotation interface
class QuotationService {
    calculateQuote(origin, destination, packageDetails)
    validateAddresses(addresses)
    applyPricingRules(route, packageType)
}

// Payment processing
class PaymentProcessor {
    processPayment(paymentMethod, amount, details)
    generateTrackingNumber()
    createReceipt(transactionData)
}
```

### 2. Admin Panel (admin.html)

**Purpose**: Administrative interface for shipment management and system oversight

**Key Components**:

- Authentication system with secure login
- Dashboard with metrics and recent activity
- Shipment management (CRUD operations)
- Delivery personnel management
- Status update interface
- Reporting and analytics

**Interface Design**:

```javascript
// Admin authentication
class AuthenticationManager {
    login(username, password)
    validateSession()
    logout()
}

// Shipment management
class ShipmentManager {
    getAllShipments()
    updateShipmentStatus(id, status)
    searchShipments(criteria)
    generateReports(dateRange)
}

// Delivery personnel management
class DeliveryPersonnelManager {
    addDeliveryPerson(personnelData)
    getAllDeliveryPersonnel()
    updateDeliveryPerson(id, updates)
    deactivateDeliveryPerson(id)
    assignShipmentToDeliveryPerson(shipmentId, personnelId)
    getDeliveryPersonnelPerformance(id)
}
```

### 3. Core Services Layer

**Data Management**:

```javascript
// Local storage wrapper for data persistence
class DataService {
    saveShipment(shipmentData)
    getShipments(filters)
    updateShipment(id, updates)
    deleteShipment(id)
}

// Business logic for pricing and validation
class BusinessLogic {
    calculateShippingCost(route, package)
    validatePackageDetails(details)
    determineDeliveryTime(route, serviceType)
}
```

## Data Models

### Shipment Model

```javascript
{
    id: "unique_tracking_number",
    customer: {
        name: "string",
        email: "string",
        phone: "string"
    },
    origin: {
        address: "string",
        coordinates: { lat: number, lng: number },
        city: "string",
        state: "string"
    },
    destination: {
        address: "string",
        coordinates: { lat: number, lng: number },
        city: "string",
        state: "string"
    },
    package: {
        type: "envelope|small|medium|large",
        weight: number,
        dimensions: { length: number, width: number, height: number },
        value: number,
        description: "string"
    },
    service: {
        type: "standard|express|overnight",
        cost: number,
        estimatedDelivery: "ISO_date_string"
    },
    payment: {
        method: "card|transfer|cash",
        status: "pending|completed|failed",
        transactionId: "string",
        amount: number
    },
    status: "created|picked_up|in_transit|out_for_delivery|delivered|cancelled",
    timestamps: {
        created: "ISO_date_string",
        updated: "ISO_date_string",
        delivered: "ISO_date_string"
    },
    tracking: [
        {
            status: "string",
            location: "string",
            timestamp: "ISO_date_string",
            notes: "string"
        }
    ]
}
```

### User Session Model

```javascript
{
    userId: "string",
    username: "string",
    role: "admin|operator|delivery_person",
    loginTime: "ISO_date_string",
    lastActivity: "ISO_date_string",
    permissions: ["view_shipments", "edit_shipments", "manage_users", "manage_delivery_personnel"]
}
```

### Delivery Personnel Model

```javascript
{
    id: "unique_personnel_id",
    personalInfo: {
        name: "string",
        lastName: "string",
        phone: "string",
        email: "string",
        address: "string",
        emergencyContact: {
            name: "string",
            phone: "string",
            relationship: "string"
        }
    },
    workInfo: {
        employeeId: "string",
        startDate: "ISO_date_string",
        status: "active|inactive|suspended",
        coverageZones: ["string"], // Array of zone names/codes
        vehicleType: "motorcycle|bicycle|car|van",
        vehicleDetails: {
            brand: "string",
            model: "string",
            year: number,
            licensePlate: "string",
            color: "string"
        }
    },
    credentials: {
        username: "string",
        password: "hashed_string", // In production, properly hashed
        lastLogin: "ISO_date_string"
    },
    performance: {
        totalDeliveries: number,
        completedDeliveries: number,
        averageRating: number,
        onTimeDeliveryRate: number,
        currentAssignedShipments: ["shipment_id"]
    },
    timestamps: {
        created: "ISO_date_string",
        updated: "ISO_date_string",
        lastActive: "ISO_date_string"
    }
}
```

## Error Handling

### JavaScript Error Prevention

1. **Strict Input Validation**: All user inputs validated before processing
2. **Null/Undefined Checks**: Defensive programming with proper null checks
3. **Try-Catch Blocks**: Wrap all external API calls and data operations
4. **Event Listener Management**: Proper cleanup and prevention of duplicate listeners
5. **Async Operation Handling**: Proper promise handling and error propagation

### Error Recovery Strategies

```javascript
// Example error handling pattern
class ErrorHandler {
  static handleAPIError(error, fallbackAction) {
    console.error("API Error:", error);
    if (fallbackAction) {
      return fallbackAction();
    }
    this.showUserFriendlyMessage(error);
  }

  static showUserFriendlyMessage(error) {
    // Display user-friendly error messages
    // Log technical details for debugging
  }
}
```

### Admin Panel Stability

1. **Session Management**: Automatic session validation and renewal
2. **Data Synchronization**: Prevent data conflicts with proper state management
3. **UI State Management**: Maintain consistent UI state across operations
4. **Network Resilience**: Handle offline scenarios and connection issues

## Testing Strategy

### Unit Testing Approach

- **Core Functions**: Test quotation calculations, validation logic, data transformations
- **API Integration**: Mock external services for reliable testing
- **Error Scenarios**: Test error handling and edge cases
- **Data Persistence**: Verify localStorage operations and data integrity

### Integration Testing

- **End-to-End Workflows**: Complete customer journey from quote to payment
- **Admin Operations**: Full admin workflow testing (login, manage shipments, reports)
- **Cross-Browser Compatibility**: Ensure functionality across target browsers
- **Performance Testing**: Validate response times and resource usage

### Manual Testing Checklist

1. Customer quote generation with various addresses
2. Payment processing with different methods
3. Admin login and session management
4. Shipment status updates and tracking
5. Error scenarios and recovery
6. Mobile responsiveness and accessibility

## Security Considerations

### Authentication Security

- Password hashing (client-side basic validation, server-side security in production)
- Session timeout management
- Brute force protection (rate limiting)

### Data Protection

- Input sanitization to prevent XSS
- Secure data transmission (HTTPS in production)
- Sensitive data encryption in storage
- PCI compliance for payment processing

### Admin Panel Security

- Role-based access control
- Audit logging for all administrative actions
- Secure session management
- Protection against CSRF attacks

## Performance Optimization

### Frontend Performance

- Lazy loading of non-critical components
- Efficient DOM manipulation
- Optimized CSS and JavaScript bundling
- Image optimization and caching

### Data Management

- Efficient localStorage usage
- Data pagination for large datasets
- Caching strategies for frequently accessed data
- Optimized search and filtering algorithms

## Deployment Architecture

### Development Environment

- Local HTTP server for testing
- File-based development workflow
- Browser developer tools integration
- Hot reload for rapid development

### Production Considerations

- CDN for static asset delivery
- Database migration from localStorage
- API gateway for external service integration
- Monitoring and logging infrastructure
