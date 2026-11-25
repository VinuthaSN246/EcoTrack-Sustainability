# EcoTrack - AI-Powered Sustainability Application

## 1. Project Title
EcoTrack

## 2. Problem Statement
In today's world, understanding and reducing our environmental impact is more critical than ever. However, tracking daily habits and understanding their true carbon cost can be complex and overwhelming. EcoTrack exists to simplify this process, providing users with an intuitive, AI-powered platform to calculate their carbon footprint, receive personalized sustainability recommendations, and track their progress over time.

## 3. Features
- **Carbon Footprint Calculator**: Estimate your emissions across transportation, electricity, food, and waste.
- **Rule-based Recommendations**: Receive personalized tips based on calculator inputs.
- **Machine Learning Estimate**: Compare the deterministic calculator result with a model trained on synthetic data; this is illustrative, not validated against real-world measurements.
- **Comprehensive Dashboard**: Visualize your sustainability journey with interactive charts and metrics.
- **Detailed User Profiles**: Track achievements, activity history, and manage settings.
- **Account History**: Signed-in users can save and retrieve footprint history through the Flask API.

## 4. Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend**: Python, Flask, Flask-CORS, SQLAlchemy
- **Database**: SQLite
- **Machine Learning**: Scikit-Learn

## 5. Project Structure
```text
.
├── backend/                  # Flask API and Backend Services
│   ├── app.py                # Main application entry point
│   ├── database.py           # Database configuration and session management
│   ├── models.py             # SQLAlchemy ORM models
│   ├── services/             # Business logic and ML services
│   └── requirements.txt      # Python dependencies
├── src/                      # React Frontend
│   ├── components/           # Reusable UI components
│   ├── pages/                # Application pages (Dashboard, Profile, Calculator, etc.)
│   ├── services/             # API client and integrations
│   ├── types/                # TypeScript interfaces
│   ├── App.tsx               # Main React component and routing
│   └── index.css             # Global styles and design tokens
├── package.json              # Frontend dependencies and scripts
└── vite.config.ts            # Vite bundler configuration
```

## 6. Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn package manager

## Security and deployment configuration

The backend uses HTTP-only signed session cookies. Set a unique `SECRET_KEY`, exact frontend origins in `CORS_ORIGINS`, and enable `COOKIE_SECURE=true` behind HTTPS. `backend/.env.example` lists the backend settings. SQLite is suitable for local development; use a managed PostgreSQL database with `postgresql+psycopg://...` for a multi-user deployment. Provision that database, run a schema migration process, and configure backups before launch. Keep `.env` files and local database contents out of source control.

Passwords must be at least 12 characters. Footprint APIs use the authenticated session to determine record ownership; they do not accept a client-selected user ID.

## Emissions methodology

Calculator values are annualized tonnes CO₂e estimates. Transport factors are based on UK DEFRA/BEIS 2023, electricity uses a global-average factor (not a country-specific grid), food factors are broad approximations derived from published research, and waste/recycling and flight tiers are estimates. These factors should be regionally reviewed and versioned before using results for reporting or decisions.

## Local checks

```bash
npm run typecheck
npm run lint
npm run test:run
cd backend
python test_flask_api.py
python test_database.py
```

## Continuous integration

GitHub Actions runs frontend typecheck, lint, unit tests, and production build, plus backend syntax and isolated API/database checks on pushes and pull requests.

## Release checklist

1. Add a long random `SECRET_KEY` in the hosting provider's secret manager.
2. Configure the exact deployed frontend origin in `CORS_ORIGINS` and set `COOKIE_SECURE=true` behind HTTPS.
3. Provision PostgreSQL, set `DATABASE_URL`, and configure backups and schema migrations.
4. Set `VITE_API_BASE` to the deployed API endpoint, then build and deploy the frontend.
5. Review and version emission factors for the intended region before treating estimates as decision-grade.

## 7. Installation & Setup Instructions

### Clone the Repository
```bash
git clone <repository-url>
cd ECOTRACK/project
```

### Frontend Setup
```bash
npm install
# Create a .env file based on .env.example
cp .env.example .env
```

### Backend Setup
```bash
cd backend
python -m venv venv
# Activate the virtual environment
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
# Create a .env file based on .env.example
cp .env.example .env
```

## 8. Running the Application (Development)

To run the full application locally, you need to start both the frontend and backend servers.

### Start the Backend Server
```bash
cd backend
# Ensure your virtual environment is active
python app.py
```
The Flask API will run on `http://localhost:5001` (by default).

### Start the Frontend Server
```bash
# In a new terminal window, from the project root
npm run dev
```
The Vite development server will start, typically on `http://localhost:5173`.

## 9. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/register` | Register a new user |
| `POST` | `/api/login` | Authenticate a user |
| `GET` | `/api/user/<id>` | Fetch user profile data |
| `POST` | `/api/footprints` | Save a new footprint calculation |
| `GET` | `/api/footprints/<user_id>` | Get all footprint history for a user |
| `GET` | `/api/recommendations` | Get personalized recommendations based on footprint |
| `POST` | `/api/predict` | Get ML-based prediction for future footprint |

## 10. Database Schema

The application uses SQLite with SQLAlchemy ORM.

**`users` Table:**
- `id`: Integer, Primary Key
- `name`: String
- `email`: String, Unique
- `password_hash`: String
- `created_at`: DateTime

**`footprint_records` Table:**
- `id`: Integer, Primary Key
- `user_id`: Integer, Foreign Key (`users.id`)
- `transportation`: Float
- `electricity`: Float
- `food`: Float
- `waste`: Float
- `total_co2`: Float
- `eco_score`: Integer
- `created_at`: DateTime

**`recommendations` Table:**
- `id`: Integer, Primary Key
- `category`: String
- `title`: String
- `description`: Text
- `priority`: Integer

## 11. Machine Learning Integration Details
The backend includes a machine learning service that analyzes user footprint data. It uses historical records to identify patterns and predict future emission trends. The models are trained locally on anonymized data patterns to provide customized insights without exposing sensitive user information.

## 12. Security Features
- **Password Hashing**: User passwords are securely hashed using `werkzeug.security` before storage. No plain-text passwords are saved.
- **Input Validation**: Strict validation on the backend ensures data integrity and prevents injection attacks.
- **Environment Variables**: Sensitive configuration (like database URLs and API keys) are managed via `.env` files, keeping them out of version control.
- **CORS Configuration**: Cross-Origin Resource Sharing is restricted to authorized frontend domains.

## 13. Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 14. License
This project is licensed under the MIT License - see the LICENSE file for details.
