#!/bin/bash

# Script de configuración rápida para Logística Integral
# Ejecuta: bash setup.sh

echo "🚚 Configurando Logística Integral..."
echo "=================================="

# Verificar si estamos en el directorio correcto
if [ ! -f "index.html" ]; then
    echo "❌ Error: No se encontró index.html. Asegúrate de estar en el directorio del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto verificado"

# Crear archivo de configuración si no existe
if [ ! -f "config.js" ]; then
    echo "📝 Creando archivo de configuración..."
    cp config.example.js config.js
    echo "✅ Archivo config.js creado desde config.example.js"
    echo "⚠️  Recuerda editar config.js con tus configuraciones específicas"
else
    echo "ℹ️  El archivo config.js ya existe"
fi

# Verificar estructura de directorios
echo "📁 Verificando estructura de directorios..."

directories=("img" "docs" "tests" ".github")
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ Directorio $dir existe"
    else
        echo "⚠️  Directorio $dir no encontrado"
    fi
done

# Verificar archivos principales
echo "📄 Verificando archivos principales..."

main_files=("index.html" "admin.html" "login.html" "script.js" "admin-script.js" "style.css" "admin-style.css")
for file in "${main_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file no encontrado"
    fi
done

# Verificar si Node.js está instalado (opcional)
if command -v node &> /dev/null; then
    echo "✅ Node.js está instalado ($(node --version))"
    
    # Instalar dependencias si existe package.json
    if [ -f "package.json" ]; then
        echo "📦 Instalando dependencias opcionales..."
        npm install
        echo "✅ Dependencias instaladas"
    fi
else
    echo "ℹ️  Node.js no está instalado (opcional para desarrollo)"
fi

# Verificar si Git está instalado
if command -v git &> /dev/null; then
    echo "✅ Git está instalado ($(git --version))"
    
    # Inicializar repositorio si no existe
    if [ ! -d ".git" ]; then
        echo "📝 Inicializando repositorio Git..."
        git init
        git add .
        git commit -m "Initial commit: Logística Integral v1.0.0"
        echo "✅ Repositorio Git inicializado"
    else
        echo "ℹ️  Repositorio Git ya existe"
    fi
else
    echo "⚠️  Git no está instalado"
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo "=========================="
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita config.js con tus configuraciones específicas"
echo "2. Si tienes una API key de Google Maps, agrégala en config.js"
echo "3. Para desarrollo local:"
echo "   - Opción 1: Abre index.html directamente en tu navegador"
echo "   - Opción 2: Ejecuta 'npm start' para servidor local"
echo "   - Opción 3: Usa tu servidor web preferido"
echo ""
echo "🧪 Para ejecutar pruebas:"
echo "   - Abre tests/test-funcionalidad.html en tu navegador"
echo ""
echo "📚 Para más información:"
echo "   - Lee README.md"
echo "   - Revisa docs/INSTRUCCIONES-PRUEBAS.md"
echo ""
echo "🚀 URLs de acceso (con servidor local en puerto 8000):"
echo "   - Página principal: http://localhost:8000/"
echo "   - Panel admin: http://localhost:8000/admin.html"
echo "   - Login: http://localhost:8000/login.html"
echo ""
echo "¡Disfruta usando Logística Integral! 🚚✨"