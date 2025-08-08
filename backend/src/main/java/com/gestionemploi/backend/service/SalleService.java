package com.gestionemploi.backend.service;

import com.gestionemploi.backend.model.Salle;
import com.gestionemploi.backend.repository.SalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SalleService {

    @Autowired
    private SalleRepository salleRepository;

    public List<Salle> getAllSalles() {
        return salleRepository.findAll();
    }

    public Optional<Salle> getSalleByNom(String nom) {
        return salleRepository.findById(nom);
    }

    public Salle saveSalle(Salle salle) {
        return salleRepository.save(salle);
    }

    public void deleteSalle(String nom) {
        salleRepository.deleteById(nom);
    }
}
