import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/InductionPage.css";

const inductionLines = [
  "まずはあなたの希望年収、希望職種、希望の企業、技術レベルを選択してください。",
  "キャリアコーチが今のあなたのスキルと希望の企業の求めるスキルのギャップを分析してくれます。",
];

function InductionPage() {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < inductionLines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    navigate("/annual-income");
  };

  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <main className="induction-animated">
        <div className="animated-text">
          {inductionLines.map((line, index) => (
            <span
              key={index}
              className={`fade-line ${index < visibleLines ? "visible" : ""}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {line}
              <br />
            </span>
          ))}
        </div>
        <button className="start-button" onClick={handleStart}>始める</button>
      </main>
    </>
  );
}

export default InductionPage;
