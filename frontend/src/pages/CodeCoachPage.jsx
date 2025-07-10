// src/pages/CodeCoachPage.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // CHANGE: Import useAuth

const CodeCoachPage = () => {
  const { user } = useAuth(); // CHANGE: Use the useAuth hook

  // Show a loading message while the user data is being verified
  if (!user) {
    return <div>読み込み中...</div>;
  }
  
  return (
    <div>
      <h2>AI Code Coach</h2>
      <p>こんにちは、{user.name}さん。プログラミングの質問をどうぞ。</p>
      
      {/* --- This is where the chat UI and logic will go --- */}
      <div>
        <div style={{ border: '1px solid #ccc', height: '400px', marginBottom: '10px', padding: '10px' }}>
          {/* AI responses will be displayed here */}
        </div>
        <form>
          <input type="text" style={{ width: '80%', padding: '8px' }} placeholder="質問を入力..." />
          <button type="submit">送信</button>
        </form>
      </div>

    </div>
  );
};

export default CodeCoachPage;