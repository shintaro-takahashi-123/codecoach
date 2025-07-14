import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import InductionPage from "./pages/InductionPage";
import AnnualIncomePage from "./pages/AnnualIncomePage";
import JobTypePage from "./pages/JobTypePage";
import CompanyListPage from "./pages/CompanyListPage";
import CompanyAnalysisResultPage from "./pages/CompanyAnalysisResultPage";
import SkillInputPage from "./pages/SkillInputPage";
import AnalysisResultPage from "./pages/AnalysisResultPage";
import HomePage from "./pages/HomePage";
import CodeCoachPage from "./pages/CodeCoachPage";
import { StepProvider } from "./contexts/StepContext";
import LearningLogDetailPage from "./components/LearningLogDetail";


function App() {
  return (
    <StepProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ステップ形式のページ */}
          <Route path="/Induction" element={<InductionPage />} />
          <Route path="/annual-income" element={<AnnualIncomePage />} />
          <Route path="/job-type" element={<JobTypePage />} />
          <Route path="/company-list" element={<CompanyListPage />} />
          <Route path="/skill-input" element={<SkillInputPage />} />
          <Route path="/analysis-result" element={<AnalysisResultPage />} />
          <Route path="/company/:id/analysis-result"element={<AnalysisResultPage />}/>
          <Route path="/company/:id/analysis-result"element={<CompanyAnalysisResultPage />}/>


          {/* その他 */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/code-coach" element={<CodeCoachPage />} />
          <Route path="/learning-log/:id" element={<LearningLogDetailPage />} />

          
        </Routes>
      </BrowserRouter>
    </StepProvider>
  );
}

export default App;
