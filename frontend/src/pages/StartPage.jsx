import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/codecoach-logo.png';
import '../styles/StartPage.css';

const StartPage = () => {
  const navigate = useNavigate();
  const [visibleLines, setVisibleLines] = useState(0);

  const descriptionLines = [
    "CodeCoachは、AIがあなたの「つまずき」を分析し、",
    "最適な学習方法とキャリアへのつなげ方を提案する、",
    "上級者向けの学習支援システムです。",
    "自分に合った学び方がきっと見つかる。",
    "「どんな企業に行きたいか」を選ぶだけで、",
    "AIが学習のパートナーになります。",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < descriptionLines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 400); // 各行の表示間隔（ミリ秒）

    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <div className="start-page">
        <div className="left-section">
          <img src={logo} alt="CodeCoach Logo" className="logo" />
          <p className="powered-by">CodeCoach powered by paiza</p>
        </div>
        <div className="right-section">
          <div className="description">
            {descriptionLines.map((line, index) => (
              <span
                key={index}
                className={`fade-line ${index < visibleLines ? 'visible' : ''}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {line}
                <br />
              </span>
            ))}
          </div>
          <button className="login-button" onClick={handleLoginClick}>
            ログインして体験する
          </button>
        </div>
      </div>
    </>
  );
};

export default StartPage;
