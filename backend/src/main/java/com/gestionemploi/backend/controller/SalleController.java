package com.gestionemploi.backend.controller;

import com.gestionemploi.backend.model.Salle;
import com.gestionemploi.backend.service.SalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/salles")
@CrossOrigin(origins = "http://localhost:3000")
public class SalleController {

    @Autowired
    private SalleService salleService;

    @GetMapping
    public List<Salle> getAllSalles() {
        return salleService.getAllSalles();
    }

    @GetMapping("/{nom}")
    public ResponseEntity<Salle> getSalleByNom(@PathVariable String nom) {
        Optional<Salle> salle = salleService.getSalleByNom(nom);
        return salle.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Salle createSalle(@RequestBody Salle salle) {
        return salleService.saveSalle(salle);
    }

    @PutMapping("/{nom}")
    public ResponseEntity<Salle> updateSalle(@PathVariable String nom, @RequestBody Salle salleDetails) {
        Optional<Salle> existingSalle = salleService.getSalleByNom(nom);
        if (existingSalle.isPresent()) {
            salleDetails.setNom(nom);
            return ResponseEntity.ok(salleService.saveSalle(salleDetails));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{nom}")
    public ResponseEntity<Void> deleteSalle(@PathVariable String nom) {
        try {
            salleService.deleteSalle(nom);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
