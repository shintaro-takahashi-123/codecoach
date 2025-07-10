// src/pages/RegisterPage.jsx (正しいコード)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 変更: useAuthをインポート
import "../styles/RegisterPage.css"; // 必要に応じてCSSをインポート

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth(); // 変更: useAuthフックからregister関数を取得
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await register({ name, email, password });
      if (response.status === 'success') {
        navigate('/annual-income'); // 登録成功後、分析ページへ
      } else {
        setError(response.message || '登録に失敗しました。');
      }
    } catch (err) {
      setError('登録中にエラーが発生しました。');
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
          <h2 className="form-title">新規登録</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="名前"
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
            {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
            <button type="submit" className="form-button">
              登録して次へ
            </button>
          </div>
          <p className="back-link">
            アカウントを既にお持ちの場合、<Link to="/login">ログインはこちら</Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default RegisterPage;