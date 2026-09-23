# ⚡ BeFit — Full-Stack Fitness Tracker & Health Analytics

A modern, full-stack fitness tracking and wellness platform built with **Spring Boot** and **React (Vite)**. BeFit enables athletes and everyday fitness enthusiasts to record multi-discipline workouts, track personalized physical metrics (Age, Height, Weight, BMI), analyze calorie burn tailored to their exact body composition, and receive AI-driven coaching insights.

---

## 🚀 Key Features

- **🏋️ Multi-Discipline Workout Logging**: Record activities across 8 categories (Running, Walking, Cycling, Swimming, Weight Training, Yoga, HIIT Cardio, Stretching) with telemetry metrics (distance, pace, average heart rate).
- **📊 Real-Time Body Composition & BMI**:
  - Calculates Body Mass Index (BMI) using WHO standards with color-coded classification badges (*Underweight*, *Normal weight*, *Overweight*, *Obese*).
  - Visual interactive BMI spectrum gauge with dynamic needle indicator.
  - Computes **Healthy Weight Range** targets and **Basal Metabolic Rate (BMR)** via the Mifflin-St Jeor formula.
- **🔥 Personalized Calorie Calculations**: Automatically calculates activity calorie expenditure using MET values and intensity multipliers, dynamically calibrated to the user's actual body weight.
- **📈 Interactive Health Dashboard**:
  - Overview metrics: total workouts, cumulative calories, active minutes, and consistency streaks.
  - 7-day activity trend visualization powered by Recharts.
- **🤖 AI Coaching & Recommendations**: Tailored workout advice, recovery suggestions, and safety improvements.
- **🔐 Secure Authentication**: Stateless JWT (HMAC-SHA256) authentication with protected routes and Google OAuth2 integration.

---

## 🛠️ Technology Stack

### Backend (`fitness-monolith`)
- **Language & Framework**: Java 25, Spring Boot 4.x
- **Data Access & ORM**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.0
- **Security**: Spring Security 6 with stateless JWT authentication
- **Documentation**: OpenAPI 3 / Swagger (`/swagger-ui.html`)
- **Build Tool**: Apache Maven (Wrapper included)
- **Containerization**: Docker (`Dockerfile`)

### Frontend (`befit-frontend`)
- **Framework & Tooling**: React 18, Vite
- **Routing**: React Router DOM (v6)
- **State & Context**: Context API for session management and notifications
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Styling**: Modern dark mode with Glassmorphism, tailored HSL color tokens, and micro-animations

---

## 📁 Repository Structure

```
befit/
├── .gitignore                      # Root Git ignore rules
├── README.md                       # Project documentation
│
├── befit-frontend/                 # React Frontend (Vite)
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js              # Dev server & backend proxy configuration
│   ├── public/                     # Static assets (favicons, etc.)
│   └── src/
│       ├── api/                    # Axios API service clients
│       ├── components/             # Reusable UI & feature components
│       ├── context/                # AuthContext & ToastContext
│       ├── pages/                  # Dashboard, Activities, Profile, etc.
│       └── utils/                  # BMI & Calorie computation formulas
│
└── fitness-monolith/               # Spring Boot REST Monolith
    ├── .gitignore
    ├── Dockerfile                  # OCI Container specification
    ├── mvnw / mvnw.cmd             # Maven Wrapper scripts
    ├── pom.xml                     # Maven project descriptor
    └── src/
        ├── main/
        │   ├── java/com/project/fitness/
        │   │   ├── config/         # Security & OpenAPI configurations
        │   │   ├── controller/     # REST API Controllers
        │   │   ├── dto/            # Request & Response DTOs
        │   │   ├── exceptions/     # Centralized error handling
        │   │   ├── model/          # JPA Entities & Enums
        │   │   ├── repository/     # Spring Data JPA repositories
        │   │   ├── security/       # JWT Filters & Token utilities
        │   │   └── service/        # Business logic services
        │   └── resources/
        │       └── application.properties # Spring configuration
        └── test/                   # Automated unit & integration tests
```

---

## 🏁 Getting Started

### Prerequisites
- **Java**: JDK 21 or higher (Java 25 recommended)
- **Node.js**: v18 or higher & npm
- **Database**: MySQL Server 8.0 running locally on port `3306`

---

### 1. Database Setup

Create the database in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS befit_db;
```

Configure your credentials in `fitness-monolith/src/main/resources/application-local.properties` (this file is ignored by Git):
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
jwt.secret=YOUR_BASE64_JWT_SECRET_KEY
```

---

### 2. Run the Backend (Spring Boot)

Navigate to `fitness-monolith` and start the server:

**Windows (CMD / PowerShell):**
```powershell
cd fitness-monolith
./mvnw.cmd spring-boot:run
```

**macOS / Linux:**
```bash
cd fitness-monolith
./mvnw spring-boot:run
```

The REST API will start at: **`http://localhost:8080`**  
Interactive API docs: **`http://localhost:8080/swagger-ui.html`**

---

### 3. Run the Frontend (React + Vite)

In a new terminal window, navigate to `befit-frontend`:

```bash
cd befit-frontend
npm install
npm run dev
```

Open your browser and navigate to: **`http://localhost:3000`**

*(All API requests through `/api` are automatically proxied to the backend at `http://127.0.0.1:8080`)*

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new athlete account (with optional age, height, weight) | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `POST` | `/api/auth/oauth2/google` | Google Single Sign-On | No |
| `GET` | `/api/users/profile` | Retrieve current authenticated user profile & BMI | Yes |
| `PUT` | `/api/users/profile` | Update physical metrics (age, height, weight) | Yes |
| `GET` | `/api/activities` | List all recorded activities for current user | Yes |
| `POST` | `/api/activities` | Log a new workout activity with automatic calorie calculation | Yes |
| `GET` | `/api/recommendation/user/{userId}` | Get AI coaching recommendations | Yes |
| `POST` | `/api/recommendation/generate` | Generate targeted activity insights | Yes |

---

## 🧪 Testing

Run backend unit and integration tests:

```powershell
cd fitness-monolith
./mvnw.cmd test
```

Build frontend production bundle:

```bash
cd befit-frontend
npm run build
```

---

## 📄 License
This project is licensed under the MIT License.
