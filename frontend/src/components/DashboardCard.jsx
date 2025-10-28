// src/components/DashboardCard.jsx
import React from "react";
import {
  TrendingUp,
  Briefcase,
  Users,
  Wallet,
  CalendarDays,
} from "lucide-react";

const iconMap = {
  work: {
    icon: <Briefcase className="w-6 h-6 text-blue-700" />,
    bg: "bg-blue-50",
    border: "border-blue-100",
    ring: "ring-blue-200",
  },
  fund: {
    icon: <Wallet className="w-6 h-6 text-green-700" />,
    bg: "bg-green-50",
    border: "border-green-100",
    ring: "ring-green-200",
  },
  job: {
    icon: <Users className="w-6 h-6 text-amber-700" />,
    bg: "bg-amber-50",
    border: "border-amber-100",
    ring: "ring-amber-200",
  },
  year: {
    icon: <CalendarDays className="w-6 h-6 text-indigo-700" />,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    ring: "ring-indigo-200",
  },
  trend: {
    icon: <TrendingUp className="w-6 h-6 text-rose-700" />,
    bg: "bg-rose-50",
    border: "border-rose-100",
    ring: "ring-rose-200",
  },
};

const DashboardCard = ({ title, value, type }) => {
  const card = iconMap[type] || iconMap.trend;

  return (
    <div
      className={`relative bg-white/95 backdrop-blur-sm border ${card.border} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col items-center justify-between hover:-translate-y-[3px]`}
    >
      {/* Header Icon */}
      <div
        className={`${card.bg} p-3 rounded-xl shadow-inner ring-1 ${card.ring} flex items-center justify-center`}
      >
        {card.icon}
      </div>

      {/* Title */}
      <p className="mt-4 text-gray-600 text-sm font-semibold text-center tracking-wide uppercase leading-snug truncate w-full">
        {title}
      </p>

      {/* Value */}
      <h3 className="text-center text-2xl font-bold text-gray-900 mt-1 tracking-tight leading-tight break-words">
        {value !== undefined && value !== null ? value : "—"}
      </h3>

      {/* Bottom Accent Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-[4px] ${card.bg} rounded-b-2xl`}
      />
    </div>
  );
};

export default DashboardCard;
