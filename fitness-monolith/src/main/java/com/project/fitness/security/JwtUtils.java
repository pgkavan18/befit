package com.project.fitness.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.List;

@Slf4j
@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private int jwtExpirationInMs;

    public String getJwtFromHeader(HttpServletRequest request) {
        String BearerToken = request.getHeader("Authorization");
        if (BearerToken != null && BearerToken.startsWith("Bearer ")) {
            return BearerToken.substring(7);
        }
        return null;
    }

    public  String generateToken(String userId, String role){


        return  Jwts.builder()
                .subject(userId)
                .claim("roles", List.of(role))
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + jwtExpirationInMs))
                .signWith(key())
                .compact();
    }

    public boolean validateToken(String jwtToken) {
        try {
            Jwts.parser().verifyWith((SecretKey) key()).build()
                    .parseSignedClaims(jwtToken);
            return true;
        } catch (Exception e) {
            log.error("JWT validation failed: {}", e.getMessage());
            return false;
        }
    }
    private Key key(){
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));

    }
    public String getUserIdFromToken(String jwt) {
        return Jwts.parser().verifyWith((SecretKey) key())
                .build().parseSignedClaims(jwt)
                .getPayload().getSubject();
    }
    public Claims getAllClaims(String jwt) {
        return Jwts.parser().verifyWith((SecretKey) key())
                .build().parseSignedClaims(jwt).getPayload();
    }

}
