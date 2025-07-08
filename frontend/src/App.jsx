import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPage from "./pages/ForgotPage";
import DashboardPage from "./pages/DashboardPage";
import TestHintApi from "./TestHintApi";
import ChatHintApi from "./ChatHintApi";

// 必要ならトップメニュー作る例（シンプル版）
function Home() {
  return (
    <div style={{padding:24}}>
      <h1>CodeCoach プロトタイプ</h1>
      <nav style={{marginBottom:16}}>
        <Link to="/login">ログイン</Link> |{" "}
        <Link to="/register">新規登録</Link> |{" "}
        <Link to="/dashboard">ダッシュボード</Link> |{" "}
        <Link to="/test-hint">ヒントAPIテスト</Link> |{" "}
        <Link to="/chat-hint">チャットヒント</Link>
      </nav>
      <p>ページ上部のリンクから各画面へ遷移できます。</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* AI学習系 */}
        <Route path="/test-hint" element={<TestHintApi />} />
        <Route path="/chat-hint" element={<ChatHintApi />} />
      </Routes>
    </Router>
  );
}

export default App;
