package com.gestionemploi.backend.controller;

import com.gestionemploi.backend.model.Matiere;
import com.gestionemploi.backend.service.MatiereService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/matieres")
@CrossOrigin(origins = "http://localhost:3000")
public class MatiereController {

    @Autowired
    private MatiereService matiereService;

    @GetMapping
    public List<Matiere> getAllMatieres() {
        return matiereService.getAllMatieres();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matiere> getMatiereById(@PathVariable Integer id) {
        Optional<Matiere> matiere = matiereService.getMatiereById(id);
        return matiere.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Matiere createMatiere(@RequestBody Matiere matiere) {
        return matiereService.saveMatiere(matiere);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Matiere> updateMatiere(@PathVariable Integer id, @RequestBody Matiere matiereDetails) {
        Optional<Matiere> existingMatiere = matiereService.getMatiereById(id);
        if (existingMatiere.isPresent()) {
            matiereDetails.setId(id);
            return ResponseEntity.ok(matiereService.saveMatiere(matiereDetails));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatiere(@PathVariable Integer id) {
        try {
            matiereService.deleteMatiere(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}