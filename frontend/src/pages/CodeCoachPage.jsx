/* frontend/src/pages/CodeCoachPage.jsx */
import React, { useState, useContext } from "react";
import "../styles/CodeCoachPage.css";
import { AuthContext } from "../contexts/AuthContext";
import { FaPaperPlane } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa6";
import LearningLogList from "../components/LearningLogList";
import api from "../api/axios";

const CodeCoachPage = () => {
  /* ---------- 認証情報 ---------- */
  const { user } = useContext(AuthContext);
  const userName = user?.name || "ゲスト";

  /* ---------- 入力欄 ---------- */
  const [problem, setProblem] = useState("");
  const [userAnswer, setUserAnswer] = useState("");

  /* ---------- チャット状態 ---------- */
  const [messages, setMessages] = useState([]); // {role:'user'|'assistant',content:string}[]
  const [loading, setLoading] = useState(false);

  /* ---------- ヒント制御用 ---------- */
  const [shown, setShown] = useState(0); // 既に開示したヒント段数
  const [pending, setPending] = useState(null); // {step,text}
  const [solved, setSolved] = useState(false);

  /* ---------- 模範解答 ---------- */
  const [answer, setAnswer] = useState(null); // {answer_text,explanation}

  /* =======================================================
      送信（ヒント API を呼び出し）
  ======================================================= */
  const handleSend = async () => {
    if (loading) return; // 2 重送信ガード
    if (!problem.trim() && !userAnswer.trim()) return;

    /* --- 1) ユーザーメッセージを履歴に追加 ---------------- */
    const prompt = [
      problem.trim() && `📝 問題文:\n${problem}`,
      userAnswer.trim() && `🧑‍💻 ユーザー入力:\n${userAnswer}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    /* 一度送信したら入力欄をクリア */
    setProblem("");
    setUserAnswer("");
    setAnswer(null); // 以前の模範解答はクリア
    setLoading(true);

    /* --- 2) ヒント API 呼び出し --------------------------- */
    try {
      const res = await api.post("/hints/generate", {
        prompt,
        shown_step: shown,
        history: messages,
      });

      if (res.data.status === "success") {
        const d = res.data.data;

        /* a. アルゴリズム名 / フローを表示 */
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              `アルゴリズム: ${d.algorithm}\n` +
              `手順: ${(d.overall_steps || []).join(" → ")}`,
          },
        ]);

        /* b. 2 回目以降ならフィードバック */
        if (d.feedback) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `フィードバック: ${d.feedback}` },
          ]);
        }

        /* c. 次のヒントを保留 */
        if (d.next_hint?.text) {
          setPending(d.next_hint); // → ボタンで小出し
        } else {
          setPending(null);
        }

        setSolved(Boolean(d.solved));
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              res.data.message ||
              "⚠️ ヒントの取得に失敗しました。再試行してください。",
          },
        ]);
      }
    } catch (err) {
      console.error("Hint API error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ サーバーエラーが発生しました。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
      pending ヒントを開示
  ======================================================= */
  const revealHint = () => {
    if (!pending) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `ヒント${pending.step}: ${pending.text}`,
      },
    ]);
    setShown(pending.step);
    setPending(null);
  };

  /* =======================================================
      模範解答 API 呼び出し
  ======================================================= */
  const fetchModelAnswer = async () => {
    if (loading || answer) return;
    setLoading(true);

    /* 直近のユーザーメッセージ（最後の user role）を抜き出す */
    const lastUserPrompt =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    try {
      const res = await api.post("/model_answers/generate", {
        prompt: lastUserPrompt,
      });

      if (res.data.status === "success") {
        const d = res.data.data;
        setAnswer(d);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "--- 模範解答 ---\n" +
              d.answer_text +
              "\n\n【解説】\n" +
              d.explanation,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.data.message || "⚠️ 模範解答の取得に失敗しました…",
          },
        ]);
      }
    } catch (err) {
      console.error("Model Answer API error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ サーバーエラーが発生しました。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
      JSX
  ======================================================= */
  return (
    <div className="codecoach-layout">
      {/* ---------- ヘッダー ---------- */}
      <header className="codecoach-header">
        <h1 className="header-title">CodeCoach</h1>
      </header>

      <div className="codecoach-main">
        {/* ---------- サイドバー 学習履歴 ---------- */}
        <aside className="sidebar">
          <h3 className="sidebar-title">学習履歴</h3>
          <LearningLogList />
        </aside>

        {/* ---------- メインパネル ---------- */}
        <div className="main-panel">
          <h2 className="greeting">こんにちは {userName} さん</h2>

          {/* ==== チャット表示エリア ==== */}
          <div className="chat-area">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                {msg.content.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
            {loading && <div className="chat-message assistant">考え中...</div>}
            {solved && (
              <div className="chat-message assistant solved">
                🎉 解決済みと判断されました！
              </div>
            )}
          </div>

          {/* ==== 入力カラム ==== */}
          <div className="chat-input-column">
            <textarea
              placeholder="📝 問題文を入力"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={3}
            />
            <textarea
              placeholder="🧑‍💻 あなたの回答・質問・途中コードなどを入力"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              rows={4}
            />

            <div className="chat-input-buttons">
              <button onClick={handleSend} disabled={loading}>
                <FaPaperPlane /> 送信
              </button>

              {/* 小出しヒント */}
              {pending && !solved && (
                <button onClick={revealHint} disabled={loading}>
                  <FaLightbulb /> ヒント{pending.step}
                </button>
              )}

              {/* 模範解答 – すべてのヒント閲覧済 or solved */}
              {!answer && !loading && (pending === null || solved) && (
                <button onClick={fetchModelAnswer} disabled={loading}>
                  模範解答を見る
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeCoachPage;
