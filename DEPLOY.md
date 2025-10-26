# 🚀 Guía de Despliegue a GitHub

Esta guía te ayudará a subir tu proyecto **Logística Integral** a GitHub y configurar GitHub Pages para tener una demo en vivo.

## 📋 Preparación Previa

### ✅ Archivos Listos para GitHub

Tu proyecto ya está preparado con:

- ✅ **README.md** - Documentación completa del proyecto
- ✅ **.gitignore** - Archivos que Git debe ignorar
- ✅ **LICENSE** - Licencia MIT del proyecto
- ✅ **package.json** - Configuración del proyecto
- ✅ **CHANGELOG.md** - Historial de cambios
- ✅ **CONTRIBUTING.md** - Guía para contribuidores
- ✅ **.github/workflows/** - Configuración de CI/CD
- ✅ **setup.sh / setup.bat** - Scripts de instalación
- ✅ **Estructura organizada** - Archivos en carpetas apropiadas

## 🔧 Pasos para Subir a GitHub

### 1. Crear Repositorio en GitHub

1. **Ve a [GitHub.com](https://github.com)**
2. **Haz clic en "New repository"** (botón verde)
3. **Configura el repositorio:**

   - **Repository name:** `logistica-integral`
   - **Description:** `Sistema web completo para gestión de envíos y paquetería CDMX-Puebla`
   - **Visibility:** Public (para GitHub Pages gratuito)
   - **NO marques** "Add a README file" (ya tienes uno)
   - **NO marques** "Add .gitignore" (ya tienes uno)
   - **NO marques** "Choose a license" (ya tienes uno)

4. **Haz clic en "Create repository"**

### 2. Subir tu Código

#### Opción A: Usando Git desde la Terminal

```bash
# 1. Inicializar Git (si no lo has hecho)
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "Initial commit: Logística Integral v1.0.0"

# 4. Agregar el repositorio remoto (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/logistica-integral.git

# 5. Subir el código
git branch -M main
git push -u origin main
```

#### Opción B: Usando GitHub Desktop

1. **Descarga [GitHub Desktop](https://desktop.github.com/)**
2. **Abre GitHub Desktop**
3. **File > Add Local Repository**
4. **Selecciona tu carpeta del proyecto**
5. **Publish repository** y conecta con tu repositorio de GitHub

#### Opción C: Subir Archivos Directamente

1. **En tu repositorio de GitHub, haz clic en "uploading an existing file"**
2. **Arrastra todos los archivos** (excepto carpetas como .git, node_modules)
3. **Escribe un commit message:** "Initial commit: Logística Integral v1.0.0"
4. **Haz clic en "Commit changes"**

### 3. Configurar GitHub Pages

1. **Ve a tu repositorio en GitHub**
2. **Haz clic en "Settings"** (pestaña)
3. **Scroll down hasta "Pages"** (en el menú lateral)
4. **En "Source", selecciona:**
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** / (root)
5. **Haz clic en "Save"**

### 4. Verificar el Despliegue

- **GitHub Pages URL:** `https://TU-USUARIO.github.io/logistica-integral/`
- **El despliegue toma 5-10 minutos** la primera vez
- **Recibirás un email** cuando esté listo

## 🔗 URLs de tu Proyecto

Una vez desplegado, tendrás:

- **🏠 Página Principal:** `https://TU-USUARIO.github.io/logistica-integral/`
- **👨‍💼 Panel Admin:** `https://TU-USUARIO.github.io/logistica-integral/admin.html`
- **🔐 Login:** `https://TU-USUARIO.github.io/logistica-integral/login.html`

## ⚙️ Configuraciones Adicionales

### Personalizar el README

Edita `README.md` y reemplaza:

- `tu-usuario` → tu nombre de usuario de GitHub
- `tu-email@ejemplo.com` → tu email real
- `https://tu-sitio-web.com` → tu sitio web (opcional)

### Configurar Google Maps (Opcional)

1. **Obtén una API Key** en [Google Cloud Console](https://console.cloud.google.com/)
2. **Crea `config.js`** desde `config.example.js`
3. **Agrega tu API Key** en el archivo `config.js`
4. **Commit y push** los cambios

### Configurar Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. **En Settings > Pages**
2. **En "Custom domain"** escribe tu dominio
3. **Configura DNS** en tu proveedor de dominio:
   ```
   CNAME: www.tu-dominio.com → TU-USUARIO.github.io
   ```

## 🧪 Verificar que Todo Funciona

### Checklist Post-Despliegue

- [ ] **Página principal carga** sin errores
- [ ] **Panel admin es accesible** (admin.html)
- [ ] **Login funciona** con credenciales admin/admin123
- [ ] **Navegación funciona** entre secciones
- [ ] **Cotización funciona** en la página principal
- [ ] **Imágenes se cargan** correctamente
- [ ] **Estilos se aplican** correctamente
- [ ] **No hay errores** en la consola del navegador

### Si Algo No Funciona

1. **Revisa la consola** del navegador (F12)
2. **Verifica que todos los archivos** se subieron correctamente
3. **Espera 10-15 minutos** para que GitHub Pages se actualice
4. **Revisa GitHub Actions** en la pestaña "Actions" de tu repositorio

## 📈 Próximos Pasos

### Mejoras Recomendadas

1. **Configurar Google Analytics** para estadísticas
2. **Agregar Google Maps API** para mejor experiencia
3. **Configurar un dominio personalizado**
4. **Agregar más pruebas automatizadas**
5. **Configurar notificaciones por email**

### Mantener el Proyecto

```bash
# Para futuras actualizaciones
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### Colaboración

- **Invita colaboradores** en Settings > Manage access
- **Configura branch protection** para el branch main
- **Revisa Pull Requests** antes de hacer merge

## 🆘 Solución de Problemas

### Error: "Repository not found"

- Verifica que el nombre del repositorio sea correcto
- Asegúrate de tener permisos de escritura

### Error: "GitHub Pages build failed"

- Revisa que no haya errores de sintaxis en HTML/CSS/JS
- Verifica que todos los archivos referenciados existen

### Error: "Site not loading"

- Espera 10-15 minutos después del primer despliegue
- Verifica la configuración de GitHub Pages
- Revisa la pestaña "Actions" para ver el estado del build

### Archivos no se actualizan

- Haz "hard refresh" (Ctrl+F5 o Cmd+Shift+R)
- Verifica que los cambios se hayan subido a GitHub
- Espera unos minutos para que GitHub Pages se actualice

## 📞 Soporte

- **GitHub Issues:** Para reportar problemas
- **GitHub Discussions:** Para preguntas generales
- **Documentación:** Lee README.md y CONTRIBUTING.md

---

**¡Felicidades! Tu proyecto ya está en GitHub y disponible para el mundo! 🎉**

Comparte tu URL: `https://TU-USUARIO.github.io/logistica-integral/`
