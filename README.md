<div align="center">

# 🌍 CircuMetal AI — ML-Powered Life Cycle Assessment Platform

**An AI-powered web application for Life Cycle Assessment (LCA) of metals in mining, with circular economy optimization**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#1-frontend-setup)
  - [ML Backend Setup (Optional)](#2-ml-backend-setup-optional)
- [Usage Guide](#-usage-guide)
- [Machine Learning Pipeline](#-machine-learning-pipeline)
- [API Reference](#-api-reference)
- [Dataset](#-dataset)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔭 Overview

**CircuMetal AI** is a Smart India Hackathon (SIH) project that brings machine learning to **Life Cycle Assessment (LCA)** for metals used in mining operations. The platform enables users to:

1. **Select** from a dataset of aluminium and copper alloys (8,000 data points)
2. **Analyze** environmental impacts across linear vs. circular production processes
3. **Compare** carbon footprint, energy consumption, water usage, and waste generation
4. **Receive AI-driven recommendations** for optimizing circularity and sustainability
5. **Export** comprehensive reports in PDF (HTML), CSV, and JSON formats

The application combines a React + TypeScript frontend with a Python Flask ML backend, using trained Random Forest and Gradient Boosting models to predict carbon emissions and energy consumption based on material properties.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🧪 **Material Selection** | Browse and filter aluminium & copper alloys loaded from the CSV dataset |
| 📊 **LCA Analysis** | Configure parameters (quantity, process type, energy source, transport distance, recycled content, end-of-life scenario) and run impact calculations |
| 🤖 **AI Parameter Prediction** | Auto-fill missing parameters with ML-based confidence scoring |
| 🔄 **Linear vs. Circular Comparison** | Side-by-side impact comparison with circularity metrics (MCI, recycling rate, carbon reduction, economic benefit) |
| 📈 **Interactive Visualizations** | Recharts-powered bar/radar charts and D3-based Sankey flow diagrams |
| 💡 **Smart Recommendations** | Priority-ranked, actionable sustainability suggestions with implementation difficulty and timeframe |
| 📤 **Multi-Format Export** | Download reports as HTML (printable PDF), CSV, or JSON |
| 🏆 **Gamification** | Earn badges, track streaks, and accumulate points for analyses |
| ⚡ **Code Splitting** | Lazy-loaded routes with React Suspense for fast initial load |
| 🎨 **Glassmorphism UI** | Modern design with blur effects, gradients, and micro-animations |

---

## 🏗 Architecture

```
┌───────────────────────────────────────────────────────────┐
│                     Browser (React SPA)                   │
│                                                           │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │Materials │  │ Analysis │  │ Results  │  │Comparison │  │
│  │Selector  │  │  Form    │  │  View    │  │   View    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       │              │             │              │        │
│  ┌────▼──────────────▼─────────────▼──────────────▼────┐  │
│  │              Zustand State Store                     │  │
│  └─────────────────────┬───────────────────────────────┘  │
│                        │                                  │
│  ┌─────────────────────▼───────────────────────────────┐  │
│  │   DataService  │  AIService  │  RecommendationsServ │  │
│  │  (CSV → ML     │  (LCA calc  │  (Priority-ranked    │  │
│  │   factors)     │  + predict) │   suggestions)       │  │
│  └────────┬───────┴──────┬──────┴──────────────────────┘  │
│           │              │                                │
│    CSV dataset      REST API call                         │
│    (in-browser)     (optional)                            │
└───────────┼──────────────┼────────────────────────────────┘
            │              │
            ▼              ▼
   lca_metals_dataset   Flask ML API
      .csv (8000 rows)  (port 5001)
                           │
                    ┌──────▼──────┐
                    │ scikit-learn │
                    │  RF / GBR   │
                    │  .joblib    │
                    └─────────────┘
```

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component framework with Suspense & lazy loading |
| **TypeScript 5.5** | Type-safe application code |
| **Vite 5.4** | Dev server & build tool |
| **Zustand 4** | Lightweight state management |
| **Recharts 2** | Bar, radar, and area charts |
| **D3.js 7** | CSV parsing + Sankey diagram data |
| **Framer Motion 10** | Animations and transitions |
| **Lucide React** | Icon library |
| **Tailwind CSS 3.4** | Utility-first styling |

### Backend (ML)
| Technology | Purpose |
|---|---|
| **Python 3.10+** | ML training & serving |
| **scikit-learn** | Random Forest & Gradient Boosting regressors |
| **Flask** | REST API for model inference |
| **flask-cors** | CORS middleware |
| **pandas / NumPy** | Data processing |
| **joblib** | Model serialization |

---

## 📁 Project Structure

```
Machine-learning-mines-LCA-main/
├── index.html                    # Vite entry point
├── package.json                  # Node dependencies & scripts
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── postcss.config.js             # PostCSS configuration
├── lca_metals_dataset.csv        # Dataset: 8,000 rows × 11 columns
│
├── src/                          # ── Frontend Source ──
│   ├── main.tsx                  # App entry: initializes DataService
│   ├── App.tsx                   # Root component with tab navigation
│   ├── index.css                 # Global styles & Tailwind imports
│   ├── vite-env.d.ts             # Vite type declarations
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── index.ts              # Material, LCAParameters, LCAResult, FlowData, CircularityMetrics
│   │   └── gamification.ts       # Badge, GameificationState, BADGES constants
│   │
│   ├── store/                    # Zustand state management
│   │   ├── useStore.ts           # App state: materials, analysis results, active tab
│   │   └── gamificationStore.ts  # Gamification: badges, points, streaks (localStorage)
│   │
│   ├── services/                 # Business logic services
│   │   ├── dataService.ts        # CSV loading, ML-based factor calculation
│   │   ├── aiService.ts          # LCA calculations, parameter prediction, Flask API calls
│   │   ├── recommendationsService.ts  # AI recommendation generation engine
│   │   └── exportService.ts      # PDF/CSV/JSON export functionality
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── index.ts              # Barrel export
│   │   ├── useAsync.ts           # Async operation wrapper with loading/error states
│   │   ├── useDebounce.ts        # Debounced value hook
│   │   ├── usePrevious.ts        # Previous value tracker
│   │   └── useScrollToTop.ts     # Scroll restoration hook
│   │
│   ├── ml/                       # Frontend ML module
│   │   └── tfjs_model.js         # TensorFlow.js neural network prototype (Node script)
│   │
│   └── components/               # React UI components
│       ├── ErrorBoundary.tsx      # Global error boundary
│       ├── DataStatus.tsx         # Dataset loading status indicator
│       │
│       ├── ui/                   # Reusable UI primitives
│       │   ├── Alert.tsx         # Alert component (info/warning/error/success)
│       │   ├── Badge.tsx         # Badge display component
│       │   ├── Button.tsx        # Button with variants
│       │   ├── Card.tsx          # Card container
│       │   ├── Loading.tsx       # Spinner + skeleton loaders
│       │   └── index.ts          # Barrel export
│       │
│       ├── Layout/               # App shell
│       │   ├── Header.tsx        # App header with branding
│       │   └── Navigation.tsx    # Tab navigation bar
│       │
│       ├── Materials/            # Material selection
│       │   └── MaterialSelector.tsx  # Material grid with search & filter
│       │
│       ├── Analysis/             # LCA analysis
│       │   └── AnalysisForm.tsx  # Parameter form with AI prediction
│       │
│       ├── Results/              # Analysis results
│       │   └── ResultsView.tsx   # Impact metrics, charts, recommendations
│       │
│       ├── Comparison/           # Linear vs. circular comparison
│       │   └── ComparisonView.tsx  # Side-by-side comparison with circularity metrics
│       │
│       ├── Dashboard/            # Progress tracking
│       │   └── ProgressDashboard.tsx  # Gamification badges, stats, and achievements
│       │
│       ├── Visualization/        # Data visualization
│       │   └── SankeyDiagram.tsx  # D3-based material flow Sankey diagram
│       │
│       └── Loading/              # Loading states (if any)
│
├── ml/                           # ── ML Backend ──
│   ├── requirements.txt          # Python dependencies
│   ├── train_and_evaluate.py     # Model training: RF + GBR with 5-fold CV
│   ├── api.py                    # Flask REST API (port 5001)
│   ├── ts_linear_regression.ts   # TypeScript gradient descent regression
│   ├── README_ml.md              # ML-specific documentation
│   │
│   └── models/                   # Trained model artifacts
│       ├── random_forest_carbon_kgCO2_per_kg.joblib
│       ├── random_forest_energy_MJ_per_kg.joblib
│       ├── gradient_boosting_carbon_kgCO2_per_kg.joblib
│       ├── gradient_boosting_energy_MJ_per_kg.joblib
│       └── training_summary.joblib
│
└── public/                       # Static assets served by Vite
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18.x | JavaScript runtime |
| **npm** | ≥ 9.x | Package manager |
| **Python** | ≥ 3.10 | ML backend (optional) |

### 1. Frontend Setup

```bash
# Clone the repository
git clone https://github.com/<your-username>/Machine-learning-mines-LCA-main.git
cd Machine-learning-mines-LCA-main

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

### 2. ML Backend Setup (Optional)

The frontend works standalone using in-browser ML calculations from the CSV dataset. For higher-accuracy predictions via the trained scikit-learn models, start the Flask API:

```bash
# Navigate to the ML directory
cd ml

# Create and activate a virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
# source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Re-train the models (pre-trained models are included)
python train_and_evaluate.py

# Start the Flask API server
python api.py
```

The ML API will be available at **http://127.0.0.1:5001**

> **Note:** The pre-trained Random Forest and Gradient Boosting models are already included in `ml/models/`. You only need to re-train if you modify the dataset or want different hyperparameters.

### 3. Build for Production

```bash
npm run build
npm run preview
```

---

## 📋 Usage Guide

### Step 1 — Select a Material
Navigate to the **Materials** tab. Browse the aluminium and copper alloys loaded from the dataset. Use the search and filter controls to find a specific material. Click a material card to select it.

### Step 2 — Configure Analysis
Switch to the **Analysis** tab. Fill in the LCA parameters:
- **Quantity** (kg)
- **Process Type** — Linear or Circular
- **Region** — Local, Domestic, or International
- **Transport Distance** (km)
- **Energy Source** — Renewable, Mixed Grid, or Fossil
- **Recycled Content** (0–100%)
- **End-of-Life Scenario** — Recycling, Reuse, Repair, or Landfill

> 💡 Missing parameters are auto-filled using AI prediction with a confidence score.

### Step 3 — Review Results
The **Results** tab displays:
- Environmental impact metrics (carbon footprint, energy consumption, water usage, waste generation)
- Circularity score visualization
- AI-generated recommendations ranked by priority
- Export options (PDF / CSV / JSON)

### Step 4 — Compare Scenarios
The **Comparison** tab lets you compare linear vs. circular process results side-by-side, with circularity metrics including Material Circularity Indicator, carbon reduction percentage, and economic benefit estimates.

### Step 5 — Track Progress
Visit the **Dashboard** tab to see your gamification stats — badges earned, analysis streaks, total points, and rank.

---

## 🤖 Machine Learning Pipeline

### Dataset

| Property | Value |
|---|---|
| **File** | `lca_metals_dataset.csv` |
| **Rows** | 8,000 |
| **Materials** | Aluminium (6061, 1100) and Copper (C101, C110) alloys |
| **Routes** | Primary & Secondary production |

### Features (Input)
| Column | Description |
|---|---|
| `recycling_rate` | Material recycling rate (0–1) |
| `renewable_share` | Share of renewable energy used (0–1) |
| `transport_km` | Transport distance in kilometres |
| `mci` | Material Circularity Indicator (0–1) |
| `scrap_recovery_rate` | Scrap recovery rate (0–1) |

### Targets (Output)
| Column | Description |
|---|---|
| `carbon_kgCO2_per_kg` | Carbon emissions per kilogram (kg CO₂/kg) |
| `energy_MJ_per_kg` | Energy consumption per kilogram (MJ/kg) |

### Models
| Model | Algorithm | Validation | Purpose |
|---|---|---|---|
| **Random Forest** | 200 trees, full parallelism | 5-fold CV RMSE | Primary prediction model |
| **Gradient Boosting** | 200 estimators, lr=0.1 | 5-fold CV RMSE | Alternative model |

### Three ML Layers

1. **In-Browser (DataService)** — Weighted feature-importance calculation from the CSV, runs entirely client-side
2. **Flask API (api.py)** — Serves pre-trained scikit-learn `.joblib` models via REST endpoint
3. **Prototype Scripts** — TensorFlow.js neural network (`src/ml/tfjs_model.js`) and TypeScript gradient descent (`ml/ts_linear_regression.ts`)

---

## 📡 API Reference

### `POST /predict`

Predict carbon or energy values using a trained model.

**Request:**
```json
{
  "features": {
    "recycling_rate": 0.15,
    "renewable_share": 0.6,
    "transport_km": 500,
    "mci": 0.05,
    "scrap_recovery_rate": 0.1
  },
  "target": "carbon",
  "model": "random_forest"
}
```

**Parameters:**
| Field | Type | Values | Description |
|---|---|---|---|
| `features` | object | — | All 5 feature values required |
| `target` | string | `"carbon"` \| `"energy"` | Which target variable to predict |
| `model` | string | `"random_forest"` \| `"gradient_boosting"` | Which model to use |

**Response:**
```json
{
  "prediction": 8.24
}
```

**Error Response (400):**
```json
{
  "error": "missing features",
  "missing": ["transport_km"]
}
```

---

## 📊 Dataset

The dataset `lca_metals_dataset.csv` contains 8,000 synthetic LCA data points for metal alloys used in mining, with the following schema:

| Column | Type | Description |
|---|---|---|
| `material_id` | string | Material identifier (e.g., `al_6061_primary`) |
| `material_name` | string | Human-readable name (e.g., `Aluminium 6061`) |
| `category` | string | Material category (e.g., `Aluminium`, `Copper`) |
| `route` | string | Production route (`primary` / `secondary`) |
| `recycling_rate` | float | Recycling rate (0–1) |
| `energy_MJ_per_kg` | float | Energy consumption (MJ/kg) |
| `carbon_kgCO2_per_kg` | float | Carbon emissions (kg CO₂/kg) |
| `scrap_recovery_rate` | float | Scrap recovery rate (0–1) |
| `mci` | float | Material Circularity Indicator (0–1) |
| `transport_km` | float | Transport distance (km) |
| `renewable_share` | float | Renewable energy share (0–1) |

---

## 🖼 Screenshots

> After starting the app with `npm run dev`, navigate to http://localhost:5173 to explore:
> - **Materials Tab** — Searchable grid of alloys with key metrics
> - **Analysis Tab** — Parameter configuration form with AI auto-fill
> - **Results Tab** — Impact charts, circularity gauge, and recommendations
> - **Comparison Tab** — Linear vs. Circular side-by-side with Sankey diagrams
> - **Dashboard Tab** — Gamification badges, streaks, and points

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "Add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Development Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 📄 License

This project was developed as part of the **Smart India Hackathon (SIH)** initiative for sustainable mining practices.

---

<div align="center">

**Built with ♻️ for a sustainable future**

</div>
