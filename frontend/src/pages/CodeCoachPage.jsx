import React, { useState, useContext } from "react";
import "../styles/CodeCoachPage.css";
import { AuthContext } from "../contexts/AuthContext";
import { FaPaperPlane } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import LearningLogList from "../components/LearningLogList";
import api from "../api/axios";

const CodeCoachPage = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.name || "ゲスト";

  const [problem, setProblem] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(0);
  const [pending, setPending] = useState(null);
  const [solved, setSolved] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);


  const [showTitleInput, setShowTitleInput] = useState(false);
  const [logTitle, setLogTitle] = useState("");

  const handleSend = async () => {
    if (loading || (!problem.trim() && !userAnswer.trim())) return;

    const prompt = [
      problem.trim() && `📝 問題文:\n${problem}`,
      userAnswer.trim() && `🧑‍💻 ユーザー入力:\n${userAnswer}`,
    ].filter(Boolean).join("\n\n");

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setProblem("");
    setUserAnswer("");
    setAnswer(null);
    setLoading(true);

    try {
      const res = await api.post("/api/hints/generate", {
        prompt,
        shown_step: shown,
        history: messages,
      });

      if (res.data.status === "success") {
        const d = res.data.data;

        const assistantMessages = [
          {
            role: "assistant",
            content: `アルゴリズム: ${d.algorithm}\n手順: ${(d.overall_steps || []).join(" → ")}`,
          },
        ];

        if (d.feedback) {
          assistantMessages.push({ role: "assistant", content: `フィードバック: ${d.feedback}` });
        }

        setMessages((prev) => [...prev, ...assistantMessages]);
        setPending(d.next_hint?.text ? d.next_hint : null);
        setSolved(Boolean(d.solved));
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: res.data.message || "⚠️ ヒントの取得に失敗しました。",
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "⚠️ サーバーエラーが発生しました。",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const revealHint = () => {
    if (!pending) return;
    setMessages((prev) => [...prev, {
      role: "assistant",
      content: `ヒント${pending.step}: ${pending.text}`,
    }]);
    setShown(pending.step);
    setPending(null);
  };

  const fetchModelAnswer = async () => {
    if (loading || answer) return;
    setLoading(true);

    const lastUserPrompt = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    try {
      const res = await api.post("/model_answers/generate", {
        prompt: lastUserPrompt,
      });

      if (res.data.status === "success") {
        const d = res.data.data;
        setAnswer(d);
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: "--- 模範解答 ---\n" + d.answer_text + "\n\n【解説】\n" + d.explanation,
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: res.data.message || "⚠️ 模範解答の取得に失敗しました…",
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "⚠️ サーバーエラーが発生しました。",
      }]);
    } finally {
      setLoading(false);
    }
  };


  const handleSaveLog = async () => {
    try {
      const desc = messages.map((m) => `${m.role}:\n${m.content}`).join("\n\n");
  
      const payload = {
        problem_title: logTitle,
        problem_desc: desc,
        status: "completed",
        model_answer: answer?.answer_text || null,
        explanation: answer?.explanation || null,
      };
  
      const res = await api.post("/api/learning_logs", payload);
  
      if (res.data.status === "success") {
        setProblem("");
        setUserAnswer("");
        setMessages([]);
        setAnswer(null);
        setSolved(false);
        setShown(0);
        setPending(null);
        setLogTitle("");
        setShowTitleInput(false);
        
        setRefreshKey((prev) => prev + 1);
        alert("✅ 学習履歴に保存しました！");
      } else {
        alert("⚠️ 保存に失敗しました。" + res.data.message);
      }
    } catch (err) {
      console.error("保存エラー:", err);
      alert("⚠️ サーバーエラーが発生しました。");
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
          <LearningLogList refreshKey={refreshKey} />
        </aside>

        <div className="main-panel">
          <h2 className="greeting">
            こんにちは <span className="highlighted-name">{userName}</span> さん
          </h2>

          <div className="chat-area">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                {msg.content.includes("--- 模範解答 ---") ? (
                  <pre><code>{msg.content}</code></pre>
                ) : (
                  msg.content.split("\n").map((line, i) => <p key={i}>{line}</p>)
                )}
              </div>
            ))}
            {loading && <div className="chat-message assistant">考え中...</div>}
            {solved && !showTitleInput && (
              <div className="solved-fixed-message">
                <span>🎉 解決済みと判断されました！</span>
                <button className="solved-fixed-close-btn" onClick={() => setShowTitleInput(true)}>
                  閉じる
                </button>
              </div>
            )}
          </div>

          <div className="chat-input-column">
            <textarea
              placeholder="📝 問題文を入力"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={2}
              style={{ maxHeight: "100px" }}
            />
            <textarea
              placeholder="🧑‍💻 あなたの回答・質問・途中コードなどを入力"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={3}
              style={{ maxHeight: "120px" }}
            />

            <div className="chat-input-buttons">
              <button onClick={handleSend} disabled={loading}>
                <FaPaperPlane /> 送信
              </button>
              {pending && !solved && (
                <button onClick={revealHint} disabled={loading}>
                  <FaLightbulb /> ヒント{pending.step}
                </button>
              )}
              {!answer && !loading && (pending === null || solved) && (
                <button onClick={fetchModelAnswer} disabled={loading}>
                  模範解答を見る
                </button>
              )}
            </div>
          </div>

          {/* ✅ タイトル入力モーダル */}
          {showTitleInput && (
            <div className="log-modal">
              <h3>学習履歴に保存</h3>
              <input
                type="text"
                value={logTitle}
                onChange={(e) => setLogTitle(e.target.value)}
                placeholder="この学習のタイトルを入力"
              />
              <button
                className="log-save-btn"
                onClick={handleSaveLog}
                disabled={!logTitle.trim()}
              >
                保存する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeCoachPage;
