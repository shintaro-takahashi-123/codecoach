import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AnnualIncomePage.css";
import { StepContext } from "../contexts/StepContext";

const AnnualIncomePage = () => {
  const navigate = useNavigate();
  const { setFormData } = useContext(StepContext);

  const incomeRanges = [
    {
      label: "～400万円",
      description: "初めてのエンジニア経験、第二新卒レベル",
    },
    {
      label: "500～700万円",
      description: "実務経験あり / 中堅エンジニア層",
    },
    {
      label: "800～1,000万円",
      description: "リードエンジニア / 上級職種を目指す方",
    },
    {
      label: "1,000万円以上",
      description: "外資・CTO・フリーランス高単価案件など",
    },
  ];

  const handleSelect = (range) => {
    setFormData((prev) => ({ ...prev, income: range }));
    navigate("/job-type");
  };

  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <div className="step-page">
        <div className="progress-bar">
          <span className="active">年収</span>
          <span>職種</span>
          <span>企業</span>
          <span>スキル診断</span>
          <span>結果</span>
        </div>

        <h2 className="page-title">希望年収を選択してください</h2>

        <div className="step-options">
          {incomeRanges.map((range, index) => (
            <div
              key={index}
              className="option-box clickable"
              onClick={() => handleSelect(range.label)}
            >
              <strong>{range.label}</strong>
              <span>{range.description}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AnnualIncomePage;
