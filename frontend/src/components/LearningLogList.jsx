import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/LearningLogList.css";

const LearningLogList = ({ refreshKey }) => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/api/learning_logs");
        if (res.data.status === "success") {
          setLogs(res.data.data);
        }
      } catch (err) {
        console.error("履歴取得エラー:", err);
      }
    };

    fetchLogs();
  }, [refreshKey]); // ✅ refreshKey の更新に応じて再取得

  const handleClick = (id) => {
    navigate(`/learning-log/${id}`);
  };

  return (
    <div className="log-list-container">
      <ul className="log-list">
        {logs.map((log) => (
          <li key={log.id} className="log-item" onClick={() => handleClick(log.id)}>
            <strong>{log.problem_title || "(タイトルなし)"}</strong>
            <span>{new Date(log.created_at).toLocaleString()}</span>
          </li>
        ))}
        {logs.length === 0 && (
          <li className="log-item">
            <span>まだ履歴がありません</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default LearningLogList;
