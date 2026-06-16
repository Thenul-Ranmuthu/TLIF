// package com.tlif.tlif.services;

// import java.util.Date;

// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.stereotype.Service;

// import com.tlif.tlif.entity.User;

// import io.jsonwebtoken.Claims;
// import io.jsonwebtoken.Jwts;
// import io.jsonwebtoken.security.Keys;



// @Service
// public class JwtService {
//     @Value("${app.jwt.secret}")
//     private String secret;

//     public String generateToken(User user){
//         return Jwts.builder()
//             .setSubject(user.getId())
//             .claim("email", user.getEmail())
//             .claim("role", user.getRole())
//             .claim("userName", user.getUserName())
//             .setIssuedAt(new Date())
//             .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
//             .signWith(Keys.hmacShaKeyFor(secret.getBytes()))
//             .compact();
//     }

//     public Claims validateToken(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }

//     public String extractUserId(String token) {
//         return validateToken(token).getSubject();
//     }
// }
