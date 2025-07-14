import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/StepPage.css";
import { StepContext } from "../contexts/StepContext";

const CompanySuggestionPage = () => {
  const { formData, setFormData } = useContext(StepContext);
  const { income, jobType } = formData;
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/suggest-companies", {
          annualIncome: income,
          jobType: jobType,
        }, {
          withCredentials: true,
        });

        if (Array.isArray(res.data.companies)) {
          setCompanies(res.data.companies);
        } else {
          setError("APIレスポンス形式が不正です。");
        }
      } catch (err) {
        console.error("企業取得エラー:", err);
        setError("企業の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [income, jobType]);

  const handleSelect = (company) => {
    setFormData((prev) => ({ ...prev, company }));
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
          <span>職種</span>
          <span className="active">企業</span>
          <span>スキル診断</span>
          <span>結果</span>
        </div>

        <h2 className="page-title">あなたに合った企業候補</h2>

        {loading ? (
          <p>企業を分析中です...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : companies.length === 0 ? (
          <p>企業候補が見つかりませんでした。</p>
        ) : (
          <div className="step-options">
            {companies.map((company, index) => (
              <div
                key={index}
                className="option-box clickable"
                onClick={() => handleSelect(company)}
              >
                <strong>会社名: {company.name || "名称未定"}</strong><br />
                <span>タイプ: {company.type || "未指定"}</span><br />
                <span>勤務地: {company.location || "不明"}</span><br />
                <span>職種: {company.job_title || "未指定"}</span><br />
                <span>技術: {company.tech_stack || company.tech || "未記載"}</span><br />
                <span>年収: {company.min_income}〜{company.max_income}万円</span><br />
                <span style={{ fontSize: "0.85em", color: "#666" }}>
                  {company.notes || ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CompanySuggestionPage;
