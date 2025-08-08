// Seance.java
package com.gestionemploi.backend.model;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "seance")
public class Seance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nom_classe")
    private String nomClasse;

    @Column(name = "id_matiere")
    private Integer idMatiere;

    @Column(name = "nom_prof")
    private String nomProf;

    @Column(name = "nom_salle")
    private String nomSalle;

    @Column(name = "heure_debut")
    private LocalTime heureDebut;

    @Column(name = "heure_fin")
    private LocalTime heureFin;

    private String groupe;

    @Enumerated(EnumType.STRING)
    private Jour jour;

    public enum Jour {
        Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche
    }

    // Constructeurs
    public Seance() {}

    public Seance(String nomClasse, Integer idMatiere, String nomProf, String nomSalle,
                  LocalTime heureDebut, LocalTime heureFin, String groupe, Jour jour) {
        this.nomClasse = nomClasse;
        this.idMatiere = idMatiere;
        this.nomProf = nomProf;
        this.nomSalle = nomSalle;
        this.heureDebut = heureDebut;
        this.heureFin = heureFin;
        this.groupe = groupe;
        this.jour = jour;
    }

    // Getters et Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNomClasse() { return nomClasse; }
    public void setNomClasse(String nomClasse) { this.nomClasse = nomClasse; }

    public Integer getIdMatiere() { return idMatiere; }
    public void setIdMatiere(Integer idMatiere) { this.idMatiere = idMatiere; }

    public String getNomProf() { return nomProf; }
    public void setNomProf(String nomProf) { this.nomProf = nomProf; }

    public String getNomSalle() { return nomSalle; }
    public void setNomSalle(String nomSalle) { this.nomSalle = nomSalle; }

    public LocalTime getHeureDebut() { return heureDebut; }
    public void setHeureDebut(LocalTime heureDebut) { this.heureDebut = heureDebut; }

    public LocalTime getHeureFin() { return heureFin; }
    public void setHeureFin(LocalTime heureFin) { this.heureFin = heureFin; }

    public String getGroupe() { return groupe; }
    public void setGroupe(String groupe) { this.groupe = groupe; }

    public Jour getJour() { return jour; }
    public void setJour(Jour jour) { this.jour = jour; }
}