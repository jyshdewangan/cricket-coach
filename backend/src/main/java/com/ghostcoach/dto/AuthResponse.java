package com.ghostcoach.dto;

public record AuthResponse(
    String token,
    UserResponse user
) {}
