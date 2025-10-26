# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Logística Integral! Esta guía te ayudará a entender cómo puedes participar en el desarrollo del proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

Este proyecto adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

### Nuestros Estándares

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas de manera elegante
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

## 🚀 ¿Cómo puedo contribuir?

### Reportar Bugs 🐛

Los bugs se rastrean como [GitHub Issues](https://github.com/tu-usuario/logistica-integral/issues). Cuando reportes un bug:

1. **Usa un título claro y descriptivo**
2. **Describe los pasos exactos para reproducir el problema**
3. **Describe el comportamiento que observaste**
4. **Explica qué comportamiento esperabas ver**
5. **Incluye capturas de pantalla si es posible**
6. **Menciona tu navegador y versión**

### Sugerir Mejoras ✨

Las mejoras también se rastrean como [GitHub Issues](https://github.com/tu-usuario/logistica-integral/issues). Cuando sugieras una mejora:

1. **Usa un título claro y descriptivo**
2. **Proporciona una descripción detallada de la mejora sugerida**
3. **Explica por qué esta mejora sería útil**
4. **Incluye ejemplos específicos si es posible**

### Contribuir con Código 💻

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios
4. Ejecuta las pruebas
5. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
6. Push a la rama (`git push origin feature/nueva-funcionalidad`)
7. Abre un Pull Request

## ⚙️ Configuración del Entorno

### Requisitos

- Navegador web moderno
- Editor de código (recomendado: VS Code)
- Git
- Servidor web local (opcional)

### Instalación

1. **Clona tu fork:**

   ```bash
   git clone https://github.com/tu-usuario/logistica-integral.git
   cd logistica-integral
   ```

2. **Configura el repositorio original como upstream:**

   ```bash
   git remote add upstream https://github.com/usuario-original/logistica-integral.git
   ```

3. **Abre el proyecto:**
   - Directamente en el navegador abriendo `index.html`
   - O usando un servidor local

### Configuración Recomendada de VS Code

Extensiones útiles:

- Live Server
- Prettier - Code formatter
- ESLint
- HTML CSS Support
- Auto Rename Tag

## 🔄 Proceso de Desarrollo

### Flujo de Trabajo

1. **Sincroniza tu fork:**

   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

2. **Crea una nueva rama:**

   ```bash
   git checkout -b feature/nombre-descriptivo
   ```

3. **Desarrolla tu feature:**

   - Escribe código limpio y bien documentado
   - Sigue los estándares de código del proyecto
   - Agrega pruebas si es necesario

4. **Prueba tus cambios:**

   - Ejecuta las pruebas existentes
   - Prueba manualmente en diferentes navegadores
   - Verifica que no hayas roto funcionalidades existentes

5. **Commit tus cambios:**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad de X"
   ```

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato (espacios, comas, etc.)
- `refactor:` refactorización de código
- `test:` agregar o modificar pruebas
- `chore:` tareas de mantenimiento

Ejemplos:

```bash
git commit -m "feat: agregar sistema de notificaciones push"
git commit -m "fix: corregir cálculo de precios en envíos express"
git commit -m "docs: actualizar README con nuevas instrucciones"
```

## 📏 Estándares de Código

### JavaScript

- Usar `const` y `let` en lugar de `var`
- Usar nombres descriptivos para variables y funciones
- Comentar código complejo
- Mantener funciones pequeñas y enfocadas
- Usar camelCase para variables y funciones
- Usar PascalCase para clases

```javascript
// ✅ Bueno
const calculateShippingCost = (origin, destination, packageType) => {
  // Lógica de cálculo aquí
  return cost;
};

// ❌ Malo
var calc = function (o, d, t) {
  return o + d * t;
};
```

### CSS

- Usar nombres de clase descriptivos
- Seguir metodología BEM cuando sea apropiado
- Agrupar propiedades relacionadas
- Usar variables CSS para colores y espaciado

```css
/* ✅ Bueno */
.shipping-form__input {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

/* ❌ Malo */
.inp {
  padding: 12px;
  border: 1px solid #ccc;
}
```

### HTML

- Usar HTML5 semántico
- Incluir atributos `alt` en imágenes
- Usar etiquetas apropiadas (`button`, `nav`, `main`, etc.)
- Mantener indentación consistente

## 🔍 Proceso de Pull Request

### Antes de Enviar

1. **Asegúrate de que tu código funciona:**

   - Prueba en múltiples navegadores
   - Ejecuta las pruebas automatizadas
   - Verifica que no hay errores en la consola

2. **Revisa tu código:**

   - Elimina código comentado innecesario
   - Verifica que no hay console.log olvidados
   - Asegúrate de que el código está bien formateado

3. **Actualiza la documentación:**
   - Actualiza README.md si es necesario
   - Agrega comentarios en código complejo
   - Actualiza CHANGELOG.md

### Descripción del Pull Request

Incluye en tu PR:

- **Descripción clara** de los cambios realizados
- **Motivación** para los cambios
- **Capturas de pantalla** si hay cambios visuales
- **Lista de verificación** de lo que se ha probado
- **Issues relacionados** (si los hay)

Ejemplo de template:

```markdown
## Descripción

Breve descripción de los cambios realizados.

## Motivación y Contexto

¿Por qué es necesario este cambio? ¿Qué problema resuelve?

## ¿Cómo se ha probado?

- [ ] Pruebas en Chrome
- [ ] Pruebas en Firefox
- [ ] Pruebas en dispositivos móviles
- [ ] Pruebas automatizadas

## Capturas de pantalla (si aplica)

## Tipos de cambios

- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que podría romper funcionalidad existente)
- [ ] Documentación

## Checklist

- [ ] Mi código sigue el estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, especialmente en áreas difíciles de entender
- [ ] He realizado los cambios correspondientes en la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado pruebas que demuestran que mi fix es efectivo o que mi feature funciona
```

## 🧪 Pruebas

### Ejecutar Pruebas

1. **Pruebas automatizadas:**

   - Abre `tests/test-funcionalidad.html`
   - Ejecuta todas las pruebas
   - Verifica que todas pasen

2. **Pruebas manuales:**
   - Prueba la funcionalidad en diferentes navegadores
   - Verifica responsive design en móviles
   - Prueba casos edge y escenarios de error

### Agregar Nuevas Pruebas

Si agregas nueva funcionalidad, considera agregar pruebas:

```javascript
// Ejemplo de prueba
function testNuevaFuncionalidad() {
  console.log("🧪 Probando nueva funcionalidad...");

  try {
    const resultado = nuevaFuncion("parametro");
    if (resultado === "esperado") {
      console.log("✅ Prueba pasó");
      return true;
    } else {
      console.log("❌ Prueba falló");
      return false;
    }
  } catch (error) {
    console.error("❌ Error en prueba:", error);
    return false;
  }
}
```

## 📞 ¿Necesitas Ayuda?

- **Issues:** [GitHub Issues](https://github.com/tu-usuario/logistica-integral/issues)
- **Discusiones:** [GitHub Discussions](https://github.com/tu-usuario/logistica-integral/discussions)
- **Email:** contribuciones@logistica-integral.com

## 🎉 Reconocimientos

Todos los contribuidores serán reconocidos en el README del proyecto. ¡Gracias por hacer que Logística Integral sea mejor!

---

**¡Gracias por contribuir!** 🚀
