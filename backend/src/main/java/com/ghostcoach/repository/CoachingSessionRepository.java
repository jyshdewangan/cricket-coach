package com.ghostcoach.repository;

import com.ghostcoach.model.CoachingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CoachingSessionRepository extends JpaRepository<CoachingSession, UUID> {
    Page<CoachingSession> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
    List<CoachingSession> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
