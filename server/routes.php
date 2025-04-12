<?php
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UsuarioController.php';


function checkAuthentication() {
    // Lógica para verificar si el usuario está autenticado
    session_start();
    if (!isset($_SESSION['user'])) {
        // No hay sesión válida
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'No autorizado']);
        exit();
    }
}

function handleRequest() {
    // Obtener el método HTTP y la ruta
    $method = $_SERVER['REQUEST_METHOD'];
    $route = isset($_GET['route']) ? $_GET['route'] : '';
    
    // Decodificar JSON si es POST o PUT
    $input = null;
    if ($method === 'POST' || $method === 'PUT') {
        $jsonInput = file_get_contents('php://input');
        if (!empty($jsonInput)) {
            $input = json_decode($jsonInput, true);
        } else {
            $input = $_POST; // Fallback a $_POST si no hay JSON
        }
    }
    
    $authController = new AuthController();
    $userController = new UsuarioController();
    
    $response = null;
    
    switch ($route) {
        case 'login':
            if ($method === 'POST') {
                $login = isset($input['login']) ? $input['login'] : '';
                $password = isset($input['password']) ? $input['password'] : '';
                $response = $authController->login($login, $password);
            }
            break;
            
        case 'register':
            if ($method === 'POST') {
                $response = $authController->register($input);
            }
            break;
            
        case 'recover-password':
            if ($method === 'POST') {
                $login = isset($input['login']) ? $input['login'] : '';
                $response = $authController->recoverPassword($login);
            }
            break;
            
        case 'block-user':
            if ($method === 'POST') {
                $login = isset($input['login']) ? $input['login'] : '';
                $response = $authController->blockUser($login);
            }
            break;
            
        case 'users':
            if ($method === 'GET') {
                $response = $userController->getAllUsers();
            }
            break;
            
        case 'user':
            if ($method === 'GET' && isset($_GET['login'])) {
                $response = $userController->getUserByLogin($_GET['login']);
            } elseif ($method === 'PUT' && isset($_GET['login'])) {
                $response = $userController->updateUser($_GET['login'], $input);
            }
            break;
            
        default:
            $response = [
                'success' => false,
                'message' => 'Ruta no encontrada'
            ];
    } 
    // respuesta JSON
    header('Content-Type: application/json');
    echo json_encode($response);
}
// Procesar la solicitud
handleRequest();
?>