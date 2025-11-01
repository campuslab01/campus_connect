import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ReactQueryProvider } from './hooks/useQueryClient.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactQueryProvider>
  </StrictMode>
);
