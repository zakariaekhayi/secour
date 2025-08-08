package com.gestionemploi.backend.service;


import com.gestionemploi.backend.model.User;
import com.gestionemploi.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Authentification simple (sans hash pour simplicité)
            if (user.getPassword().equals(password) && user.getRole() == User.Role.ADMIN) {
                response.put("success", true);
                response.put("user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "role", user.getRole().toString(),
                        "nomComplet", user.getNomComplet()
                ));
                return response;
            }
        }

        response.put("success", false);
        response.put("message", "Identifiants incorrects ou accès non autorisé");
        return response;
    }

    public Map<String, Object> getDashboardData() {
        Map<String, Object> data = new HashMap<>();

        data.put("userCount", userRepository.countUsers());
        data.put("classeCount", userRepository.countClasses());
        data.put("salleCount", userRepository.countSalles());
        data.put("matiereCount", userRepository.countMatieres());

        return data;
    }
}
