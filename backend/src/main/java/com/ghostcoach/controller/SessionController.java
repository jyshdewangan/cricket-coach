package com.ghostcoach.controller;

import com.ghostcoach.dto.SessionResponse;
import com.ghostcoach.service.SessionService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/sessions")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<SessionResponse> createSession(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        SessionResponse response = sessionService.createSession(file, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<SessionResponse>> getUserSessions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Page<SessionResponse> sessions = sessionService.getUserSessions(
                authentication.getName(), page, size);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SessionResponse> getSessionById(
            @PathVariable UUID id,
            Authentication authentication) {
        SessionResponse response = sessionService.getSessionById(id, authentication.getName());
        return ResponseEntity.ok(response);
    }
}
