package com.gestionemploi.backend.controller;

import com.gestionemploi.backend.model.Classe;
import com.gestionemploi.backend.service.ClasseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/classes")
@CrossOrigin(origins = "http://localhost:3000")
public class ClasseController {

    @Autowired
    private ClasseService classeService;

    @GetMapping
    public List<Classe> getAllClasses() {
        return classeService.getAllClasses();
    }

    @GetMapping("/{nom}")
    public ResponseEntity<Classe> getClasseByNom(@PathVariable String nom) {
        Optional<Classe> classe = classeService.getClasseByNom(nom);
        return classe.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Classe createClasse(@RequestBody Classe classe) {
        return classeService.saveClasse(classe);
    }

    @PutMapping("/{nom}")
    public ResponseEntity<Classe> updateClasse(@PathVariable String nom, @RequestBody Classe classeDetails) {
        Optional<Classe> existingClasse = classeService.getClasseByNom(nom);
        if (existingClasse.isPresent()) {
            classeDetails.setNom(nom);
            return ResponseEntity.ok(classeService.saveClasse(classeDetails));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{nom}")
    public ResponseEntity<Void> deleteClasse(@PathVariable String nom) {
        try {
            classeService.deleteClasse(nom);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
