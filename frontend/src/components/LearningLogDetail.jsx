import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/LearningLogDetail.css";

const LearningLogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [log, setLog] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await api.get(`/api/learning_logs/${id}`);
        if (res.data.status === "success") {
          setLog(res.data.data);
        }
      } catch (err) {
        console.error("詳細取得エラー:", err);
      }
    };

    fetchLog();
  }, [id]);

  if (!log) return <p>読み込み中...</p>;

  return (
    <>
      {/* ✅ ヘッダー（ページ上部に白文字で表示） */}
      <header className="log-header">
        <h1 className="header-title">CodeCoach</h1>
      </header>

      <div className="log-detail-container">
        {/* ✅ 戻るボタン */}
        <button onClick={() => navigate(-1)} className="back-button">← 履歴一覧に戻る</button>

        <h2>{log.problem_title || "タイトルなし"}</h2>
        <p className="log-date">{new Date(log.created_at).toLocaleString()}</p>

        <section>
          <h4>📝 問題内容</h4>
          <pre>{log.problem_desc}</pre>
        </section>
        <section>
          <h4>✅ 模範解答</h4>
          <pre>{log.model_answer}</pre>
        </section>
        <section>
          <h4>🔍 解説</h4>
          <pre>{log.explanation}</pre>
        </section>
      </div>
    </>
  );
};

export default LearningLogDetailPage;
