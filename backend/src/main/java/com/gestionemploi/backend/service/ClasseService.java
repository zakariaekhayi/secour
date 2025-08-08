package com.gestionemploi.backend.service;

import com.gestionemploi.backend.model.Classe;
import com.gestionemploi.backend.repository.ClasseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClasseService {

    @Autowired
    private ClasseRepository classeRepository;

    public List<Classe> getAllClasses() {
        return classeRepository.findAll();
    }

    public Optional<Classe> getClasseByNom(String nom) {
        return classeRepository.findById(nom);
    }

    public Classe saveClasse(Classe classe) {
        return classeRepository.save(classe);
    }

    public void deleteClasse(String nom) {
        classeRepository.deleteById(nom);
    }
}
