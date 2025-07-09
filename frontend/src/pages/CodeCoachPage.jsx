import React, { useState, useContext } from "react";
import "../styles/CodeCoachPage.css";
import { AuthContext } from "../contexts/AuthContext";
import { FaPaperPlane } from "react-icons/fa";
import LearningLogList from "../components/LearningLogList";
import api from "../api/axios";

const CodeCoachPage = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.name || "ゲスト";

  const [problem, setProblem] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!problem.trim() || !userAnswer.trim()) return;

    const userMessage = {
      role: "user",
      content: `📝 問題文:\n${problem}\n\n🧑‍💻 あなたの回答:\n${userAnswer}`,
    };

    setMessages((prev) => [...prev, userMessage]);
    setProblem("");
    setUserAnswer("");
    setLoading(true);

    try {
      const res = await api.post("/model_answers/generate", {
        prompt: `問題文:\n${problem}\n\nユーザーの回答:\n${userAnswer}`,
      });

      const { answer_text, explanation } = res.data.data;

      const assistantMessage = {
        role: "assistant",
        content: `✅ **模範解答**\n${answer_text}\n\n💡 **解説**\n${explanation}`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("GPT連携エラー:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ 回答の取得に失敗しました。もう一度お試しください。",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="codecoach-layout">
      <header className="codecoach-header">
        <h1 className="header-title">CodeCoach</h1>
      </header>

      <div className="codecoach-main">
        <aside className="sidebar">
          <h3 className="sidebar-title">学習履歴</h3>
          <LearningLogList />
        </aside>

        <div className="main-panel">
          <h2 className="greeting">こんにちは {userName} さん</h2>

          <div className="chat-area">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                {msg.content.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
            {loading && <div className="chat-message assistant">考え中...</div>}
          </div>

          <div className="chat-input-column">
            <textarea
              placeholder="📝 問題文を入力"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={3}
            />
            <textarea
              placeholder="🧑‍💻 あなたの回答を入力"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={4}
            />
            <button onClick={handleSend} disabled={loading}>
              <FaPaperPlane /> 送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCoachPage;
