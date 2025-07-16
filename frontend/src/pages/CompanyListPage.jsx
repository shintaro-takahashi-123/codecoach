import React, { useContext, useEffect, useState } from "react";
import { StepContext } from "../contexts/StepContext";
import { useNavigate } from "react-router-dom";
import "../styles/CompanyListPage.css";

const CompanyListPage = () => {
  const { formData } = useContext(StepContext);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:8000/api/companies/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        // ここで受け取った値をconsole.logしてチェックもできる
        // console.log("API result:", data);

        if (data.status === "success" && Array.isArray(data.data)) {
          setCompanies(data.data);
        } else {
          setCompanies([]);
          setError(data.message || "取得に失敗しました");
        }
      } catch (e) {
        setError("サーバー通信に失敗しました");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [formData]);

  return (
    <>
      <header className="codecoach-header">
        <h1 className="header-title">CodeCoach</h1>
      </header>
      <div className="company-list-container">
        <div className="company-list-header">
          <h2 className="company-list-title">
            あなたにマッチする企業
            <span className="company-count">（{companies.length}社）</span>
          </h2>
        </div>

        {loading ? (
          <div className="loading-message">読み込み中...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : companies.length === 0 ? (
          <div className="no-companies-message">該当する企業がありません。</div>
        ) : (
          <div className="companies-grid">
            {companies.map((c, i) => (
              <div
                key={c.id || i}
                className="company-card"
                onClick={() =>
                  navigate(`/company/${c.id || i}/analysis-result`, {
                    state: { company: c },
                  })
                }
              >
                <h3 className="company-name">{c.name}</h3>
                <div className="company-info">
                  <div className="company-location">📍 {c.location}</div>
                  <div className="company-tech-stack">
                    💻 {c.techStack?.join(", ")}
                  </div>
                  <div className="company-salary">年収： {c.salaryRange}</div>
                </div>
                <div className="company-match-rate">
                  マッチ度: {c.matchRate}%
                </div>
                <div className="company-description">{c.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyListPage;