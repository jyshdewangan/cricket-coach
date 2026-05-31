package com.ghostcoach.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghostcoach.dto.CoachingReport;
import com.ghostcoach.dto.SessionResponse;
import com.ghostcoach.model.CoachingSession;
import com.ghostcoach.model.User;
import com.ghostcoach.repository.CoachingSessionRepository;
import com.ghostcoach.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SessionService {

    private final CoachingSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final GeminiVisionService geminiVisionService;
    private final ObjectMapper objectMapper;

    public SessionService(CoachingSessionRepository sessionRepository,
                          UserRepository userRepository,
                          FileStorageService fileStorageService,
                          GeminiVisionService geminiVisionService,
                          ObjectMapper objectMapper) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.geminiVisionService = geminiVisionService;
        this.objectMapper = objectMapper;
    }

    public SessionResponse createSession(MultipartFile file, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Store file
        String relativePath = fileStorageService.storeFile(file, user.getId());
        Path imagePath = fileStorageService.getFilePath(relativePath);

        // Analyze with AI
        CoachingReport report = geminiVisionService.analyzeStance(
                imagePath, user.getRole(), user.getExperienceLevel());

        // Save session
        CoachingSession session = new CoachingSession();
        session.setId(UUID.randomUUID());
        session.setUser(user);
        session.setImagePath(relativePath);
        session.setOverallScore(report.getOverallScore());
        session.setPriorityFix(report.getPriorityFix());
        session.setDrillSuggestion(report.getDrillSuggestion());
        session.setConfidenceLevel(report.getConfidenceLevel());
        session.setConfidenceReason(report.getConfidenceReason());
        session.setCreatedAt(LocalDateTime.now());

        try {
            session.setStrengths(objectMapper.writeValueAsString(report.getStrengths()));
            session.setAreasToImprove(objectMapper.writeValueAsString(report.getAreasToImprove()));
            session.setRawAiResponse(objectMapper.writeValueAsString(report));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize coaching report", e);
        }

        sessionRepository.save(session);

        return mapToSessionResponse(session);
    }

    public Page<SessionResponse> getUserSessions(String userEmail, int page, int size) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return sessionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size))
                .map(this::mapToSessionResponse);
    }

    public SessionResponse getSessionById(UUID sessionId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CoachingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied");
        }

        return mapToSessionResponse(session);
    }

    private SessionResponse mapToSessionResponse(CoachingSession session) {
        List<String> strengths = List.of();
        List<SessionResponse.AreaToImprove> areasToImprove = List.of();

        try {
            if (session.getStrengths() != null && !session.getStrengths().isBlank()) {
                strengths = objectMapper.readValue(
                        session.getStrengths(), new TypeReference<List<String>>() {});
            }

            if (session.getAreasToImprove() != null && !session.getAreasToImprove().isBlank()) {
                List<CoachingReport.AreaToImprove> reportAreas = objectMapper.readValue(
                        session.getAreasToImprove(),
                        new TypeReference<List<CoachingReport.AreaToImprove>>() {});

                areasToImprove = reportAreas.stream()
                        .map(a -> new SessionResponse.AreaToImprove(a.getIssue(), a.getExplanation()))
                        .toList();
            }
        } catch (Exception e) {
            // Fall back to empty lists to avoid crashing the endpoint on corrupted JSON data
        }

        return new SessionResponse(
                session.getId(),
                session.getImagePath(),
                session.getOverallScore(),
                strengths,
                areasToImprove,
                session.getPriorityFix(),
                session.getDrillSuggestion(),
                session.getConfidenceLevel(),
                session.getConfidenceReason(),
                session.getCreatedAt()
        );
    }
}
