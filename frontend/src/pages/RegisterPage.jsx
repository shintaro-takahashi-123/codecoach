import React, { useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"; // ✅ axios.jsで withCredentials が設定されている前提
import { AuthContext } from "../contexts/AuthContext";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);

    if (password.length < 6) {
      alert("パスワードは6文字以上で設定してください");
      setSubmitting(false);
      submittingRef.current = false;
      return;
    }

    if (password !== confirm) {
      alert("パスワードが一致しません");
      setSubmitting(false);
      submittingRef.current = false;
      return;
    }

    try {
      console.log("🚀 登録開始", { name, email });

      const res = await api.post("/register", { name, email, password });
      console.log("✅ 登録成功", res.data);

      login(res.data.data);

      const userRes = await api.get("/user");
      console.log("🔐 認証済みユーザー取得", userRes.data);

      navigate("/induction");
    } catch (err) {
      const errorData = err.response?.data || err.message || err;
      console.error("❌ 登録エラー詳細", errorData);

      if (err.response?.status === 422 && errorData?.errors?.email?.[0]) {
        alert(`登録に失敗：${errorData.errors.email[0]}`);
      } else if (err.response?.status === 419) {
        alert("CSRFエラーが発生しました。Cookieとセッションを確認してください。");
      } else {
        alert("登録に失敗しました。");
      }
    } finally {
      setSubmitting(false);
      submittingRef.current = false;
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

          <form className="form-group" onSubmit={handleSubmit}>
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
            <button
              type="submit"
              className="form-button"
              disabled={submitting}
            >
              {submitting ? "登録中..." : "アカウント作成"}
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
