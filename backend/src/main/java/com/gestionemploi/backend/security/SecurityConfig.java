package com.gestionemploi.backend.security;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource)) // 👈 Utilise ta config CORS ici
                .csrf().disable() // Désactivé pour faciliter les tests frontend
                .authorizeHttpRequests()
                .requestMatchers("/", "/api/**").permitAll() // autorise / et /api/** // 👈 Autorise tes endpoints API
                .anyRequest().authenticated(); // 🔒 Pour tout le reste, authentification requise

        return http.build();
    }
}
