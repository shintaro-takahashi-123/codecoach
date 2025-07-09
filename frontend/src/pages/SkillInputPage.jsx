import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StepPage.css";
import { StepContext } from "../contexts/StepContext";

const skillsList = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React",
  "Git", "Docker", "AWS"
];

const SkillInputPage = () => {
  const navigate = useNavigate();
  const { setFormData } = useContext(StepContext);
  const [skills, setSkills] = useState({});

  const handleChange = (skill, level) => {
    setSkills((prev) => ({ ...prev, [skill]: level }));
  };

  const handleSubmit = () => {
    const filteredSkills = Object.fromEntries(
      Object.entries(skills).filter(([_, level]) => level !== "")
    );

    setFormData((prev) => ({ ...prev, skills: filteredSkills }));

    // 仮のIDを使って次のページへ遷移（実際はAPIで生成されたIDを使う）
    navigate("/analysis-result/temp-id");
  };

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
          <span className="active">スキル診断</span>
          <span>結果</span>
        </div>

        <h2 className="page-title">あなたのスキルレベルを自己評価してください</h2>

        <div className="skill-form">
          {skillsList.map((skill) => (
            <div key={skill} className="skill-row">
              <label>{skill}</label>
              <select
                value={skills[skill] || ""}
                onChange={(e) => handleChange(skill, parseInt(e.target.value))}
              >
                <option value="">選択</option>
                <option value="0">未経験</option>
                <option value="1">基礎レベル</option>
                <option value="2">簡単な実装ができる</option>
                <option value="3">実務で使ったことがある</option>
                <option value="4">チームでリードできる</option>
              </select>
            </div>
          ))}
        </div>

        <button className="form-button" onClick={handleSubmit}>
          分析結果を見る
        </button>
      </div>
    </>
  );
};

export default SkillInputPage;
