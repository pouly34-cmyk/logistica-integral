@echo off
REM Script de configuración rápida para Logística Integral (Windows)
REM Ejecuta: setup.bat

echo 🚚 Configurando Logística Integral...
echo ==================================

REM Verificar si estamos en el directorio correcto
if not exist "index.html" (
    echo ❌ Error: No se encontró index.html. Asegúrate de estar en el directorio del proyecto.
    pause
    exit /b 1
)

echo ✅ Directorio del proyecto verificado

REM Crear archivo de configuración si no existe
if not exist "config.js" (
    echo 📝 Creando archivo de configuración...
    copy "config.example.js" "config.js" >nul
    echo ✅ Archivo config.js creado desde config.example.js
    echo ⚠️  Recuerda editar config.js con tus configuraciones específicas
) else (
    echo ℹ️  El archivo config.js ya existe
)

REM Verificar estructura de directorios
echo 📁 Verificando estructura de directorios...

if exist "img" (echo ✅ Directorio img existe) else (echo ⚠️  Directorio img no encontrado)
if exist "docs" (echo ✅ Directorio docs existe) else (echo ⚠️  Directorio docs no encontrado)
if exist "tests" (echo ✅ Directorio tests existe) else (echo ⚠️  Directorio tests no encontrado)
if exist ".github" (echo ✅ Directorio .github existe) else (echo ⚠️  Directorio .github no encontrado)

REM Verificar archivos principales
echo 📄 Verificando archivos principales...

if exist "index.html" (echo ✅ index.html existe) else (echo ❌ index.html no encontrado)
if exist "admin.html" (echo ✅ admin.html existe) else (echo ❌ admin.html no encontrado)
if exist "login.html" (echo ✅ login.html existe) else (echo ❌ login.html no encontrado)
if exist "script.js" (echo ✅ script.js existe) else (echo ❌ script.js no encontrado)
if exist "admin-script.js" (echo ✅ admin-script.js existe) else (echo ❌ admin-script.js no encontrado)
if exist "style.css" (echo ✅ style.css existe) else (echo ❌ style.css no encontrado)
if exist "admin-style.css" (echo ✅ admin-style.css existe) else (echo ❌ admin-style.css no encontrado)

REM Verificar si Node.js está instalado (opcional)
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Node.js está instalado
    
    REM Instalar dependencias si existe package.json
    if exist "package.json" (
        echo 📦 Instalando dependencias opcionales...
        npm install
        echo ✅ Dependencias instaladas
    )
) else (
    echo ℹ️  Node.js no está instalado ^(opcional para desarrollo^)
)

REM Verificar si Git está instalado
git --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ Git está instalado
    
    REM Inicializar repositorio si no existe
    if not exist ".git" (
        echo 📝 Inicializando repositorio Git...
        git init
        git add .
        git commit -m "Initial commit: Logística Integral v1.0.0"
        echo ✅ Repositorio Git inicializado
    ) else (
        echo ℹ️  Repositorio Git ya existe
    )
) else (
    echo ⚠️  Git no está instalado
)

echo.
echo 🎉 ¡Configuración completada!
echo ==========================
echo.
echo 📋 Próximos pasos:
echo 1. Edita config.js con tus configuraciones específicas
echo 2. Si tienes una API key de Google Maps, agrégala en config.js
echo 3. Para desarrollo local:
echo    - Opción 1: Abre index.html directamente en tu navegador
echo    - Opción 2: Ejecuta 'npm start' para servidor local
echo    - Opción 3: Usa tu servidor web preferido
echo.
echo 🧪 Para ejecutar pruebas:
echo    - Abre tests/test-funcionalidad.html en tu navegador
echo.
echo 📚 Para más información:
echo    - Lee README.md
echo    - Revisa docs/INSTRUCCIONES-PRUEBAS.md
echo.
echo 🚀 URLs de acceso ^(con servidor local en puerto 8000^):
echo    - Página principal: http://localhost:8000/
echo    - Panel admin: http://localhost:8000/admin.html
echo    - Login: http://localhost:8000/login.html
echo.
echo ¡Disfruta usando Logística Integral! 🚚✨
echo.
pause