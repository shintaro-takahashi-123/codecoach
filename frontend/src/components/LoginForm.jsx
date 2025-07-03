import { useState } from 'react'

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    alert("ログイン処理（APIに接続予定）")
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ textAlign: 'center', fontSize: '1rem' }}>
        <strong>ログインして診断結果をみよう！</strong>
      </h2>

      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        required
      />

      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
        required
      />

      <button type="submit" className="button" style={buttonStyle}>ログイン </button>

      <p style={{ fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem' }}>
        ログイン情報を忘れてしまった場合は、<a href="#" style={{ color: "#007bff" }}>ログインのヘルプをチェック。</a>
      </p>
    </form>
  )
}

export default LoginForm
