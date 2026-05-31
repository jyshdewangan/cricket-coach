package com.ghostcoach.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class CoachingReport {

    @JsonProperty("overall_score")
    private int overallScore;

    private List<String> strengths;

    @JsonProperty("areas_to_improve")
    private List<AreaToImprove> areasToImprove;

    @JsonProperty("priority_fix")
    private String priorityFix;

    @JsonProperty("drill_suggestion")
    private String drillSuggestion;

    @JsonProperty("confidence_level")
    private String confidenceLevel;

    @JsonProperty("confidence_reason")
    private String confidenceReason;

    public CoachingReport() {}

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public List<String> getStrengths() { return strengths; }
    public void setStrengths(List<String> strengths) { this.strengths = strengths; }

    public List<AreaToImprove> getAreasToImprove() { return areasToImprove; }
    public void setAreasToImprove(List<AreaToImprove> areasToImprove) { this.areasToImprove = areasToImprove; }

    public String getPriorityFix() { return priorityFix; }
    public void setPriorityFix(String priorityFix) { this.priorityFix = priorityFix; }

    public String getDrillSuggestion() { return drillSuggestion; }
    public void setDrillSuggestion(String drillSuggestion) { this.drillSuggestion = drillSuggestion; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public String getConfidenceReason() { return confidenceReason; }
    public void setConfidenceReason(String confidenceReason) { this.confidenceReason = confidenceReason; }

    public static class AreaToImprove {
        private String issue;
        private String explanation;

        public AreaToImprove() {}

        public String getIssue() { return issue; }
        public void setIssue(String issue) { this.issue = issue; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }
}
