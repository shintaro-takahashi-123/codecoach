import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StepPage.css";
import { StepContext } from "../contexts/StepContext";

const JobTypePage = () => {
  const navigate = useNavigate();
  const { setFormData } = useContext(StepContext);

  const jobTypes = [
    {
      title: "Web・アプリ開発",
      description: "HTML / CSS / JavaScript / React / Node.js など",
    },
    {
      title: "AI・データ分析",
      description: "Python / 機械学習 / 統計 / データ可視化 など",
    },
    {
      title: "モバイルアプリ開発",
      description: "Swift / Kotlin / Flutter / React Native など",
    },
    {
      title: "データエンジニアリング",
      description: "ETL / BigQuery / Spark / データ基盤構築 など",
    },
  ];

  const handleSelect = (type) => {
    setFormData((prev) => ({ ...prev, jobType: type }));
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
          <span>企業</span>
          <span>スキル診断</span>
          <span>結果</span>
        </div>

        <h2 className="page-title">目指す職種を選択してください</h2>

        <div className="step-options">
          {jobTypes.map((job, index) => (
            <div
              key={index}
              className="option-box clickable"
              onClick={() => handleSelect(job.title)}
            >
              <strong>{job.title}</strong>
              <span>{job.description}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JobTypePage;
