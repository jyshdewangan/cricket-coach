# 🏏 Kohlified, or not?

`Kohlified, or not?` is a high-performance full-stack web application designed for cricket stance diagnostics. Calibrating its technical rigor to different player experience levels, the app utilizes the **Google Gemini 3 Flash Preview Vision API** to review athlete setups, pinpoint flaws, score batting stances on a strict 1-10 rubric, and prescribe targeted net drills.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite, React Router 6, Axios with JWT interceptors.
- **Backend**: Spring Boot 3.3 + Java 21, Spring Security 6 (Stateless JWT authentication).
- **Database**: PostgreSQL (JPA / Hibernate data persistence).
- **AI Engine**: Google Gemini 3 Flash Preview (Vision-enabled multi-modal model).

---

## 🚀 Setup Instructions

### 1. Database Setup
Create your target PostgreSQL database.
```sql
CREATE DATABASE ghostcoach;
```

### 2. Configure Environment Variables
Duplicate the template and enter your database credentials and Gemini API key.
```bash
cp .env.example .env
```

### 3. Launch the Backend
Navigate to the backend directory and boot the Spring Boot REST API.
```bash
cd backend
mvn spring-boot:run
```

### 4. Launch the Frontend
Navigate to the frontend directory, install dependencies, and start the Vite server.
```bash
cd frontend
npm install
npm run dev
```

---

## 🔮 Future Improvements (Roadmap)

- **💬 Personalized AI Coach Chat**: A conversational assistant enabling athletes to ask follow-up questions about their posture fixes and custom drill plans.
- **🔑 Google OAuth 2.0 Integration**: Quick social signup and login capability for frictionless athlete onboarding.
- **🤖 Batting Shot Analysis (Sequential LLM Chaining)**: Support for analyzing dynamic batting shots by performing orchestrations across two Gemini API calls—first validating correct shot selection, then analyzing execution biomechanics.
- **📐 3D Skeletal Overlay & Multi-Angle Parsing**: Ability to upload multiple stance angles simultaneously to map a comprehensive 3D skeletal joint posture grid.
