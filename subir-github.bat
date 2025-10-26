@echo off
echo 🚀 Script para subir Logística Integral a GitHub
echo ===============================================
echo.

REM Verificar que Git esté configurado
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git no está configurado. Ejecutando configuración...
    set /p email="Ingresa tu email de GitHub: "
    set /p name="Ingresa tu nombre: "
    git config --global user.email "%email%"
    git config --global user.name "%name%"
    echo ✅ Git configurado correctamente
    echo.
)

REM Mostrar estado actual
echo 📋 Estado actual del repositorio:
git status
echo.

REM Solicitar URL del repositorio
echo 📝 Necesito la URL de tu repositorio de GitHub
echo Ejemplo: https://github.com/tu-usuario/logistica-integral.git
echo.
set /p repo_url="Pega aquí la URL de tu repositorio: "

if "%repo_url%"=="" (
    echo ❌ No ingresaste una URL. Saliendo...
    pause
    exit /b 1
)

echo.
echo 🔗 Conectando con el repositorio: %repo_url%

REM Remover origin si existe
git remote remove origin >nul 2>&1

REM Agregar nuevo origin
git remote add origin %repo_url%
if %errorlevel% neq 0 (
    echo ❌ Error agregando el repositorio remoto
    pause
    exit /b 1
)

echo ✅ Repositorio remoto agregado correctamente
echo.

REM Subir el código
echo 📤 Subiendo código a GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ❌ Error subiendo el código
    echo.
    echo 💡 Posibles soluciones:
    echo 1. Verifica que la URL del repositorio sea correcta
    echo 2. Asegúrate de tener permisos de escritura
    echo 3. Verifica tu conexión a internet
    echo 4. Si tienes 2FA, necesitarás un Personal Access Token
    echo.
    pause
    exit /b 1
)

echo.
echo 🎉 ¡Código subido exitosamente a GitHub!
echo =======================================
echo.
echo 📋 Próximos pasos:
echo 1. Ve a tu repositorio en GitHub
echo 2. Configura GitHub Pages en Settings ^> Pages
echo 3. Selecciona "Deploy from branch" ^> "main" ^> "/ (root)"
echo 4. Espera 5-10 minutos para que se active
echo.
echo 🌐 URLs de tu proyecto:
echo - Repositorio: %repo_url%
echo - Demo (cuando esté activo): https://tu-usuario.github.io/logistica-integral/
echo.
echo ¡Felicidades! Tu proyecto ya está en GitHub 🎉
pause