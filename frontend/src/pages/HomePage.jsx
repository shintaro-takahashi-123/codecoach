import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";
import { FaSearch, FaPencilAlt, FaHandshake } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext";

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const userName = user?.name || "ゲスト";
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);

  const handleCareerReset = () => {
    localStorage.removeItem("userProfile"); // 例：保存していた診断データを削除
    navigate("/annual-income"); // 希望年収ページへ遷移
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-title">CodeCoach</div>
      </header>


      <main className="home-main">
        <h2 className="greeting">こんにちは {userName} さん</h2>

        <div className="home-buttons">
          <div className="home-button">
            <FaSearch className="icon" />
            <span>スキル診断情報をみる</span>
          </div>

          <div
            className="home-button"
            onMouseEnter={() => setShowWarning(true)}
            onMouseLeave={() => setShowWarning(false)}
            onClick={handleCareerReset}
          >
            <FaPencilAlt className="icon" />
            <span>キャリアコーチ</span>
            {showWarning && (
              <div className="warning-text">※診断結果はすべてリセットされます</div>
            )}
          </div>

          <div className="home-button" onClick={() => navigate("/code-coach")}>
            <FaHandshake className="icon" />
            <span>コードコーチ</span>
        </div>

        </div>
      </main>

      <footer className="home-footer">© 2025 CodeCoach.</footer>
    </div>
  );
};

export default HomePage;
