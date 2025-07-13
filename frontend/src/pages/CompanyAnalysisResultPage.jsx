// src/pages/CompanyAnalysisResultPage.jsx
import React from "react";
import { useLocation } from "react-router-dom";

const CompanyAnalysisResultPage = () => {
  const location = useLocation();
  const company = location.state?.company;

  if (!company) {
    return <div>企業情報が取得できませんでした。</div>;
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
      <h2>{company.name}</h2>
      <div>📍 {company.location}</div>
      <div>💰 {company.salaryRange}</div>
      <div>💻 技術: {company.techStack?.join(", ")}</div>
      <div style={{ margin: "12px 0" }}>{company.description}</div>
      <div>
        マッチ度: <b>{company.matchRate}%</b>
      </div>
      {/* 必要ならここに会社ごとの追加分析やスキル可視化などを拡張 */}
    </div>
  );
};

export default CompanyAnalysisResultPage;
