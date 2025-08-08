package com.gestionemploi.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "classe")
public class Classe {
    @Id
    private String nom;

    private String niveau;
    private String filiere;

    // Constructeurs
    public Classe() {}

    public Classe(String nom, String niveau, String filiere) {
        this.nom = nom;
        this.niveau = niveau;
        this.filiere = filiere;
    }

    // Getters et Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getNiveau() { return niveau; }
    public void setNiveau(String niveau) { this.niveau = niveau; }

    public String getFiliere() { return filiere; }
    public void setFiliere(String filiere) { this.filiere = filiere; }
}
