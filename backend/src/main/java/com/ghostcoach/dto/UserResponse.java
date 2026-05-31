package com.ghostcoach.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
    UUID id,
    String fullName,
    String email,
    String sport,
    String role,
    String experienceLevel,
    LocalDateTime createdAt
) {}
