<?php
require_once __DIR__ . '/../models/Usuarios.php';

class AuthController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new Usuarios();
    }
    
    // POST login
    public function login($login, $password) {
        $user = $this->userModel->verifyCredentials($login, $password);
        
        if ($user !== false) {
            return [
                'success' => true,
                'message' => 'Login exitoso',
                'user' => $user
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Usuario o contraseña incorrectos'
            ];
        }
    }
    
    // POST register
    public function register($userData) {
        // Validar datos mínimos requeridos
        if (empty($userData['UsrName']) || empty($userData['UsrLogin']) || empty($userData['UsrPassword'])) {
            return [
                'success' => false,
                'message' => 'Faltan datos obligatorios'
            ];
        }
        
        $result = $this->userModel->create($userData);
        
        if ($result) {
            return [
                'success' => true,
                'message' => 'Usuario registrado correctamente'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Error al registrar el usuario. Es posible que el nombre de usuario ya exista.'
            ];
        }
    }
    
    // POST recover
    public function recoverPassword($login) {
        $password = $this->userModel->recoverPassword($login);
        
        if ($password !== false) {
            return [
                'success' => true,
                'message' => 'Contraseña recuperada',
                'password' => $password
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Usuario no encontrado'
            ];
        }
    }
    
    // POST block
    public function blockUser($login) {
        $result = $this->userModel->blockUser($login);
        
        if ($result) {
            return [
                'success' => true,
                'message' => 'Usuario bloqueado correctamente'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Error al bloquear el usuario'
            ];
        }
    }
}
?>