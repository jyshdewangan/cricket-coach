package com.ghostcoach.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghostcoach.dto.CoachingReport;
import com.ghostcoach.dto.SessionResponse;
import com.ghostcoach.model.CoachingSession;
import com.ghostcoach.model.User;
import com.ghostcoach.repository.CoachingSessionRepository;
import com.ghostcoach.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionServiceTest {

    @Mock
    private CoachingSessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private GeminiVisionService geminiVisionService;

    @Mock
    private MultipartFile multipartFile;

    private SessionService sessionService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private User user;
    private UUID userId;

    @BeforeEach
    void setUp() {
        sessionService = new SessionService(
                sessionRepository,
                userRepository,
                fileStorageService,
                geminiVisionService,
                objectMapper
        );

        userId = UUID.randomUUID();
        user = new User();
        user.setId(userId);
        user.setEmail("player@example.com");
        user.setFullName("John Player");
        user.setRole("Right-hand Batsman");
        user.setExperienceLevel("Intermediate");
    }

    @Test
    void testCreateSessionSuccess() throws IOException {
        String relativePath = userId + "/test-stance.jpg";
        Path resolvedPath = Paths.get("uploads").resolve(relativePath);

        CoachingReport report = new CoachingReport();
        report.setOverallScore(6);
        report.setStrengths(List.of("Good stance width"));
        
        CoachingReport.AreaToImprove area = new CoachingReport.AreaToImprove();
        area.setIssue("Head falling away");
        area.setExplanation("Your head needs to remain aligned.");
        report.setAreasToImprove(List.of(area));
        
        report.setPriorityFix("Align head straight");
        report.setDrillSuggestion("Head alignment drills");
        report.setConfidenceLevel("High");
        report.setConfidenceReason("Stance clearly captured");

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(fileStorageService.storeFile(multipartFile, userId)).thenReturn(relativePath);
        when(fileStorageService.getFilePath(relativePath)).thenReturn(resolvedPath);
        when(geminiVisionService.analyzeStance(resolvedPath, user.getRole(), user.getExperienceLevel()))
                .thenReturn(report);

        SessionResponse response = sessionService.createSession(multipartFile, user.getEmail());

        assertNotNull(response);
        assertEquals(6, response.overallScore());
        assertEquals(relativePath, response.imagePath());
        assertEquals("Align head straight", response.priorityFix());
        assertEquals("High", response.confidenceLevel());
        assertEquals(1, response.strengths().size());
        assertEquals("Good stance width", response.strengths().get(0));
        assertEquals(1, response.areasToImprove().size());
        assertEquals("Head falling away", response.areasToImprove().get(0).issue());

        verify(sessionRepository, times(1)).save(any(CoachingSession.class));
    }

    @Test
    void testGetUserSessions() {
        CoachingSession session = new CoachingSession();
        session.setId(UUID.randomUUID());
        session.setUser(user);
        session.setImagePath("uploads/stance.jpg");
        session.setOverallScore(8);
        session.setStrengths("[\"High elbow\"]");
        session.setAreasToImprove("[]");
        session.setCreatedAt(LocalDateTime.now());

        PageImpl<CoachingSession> page = new PageImpl<>(List.of(session));

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(sessionRepository.findByUserIdOrderByCreatedAtDesc(eq(userId), any(PageRequest.class)))
                .thenReturn(page);

        Page<SessionResponse> result = sessionService.getUserSessions(user.getEmail(), 0, 10);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertEquals(8, result.getContent().get(0).overallScore());
        assertEquals("uploads/stance.jpg", result.getContent().get(0).imagePath());
    }

    @Test
    void testGetSessionByIdSuccess() {
        UUID sessionId = UUID.randomUUID();
        CoachingSession session = new CoachingSession();
        session.setId(sessionId);
        session.setUser(user);
        session.setImagePath("uploads/stance.jpg");
        session.setOverallScore(7);
        session.setStrengths("[]");
        session.setAreasToImprove("[]");
        session.setCreatedAt(LocalDateTime.now());

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        SessionResponse response = sessionService.getSessionById(sessionId, user.getEmail());

        assertNotNull(response);
        assertEquals(sessionId, response.id());
        assertEquals(7, response.overallScore());
    }

    @Test
    void testGetSessionByIdAccessDenied() {
        UUID sessionId = UUID.randomUUID();
        
        User stranger = new User();
        stranger.setId(UUID.randomUUID());
        stranger.setEmail("stranger@example.com");

        CoachingSession session = new CoachingSession();
        session.setId(sessionId);
        session.setUser(stranger); // Belongs to stranger

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                sessionService.getSessionById(sessionId, user.getEmail()));
        assertEquals("Access denied", exception.getMessage());
    }

    @Test
    void testGetSessionByIdNotFound() {
        UUID sessionId = UUID.randomUUID();

        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () ->
                sessionService.getSessionById(sessionId, user.getEmail()));
        assertEquals("Session not found", exception.getMessage());
    }
}
