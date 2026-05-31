package com.ghostcoach.service;

import com.ghostcoach.dto.AuthResponse;
import com.ghostcoach.dto.LoginRequest;
import com.ghostcoach.dto.RegisterRequest;
import com.ghostcoach.dto.UserResponse;
import com.ghostcoach.model.User;
import com.ghostcoach.repository.UserRepository;
import com.ghostcoach.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, passwordEncoder, jwtTokenProvider);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
                "Virat Kohli",
                "virat@rcb.com",
                "password123",
                "Cricket",
                "Right-hand Batsman",
                "Advanced"
        );

        when(userRepository.existsByEmail(request.email())).thenReturn(false);
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPassword");
        when(jwtTokenProvider.generateToken(request.email())).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.token());
        assertEquals("Virat Kohli", response.user().fullName());
        assertEquals("virat@rcb.com", response.user().email());
        assertEquals("Cricket", response.user().sport());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest(
                "Virat Kohli",
                "virat@rcb.com",
                "password123",
                "Cricket",
                "Right-hand Batsman",
                "Advanced"
        );

        when(userRepository.existsByEmail(request.email())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("virat@rcb.com", "password123");
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("virat@rcb.com");
        user.setPasswordHash("encodedPassword");
        user.setFullName("Virat Kohli");

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.password(), user.getPasswordHash())).thenReturn(true);
        when(jwtTokenProvider.generateToken(user.getEmail())).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.token());
        assertEquals("Virat Kohli", response.user().fullName());
    }

    @Test
    void testLoginInvalidEmailThrowsException() {
        LoginRequest request = new LoginRequest("wrong@rcb.com", "password123");

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void testLoginWrongPasswordThrowsException() {
        LoginRequest request = new LoginRequest("virat@rcb.com", "wrongpassword");
        User user = new User();
        user.setEmail("virat@rcb.com");
        user.setPasswordHash("encodedPassword");

        when(userRepository.findByEmail(request.email())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.password(), user.getPasswordHash())).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void testGetCurrentUserSuccess() {
        String email = "virat@rcb.com";
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail(email);
        user.setFullName("Virat Kohli");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        UserResponse response = authService.getCurrentUser(email);

        assertNotNull(response);
        assertEquals("Virat Kohli", response.fullName());
        assertEquals(email, response.email());
    }

    @Test
    void testGetCurrentUserNotFoundThrowsException() {
        String email = "missing@rcb.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.getCurrentUser(email));
    }
}
