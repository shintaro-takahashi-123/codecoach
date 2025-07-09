import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/RegisterPage.css";

axios.defaults.withCredentials = true;

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    axios.get("http://localhost:8000/sanctum/csrf-cookie", {
      withCredentials: true,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      alert("パスワードは6文字以上で設定してください");
      return;
    }

    if (password !== confirm) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/register",
        { name, email, password },
        { withCredentials: true }
      );

      // 登録成功後にログイン状態を保存
      login(res.data.data);

      alert("登録成功！プロフィール入力へ進みます");
      navigate("/annual-income");
    } catch (err) {
      console.error("登録エラー", err);
      alert("登録エラー：メールアドレスが既に使われているか、サーバーエラーです");
    }
  };

  return (
    <>
      <header>
        <div className="header-title">CodeCoach</div>
      </header>

      <div className="form-container">
        <div className="form-box">
          <h2 className="form-title">新規登録</h2>
          <p className="form-description">必要事項を入力してアカウントを作成してください。</p>
          <form onSubmit={handleSubmit} className="form-group">
            <input
              type="text"
              placeholder="ユーザー名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
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
            <input
              type="password"
              placeholder="パスワード確認"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="form-input"
              required
            />
            <button type="submit" className="form-button">
              アカウント作成
            </button>
          </form>
          <p className="back-link">
            すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
