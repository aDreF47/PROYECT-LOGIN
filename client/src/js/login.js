document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const recoverForm = document.getElementById('recover-form');
    const messageContainer = document.getElementById('message-container');
    const forgotLink = document.getElementById('forgot-password-link');
    const cancelRecover = document.getElementById('cancel-recover');

    const MAX_LOGIN_ATTEMPTS = 3; 
    const LOCKOUT_DURATION = 10 * 1000;

    // === Función para Gestionar Intentos de Inicio de Sesión ===
    function handleLoginAttempt(username) {
        // Obtener intentos previos del localStorage
        const loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');

        // Inicializar intentos para este usuario si no existen
        if (!loginAttempts[username]) {
            loginAttempts[username] = {
                attempts: 0,
                lastAttempt: 0,
                lockedUntil: 0
            };
        }

        const userAttempts = loginAttempts[username];
        const now = Date.now();

        // Verificar si el usuario está bloqueado
        if (userAttempts.lockedUntil > now) {
            const minutesRemaining = Math.ceil((userAttempts.lockedUntil - now) / 60000);
            showMessage(`Cuenta bloqueada. Intente nuevamente en ${minutesRemaining} minutos.`, 'error');
            return false;
        }

        // Resetear intentos si han pasado más de 15 minutos
        if (now - userAttempts.lastAttempt > LOCKOUT_DURATION) {
            userAttempts.attempts = 0;
        }

        // Incrementar intentos
        userAttempts.attempts++;
        userAttempts.lastAttempt = now;

        // Bloquear si se superan los intentos máximos
        if (userAttempts.attempts >= MAX_LOGIN_ATTEMPTS) {
            userAttempts.lockedUntil = now + LOCKOUT_DURATION;
            showMessage(`Demasiados intentos fallidos. Cuenta bloqueada por ${LOCKOUT_DURATION/1000} .`, 'error');
            
            // Llamar a una API para bloquear el usuario en el backend
            blockUserOnServer(username);
            
            localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
            return false;
        }

        // Guardar intentos
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
        return true;
    }

    // === Función para Bloquear Usuario en el Servidor ===
    function blockUserOnServer(username) {
        fetch('../../../server/app.php?route=block-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login: username })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                console.error('No se pudo bloquear el usuario en el servidor');
            }
        })
        .catch(err => {
            console.error('Error al bloquear usuario:', err);
        });
    }

    // === Login ===
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Verificar intentos antes de intentar iniciar sesión
            if (!handleLoginAttempt(username)) {
                return;
            }

            fetch('../../../server/app.php?route=login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: username, password: password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Reiniciar intentos en caso de inicio de sesión exitoso
                    const loginAttempts = JSON.parse(localStorage.getItem('loginAttempts') || '{}');
                    if (loginAttempts[username]) {
                        loginAttempts[username].attempts = 0;
                        loginAttempts[username].lockedUntil = 0;
                        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
                    }

                    localStorage.setItem('currentUser', username);
                    showMessage('Login exitoso. Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = 'Profile.html';
                    }, 1000);
                } else {
                    showMessage(data.message, 'error');
                }
            })
            .catch(err => {
                showMessage('Error de conexión', 'error');
                console.error(err);
            });
        });
    }

    // === Registro ===
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('register-name').value;
            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value

            // Validar que las contraseñas coincidan
            if (password !== confirmPassword) {
                showMessage('Las contraseñas no coinciden', 'error');
                return;
            }

            // Añadir fecha y hora de finalización (un año desde hoy, por ejemplo)
            const today = new Date();
            const expiryDate = new Date(today);
            expiryDate.setFullYear(today.getFullYear() + 1); // Un año desde hoy

            const dateEnd = expiryDate.getFullYear() +
                            ('0' + (expiryDate.getMonth() + 1)).slice(-2) +
                            ('0' + expiryDate.getDate()).slice(-2);
            const timeEnd = '235959'; // 23:59:59
            
            fetch('../../../server/app.php?route=register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    UsrName: name,
                    UsrLogin: username,
                    UsrPassword: password,
                    UsrDateEnd: dateEnd,
                    UsrTimeEnd: timeEnd
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showMessage('Registro exitoso. Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = 'Login.html';
                    }, 1500);
                } else showMessage(data.message, 'error');
            })
            .catch(err => {
                showMessage('Error de conexión', 'error');
                console.error(err);
            });
        });
    }

    // === Recuperación de contraseña ===
    if (forgotLink && recoverForm && loginForm) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginForm.style.display = 'none';
            recoverForm.style.display = 'block';
            clearMessages();
        });
    }

    if (cancelRecover && recoverForm && loginForm) {
        cancelRecover.addEventListener('click', () => {
            recoverForm.style.display = 'none';
            loginForm.style.display = 'block';
            clearMessages();
        });
    }

    if (recoverForm) {
        recoverForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('recover-username').value;

            fetch('../../../server/app.php?route=recover-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: username })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Crear un nuevo div para mostrar la contraseña
                    const passwordDisplay = document.createElement('div');
                    passwordDisplay.innerHTML = `
                        <div class="recovered-password">
                            <strong>Contraseña recuperada:</strong> 
                            <span id="recovered-password-text">${data.password}</span>
                            <button type="button" id="copy-password-btn" style="margin-left: 10px;">Copiar</button>
                        </div>
                    `;
                    
                    // Limpiar mensajes anteriores y agregar nueva contraseña
                    messageContainer.innerHTML = '';
                    messageContainer.appendChild(passwordDisplay);

                    // Agregar funcionalidad de copiar
                    const copyBtn = document.getElementById('copy-password-btn');
                    const passwordText = document.getElementById('recovered-password-text');
                    
                    copyBtn.addEventListener('click', () => {
                        // Copiar al portapapeles
                        navigator.clipboard.writeText(passwordText.textContent).then(() => {
                            copyBtn.textContent = '¡Copiado!';
                            copyBtn.style.backgroundColor = '#28a745';
                            copyBtn.style.color = 'white';
                            
                            // Restaurar botón después de 2 segundos
                            setTimeout(() => {
                                copyBtn.textContent = 'Copiar';
                                copyBtn.style.backgroundColor = '';
                                copyBtn.style.color = '';
                            }, 2000);
                        }).catch(err => {
                            console.error('Error al copiar:', err);
                        });
                    });
                } else {
                    // Mostrar mensaje de error
                    messageContainer.innerHTML = `
                        <div class="message error">${data.message}</div>
                    `;
                }
            })
            .catch(err => {
                showMessage('Error al intentar recuperar contraseña', 'error');
                console.error(err);
            });
        });
    }

    // === Funciones utilitarias ===
    function showMessage(text, type) {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="message ${type}">${text}</div>`;
        }
    }

    function clearMessages() {
        if (messageContainer) {
            messageContainer.innerHTML = '';
        }
    }
});