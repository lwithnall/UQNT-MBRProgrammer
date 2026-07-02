import { createRoot } from 'react-dom/client';
import { Theme } from "@radix-ui/themes";
import App from './App.tsx';
import { StrictMode } from 'react';
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme hasBackground={false}>
      <App />
    </Theme>
  </StrictMode>,
)
