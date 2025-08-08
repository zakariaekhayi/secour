package com.gestionemploi.backend.controller;



import com.gestionemploi.backend.model.Seance;
import com.gestionemploi.backend.service.SeanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seances")
@CrossOrigin(origins = "http://localhost:3000")
public class SeanceController {

    @Autowired
    private SeanceService seanceService;

    @GetMapping
    public List<Seance> getAllSeances() {
        return seanceService.getAllSeances();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seance> getSeanceById(@PathVariable Integer id) {
        Optional<Seance> seance = seanceService.getSeanceById(id);
        return seance.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/classe/{nomClasse}")
    public List<Seance> getSeancesByClasse(@PathVariable String nomClasse) {
        return seanceService.getSeancesByClasse(nomClasse);
    }

    @PostMapping
    public Seance createSeance(@RequestBody Seance seance) {
        return seanceService.saveSeance(seance);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seance> updateSeance(@PathVariable Integer id, @RequestBody Seance seanceDetails) {
        Optional<Seance> existingSeance = seanceService.getSeanceById(id);
        if (existingSeance.isPresent()) {
            seanceDetails.setId(id);
            return ResponseEntity.ok(seanceService.saveSeance(seanceDetails));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeance(@PathVariable Integer id) {
        try {
            seanceService.deleteSeance(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}