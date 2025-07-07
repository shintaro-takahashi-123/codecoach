import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TestHintApi from "./TestHintApi";

import ChatHintApi from "./ChatHintApi";

function Home({ ping, fetchPing }) {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={fetchPing}>{ping}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <hr />
      {/* 追加：リンクでテストページに遷移 */}
      <Link to="/test-hint">ヒントAPIテストページへ</Link>
    </>
  );
}

function App() {
  const [ping, setPing] = useState("");
  const fetchPing = async () => {
    await fetch("http://localhost:8000/ping")
      .then((res) => res.json())
      .then((response) => setPing(response.message));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home ping={ping} fetchPing={fetchPing} />} />
        <Route path="/test-hint" element={<TestHintApi />} />

        <Route path="/chat-hint" element={<ChatHintApi />} />
      </Routes>
    </Router>
  );
}

export default App;
