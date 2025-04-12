<?php
require_once __DIR__ . '/../models/Usuarios.php';

$userModel = new Usuarios();

$users = [
    [
        'UsrId' => '03',
        'UsrName' => 'Maria Garcia',
        'UsrLogin' => 'mgarcia',
        'UsrPassword' => 'mg123456',
        'UsrDateBegin' => date('Ymd'),
        'UsrTimeBegin' => date('His'),
        'UsrDateEnd' => '20251231',
        'UsrTimeEnd' => '235959',
        'UsrStatus' => '1'
    ],
    [
        'UsrId' => '02',
        'UsrName' => 'Juan Perez',
        'UsrLogin' => 'jperez',
        'UsrPassword' => 'jp123456',
        'UsrDateBegin' => date('Ymd'),
        'UsrTimeBegin' => date('His'),
        'UsrDateEnd' => '20251231',
        'UsrTimeEnd' => '235959',
        'UsrStatus' => '1'
    ],
    [
        'UsrId' => '01',
        'UsrName' => 'Administrador',
        'UsrLogin' => 'admin',
        'UsrPassword' => 'admin123',
        'UsrDateBegin' => date('Ymd'),
        'UsrTimeBegin' => date('His'),
        'UsrDateEnd' => '20251231',
        'UsrTimeEnd' => '235959',
        'UsrStatus' => '1'
    ],
];

foreach ($users as $user) {
    $userModel->create($user);
}

echo "Usuarios de ejemplo creados correctamente.\n";
?>