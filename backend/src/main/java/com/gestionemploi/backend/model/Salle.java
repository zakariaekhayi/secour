package com.gestionemploi.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "salle")
public class Salle {
    @Id
    private String nom;

    private String batiment;

    @Enumerated(EnumType.STRING)
    private TypeSalle type;

    public enum TypeSalle {
        salle, amphi, atelier
    }

    // Constructeurs
    public Salle() {}

    public Salle(String nom, String batiment, TypeSalle type) {
        this.nom = nom;
        this.batiment = batiment;
        this.type = type;
    }

    // Getters et Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getBatiment() { return batiment; }
    public void setBatiment(String batiment) { this.batiment = batiment; }

    public TypeSalle getType() { return type; }
    public void setType(TypeSalle type) { this.type = type; }
}
