import React from "react";
import { useTranslation } from "react-i18next";
import { Phone, Mail } from "lucide-react";

const Header = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <header className="bg-white border-b-4 border-orange-500 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              Toll Free: 1800-345-6789
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              support@mgnrega.gov.in
            </span>
          </div>

          {/* Language Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => changeLanguage("hi")}
              className={`hover:text-orange-300 transition-colors ${
                i18n.language === "hi" ? "text-orange-300 font-semibold" : ""
              }`}
            >
              हिंदी
            </button>
            <span>|</span>
            <button
              onClick={() => changeLanguage("en")}
              className={`hover:text-orange-300 transition-colors ${
                i18n.language === "en" ? "text-orange-300 font-semibold" : ""
              }`}
            >
              English
            </button>
            <span>|</span>
            <button
              onClick={() => changeLanguage("ta")}
              className={`hover:text-orange-300 transition-colors ${
                i18n.language === "ta" ? "text-orange-300 font-semibold" : ""
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          {/* Government Emblem */}
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
            <div className="text-white font-bold text-2xl">⚜</div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-blue-900 leading-tight">
              Mahatma Gandhi National Rural Employment Guarantee Act
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Ministry of Rural Development | Government of India
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
