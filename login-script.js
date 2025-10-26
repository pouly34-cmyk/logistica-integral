// Sistema de Login para Panel de Administración

document.addEventListener("DOMContentLoaded", function () {
  // Verificar si ya está logueado
  const user = localStorage.getItem("adminUser");
  if (user) {
    window.location.href = "admin.html";
    return;
  }

  // Inicializar formulario de login
  initLoginForm();
});

function initLoginForm() {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validar credenciales (en producción esto sería con un servidor)
    const validUser = validateCredentials(username, password);
    if (validUser) {
      // Crear sesión de usuario
      const userData = {
        username: username,
        name: validUser.name,
        loginTime: new Date().toISOString(),
        role: validUser.role,
      };

      localStorage.setItem("adminUser", JSON.stringify(userData));

      // Mostrar mensaje de éxito
      showLoginSuccess();

      // Redirigir al panel
      setTimeout(() => {
        window.location.href = "admin.html";
      }, 1000);
    } else {
      // Mostrar error
      showError("Usuario o contraseña incorrectos");
    }
  });
}

function validateCredentials(username, password) {
  // Usuarios predefinidos (en producción esto sería una API)
  const validUsers = {
    admin: {
      password: "admin123",
      name: "Administrador",
      role: "admin",
    },
    supervisor: {
      password: "super123",
      name: "Supervisor",
      role: "supervisor",
    },
    operador: {
      password: "oper123",
      name: "Operador",
      role: "operador",
    },
  };

  const user = validUsers[username];
  return user && user.password === password ? user : false;
}

function getUserName(username) {
  const users = {
    admin: "Administrador",
    supervisor: "Supervisor",
    operador: "Operador",
  };
  return users[username] || username;
}

function getUserRole(username) {
  const roles = {
    admin: "admin",
    supervisor: "supervisor",
    operador: "operador",
  };
  return roles[username] || "operador";
}

function showError(message) {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = message;
  errorDiv.style.display = "block";

  // Ocultar después de 5 segundos
  setTimeout(() => {
    errorDiv.style.display = "none";
  }, 5000);
}

function showLoginSuccess() {
  const errorDiv = document.getElementById("errorMessage");
  errorDiv.textContent = "¡Login exitoso! Redirigiendo...";
  errorDiv.style.display = "block";
  errorDiv.style.backgroundColor = "#27ae60";
  errorDiv.style.color = "white";
}

// Mostrar/ocultar contraseña
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "👁️";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "👁️‍🗨️";
  }
}
