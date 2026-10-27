# 🌱 EcoTrack — AI-Powered Sustainability Application

**EcoTrack** is an AI-powered sustainability application designed to help users understand, track, and reduce their environmental impact. It combines carbon footprint calculation, personalized sustainability recommendations, an AI Sustainability Assistant, interactive data visualization, and machine learning-based emission prediction in one platform.

The application helps users make informed environmental decisions by tracking their carbon footprint, monitoring sustainability progress, and discovering practical ways to adopt eco-friendly habits.

---

## 🚀 Key Features

- 🌍 **Carbon Footprint Calculator** — Calculate carbon emissions based on transportation, electricity consumption, food habits, and waste generation.
- 🤖 **AI Sustainability Assistant** — Interact with an AI-powered assistant to explore sustainability topics and receive environmental guidance.
- 💡 **Personalized Sustainability Recommendations** — Discover practical suggestions based on carbon footprint data and sustainability goals.
- 📊 **Interactive Sustainability Dashboard** — Visualize carbon emissions, activity data, and sustainability progress.
- 📈 **Machine Learning-Based Emission Prediction** — Use machine learning to analyze emission data and estimate future trends.
- 👤 **User Profiles** — Maintain individual user information and sustainability preferences.
- 📋 **Activity History** — Track previous calculations and monitor changes over time.
- 🗄️ **Database Integration** — Store application data using SQLite and SQLAlchemy.
- 🌱 **Environmental Insights** — Understand emission patterns and identify opportunities to reduce environmental impact.

---

## 🛠️ Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Lucide React

### Backend
- Python
- Flask
- Flask-CORS
- SQLAlchemy

### Database
- SQLite

### Machine Learning
- Scikit-learn

### Artificial Intelligence
- AI Sustainability Assistant
- AI-powered sustainability recommendations

---

## 🏗️ System Architecture

EcoTrack follows a frontend-backend architecture in which the user interface communicates with the Python backend through API endpoints.

```text
                ┌──────────────────────────┐
                │       User Interface     │
                │  React + TypeScript      │
                └────────────┬─────────────┘
                             │
                             │ HTTP Requests
                             ▼
                ┌──────────────────────────┐
                │      Flask Backend       │
                │       REST APIs          │
                └────────────┬─────────────┘
                             │
                 ┌───────────┴───────────┐
                 │                       │
                 ▼                       ▼
       ┌──────────────────┐   ┌────────────────────┐
       │   SQLite Database│   │ AI / ML Components │
       │  SQLAlchemy ORM  │   │ Recommendations    │
       └──────────────────┘   │ Emission Prediction│
                              │ Sustainability AI  │
                              └────────────────────┘
```

*Note: This diagram represents the application's high-level architecture. The exact integration of individual AI and machine learning components depends on their implementation.*

---

## 📁 Project Structure

```text
EcoTrack-Sustainability/
└── project/
    ├── backend/
    │   ├── app.py
    │   ├── requirements.txt
    │   └── ...
    ├── src/
    │   └── ...
    ├── public/
    │   └── ...
    ├── package.json
    ├── vite.config.ts
    └── README.md
```

**Main directories:**

- `backend/` — Python Flask backend, API endpoints, and server-side logic.
- `src/` — React frontend source code and application components.
- `public/` — Static assets used by the frontend.
- `package.json` — Frontend dependencies and development scripts.
- `vite.config.ts` — Vite development and build configuration.
- `README.md` — Project documentation and setup instructions.

---

## ⚙️ Getting Started

Follow these steps to run EcoTrack on your local machine.

### Prerequisites

Install the following software before starting:

- [Git](https://git-scm.com/)
- [Node.js and npm](https://nodejs.org/)
- [Python](https://www.python.org/)

### 1. Clone the Repository

```bash
git clone https://github.com/VinuthaSN246/EcoTrack-Sustainability.git
```

Navigate to the project directory:

```bash
cd EcoTrack-Sustainability/project
```

### 2. Set Up the Frontend

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

### 3. Set Up the Backend

Open a new terminal and navigate to the backend directory:

```bash
cd EcoTrack-Sustainability/project/backend
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

On macOS or Linux:

```bash
source venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

The backend will run at the address configured in the application.

**Note:** Keep the frontend and backend running in separate terminals. Ensure the frontend API configuration matches the backend URL and port.

---

## 🤖 AI and Machine Learning

EcoTrack combines AI-powered sustainability assistance with data-driven environmental insights.

### AI Sustainability Assistant

The AI Sustainability Assistant is designed to help users:

- Understand environmental and sustainability concepts.
- Explore practical ways to adopt eco-friendly habits.
- Receive guidance on reducing their environmental impact.
- Make more informed sustainability-related decisions.

### AI-Powered Recommendations

The application provides sustainability recommendations intended to help users identify practical improvements based on their carbon footprint and environmental activities.

### Machine Learning-Based Emission Prediction

Scikit-learn supports the machine learning component of EcoTrack, which is designed to analyze carbon footprint data, identify patterns, and estimate future emission trends.

These capabilities help users understand their environmental impact and explore opportunities for improvement.

---

## 🌍 Carbon Footprint Tracking

EcoTrack focuses on four major areas of everyday activity:

| Category | What It Tracks |
|---|---|
| 🚗 Transportation | Emissions associated with travel |
| ⚡ Electricity | Emissions associated with electricity consumption |
| 🍽️ Food | Environmental impact associated with food habits |
| ♻️ Waste | Emissions associated with waste generation |

By organizing activities into these categories, EcoTrack helps users understand potential sources of emissions and identify areas where changes may reduce their carbon footprint.

*Note: Actual emission values depend on the calculation methodology and emission factors implemented in the application.*

---

## 🎯 Project Objectives

The primary objectives of EcoTrack are to:

- Make carbon footprint tracking accessible and easy to understand.
- Encourage environmentally responsible daily habits.
- Provide personalized sustainability guidance.
- Help users monitor their environmental progress.
- Apply artificial intelligence and machine learning to sustainability-related tasks.
- Promote awareness of individual environmental impact.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Integration with real-time environmental datasets.
- Enhanced emission prediction models.
- More advanced personalized recommendations.
- Goal setting and sustainability challenges.
- Improved historical analytics and progress reports.
- Additional visualizations for comparing emission trends.
- Expanded AI-assisted environmental insights.

---

## 📚 Documentation

Detailed technical documentation is available in:

**`project/README.md`**

It contains additional information about the application's implementation, API endpoints, database structure, machine learning components, security features, and setup procedures, as documented in the project.

---

## 👩‍💻 Author

**Vinutha S N**

- GitHub: [@VinuthaSN246](https://github.com/VinuthaSN246)
- LinkedIn: [Vinutha S N](https://www.linkedin.com/in/vinutha-s-n-65123b335/)

---

## 🌱 Project Vision

EcoTrack aims to make sustainability more understandable and actionable by combining carbon footprint tracking, AI-assisted guidance, and data-driven insights in a single application.

**Understand your impact. Make informed choices. Build a more sustainable future.** 🌍

---

*Built with React, TypeScript, Python, Flask, SQLite, and Scikit-learn.*
