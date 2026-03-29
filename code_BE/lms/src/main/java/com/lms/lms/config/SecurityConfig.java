package com.lms.lms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // swagger ui
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // auth public
                        .requestMatchers("/api/auth/**").permitAll()

                        // profile: chỉ cần login
                        .requestMatchers("/api/users/**").authenticated()

                        // instructor request: student tạo request
                        .requestMatchers(HttpMethod.POST, "/api/instructor-requests").hasRole("STUDENT")

                        // instructor request: admin xem list
                        .requestMatchers(HttpMethod.GET, "/api/instructor-requests").hasRole("ADMIN")

                        // instructor request: admin approve/reject
                        .requestMatchers(HttpMethod.POST, "/api/instructor-requests/*/approve").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/instructor-requests/*/reject").hasRole("ADMIN")

                        // enrollment
                        .requestMatchers(HttpMethod.POST, "/api/enrollments/**").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/enrollments/**").authenticated()

                        // payment: create requires login, callback is public (called by VNPay)
                        .requestMatchers(HttpMethod.POST, "/api/payments/**").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/payments/vnpay/callback").permitAll()

                        // courses: public list & detail
                        .requestMatchers(HttpMethod.GET, "/api/courses").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/courses/{courseId}").permitAll()

                        // courses: instructor/admin manage
                        .requestMatchers(HttpMethod.POST, "/api/courses").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/courses/my").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/courses/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/courses/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/courses/**").hasAnyRole("INSTRUCTOR", "ADMIN")

                        // chapters: public read, instructor/admin write
                        .requestMatchers(HttpMethod.GET, "/api/courses/*/chapters").authenticated()
                        .requestMatchers("/api/courses/*/chapters/**").hasAnyRole("INSTRUCTOR", "ADMIN")

                        // lessons: public read, instructor/admin write
                        .requestMatchers(HttpMethod.GET, "/api/chapters/*/lessons").authenticated()
                        .requestMatchers("/api/chapters/*/lessons/**").hasAnyRole("INSTRUCTOR", "ADMIN")

                        // progress: student watch/complete, all roles can read (service handles authorization)
                        .requestMatchers(HttpMethod.POST, "/api/progress/lessons/*/watch").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.POST, "/api/progress/lessons/*/complete").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/progress/**").authenticated()

                        // questions: instructor/admin only
                        .requestMatchers("/api/courses/*/questions/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers("/api/questions/**").hasAnyRole("INSTRUCTOR", "ADMIN")

                        // exams: create/update/delete/publish → instructor/admin
                        .requestMatchers(HttpMethod.POST, "/api/courses/*/exams").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/courses/*/exams").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/exams/*/take").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/exams/*").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/exams/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/exams/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/exams/*/publish").hasAnyRole("INSTRUCTOR", "ADMIN")

                        // submissions: student submit/view own, instructor/admin view all
                        .requestMatchers(HttpMethod.POST, "/api/exams/*/submit").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/exams/*/my-result").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/exams/*/submissions/**").hasAnyRole("INSTRUCTOR", "ADMIN")

                        // còn lại phải login
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}