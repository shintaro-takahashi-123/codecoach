import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("パスワードが一致しません");
      return;
    }

    try {
      const res = await axios.post("http://localhost:9000/api/register", {
        name,
        email,
        password,
      });
      alert("登録成功");
    } catch (err) {
      console.error(err);
      alert("登録エラー：サーバーエラー");
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2 className="form-title">新規登録画面</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input
            type="text"
            placeholder="ユーザー名"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="パスワード確認"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button type="submit">アカウント作成</button>
        </form>
        <p className="back-link">
          <a href="/login">ログイン画面へ</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;