# 🌱 EcoTrack — Sustainability Tracking Application

**EcoTrack** is a sustainability application designed to help users estimate and track their environmental impact. It combines carbon footprint calculation, rule-based personalized recommendations, a sustainability assistant, interactive data visualization, and an experimental machine learning estimate.

The application helps users make informed environmental decisions by tracking their carbon footprint, monitoring sustainability progress, and discovering practical ways to adopt eco-friendly habits.

---

## 🚀 Key Features

- 🌍 **Carbon Footprint Calculator** — Calculate carbon emissions based on transportation, electricity consumption, food habits, and waste generation.
- 🤖 **Sustainability Assistant** — Get topic-based, rule-driven guidance for common sustainability questions.
- 💡 **Personalized Sustainability Recommendations** — Get rule-based actions ranked using the footprint estimate and saved interests.
- 📊 **Interactive Sustainability Dashboard** — Visualize carbon emissions, activity data, and sustainability progress.
- 📈 **Experimental Emission Estimate** — Compare calculator output with a model trained on synthetic calculator data; it is not validated against real-world measurements.
- 👤 **User Profiles** — Save account details, interests, and preferences to the backend.
- 📋 **Activity History** — Save and review calculations for signed-in accounts.
- 🗄️ **Database Integration** — Use SQLite for local development; configure PostgreSQL for deployment.
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

### Sustainability Logic
- Deterministic topic responses
- Rule-based recommendations personalized from footprint inputs and saved interests

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
                              │ Rule-Based Assistant│
                              └────────────────────┘
```

*Note: The assistant and recommendation engine are rule-based. The ML estimate is experimental and uses synthetic training data derived from the calculator.*

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

## 🤖 Assistant and Machine Learning Estimate

EcoTrack combines a rule-based sustainability assistant with calculator-based insights and an experimental prediction model.

**Implementation note:** The current assistant and recommendations are rule-based, not generative AI. The emission prediction model is experimental and uses synthetic data derived from the calculator; its predictions have not been validated against real-world observations. Treat predictions as illustrative estimates.

### Sustainability Assistant

The rule-based Sustainability Assistant is designed to help users:

- Understand environmental and sustainability concepts.
- Explore practical ways to adopt eco-friendly habits.
- Receive guidance on reducing their environmental impact.
- Make more informed sustainability-related decisions.

### Personalized Recommendations

The application provides sustainability recommendations intended to help users identify practical improvements based on their carbon footprint and environmental activities.

### Experimental Machine Learning Estimate

Scikit-learn supports an experimental model that estimates emissions from the same lifestyle inputs used by the calculator. The model uses synthetic data generated from the calculator factors, so its metrics do not measure real-world predictive accuracy.

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

EcoTrack aims to make sustainability more understandable and actionable by combining carbon footprint tracking, rule-based guidance, and data-driven estimates in a single application.

**Understand your impact. Make informed choices. Build a more sustainable future.** 🌍

---

*Built with React, TypeScript, Python, Flask, SQLite, and Scikit-learn.*
