<?php
// vider.php - Script standalone pour vider les emplois du temps
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connexion.php';

try {
    // Compter le nombre de séances avant suppression
    $stmt = $pdo->query("SELECT COUNT(*) FROM seance");
    $nb_seances_avant = $stmt->fetchColumn();
    
    // Vider la table seance
    $pdo->exec("DELETE FROM seance");
    
    // Vérifier que la suppression a bien eu lieu
    $stmt = $pdo->query("SELECT COUNT(*) FROM seance");
    $nb_seances_apres = $stmt->fetchColumn();
    
    $resultat = [
        'success' => true,
        'message' => 'Tous les emplois du temps ont été supprimés avec succès!',
        'seances_supprimees' => $nb_seances_avant,
        'seances_restantes' => $nb_seances_apres
    ];
    
    http_response_code(200);
    echo json_encode($resultat, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    $resultat = [
        'success' => false,
        'error' => 'Erreur lors de la suppression : ' . $e->getMessage()
    ];
    
    http_response_code(500);
    echo json_encode($resultat, JSON_UNESCAPED_UNICODE);
}
?>