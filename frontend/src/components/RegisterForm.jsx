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
    <form onSubmit={handleSubmit} className="form-container">
      <h2>新規登録画面</h2>
      <input type="text" placeholder="ユーザー名" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="email" placeholder="メールアドレス" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="パスワード" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input type="password" placeholder="パスワード確認" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      <button type="submit">アカウント作成</button>
      <p><a href="/login">ログイン画面へ</a></p>
    </form>
  );
};

export default RegisterForm;
