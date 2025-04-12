# Actividad Grupal Nº1 – Desarrollo de Sistemas Web

## 📌 Objetivo

Desarrollar una aplicación web en PHP denominada `Login.php`, que permita controlar el acceso de los usuarios utilizando un archivo de datos externo llamado `Usuarios.dat`, ubicado en un servidor remoto (simulado mediante `localhost` con XAMPP).

## 🧩 Funcionalidades requeridas

La aplicación debe cumplir con los siguientes requisitos:

1. **Inicio de sesión (`Login.php`)**
   - Validación del login y contraseña del usuario.
   - Control de estado del usuario (activo/inactivo).
   - Bloqueo automático tras varios intentos fallidos.

2. **Creación de un nuevo usuario**
   - Formulario para registrar nuevos usuarios con los datos requeridos.
   - Validaciones necesarias.

3. **Recuperación de contraseña**
   - Opción para recuperar contraseña mediante login y validación (según diseño del equipo).

4. **Bloqueo de usuarios**
   - Si un usuario excede el número permitido de intentos fallidos, debe ser bloqueado automáticamente.

---

## 📁 Estructura del archivo `Usuarios.dat`

La información de usuarios se encuentra en un archivo de texto plano con estructura **de longitud fija** para acceso directo (no secuencial).

Cada registro contiene los siguientes campos:

| Campo          | Tipo         | Descripción                        |
|----------------|--------------|------------------------------------|
| UsrId          | char(2)      | ID del usuario                     |
| UsrName        | varchar(30)  | Apellidos y nombres                |
| UsrLogin       | varchar(15)  | Login                              |
| UsrPassword    | varchar(10)  | Contraseña                         |
| UsrDateBegin   | char(8)      | Fecha de inicio (YYYYMMDD)         |
| UsrTimeBegin   | char(6)      | Hora de inicio (HHMMSS)            |
| UsrDateEnd     | char(8)      | Fecha de finalización (YYYYMMDD)   |
| UsrTimeEnd     | char(6)      | Hora de finalización (HHMMSS)      |
| UsrStatus      | char(1)      | Estado del usuario (1: Activo, 0: Inactivo) |

📌 **Nota**: La longitud total de cada registro debe mantenerse constante para permitir el acceso directo por posición.

---

## ⚙️ Requisitos técnicos

- **Lenguaje**: PHP
- **Servidor local**: XAMPP (Apache + PHP)
- **Acceso a archivo remoto**: Simulado con archivo local `Usuarios.dat` accesible desde la misma carpeta del proyecto.
- **Interfaz**: HTML + PHP (puede incluir CSS básico)

---

## 🔒 Lógica para acceso y bloqueo

- Validar si el `UsrStatus` es activo (`1`) antes de permitir el acceso.
- Registrar intentos fallidos (en archivo de log o variable de sesión).
- Bloquear usuario luego de varios intentos fallidos modificando `UsrStatus` a `0`.

---

## 🧠 Recomendaciones

- Simular algunos datos iniciales en `Usuarios.dat` para realizar pruebas.
- Verificar que todos los registros tengan la **misma longitud física**.
- Comentar el código para facilitar la exposición del proyecto.
- Preparar una presentación corta para exponer la lógica de funcionamiento.

---

## 👨‍💻 Integrantes

- Acuña Montalvan Geraldine Dayhana 
- Celadita Gaspar Fernando David
- Chilon Tintaya Monica Isabel
- Gomez Cayo David Junior
- Navarro Laguna Sergio Edgardo
- Lanazca Saya Alex
- Ttito Carhuas, Carolhay

---

