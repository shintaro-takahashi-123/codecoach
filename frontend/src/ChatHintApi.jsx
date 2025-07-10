import React, { useState } from "react";

export default function ChatHintApi() {
  /* ---------------- state ---------------- */
  const [history, setHistory] = useState([]); // {role,text}[]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [shown, setShown] = useState(0); // 既提示ヒント段数
  const [pending, setPending] = useState(null); // {step,text}
  const [solved, setSolved] = useState(false);

  const [answer, setAnswer] = useState(null); // {answer_text,explanation}

  /* ------------- 共通 fetch helper ------------- */
  const postJson = (url, body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json());

  /* ------------- ヒント取得 ------------- */
  const callHintApi = async (prompt) => {
    setLoading(true);

    const res = await postJson("http://localhost:8000/api/hints/generate", {
      prompt,
      shown_step: shown,
      history,
    });

    if (res.status === "success") {
      const d = res.data;

      /* アルゴリズム+手順はいつも表示 */
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          text:
            `アルゴリズム: ${d.algorithm}\n` +
            `手順: ${(d.overall_steps || []).join(" → ")}`,
        },
      ]);

      /* フィードバック（2 回目以降のみ来る想定） */
      if (d.feedback) {
        setHistory((h) => [
          ...h,
          { role: "assistant", text: `フィードバック: ${d.feedback}` },
        ]);
      }

      /* 次ヒント保存 */
      if (d.next_hint?.text) {
        setPending(d.next_hint);
      } else {
        setPending(null);
      }

      setSolved(Boolean(d.solved));
    } else {
      setHistory((h) => [
        ...h,
        { role: "assistant", text: res.message || "エラーが発生しました" },
      ]);
    }
    setLoading(false);
  };

  /* ------------- 模範解答取得 ------------- */
  const callAnswerApi = async () => {
    if (loading || answer) return;
    setLoading(true);

    const lastUser =
      [...history].reverse().find((m) => m.role === "user")?.text || "";

    const res = await postJson(
      "http://localhost:8000/api/model_answers/generate",
      { prompt: lastUser }
    );

    if (res.status === "success") {
      setAnswer(res.data);
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          text:
            "--- 模範解答 ---\n" +
            res.data.answer_text +
            "\n\n【解説】" +
            res.data.explanation,
        },
      ]);
    } else {
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          text: res.message || "模範解答取得に失敗しました",
        },
      ]);
    }
    setLoading(false);
  };

  /* ------------- UI アクション ------------- */
  const send = () => {
    if (!input.trim() || loading) return;

    setHistory((h) => [...h, { role: "user", text: input }]);
    setAnswer(null); // 新しい問いには旧解答をクリア
    callHintApi(input);
    setInput("");
  };

  const revealHint = () => {
    if (!pending) return;

    setHistory((h) => [
      ...h,
      {
        role: "assistant",
        text: `ヒント${pending.step}: ${pending.text}`,
      },
    ]);
    setShown(pending.step);
    setPending(null);
  };

  /* ----------------- JSX ----------------- */
  return (
    <div style={{ maxWidth: 660, margin: "0 auto", padding: 24 }}>
      <h2 style={{ textAlign: "center" }}>
        チャット学習&nbsp;/&nbsp;段階ヒント
      </h2>

      {/* チャットログ */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          minHeight: 280,
          padding: 12,
          overflowY: "auto",
          whiteSpace: "pre-wrap",
          background: "#fafafa",
        }}
      >
        {history.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              margin: "4px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 10px",
                borderRadius: 10,
                background: m.role === "user" ? "#dbf4ff" : "#f1f1f1",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div>…送信中</div>}
        {solved && (
          <div style={{ color: "green", marginTop: 8 }}>
            🎉 解決済みと判断されました！
          </div>
        )}
      </div>

      {/* 入力欄 */}
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        <input
          style={{ flex: 1, fontSize: 16 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="質問・途中コードなどを入力して Enter"
          onKeyDown={(e) => e.key === "Enter" && send()}
          disabled={loading}
        />
        <button onClick={send} disabled={loading || !input.trim()}>
          送信
        </button>
      </div>

      {/* 追加ヒント & 模範解答ボタン */}
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        {pending && !solved && (
          <button onClick={revealHint} disabled={loading}>
            ヒント{pending.step} を見る
          </button>
        )}
        {/* ✅ 解決済み（solved=true）になったとき **だけ** 模範解答を出す */}
        {!answer && !loading && solved && (
          <button onClick={callAnswerApi}>模範解答を見る</button>
        )}
      </div>
    </div>
  );
}
