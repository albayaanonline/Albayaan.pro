import { createRoot } from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { setBaseUrl } from "@/lib/api-client";
import { env } from "@/lib/env";
import "./index.css";

if (env.apiBaseUrl) {
  setBaseUrl(env.apiBaseUrl);
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
