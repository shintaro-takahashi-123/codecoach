import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StepPage.css";
import { StepContext } from "../contexts/StepContext";

const skillsList = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Git",
  "Docker",
  "AWS",
];

const SkillInputPage = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useContext(StepContext); // formDataも取得
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (skill, level) => {
    setSkills((prev) => ({ ...prev, [skill]: level }));
  };

  const handleSubmit = async () => {
    const filteredSkills = Object.fromEntries(
      Object.entries(skills).filter(([_, level]) => level !== "")
    );

    // 送信データの組み立て
    const postData = {
      ...formData, // 年収・職種など前ステップの内容も送る
      skills: filteredSkills,
    };

    setFormData((prev) => ({ ...prev, skills: filteredSkills }));

    setLoading(true);
    try {
      // 分析APIにPOST
      const res = await fetch("http://localhost:8000/api/analyze-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        // 結果をstateかcontextで保持（ここではcontext渡し）
        setFormData((prev) => ({
          ...prev,
          analysisResult: data.data,
        }));
        // ★ 遷移先を /analysis-result に統一
        navigate("/company-list");
      } else {
        alert(data.message || "分析に失敗しました。");
      }
    } catch (err) {
      alert("サーバーとの通信に失敗しました。");
    } finally {
      setLoading(false);
    }
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

        <h2 className="page-title">
          あなたのスキルレベルを自己評価してください
        </h2>

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

        <button
          className="form-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "分析中..." : "分析結果を見る"}
        </button>
      </div>
    </>
  );
};

export default SkillInputPage;
