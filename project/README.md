# EcoTrack - AI-Powered Sustainability Application

## 1. Project Title
EcoTrack

## 2. Problem Statement
In today's world, understanding and reducing our environmental impact is more critical than ever. However, tracking daily habits and understanding their true carbon cost can be complex and overwhelming. EcoTrack exists to simplify this process, providing users with an intuitive, AI-powered platform to calculate their carbon footprint, receive personalized sustainability recommendations, and track their progress over time.

## 3. Features
- **Carbon Footprint Calculator**: Estimate your emissions across transportation, electricity, food, and waste.
- **AI-Powered Recommendations**: Receive personalized tips to reduce your environmental impact.
- **Machine Learning Integration**: Predict future trends and analyze complex patterns in user data.
- **Comprehensive Dashboard**: Visualize your sustainability journey with interactive charts and metrics.
- **Detailed User Profiles**: Track achievements, activity history, and manage settings.
- **Secure Data Storage**: Your history and progress are securely saved locally.

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
