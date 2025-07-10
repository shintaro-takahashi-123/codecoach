// src/pages/HomePage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // CHANGE: Import useAuth
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, isLoading } = useAuth(); // CHANGE: Use the useAuth hook

  // Show a loading message while authentication status is being checked
  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div>
      <h1>CodeCoachへようこそ！</h1>
      {user ? (
        // What to show when logged in
        <div>
          <p>こんにちは、{user.name}さん。</p>
          <p>早速、スキル分析やAIとの学習を始めましょう。</p>
          <Link to="/annual-income">分析を始める</Link>
        </div>
      ) : (
        // What to show when logged out
        <div>
          <p>まずはログインまたは新規登録をしてください。</p>
          <Link to="/login" style={{ marginRight: '10px' }}>ログイン</Link>
          <Link to="/register">新規登録</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;