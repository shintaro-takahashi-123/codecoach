import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ★ 追加
import { StepContext } from "../contexts/StepContext";

import { Radar } from "react-chartjs-2";
import Chart from "chart.js/auto"; // eslint-disable-line no-unused-vars

import "../styles/StepPage.css";
import "../styles/AnalysisResultPage.css";

const AnalysisResultPage = () => {
  /* ---------- context / state ---------- */
  const { formData } = useContext(StepContext);
  const navigate = useNavigate(); // ★ 追加

  const [result, setResult] = useState(formData.analysisResult || null);
  const [loading, setLoading] = useState(!formData.analysisResult);
  const [error, setError] = useState(null);

  /* ---------- fallback fetch ---------- */
  useEffect(() => {
    if (formData.analysisResult) return;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/analyze-skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok && data.status === "success") {
          setResult(data.data);
        } else {
          throw new Error(data.message || "分析に失敗しました。");
        }
      } catch {
        setError("分析に失敗しました。もう一度お試しください。");
      } finally {
        setLoading(false);
      }
    })();
  }, [formData]);

  /* ---------- Radar Chart data ---------- */
  const chartData = useMemo(() => {
    if (!result?.skills) return null;

    const labels = Object.keys(result.skills);
    const current = Object.values(result.skills);
    const target = result.targetLevels
      ? labels.map((k) => result.targetLevels[k] ?? 4)
      : labels.map(() => 4);

    return {
      labels,
      datasets: [
        {
          label: "目標レベル",
          data: target,
          borderColor: "rgba(255,99,132,0.9)",
          backgroundColor: "rgba(255,99,132,0.2)",
          pointRadius: 3,
        },
        {
          label: "あなたの現在レベル",
          data: current,
          borderColor: "rgba(54,162,235,0.9)",
          backgroundColor: "rgba(54,162,235,0.15)",
          pointRadius: 3,
        },
      ],
    };
  }, [result]);

  /* ---------- ギャップ一覧 ---------- */
  const gapList = useMemo(() => {
    if (!result?.skills) return [];
    const target = result.targetLevels || {};
    return Object.entries(result.skills)
      .map(([skill, lvl]) => {
        const goal = target[skill] ?? 4;
        return { skill, current: lvl, goal, diff: goal - lvl };
      })
      .filter((g) => g.diff > 0)
      .sort((a, b) => b.diff - a.diff);
  }, [result]);

  /* ---------- render ---------- */
  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <div className="step-page">
        {/* 進捗バー */}
        <div className="progress-bar">
          <span>年収</span>
          <span>職種</span>
          <span>企業</span>
          <span>スキル診断</span>
          <span className="active">結果</span>
        </div>

        <h2 className="page-title">スキル一致率診断結果</h2>

        {loading ? (
          <p>分析中です...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : result ? (
          <>
            {/* -------- 上段 -------- */}
            <div className="result-top">
              <div className="radar-wrapper">
                {chartData && <Radar data={chartData} />}
                <div className="legend">
                  <span className="legend-target">■ 目標レベル</span>
                  <span className="legend-current">■ 現在レベル</span>
                </div>
              </div>

              <div className="gap-info">
                <p className="match-rate">
                  あなたの現在のスキル一致率は：
                  <strong>{Number(result.matchRate).toFixed(1)}%</strong> です
                </p>
                <h4>ギャップ詳細（優先度順）</h4>
                <ul className="gap-list">
                  {gapList.length === 0 ? (
                    <li>大きなギャップはありません 🎉</li>
                  ) : (
                    gapList.map((g) => (
                      <li key={g.skill}>
                        <span className="skill-name">{g.skill}</span>
                        ：必要 <b>{g.goal}</b> / 現在 <b>{g.current}</b>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* -------- 下段 -------- */}
            <div className="result-bottom">
              <div className="advice-block">
                <h3>個別ヒント（学習アドバイス）</h3>
                <ul>
                  {result.advice
                    ? result.advice
                        .split("\n")
                        .map((row, i) => <li key={i}>{row}</li>)
                    : "－"}
                </ul>
              </div>

              <div className="roadmap-block">
                <h3>あなた専用の学習ロードマップ</h3>
                <ul>
                  {result.roadmap
                    ? Object.entries(result.roadmap).map(([w, t]) => (
                        <li key={w}>
                          <strong>{w}：</strong>
                          {t}
                        </li>
                      ))
                    : "－"}
                </ul>
              </div>
            </div>

            {/* -------- アクションボタン -------- */}
            <div className="action-buttons">
              <button onClick={() => navigate("/career-coach")}>
                ✏️ キャリアコーチへ
              </button>

              {/* ★ ここで /code-coach へ遷移 */}
              <button onClick={() => navigate("/code-coach")}>
                💡 コードコーチへ
              </button>
            </div>
          </>
        ) : (
          <p>結果が取得できませんでした。</p>
        )}
      </div>
    </>
  );
};

export default AnalysisResultPage;
