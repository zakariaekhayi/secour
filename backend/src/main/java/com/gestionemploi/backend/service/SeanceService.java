package com.gestionemploi.backend.service;



import com.gestionemploi.backend.model.Seance;
import com.gestionemploi.backend.repository.SeanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SeanceService {

    @Autowired
    private SeanceRepository seanceRepository;

    public List<Seance> getAllSeances() {
        return seanceRepository.findAll();
    }

    public Optional<Seance> getSeanceById(Integer id) {
        return seanceRepository.findById(id);
    }

    public List<Seance> getSeancesByClasse(String nomClasse) {
        return seanceRepository.findByNomClasseWithMatiere(nomClasse);
    }

    public Seance saveSeance(Seance seance) {
        return seanceRepository.save(seance);
    }

    public void deleteSeance(Integer id) {
        seanceRepository.deleteById(id);
    }
}