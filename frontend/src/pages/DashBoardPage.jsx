function DashboardPage() {
  return (
    <>
      <header style={{
        background: 'linear-gradient(to right, #00f2fe, #4facfe)',
        padding: '1rem',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>CodeCoach</h1>
      </header>

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>ようこそ、ユーザーさん</h2>
        <p>ここはダッシュボード画面です。診断結果などをここに表示します。</p>
      </main>
    </>
  )
}

export default DashboardPage
