import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import { Link } from "react-router-dom";

const ForgotPage = () => {
  return (
    <>
      <Header />
      <div className="form-container">
        <div className="form-box">
          <h2 className="form-title">ログインできない場合</h2>
          <p className="form-description">
            アカウントにアクセスするためのリンクを送信する為、ユーザー名またはメールアドレスを入力してください。
          </p>
          <input
            type="text"
            placeholder="ユーザー ネーム またはメールアドレス"
            className="form-input"
          />
          <button className="form-button">ログインリンクを送信</button>
        </div>
      </div>
      <div className="back-link">
        <Link to="/login">ログインに戻る</Link>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPage;
