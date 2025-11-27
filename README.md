# MediScan: Digital Prescription and Healthcare Management System

MediScan is a full-stack web application designed to streamline prescription management, appointment bookings, and patient-doctor communication. It supports various user roles, including Doctors, Patients, and Family Members, each with tailored functionalities.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Doctor Panel
- View and manage appointment bookings.
- Secure messaging with patients.
- Upload, confirm, or draw digital prescriptions.
- Fill online medicine forms for patients.
- View patient medical history and prescriptions.
- Mark medicines as 'sent to pharmacy' (Tata 1mg integration).

### Patient Panel
- Book appointments with doctors.
- Capture prescriptions via camera/image upload with OCR.
- Review and edit parsed prescription details.
- Set reminders for medicine intakes.
- Order medicines via Tata 1mg affiliate link.
- View medication details and history.

### Family Panel
- Link to patients via invite/consent.
- Access read-only or editable patient data (prescriptions, schedules, appointments).
- Receive notifications for linked patients.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router
- Zustand (or Context for lightweight state)
- Axios (for API calls)

**Backend:**
- Node.js
- Express
- MongoDB (Atlas preferred) with Mongoose

**OCR / Prescription Reading:**
- Cloud OCR: Google Cloud Vision API or AWS Textract
- Open-source fallback: Tesseract.js with NLP post-processor

**Notifications:**
- Twilio (for SMS)
- Firebase Cloud Messaging (FCM) (for in-browser/mobile push notifications - optional)

**Optional (for heavy async processing):**
- Redis (for job queue - BullMQ or Bree)

**Deployment:**
- Docker (for backend)
- Vite build (for frontend)
- Docker Compose (for local development)
- Vercel/Netlify (for frontend deployment)
- Render/Heroku or AWS/GCP (for backend deployment)

## Setup Instructions

### Prerequisites

- Node.js (v20.19.0 or v22.12.0 or higher is recommended for Vite compatibility)
- npm (Node Package Manager)
- MongoDB Atlas account or local MongoDB instance
- Git

### Manual Setup

#### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory based on the example (see [Environment Variables](#environment-variables)).
4.  Ensure a MongoDB instance is running and accessible via the `MONGODB_URI` specified in your `.env` file.
5.  Start the backend server:
    ```bash
    npm start
    ```

#### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory with `VITE_BACKEND_URL=http://localhost:5000/api`.
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```