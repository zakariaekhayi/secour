package com.gestionemploi.backend.repository;

import com.gestionemploi.backend.model.Classe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, String> {
}