import App from "@/app";
import { createRoot } from "@/utils/core/render/createRoot";

// console.log(App());
const container = document.getElementById("app");
if (!container) throw new Error("Root element not found");

createRoot(App, container);
