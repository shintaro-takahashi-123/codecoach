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
    localStorage.removeItem("userProfile"); // 診断データ削除
    navigate("/annual-income"); // キャリア入力へ
  };

  const handleViewAnalysis = () => {
    navigate("/analysis-result");
  };

  const handleCareerCoachClick = () => {
    setShowWarning(true); // 警告モードON
  };

  const cancelReset = () => {
    setShowWarning(false); // 警告モード解除
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-title">CodeCoach</div>
      </header>

      <main className="home-main">
        <h2 className="greeting">こんにちは <span className="highlighted-name">{userName}</span> さん</h2>

        <div className="home-buttons">
          {/* スキル診断情報を見る */}
          <div className="home-button" onClick={handleViewAnalysis}>
            <FaSearch className="icon" />
            <span>スキル診断情報をみる</span>
          </div>

          {/* キャリアコーチ（警告付き） */}
          <div className="home-button" onClick={handleCareerCoachClick}>
            <FaPencilAlt className="icon" />
            <span>キャリアコーチ</span>

            {showWarning && (
              <div className="warning-container">
                <div className="warning-text">
                  診断結果はすべてリセットされます。よろしいですか？
                </div>
                <div className="warning-actions">
                  <button onClick={handleCareerReset}>はい</button>
                  <button onClick={cancelReset}>戻る</button>
                </div>
              </div>
            )}
          </div>

          {/* コードコーチ */}
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
