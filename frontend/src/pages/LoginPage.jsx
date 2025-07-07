import React, { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";

axios.defaults.withCredentials = true;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 初回にCSRF Cookieを取得（Sanctum用）
  useEffect(() => {
    axios.get("http://localhost:8000/sanctum/csrf-cookie").catch((err) => {
      console.error("CSRF cookie取得失敗", err);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });
      alert("ログイン成功");
      console.log(res.data);

      // 任意：トップページやマイページに遷移
      // window.location.href = "/dashboard";
    } catch (err) {
      console.error("ログイン失敗", err.response?.data);
      alert("ログインエラー：メールアドレスまたはパスワードが無効です");
    }
  };

  return (
    <>
      <header className="header">
        <h1>CodeCoach</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <h2>ログイン</h2>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">ログイン</button>
        <p>
          アカウントをお持ちでない場合、<a href="/register">登録はこちら</a>
        </p>
      </form>
    </>
  );
}

export default LoginPage;
