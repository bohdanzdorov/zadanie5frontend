import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "katex/dist/katex.min.css";
import App from './App.jsx'
import './i18n';

import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
)

