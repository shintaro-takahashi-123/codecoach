import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LearningLogList.css";

const LearningLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/learning_logs", { withCredentials: true })
      .then((res) => {
        setLogs(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("履歴取得エラー", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="log-list-container">
      <h2>学習履歴</h2>
      {logs.length === 0 ? (
        <p>履歴がありません。</p>
      ) : (
        <ul className="log-list">
          {logs.map((log) => (
            <li key={log.id} className="log-item">
              <strong>{log.problem_title}</strong>
              <span>ステータス: {log.status}</span>
              <span>{new Date(log.created_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LearningLogList;
