// package com.tlif.tlif.Configuration;

// import java.util.List;

// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.tlif.tlif.entity.User;
// import com.tlif.tlif.repositories.UserRepository;
// import com.tlif.tlif.services.JwtService;

// import java.io.IOException;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;

// @Component
// @RequiredArgsConstructor
// public class JwtAuthFilter extends OncePerRequestFilter {

//     private final JwtService jwtService;
//     private final UserRepository userRepository;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                     HttpServletResponse response,
//                                     FilterChain filterChain) throws ServletException, IOException {

//         String authHeader = request.getHeader("Authorization");

//         if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//             filterChain.doFilter(request, response);
//             return;
//         }

//         String token = authHeader.substring(7); // remove "Bearer "

//         try {
//             String userId = jwtService.extractUserId(token);
//             User user = userRepository.findById(userId).orElseThrow();

//             UsernamePasswordAuthenticationToken auth =
//                 new UsernamePasswordAuthenticationToken(user, null, List.of());

//             SecurityContextHolder.getContext().setAuthentication(auth);
//         } catch (Exception e) {
//             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//             return;
//         }

//         filterChain.doFilter(request, response);
//     }
// }
