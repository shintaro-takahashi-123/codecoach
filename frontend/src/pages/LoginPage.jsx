import "../index.css";

function LoginPage() {
  return (
    <>
      <header className="header">
        <h1>CodeCoach</h1>
      </header>
      <form>
        <h2>ログイン</h2>
        <input type="email" placeholder="メールアドレス" required />
        <input type="password" placeholder="パスワード" required />
        <button type="submit">ログイン</button>
        <p>
          アカウントをお持ちでない場合、<a href="/register">登録はこちら</a>
        </p>
      </form>
    </>
  );
}

export default LoginPage;
