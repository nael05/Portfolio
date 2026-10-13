"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type LanguageContextType = {
  lang: "fr" | "en";
  setLang: (lang: "fr" | "en") => void;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<"fr" | "en">("fr");

  // Optional: Load language from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("portfolio-lang") as "fr" | "en";
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  const handleSetLang = (newLang: "fr" | "en") => {
    setLang(newLang);
    localStorage.setItem("portfolio-lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
