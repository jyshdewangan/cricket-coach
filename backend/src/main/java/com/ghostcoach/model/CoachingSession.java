package com.ghostcoach.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "coaching_sessions")
public class CoachingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "image_path", nullable = false, length = 500)
    private String imagePath;

    @Column(name = "overall_score")
    private Integer overallScore;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "strengths", columnDefinition = "jsonb")
    private String strengths;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "areas_to_improve", columnDefinition = "jsonb")
    private String areasToImprove;

    @Column(name = "priority_fix", columnDefinition = "TEXT")
    private String priorityFix;

    @Column(name = "drill_suggestion", columnDefinition = "TEXT")
    private String drillSuggestion;

    @Column(name = "confidence_level", length = 10)
    private String confidenceLevel;

    @Column(name = "confidence_reason", columnDefinition = "TEXT")
    private String confidenceReason;

    @Column(name = "raw_ai_response", columnDefinition = "TEXT")
    private String rawAiResponse;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public CoachingSession() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getAreasToImprove() {
        return areasToImprove;
    }

    public void setAreasToImprove(String areasToImprove) {
        this.areasToImprove = areasToImprove;
    }

    public String getPriorityFix() {
        return priorityFix;
    }

    public void setPriorityFix(String priorityFix) {
        this.priorityFix = priorityFix;
    }

    public String getDrillSuggestion() {
        return drillSuggestion;
    }

    public void setDrillSuggestion(String drillSuggestion) {
        this.drillSuggestion = drillSuggestion;
    }

    public String getConfidenceLevel() {
        return confidenceLevel;
    }

    public void setConfidenceLevel(String confidenceLevel) {
        this.confidenceLevel = confidenceLevel;
    }

    public String getConfidenceReason() {
        return confidenceReason;
    }

    public void setConfidenceReason(String confidenceReason) {
        this.confidenceReason = confidenceReason;
    }

    public String getRawAiResponse() {
        return rawAiResponse;
    }

    public void setRawAiResponse(String rawAiResponse) {
        this.rawAiResponse = rawAiResponse;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
