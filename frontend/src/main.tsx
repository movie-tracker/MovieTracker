import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App.tsx";
import AppConfig, { AppStage } from "@/config/index.ts";

import "@/config/i18n.ts";
import "@/index.css";

const root = createRoot(document.getElementById("root")!);

if (AppConfig.stage === AppStage.DEVELOPMENT) {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  root.render(<App />);
}
