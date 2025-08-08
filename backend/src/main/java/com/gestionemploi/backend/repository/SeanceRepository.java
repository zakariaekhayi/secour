// SeanceRepository.java
package com.gestionemploi.backend.repository;

import com.gestionemploi.backend.model.Seance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeanceRepository extends JpaRepository<Seance, Integer> {
    List<Seance> findByNomClasse(String nomClasse);

    @Query("SELECT s FROM Seance s JOIN Matiere m ON s.idMatiere = m.id WHERE s.nomClasse = :nomClasse ORDER BY FIELD(s.jour, 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'), s.heureDebut")
    List<Seance> findByNomClasseWithMatiere(@Param("nomClasse") String nomClasse);
}