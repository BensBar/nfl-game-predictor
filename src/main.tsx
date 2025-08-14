import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
// Removed @github/spark/spark import for GitHub Pages deployment

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
