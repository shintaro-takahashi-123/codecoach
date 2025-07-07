// frontend/src/pages/ForgotPage.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";

const ForgotPage = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <h2>ログインできない場合</h2>
        <p>
          アカウントにアクセスするためのリンクを送信する為、ユーザー名またはメールアドレスを入力してください。
        </p>
        <form className="form-box">
          <input
            type="text"
            placeholder="ユーザー ネーム または メールアドレス"
            className="input-field"
          />
          <button type="submit" className="submit-button">
            ログインリンクを送信
          </button>
        </form>
        <div className="back-link">
          <a href="/">ログインに戻る</a>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPage;