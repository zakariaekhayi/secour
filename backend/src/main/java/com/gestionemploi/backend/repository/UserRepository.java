package com.gestionemploi.backend.repository;


import com.gestionemploi.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    @Query("SELECT COUNT(u) FROM User u")
    Long countUsers();

    @Query(value = "SELECT COUNT(*) FROM classe", nativeQuery = true)
    Long countClasses();

    @Query(value = "SELECT COUNT(*) FROM salle", nativeQuery = true)
    Long countSalles();

    @Query(value = "SELECT COUNT(*) FROM matiere", nativeQuery = true)
    Long countMatieres();
}