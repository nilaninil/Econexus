import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handling to capture and ignore benign environment or iframe errors
window.addEventListener('error', (event) => {
  if (
    event.message &&
    (event.message.includes('ResizeObserver') || 
     event.message.includes('Script error.') ||
     event.message.includes('Unexpected token') ||
     event.message.includes('recharts'))
  ) {
    event.stopImmediatePropagation();
    return;
  }
  console.warn('Caught global error safely:', event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && String(event.reason).includes('ResizeObserver')) {
    event.preventDefault();
    return;
  }
  console.warn('Caught global unhandled promise rejection safely:', event.reason);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

