import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from './components/ui/provider';
import { QueryProvider } from './providers/QueryProvider';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </Provider>
  </StrictMode>,
);
