// src/contexts/StepContext.jsx
import React, { createContext, useState } from "react";

// コンテキストの作成
export const StepContext = createContext();

// プロバイダーコンポーネント
export const StepProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    income: "",           // 年収
    jobType: "",          // 職種
    company: null,        // 企業オブジェクト { name, type, tech, reason }
    skills: {},           // スキル評価 { React: 3, Docker: 2, ... }
  });

  return (
    <StepContext.Provider value={{ formData, setFormData }}>
      {children}
    </StepContext.Provider>
  );
};
