import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
// import { initializeIcons } from '@fluentui/react/lib/Icons';

// initializeIcons();
import "bootstrap/dist/css/bootstrap.min.css";
createRoot(document.getElementById("root")!).render(<App />);
