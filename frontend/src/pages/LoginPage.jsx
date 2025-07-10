import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({ email, password });

      if (response.status === 'success') {
        // ↓ この行を変更しました
        navigate("/annual-income");
      } else {
        setError(response.message || 'ログインに失敗しました。');
      }
    } catch (err) {
      setError("ログインエラー：メールアドレスまたはパスワードが無効です");
      console.error(err);
    }
  };

  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form-box">
          <h2 className="form-title">ログイン</h2>
          <p className="form-description">
            登録済みのメールアドレスとパスワードを入力してください。
          </p>
          <div className="form-group">
            <input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
            <button type="submit" className="form-button">
              ログイン
            </button>
          </div>
          <p className="back-link">
            アカウントをお持ちでない場合、<Link to="/register">登録はこちら</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default LoginPage;