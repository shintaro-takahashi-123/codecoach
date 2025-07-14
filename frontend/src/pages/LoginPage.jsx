import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"; // ✅ axiosからapiに変更
import { AuthContext } from "../contexts/AuthContext";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ 認証リクエスト（CSRF除外済み想定）
      await api.post("/login", { email, password });

      // ✅ ユーザー情報の取得（withCredentialsは axios.js にて統一済み）
      const userRes = await api.get("/user");

      login(userRes.data.data);
      navigate("/Induction");
    } catch (err) {
      const msg = err.response?.data?.message || "ログインできませんでした。メールアドレスまたはパスワードを確認してください。";
      alert(msg);
      console.error("Login failed:", err.response?.data || err);
    }
  }

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
