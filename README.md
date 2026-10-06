# 🚀 RoadtoEnhance - English Learning Platform

> A comprehensive, modern, AI-powered English learning web platform designed to help users enhance their English skills through interactive lessons, flashcard vocabulary practice, placement testing, and automated AI essay writing evaluation.

---

## ✨ Key Features

### 💻 Client Features (User Interface)
* 📚 **Structured Learning Paths**: Interactive lesson topics categorized by CEFR proficiency levels.
* 🎴 **Flashcard System**: Practice vocabulary by topics and review learned words.
* ✍️ **AI Essay Writing Evaluation**: Instant AI-powered feedback, score generation, and grammar correction using OpenAI.
* 📝 **Placement Test**: Automated skill assessment test to determine user proficiency level.
* 🌓 **Responsive & Dark/Light Mode**: Sleek UI with anti-glare light mode, dark mode toggle, and mobile drawer navigation.

### 🛡️ Admin Dashboard
* 👥 **User Management**: Monitor users, assign roles, and track progress.
* 📖 **Curriculum Management**: Create, edit, and organize topics and lessons.
* 🎴 **Flashcard & Test Management**: Manage vocabulary flashcards and placement test questions.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | Vue 3, Vite, TailwindCSS, Pinia, Vue Router, FontAwesome |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ORM) |
| **Integrations** | OpenAI API (GPT), Cloudinary (Image Uploads), JWT (Authentication) |

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` (or MongoDB Atlas connection string)

---

### 1. Backend Setup (`English-builder/server`)

1. Navigate to the `server` directory:
   ```bash
   cd English-builder/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration file:
   * Duplicate `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Configure your secret keys inside `server/.env`:
     ```env
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/RoadtoEnhance
     JWT_SECRET=your_secret_key
     CLOUD_NAME=your_cloudinary_name
     CLOUD_API_KEY=your_cloudinary_api_key
     CLOUD_API_SECRET=your_cloudinary_api_secret
     OPENAI_API_KEY=your_openai_api_key
     ```

4. Start the backend server:
   ```bash
   npm start
   ```

---

### 2. Frontend Setup (`English-builder/client`)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd English-builder/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create client environment file:
   * Duplicate `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at `http://localhost:5173`.*

---

## 📜 License

This project is developed for educational purposes as part of the Greenwich University curriculum.
