package com.gestionemploi.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "matiere")
public class Matiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nom_cour")
    private String nomCour;

    @Column(name = "nom_prof")
    private String nomProf;

    @Column(name = "type_cour")
    private String typeCour;

    @Column(name = "classe_id")
    private String classeId;

    // Constructeurs
    public Matiere() {}

    public Matiere(String nomCour, String nomProf, String typeCour, String classeId) {
        this.nomCour = nomCour;
        this.nomProf = nomProf;
        this.typeCour = typeCour;
        this.classeId = classeId;
    }

    // Getters et Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomCour() { return nomCour; }
    public void setNomCour(String nomCour) { this.nomCour = nomCour; }

    public String getNomProf() { return nomProf; }
    public void setNomProf(String nomProf) { this.nomProf = nomProf; }

    public String getTypeCour() { return typeCour; }
    public void setTypeCour(String typeCour) { this.typeCour = typeCour; }

    public String getClasseId() { return classeId; }
    public void setClasseId(String classeId) { this.classeId = classeId; }
}