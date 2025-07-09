import React, { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/login", { email, password });

      const res = await api.get("/user");
      login(res.data.data);

      navigate("/annual-income");
    } catch (err) {
      alert("ログインエラー：メールアドレスまたはパスワードが無効です");
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
