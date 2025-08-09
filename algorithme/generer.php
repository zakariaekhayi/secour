<?php
// generer.php - Script standalone pour générer les emplois du temps
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connexion.php';

class GenerateurPlanning {
    private $pdo;
    private $creneaux = [
        ['08:30:00', '10:30:00'],
        ['10:45:00', '12:45:00'],
        ['14:00:00', '16:00:00'],
        ['16:15:00', '18:15:00']
    ];
    private $jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    private $matieres_en_attente = [];
    private $matieres_avec_groupes_restants = [];
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    private function trouverSalleDisponible($jour, $heure_debut, $heure_fin, $type_cour, $exclude_salles = []) {
        $exclude_condition = '';
        $params = [
            ':jour' => $jour,
            ':heure_debut' => $heure_debut,
            ':heure_fin' => $heure_fin
        ];
        
        if (!empty($exclude_salles)) {
            $placeholders = ':exclude_' . implode(', :exclude_', array_keys($exclude_salles));
            $exclude_condition = "AND nom NOT IN ($placeholders)";
            foreach ($exclude_salles as $index => $salle) {
                $params[':exclude_' . $index] = $salle;
            }
        }
        
        if (strtolower($type_cour) == 'cours') {
            $sql = "SELECT nom FROM salle WHERE type = 'amphi' $exclude_condition AND nom NOT IN (
                SELECT nom_salle FROM seance 
                WHERE jour = :jour 
                AND (heure_debut < :heure_fin AND heure_fin > :heure_debut)
            ) ORDER BY RAND() LIMIT 1";
        } else {
            $sql = "SELECT nom FROM salle WHERE 1=1 $exclude_condition AND nom NOT IN (
                SELECT nom_salle FROM seance 
                WHERE jour = :jour 
                AND (heure_debut < :heure_fin AND heure_fin > :heure_debut)
            ) ORDER BY RAND() LIMIT 1";
        }
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetchColumn();
    }
    
    private function getMatieresAvecGroupes($classe_id) {
        $sql = "SELECT nom_cour, type_cour, 
                       GROUP_CONCAT(DISTINCT nom_prof ORDER BY nom_prof SEPARATOR '|') as profs,
                       GROUP_CONCAT(DISTINCT id ORDER BY nom_prof SEPARATOR '|') as ids
                FROM matiere 
                WHERE classe_id = :classe_id
                GROUP BY nom_cour, type_cour
                ORDER BY nom_cour, type_cour";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':classe_id' => $classe_id]);
        
        $result = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $profs = explode('|', $row['profs']);
            $ids = explode('|', $row['ids']);
            
            if (count($profs) !== count($ids)) {
                continue;
            }
            
            $profs_associes = [];
            for ($i = 0; $i < count($ids); $i++) {
                $profs_associes[$ids[$i]] = $profs[$i];
            }
            
            $result[] = [
                'nom_cour' => $row['nom_cour'],
                'type_cour' => $row['type_cour'],
                'profs' => $profs_associes,
                'nb_groupes' => count($profs)
            ];
        }
        
        return $result;
    }
    
    private function classeOccupee($classe_id, $jour, $heure_debut, $heure_fin) {
        $sql = "SELECT COUNT(*) FROM seance 
                WHERE nom_classe = :classe_id 
                AND jour = :jour 
                AND (heure_debut < :heure_fin AND heure_fin > :heure_debut)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':classe_id' => $classe_id,
            ':jour' => $jour,
            ':heure_debut' => $heure_debut,
            ':heure_fin' => $heure_fin
        ]);
        
        return $stmt->fetchColumn() > 0;
    }
    
    private function professeurOccupe($nom_prof, $jour, $heure_debut, $heure_fin) {
        $sql = "SELECT COUNT(*) FROM seance 
                WHERE nom_prof = :nom_prof 
                AND jour = :jour 
                AND (heure_debut < :heure_fin AND heure_fin > :heure_debut)";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':nom_prof' => $nom_prof,
            ':jour' => $jour,
            ':heure_debut' => $heure_debut,
            ':heure_fin' => $heure_fin
        ]);
        
        return $stmt->fetchColumn() > 0;
    }
    
    private function insererSeanceAvecGroupe($classe_id, $matiere_id, $nom_prof, $nom_salle, $jour, $heure_debut, $heure_fin, $groupe = null) {
        try {
            $sql = "INSERT INTO seance (nom_classe, id_matiere, nom_prof, nom_salle, heure_debut, heure_fin, jour, groupe) 
                    VALUES (:nom_classe, :id_matiere, :nom_prof, :nom_salle, :heure_debut, :heure_fin, :jour, :groupe)";
            
            $stmt = $this->pdo->prepare($sql);
            return $stmt->execute([
                ':nom_classe' => $classe_id,
                ':id_matiere' => $matiere_id,
                ':nom_prof' => $nom_prof,
                ':nom_salle' => $nom_salle,
                ':heure_debut' => $heure_debut,
                ':heure_fin' => $heure_fin,
                ':jour' => $jour,
                ':groupe' => $groupe
            ]);
            
        } catch (PDOException $e) {
            return false;
        }
    }
    
    private function trouverProchainCreneauLibre($classe_id, $prof, $jour_actuel, $creneau_actuel) {
        $jour_index = array_search($jour_actuel, $this->jours);
        $creneau_index = array_search([$creneau_actuel[0], $creneau_actuel[1]], $this->creneaux);
        
        for ($j = $jour_index; $j < count($this->jours); $j++) {
            $start_creneau = ($j == $jour_index) ? $creneau_index + 1 : 0;
            
            for ($c = $start_creneau; $c < count($this->creneaux); $c++) {
                $jour = $this->jours[$j];
                $heure_debut = $this->creneaux[$c][0];
                $heure_fin = $this->creneaux[$c][1];
                
                if (!$this->classeOccupee($classe_id, $jour, $heure_debut, $heure_fin) &&
                    !$this->professeurOccupe($prof, $jour, $heure_debut, $heure_fin)) {
                    return [
                        'jour' => $jour,
                        'heure_debut' => $heure_debut,
                        'heure_fin' => $heure_fin
                    ];
                }
            }
        }
        
        return null;
    }

    private function planifierMatiereDirectement($classe_id, $matiere, $jour, $heure_debut, $heure_fin) {
        if ($matiere['nb_groupes'] > 1) {
            $matiere_id = array_keys($matiere['profs'])[0];
            $prof = array_values($matiere['profs'])[0];
            
            $salle_disponible = $this->trouverSalleDisponible($jour, $heure_debut, $heure_fin, $matiere['type_cour']);
            
            if ($salle_disponible) {
                $groupe_label = 'G1';
                if ($this->insererSeanceAvecGroupe($classe_id, $matiere_id, $prof, $salle_disponible, $jour, $heure_debut, $heure_fin, $groupe_label)) {
                    $this->matieres_avec_groupes_restants[] = [
                        'matiere' => $matiere,
                        'groupes_restants' => array_slice($matiere['profs'], 1, null, true)
                    ];
                    return true;
                }
            }
        } else {
            $matiere_id = array_keys($matiere['profs'])[0];
            $prof = array_values($matiere['profs'])[0];
            
            $salle_disponible = $this->trouverSalleDisponible($jour, $heure_debut, $heure_fin, $matiere['type_cour']);
            
            if ($salle_disponible) {
                return $this->insererSeanceAvecGroupe($classe_id, $matiere_id, $prof, $salle_disponible, $jour, $heure_debut, $heure_fin);
            }
        }
        
        return false;
    }
    
    private function programmerGroupesRestants($classe_id) {
        $seances_creees = 0;
        
        foreach ($this->matieres_avec_groupes_restants as $matiere_restante) {
            $matiere = $matiere_restante['matiere'];
            $groupes_restants = $matiere_restante['groupes_restants'];
            
            $groupe_num = 2;
            foreach ($groupes_restants as $matiere_id => $prof) {
                $groupe_planifie = false;
                
                foreach ($this->jours as $jour) {
                    foreach ($this->creneaux as $creneau) {
                        $heure_debut = $creneau[0];
                        $heure_fin = $creneau[1];
                        
                        if ($this->classeOccupee($classe_id, $jour, $heure_debut, $heure_fin) || 
                            $this->professeurOccupe($prof, $jour, $heure_debut, $heure_fin)) {
                            continue;
                        }
                        
                        $salle_disponible = $this->trouverSalleDisponible($jour, $heure_debut, $heure_fin, $matiere['type_cour']);
                        
                        if ($salle_disponible) {
                            $groupe_label = 'G' . $groupe_num;
                            if ($this->insererSeanceAvecGroupe($classe_id, $matiere_id, $prof, $salle_disponible, $jour, $heure_debut, $heure_fin, $groupe_label)) {
                                $seances_creees++;
                                $groupe_planifie = true;
                                break 2;
                            }
                        }
                    }
                }
                
                $groupe_num++;
            }
        }
        
        return $seances_creees;
    }
    
    public function genererTousLesPlanning() {
        try {
            // Vérifier/ajouter la colonne groupe
            try {
                $this->pdo->exec("ALTER TABLE seance ADD COLUMN groupe VARCHAR(10) DEFAULT NULL");
            } catch (PDOException $e) {
                // Colonne existe déjà ou autre erreur - continuer
            }
            
            // Vider la table seance
            $this->pdo->exec("DELETE FROM seance");
            
            // Récupérer toutes les classes
            $stmt = $this->pdo->query("SELECT nom FROM classe");
            $classes = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            $total_seances_creees = 0;
            $resultats_par_classe = [];
            
            foreach ($classes as $classe_id) {
                $this->matieres_avec_groupes_restants = [];
                $this->matieres_en_attente = [];
                
                $matieres = $this->getMatieresAvecGroupes($classe_id);
                
                if (empty($matieres)) {
                    continue;
                }
                
                $this->matieres_en_attente = $matieres;
                $seances_classe = 0;
                
                foreach ($this->jours as $jour) {
                    foreach ($this->creneaux as $creneau) {
                        $heure_debut = $creneau[0];
                        $heure_fin = $creneau[1];
                        
                        if ($this->classeOccupee($classe_id, $jour, $heure_debut, $heure_fin)) {
                            continue;
                        }
                        
                        $matiere_planifiee = false;
                        
                        for ($i = 0; $i < count($this->matieres_en_attente); $i++) {
                            $matiere = $this->matieres_en_attente[$i];
                            $premier_prof = array_values($matiere['profs'])[0];
                            
                            if (!$this->professeurOccupe($premier_prof, $jour, $heure_debut, $heure_fin)) {
                                if ($this->planifierMatiereDirectement($classe_id, $matiere, $jour, $heure_debut, $heure_fin)) {
                                    $seances_classe++;
                                    $total_seances_creees++;
                                    array_splice($this->matieres_en_attente, $i, 1);
                                    $matiere_planifiee = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                // Programmer les groupes restants
                $groupes_programmes = $this->programmerGroupesRestants($classe_id);
                $seances_classe += $groupes_programmes;
                $total_seances_creees += $groupes_programmes;
                
                $resultats_par_classe[$classe_id] = $seances_classe;
            }
            
            return [
                'success' => true,
                'message' => 'Génération terminée avec succès!',
                'total_seances' => $total_seances_creees,
                'resultats_par_classe' => $resultats_par_classe
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => 'Erreur lors de la génération : ' . $e->getMessage()
            ];
        }
    }
}

// Exécution du script
try {
    $generateur = new GenerateurPlanning($pdo);
    $resultat = $generateur->genererTousLesPlanning();
    
    http_response_code($resultat['success'] ? 200 : 500);
    echo json_encode($resultat, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur fatale : ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>