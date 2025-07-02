import { useState } from 'react'

function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const result = await res.json()
    if (result.status === "success") {
      setMessage("登録成功！")
    } else {
      setMessage("エラー: " + (result.message || "不明"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>ユーザー登録</h2>
      <input placeholder="名前" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="メール" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="パスワード" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">登録</button>
      {message && <p>{message}</p>}
    </form>
  )
}

export default RegisterForm
