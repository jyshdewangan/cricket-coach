package com.ghostcoach.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SessionResponse(
    UUID id,
    String imagePath,
    int overallScore,
    List<String> strengths,
    List<AreaToImprove> areasToImprove,
    String priorityFix,
    String drillSuggestion,
    String confidenceLevel,
    String confidenceReason,
    LocalDateTime createdAt
) {
    public record AreaToImprove(
        String issue,
        String explanation
    ) {}
}
