import React, { useContext, useEffect, useState } from "react";
import { StepContext } from "../contexts/StepContext";
import { useNavigate } from "react-router-dom";

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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2>あなたにマッチする企業（{companies.length}社）</h2>
      {loading ? (
        <div>読み込み中...</div>
      ) : error ? (
        <div style={{ color: "red" }}>{error}</div>
      ) : companies.length === 0 ? (
        <div>該当する企業がありません。</div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
          {companies.map((c, i) => (
            <div
              key={c.id || i}
              style={{
                border: "1px solid #ccc",
                borderRadius: 12,
                padding: 18,
                width: 250,
                background: "#fafdff",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/company/${c.id || i}/analysis-result`, {
                  state: { company: c },
                })
              }
            >
              <h3>{c.name}</h3>
              <div>
                📍 {c.location} / 💻 {c.techStack?.join(", ")}
              </div>
              <div>💰 {c.salaryRange}</div>
              <div style={{ fontWeight: "bold", marginTop: 8 }}>
                マッチ度: {c.matchRate}%
              </div>
              <div style={{ marginTop: 8 }}>{c.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyListPage;
