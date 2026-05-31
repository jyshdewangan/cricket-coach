package com.ghostcoach.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "super-secret-key-that-needs-to-be-long-enough-for-hmac-sha-256";
    private final long expirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secret, expirationMs);
    }

    @Test
    void testGenerateTokenAndValidate() {
        String email = "test@example.com";
        String token = jwtTokenProvider.generateToken(email);

        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(email, jwtTokenProvider.getEmailFromToken(token));
    }

    @Test
    void testValidateInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid-token-string"));
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken(null));
    }

    @Test
    void testExpiredToken() throws InterruptedException {
        // Create a provider with a very short expiration time (1ms)
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(secret, 1);
        String token = shortLivedProvider.generateToken("user@example.com");
        
        // Wait 5 milliseconds to guarantee expiration
        Thread.sleep(5);
        
        assertFalse(shortLivedProvider.validateToken(token));
    }
}
