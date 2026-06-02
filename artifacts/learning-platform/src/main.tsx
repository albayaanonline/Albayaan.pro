import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { setBaseUrl } from "./lib/api-client";
import { env } from "./lib/env";
import "./index.css";

// In production, set VITE_API_BASE_URL to the deployed API server base URL
// (e.g. https://api.albayaan.pro) so all /api/* calls reach the correct server.
// In development, Vite's proxy handles /api/* → Express automatically.
if (env.apiBaseUrl) {
  setBaseUrl(env.apiBaseUrl);
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
