package com.tlif.tlif.Configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.tlif.tlif.Security.OAuth2LoginSuccessHandler;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${app.cors.allowed-origins}")
    private String origins;

    // private final JwtAuthFilter jwtAuthFilter;
    private final OAuth2LoginSuccessHandler successHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
            .cors(cors-> cors.configurationSource(configurationSource()))
            .csrf(csrf-> csrf.disable())
            .authorizeHttpRequests(auth->
                auth
                    // Allow unauthenticated access to static pages, login, OAuth endpoints and API during local development
                    .requestMatchers("/home", "/login/**", "/oauth2/**", "/error", "/api/**").permitAll()
                    .anyRequest().authenticated()
            )
            .oauth2Login(oauth2-> oauth2
            .successHandler(successHandler)
            );
            return http.build();
    }

    @Bean
    public CorsConfigurationSource configurationSource(){
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(origins));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
