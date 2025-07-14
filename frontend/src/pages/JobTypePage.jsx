import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StepPage.css";
import { StepContext } from "../contexts/StepContext";

const JobTypePage = () => {
  const navigate = useNavigate();
  const { setFormData } = useContext(StepContext);

  const jobTypes = [
    {
      label: "Web・アプリ開発",
      value: "Web・アプリ開発",
      description: "HTML / CSS / JavaScript / React / Node.js など",
    },
    {
      label: "AI・データ分析",
      value: "AI・データ分析",
      description: "Python / 機械学習 / 統計 / データ可視化 など",
    },
    {
      label: "モバイルアプリ開発",
      value: "モバイルアプリ開発",
      description: "Swift / Kotlin / Flutter / React Native など",
    },
    {
      label: "データエンジニアリング",
      value: "データエンジニアリング",
      description: "ETL / BigQuery / Spark / データ基盤構築 など",
    },
  ];

  const handleSelect = (value) => {
    setFormData((prev) => ({ ...prev, jobType: value }));
    navigate("/skill-input");
  };

  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <div className="step-page">
        <div className="progress-bar">
          <span>年収</span>
          <span className="active">職種</span>
          <span>スキル診断</span>
          <span>企業</span>
          <span>結果</span>
        </div>

        <h2 className="page-title">目指す職種を選択してください</h2>

        <div className="step-options">
          {jobTypes.map((type, index) => (
            <div
              key={index}
              className="option-box clickable"
              onClick={() => handleSelect(type.value)}
            >
              <strong>{type.label}</strong>
              <span>{type.description}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JobTypePage;
