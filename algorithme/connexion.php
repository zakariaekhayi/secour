<?php
// connexion.php - Fichier de connexion à la base de données
try {
    // Configuration de la base de données
    $host = 'localhost';
    $dbname = 'emp_php4'; // Remplacez par le nom de votre base de données
    $username = 'root'; // Remplacez par votre nom d'utilisateur
    $password = ''; // Remplacez par votre mot de passe
    
    // Création de la connexion PDO
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
    
} catch (PDOException $e) {
    // En cas d'erreur de connexion
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur de connexion à la base de données : ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
?>