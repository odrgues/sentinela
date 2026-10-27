
package br.com.sentinela.backend.config;

import br.com.sentinela.backend.dto.ErroResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final SecurityFilter securityFilter;
    private final ObjectMapper objectMapper;

    @Value("${app.cors.origens}")
    private List<String> origensPermitidas;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/esqueci-senha",
                                "/api/auth/redefinir-senha",
                                "/api/usuario"
                        ).permitAll()
                        .requestMatchers(
                                "/api/whatsapp/webhook",
                                "/api/whatsapp/webhook/**"
                        ).permitAll()
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(erros -> erros
                        .authenticationEntryPoint((request, response, ex) ->
                                escreverErro(
                                        response,
                                        HttpStatus.UNAUTHORIZED,
                                        "Sua sessão expirou. Entre de novo."
                                ))
                        .accessDeniedHandler((request, response, ex) ->
                                escreverErro(
                                        response,
                                        HttpStatus.FORBIDDEN,
                                        "Você não tem permissão para isso."
                                ))
                )
                .addFilterBefore(
                        securityFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOrigins(origensPermitidas);
        cors.setAllowedMethods(List.of(
                "GET", "POST", "PATCH", "DELETE", "OPTIONS"
        ));
        cors.setAllowedHeaders(List.of(
                "Authorization", "Content-Type"
        ));

        UrlBasedCorsConfigurationSource fonte =
                new UrlBasedCorsConfigurationSource();
        fonte.registerCorsConfiguration("/api/**", cors);

        return fonte;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private void escreverErro(
            HttpServletResponse response,
            HttpStatus status,
            String mensagem
    ) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        objectMapper.writeValue(
                response.getWriter(),
                new ErroResponseDTO(status.value(), mensagem)
        );
    }
}
