<?php
// Permitir solicitudes CORS (para desarrollo)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Incluir el archivo de rutas
require_once __DIR__ . '/routes.php';
?>