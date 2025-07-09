import React, { useContext, useEffect, useState } from "react";
import { StepContext } from "../contexts/StepContext";
import "../styles/StepPage.css";

const AnalysisResultPage = () => {
  const { formData } = useContext(StepContext);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/analyze-skills", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok && data.status === "success") {
          setResult(data.data);
        } else {
          throw new Error(data.message || "分析に失敗しました。");
        }
      } catch (err) {
        console.error("分析エラー:", err);
        setError("分析に失敗しました。もう一度お試しください。");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [formData]);

  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <div className="step-page">
        <div className="progress-bar">
          <span>年収</span>
          <span>職種</span>
          <span>企業</span>
          <span>スキル診断</span>
          <span className="active">結果</span>
        </div>

        <h2 className="page-title">分析結果</h2>

        {loading ? (
          <p>分析中です...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : result ? (
          <div className="analysis-result">
            <p><strong>マッチ率:</strong> {result.matchRate}%</p>

            <h3>スキル評価</h3>
            <ul>
              {Object.entries(result.skills).map(([skill, level]) => (
                <li key={skill}>
                  {skill}: レベル {level}
                </li>
              ))}
            </ul>

            <h3>アドバイス</h3>
            <p>{result.advice}</p>

            <h3>学習ロードマップ</h3>
            <ul>
              {Object.entries(result.roadmap).map(([week, task]) => (
                <li key={week}>
                  <strong>{week}:</strong> {task}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>結果が取得できませんでした。</p>
        )}
      </div>
    </>
  );
};

export default AnalysisResultPage;
