<?php
require_once __DIR__ . '/../models/Usuarios.php';

class UsuarioController {
    private $userModel;
    
    public function __construct() {
        $this->userModel = new Usuarios();
    }
    
    // Método para obtener todos los usuarios
    public function getAllUsers() {
        $users = $this->userModel->getAll();
        
        return [
            'success' => true,
            'count' => count($users),
            'users' => $users
        ];
    }
    
    // Método para obtener un usuario por su login
    public function getUserByLogin($login) {
        $result = $this->userModel->findByLogin($login);
        
        if ($result !== false) {
            return [
                'success' => true,
                'user' => $result['data']
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Usuario no encontrado'
            ];
        }
    }
    
    // Método para actualizar un usuario
    public function updateUser($login, $userData) {
        $result = $this->userModel->update($login, $userData);
        
        if ($result) {
            return [
                'success' => true,
                'message' => 'Usuario actualizado correctamente'
            ];
        } else {
            return [
                'success' => false,
                'message' => 'Error al actualizar el usuario'
            ];
        }
    }
}
?>