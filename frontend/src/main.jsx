import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext"; // ✅ AuthProvider をインポート

createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <App />
    </AuthProvider>
);

