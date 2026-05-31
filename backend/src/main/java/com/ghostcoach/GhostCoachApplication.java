package com.ghostcoach;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;
import java.io.IOException;
import java.util.TimeZone;

@SpringBootApplication
public class GhostCoachApplication {

    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
        loadEnv();
        SpringApplication.run(GhostCoachApplication.class, args);
    }

    private static void loadEnv() {
        File envFile = new File(".env");
        if (!envFile.exists()) {
            envFile = new File("../.env");
        }
        if (envFile.exists()) {
            try (java.io.BufferedReader reader = new java.io.BufferedReader(new java.io.FileReader(envFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }
                    int eqIdx = line.indexOf('=');
                    if (eqIdx > 0) {
                        String key = line.substring(0, eqIdx).trim();
                        String value = line.substring(eqIdx + 1).trim();
                        
                        // Strip comments at the end of the value
                        int commentIdx = value.indexOf('#');
                        if (commentIdx >= 0) {
                            value = value.substring(0, commentIdx).trim();
                        }
                        
                        // Strip quotes if present
                        if (value.startsWith("\"") && value.endsWith("\"")) {
                            value = value.substring(1, value.length() - 1);
                        } else if (value.startsWith("'") && value.endsWith("'")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        
                        System.setProperty(key, value);
                    }
                }
                System.out.println("Loaded environment variables from " + envFile.getAbsolutePath());
            } catch (IOException e) {
                System.err.println("Failed to load .env file: " + e.getMessage());
            }
        } else {
            System.out.println(".env file not found. Falling back to system environment variables.");
        }
    }
}
