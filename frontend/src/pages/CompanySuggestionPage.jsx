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
        });

        if (Array.isArray(res.data.companies)) {
          setCompanies(res.data.companies);
        } else {
          setError("GPTからの出力が不正です。");
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
                <strong>{company.name}</strong>
                <span>タイプ: {company.type}</span><br />
                <span>技術: {company.tech}</span><br />
                <span>理由: {company.reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CompanySuggestionPage;
