# WS PMT Frontend

Frontend application untuk Widianto & Sumbogo Project Management Tool.

## Tech Stack
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Zustand
- Axios

## Getting Started

### Install Dependencies
```bash
npm install
```

### Setup Environment
```bash
Copy-Item .env.example .env
```

Edit `.env` and update API base URL if needed:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Run Development Server
```bash
npm run dev
```

Application will be available at http://localhost:3000

### Build for Production
```bash
npm run build
```

## Project Structure
```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── services/       # API services
├── stores/         # State management (Zustand)
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Available Pages
- Landing Page
- Login Page
- Sign Up Page (2-step)
- Dashboard (Manager)
- Project View
- Document Center

## API Integration
All API calls are made through services in `src/services/`. Authentication token is automatically attached to requests via Axios interceptors.
