// src/components/Header.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail } from "lucide-react";
import logo from "../assets/images.png";

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <header className="bg-white shadow-md border-b-4 border-orange-500">
      {/* 🔹 Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Contact Info */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{t("tollFree") || "Toll Free: 1800-345-6789"}</span>
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{t("supportMail") || "support@mgnrega.gov.in"}</span>
            </span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-3 justify-center sm:justify-end">
            {[
              { code: "hi", label: "हिंदी" },
              { code: "en", label: "English" },
              { code: "ta", label: "தமிழ்" },
            ].map(({ code, label }) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className={`transition-colors hover:text-orange-300 ${
                  i18n.language === code
                    ? "text-orange-300 font-semibold"
                    : "text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center sm:justify-start gap-4">
        {/* Logo or Emblem */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shadow-md bg-gray-300 flex items-center justify-center">
          <img
            src={logo}
            alt="Ministry of Rural Development Logo"
            className="w-full h-full object-contain p-1"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center sm:text-left">
          <h1 className="text-lg sm:text-2xl font-bold text-blue-900 leading-tight">
            Mahatma Gandhi National Rural Employment Guarantee Act
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Ministry of Rural Development | Government of India
          </p>

          {/* Project Subtitle - Our Voice, Our Rights */}
          <p className="mt-2 text-orange-600 font-semibold text-base sm:text-lg italic tracking-wide">
            {t("ourVoiceOurRights") || "Our Voice, Our Rights"}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
