import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { DataService } from './services/dataService';
import { useStore } from './store/useStore';
import './index.css';

// Initialize DataService and load materials
DataService.init().then(() => {
  // Load materials into store after DataService is ready
  useStore.getState().loadMaterials();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
