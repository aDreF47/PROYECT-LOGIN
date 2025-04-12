<?php
class Usuarios {
    private $filePath;
    private $recordSize;

    private $fieldSizes = [
        'UsrId' => 2,         // char(2)
        'UsrName' => 30,      // varchar(30)
        'UsrLogin' => 15,     // varchar(15)
        'UsrPassword' => 10,  // varchar(10)
        'UsrDateBegin' => 8,  // char(8)
        'UsrTimeBegin' => 6,  // char(6)
        'UsrDateEnd' => 8,    // char(8)
        'UsrTimeEnd' => 6,    // char(6)
        'UsrStatus' => 1      // char(1)
    ];
    
    public function __construct() {
        // Ruta al archivo de datos
        $this->filePath = __DIR__ . '/../database/Usuarios.dat';
        
        // Calcular el tamaño total de un registro
        $this->recordSize = array_sum($this->fieldSizes);
        
        // Crear el archivo si no existe
        if (!file_exists($this->filePath)) {
            $dir = dirname($this->filePath);
            if (!is_dir($dir)) {
                mkdir($dir, 0755, true);
            }
            file_put_contents($this->filePath, '');
        }
    }
    
    //FERNANDO
    // Método para leer un registro específico por su posición
    private function readRecord($position) {
        $handle = fopen($this->filePath, 'rb');
        if ($handle === false) {
            return false;
        }
        
        // Posicionarse en el registro específico
        fseek($handle, $position * $this->recordSize);
        
        // Leer el registro completo
        $record = fread($handle, $this->recordSize);
        fclose($handle);
        
        if (strlen($record) < $this->recordSize) {
            return false; // No hay suficientes datos para un registro completo
        }
        
        return $this->parseRecord($record);
    }
    
    // Método para parsear un registro desde el formato binario
    private function parseRecord($binaryData) {
        $offset = 0;
        $result = [];
        
        foreach ($this->fieldSizes as $field => $size) {
            $value = substr($binaryData, $offset, $size);
            $result[$field] = trim($value); // Eliminar espacios en blanco
            $offset += $size;
        }
        
        return $result;
    }
    
    // Método para crear un nuevo registro binario
    private function createBinaryRecord($data) {
        $binaryData = '';
        
        foreach ($this->fieldSizes as $field => $size) {
            if (isset($data[$field])) {
                // Rellenar o truncar según sea necesario para ajustarse al tamaño fijo
                $value = str_pad(substr($data[$field], 0, $size), $size);
            } else {
                $value = str_repeat(' ', $size);
            }
            $binaryData .= $value;
        }
        
        return $binaryData;
    }
    
    // Método para escribir un registro en una posición específica
    private function writeRecord($position, $data) {
        $handle = fopen($this->filePath, 'r+b');
        if ($handle === false) {
            return false;
        }
        
        // Posicionarse en el registro específico
        fseek($handle, $position * $this->recordSize);
        
        // Crear el registro binario y escribirlo
        $binaryData = $this->createBinaryRecord($data);
        fwrite($handle, $binaryData);
        fclose($handle);
        
        return true;
    }
    

    //JUNIOR
    // Obtener todos los usuarios
    public function getAll() {
        $users = [];
        $fileSize = filesize($this->filePath);
        
        if ($fileSize === 0) {
            return $users;
        }
        
        $totalRecords = floor($fileSize / $this->recordSize);
        
        for ($i = 0; $i < $totalRecords; $i++) {
            $user = $this->readRecord($i);
            if ($user !== false) {
                $users[] = $user;
            }
        }
        
        return $users;
    }
    
    // Buscar usuario por login
    public function findByLogin($login) {
        $users = $this->getAll();
        
        foreach ($users as $index => $user) {
            if ($user['UsrLogin'] === $login) {
                return ['index' => $index, 'data' => $user];
            }
        }
        
        return false;
    }
    
    // Verificar credenciales de usuario
    public function verifyCredentials($login, $password) {
        $result = $this->findByLogin($login);
        
        if ($result === false) {
            return false; 
        }
        
        $user = $result['data'];
        
        // Verificar contraseña y estado activo
        if ($user['UsrPassword'] === $password && $user['UsrStatus'] === '1') {
            return $user;
        }
        
        return false;
    }

    // Crear un nuevo usuario
    public function create($userData) {
        // Verificar si el login ya existe
        if ($this->findByLogin($userData['UsrLogin']) !== false) {
            return false; // Usuario ya existe
        }
        
        // Obtener el número total de registros actuales
        $fileSize = filesize($this->filePath);
        $position = floor($fileSize / $this->recordSize);
        
        // Generar ID único si no se proporciona
        if (!isset($userData['UsrId']) || empty($userData['UsrId'])) {
            $userData['UsrId'] = sprintf('%02d', $position + 1); // ID numérico de 2 dígitos
        }
        
        // Establecer fechas y horas actuales si no se proporcionan
        $now = date('Ymd');
        $time = date('His');
        
        if (!isset($userData['UsrDateBegin']) || empty($userData['UsrDateBegin'])) {
            $userData['UsrDateBegin'] = $now;
        }
        
        if (!isset($userData['UsrTimeBegin']) || empty($userData['UsrTimeBegin'])) {
            $userData['UsrTimeBegin'] = $time;
        }
        
        // Estado activo por defecto
        if (!isset($userData['UsrStatus']) || empty($userData['UsrStatus'])) {
            $userData['UsrStatus'] = '1';
        }
        
        // Escribir el nuevo registro al final del archivo
        return $this->writeRecord($position, $userData);
    }
    

    // ALEX
    // Actualizar un usuario existente
    public function update($login, $userData) {
        $result = $this->findByLogin($login);
        
        if ($result === false) {
            return false; // Usuario no encontrado
        }
        
        $index = $result['index'];
        $existingData = $result['data'];
        
        // Combinar datos existentes con los nuevos
        $updatedData = array_merge($existingData, $userData);
        
        // Escribir los datos actualizados
        return $this->writeRecord($index, $updatedData);
    }
    
    // Bloquear un usuario (cambiar estado a inactivo)
    public function blockUser($login) {
        return $this->update($login, ['UsrStatus' => '0']);
    }
    
    // Recuperar contraseña (simplemente devolvemos la contraseña actual)
    public function recoverPassword($login) {
        $result = $this->findByLogin($login);
        
        if ($result === false) {
            return false; // Usuario no encontrado
        }
        
        return $result['data']['UsrPassword'];
    }
}
?>