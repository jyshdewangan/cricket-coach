package com.ghostcoach.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghostcoach.dto.CoachingReport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiVisionService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model}")
    private String model;

    @Value("${app.gemini.endpoint}")
    private String endpoint;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiVisionService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public CoachingReport analyzeStance(Path imagePath, String role, String experienceLevel) {
        try {
            // Read and encode image
            byte[] imageBytes = Files.readAllBytes(imagePath);
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            // Determine MIME type
            String fileName = imagePath.getFileName().toString().toLowerCase();
            String mimeType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

            // Build prompt
            String prompt = buildPrompt(role, experienceLevel);

            // Build request body
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(
                        Map.of("text", prompt),
                        Map.of("inline_data", Map.of(
                            "mime_type", mimeType,
                            "data", base64Image
                        ))
                    )
                )),
                "generationConfig", Map.of(
                    "temperature", 0.3
                )
            );

            // Build URL
            String url = endpoint + "/" + model + ":generateContent?key=" + apiKey;

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make request
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getBody() == null) {
                throw new RuntimeException("Empty response from Gemini API");
            }

            // Parse response
            JsonNode root = objectMapper.readTree(response.getBody());
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            // Clean the text (remove markdown code fences if present)
            text = text.trim();
            if (text.startsWith("```json")) {
                text = text.substring(7);
            } else if (text.startsWith("```")) {
                text = text.substring(3);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - 3);
            }
            text = text.trim();

            return objectMapper.readValue(text, CoachingReport.class);

        } catch (IOException e) {
            throw new RuntimeException("Failed to analyze stance: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String role, String experienceLevel) {
        return """
            You are a ruthlessly honest elite cricket coach and biomechanics analyst.
Your reputation depends on accurate diagnosis, not player feelings.
You have coached at first-class level. You do not give participation scores.

Player Profile:
- Role: %s
- Experience Level: %s

ORTHODOX BATTING STANCE — REFERENCE STANDARD:
The correct batting stance is defined as follows:
- Body position: side-on, front shoulder pointing directly toward the bowler
- Feet: shoulder-width apart, balanced
- Knees: slightly bent, not locked
- Back: slightly bent forward, enough to comfortably tap bat on the ground near the feet
- Chin: positioned over the front shoulder, eyes level and watching the bowler
- Hands: close to the body at approximately hip height
- Bat: bottom of bat pointing back toward the wicket-keeper or first slip

Any visible deviation from this reference is a flaw and must be penalised.
Use this as your scoring baseline — a player matching all of the above starts at 10 
and loses points for every deviation. A player matching none of it starts at 1.

GROUND RULES BEFORE YOU BEGIN:
- Most amateur photos will score 3-6. That is normal and expected.
- A score above 7 requires explicit written justification for each point above 7.
- If a flaw is visible, it must be penalised. No partial credits for "trying".
- If a body part is not visible in the image, mark it UNASSESSABLE — do not skip it silently.
- Never infer intent. Score only what is geometrically visible in the image.

STEP 1 — BATTING STANCE CHECKLIST
Evaluate each item. State GOOD / FLAWED / UNASSESSABLE. If FLAWED, describe the specific flaw in one sentence.

[ ] Grip — top hand V aligned down spine of bat, bottom hand V matching, no gap between hands, no white knuckle squeeze
[ ] Stance width — approximately shoulder width, not too wide (restricts movement) or too narrow (unstable base)
[ ] Foot alignment — both feet parallel to crease, front toe pointing toward cover, not splayed
[ ] Knee flex — both knees slightly bent and relaxed, not locked straight, not over-bent
[ ] Head position — level, eyes horizontal (not tilted), chin tucked over front shoulder, not drooping
[ ] Weight distribution — balanced or slightly back-foot heavy, not falling onto toes or heels
[ ] Shoulder alignment — front shoulder closed, pointing down the pitch toward bowler
[ ] Bat position — resting beside or behind back toe, not hanging in mid-air or too far from body
[ ] Backlift — angled toward second slip, not gully (too open) or fine leg (too closed)
[ ] Top elbow — high and pointing toward mid-on, not collapsed downward or tucked into body
[ ] Front arm — relaxed and controlling, not rigid or collapsed
[ ] Overall balance — body weight centred, no visible lean forward or backward

STEP 2 — PENALTY SCORING
Start at 10. Apply deductions:

CRITICAL flaws (each = -2 points):
- Incorrect grip (V's misaligned, hands split)
- Head tilting or falling away
- Both knees locked straight
- Stance extremely wide or extremely narrow
- Front shoulder completely open (chest facing bowler)

SERIOUS flaws (each = -1.5 points):
- Weight visibly on heels or toes
- Top elbow low and collapsed
- Backlift directed toward fine leg or gully
- Front foot splayed open excessively
- Bat held far from body at stance

MINOR flaws (each = -0.5 points):
- Slight foot misalignment
- One V grip slightly off
- Minor head tilt
- Marginal stance width issue
- Front arm slightly stiff

UNASSESSABLE items: -0.3 per item

Floor is 1. Ceiling is 10 but justify every point above 7 explicitly.

STEP 3 — SHOW YOUR MATH
Write the score as:
10 - [deduction 1 reason] - [deduction 2 reason] ... = [Final Score]

Example:
10 - 2.0 (head falling away) - 1.5 (top elbow collapsed) - 0.3 (grip unassessable) = 6.2 → rounded to 6

EXPERIENCE LEVEL CALIBRATION:
- Beginner: Plain English. Name the flaw, explain why it will hurt them in a real match situation.
- Intermediate: Technical terms. Reference which delivery type will exploit this flaw (e.g. "this open stance will expose you to sharp inswing").
- Advanced: Surgical precision. Compare to first-class standards. Minor deviations matter.

CONFIDENCE LEVEL RULES:
- High: 10+ checklist items clearly visible
- Medium: 7-9 items visible
- Low: fewer than 7 items visible, or head/grip/feet obscured
- Cannot score above 7 if confidence is Low or Medium

            Respond ONLY with a JSON object matching this exact schema (no markdown, no code fences, just raw JSON):
            {
              "overall_score": <integer 1-10>,
              "strengths": [<string>, ...],
              "areas_to_improve": [{"issue": <string>, "explanation": <string>}, ...],
              "priority_fix": <string>,
              "drill_suggestion": <string>,
              "confidence_level": <"Low" | "Medium" | "High">,
              "confidence_reason": <string>
            }
            """.formatted(role, experienceLevel);
    }
}
