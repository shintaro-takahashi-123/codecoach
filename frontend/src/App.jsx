import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AnnualIncomePage from "./pages/AnnualIncomePage";
import JobTypePage from "./pages/JobTypePage";
import SkillInputPage from "./pages/SkillInputPage";
import AnalysisResultPage from "./pages/AnalysisResultPage";
import HomePage from "./pages/HomePage";
import CodeCoachPage from "./pages/CodeCoachPage";
import { StepProvider } from "./contexts/StepContext";

function App() {
  return (
    <StepProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ステップ形式のページ */}
          <Route path="/annual-income" element={<AnnualIncomePage />} />
          <Route path="/job-type" element={<JobTypePage />} />
          <Route path="/skill-input" element={<SkillInputPage />} />
          <Route path="/analysis-result/:id" element={<AnalysisResultPage />} />

          {/* その他 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/code-coach" element={<CodeCoachPage />} />

        </Routes>
      </BrowserRouter>
    </StepProvider>
  );
}

export default App;
