import React from "react";
import {
  X,
  Users,
  Briefcase,
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  Award,
  MapPin,
  Building2,
  Target,
  BarChart3,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const DetailModal = ({ district, onClose }) => {
  const { t } = useTranslation();
  if (!district) return null;

  // 🧩 Normalize Keys
  const normalized = {
    ...district,
    percentage_Payments_Generated_Within_15_Days:
      district.percentage_Payments_Generated_Within_15_Days ??
      district.percentage_payments_gererated_within_15_days,
    percent_of_Expenditure_on_Agriculture_Allied_Works:
      district.percent_of_Expenditure_on_Agriculture_Allied_Works ??
      district.percent_of_Expenditure_on_Agriculture_Allied_Works,
  };

  // 🔢 Safely Convert Values
  const safeNumber = (value) => {
    if (value === null || value === undefined || value === "NA") return 0;
    const num = parseFloat(String(value).replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  };

  // 💬 Format Values with Commas & Decimals
  const formatValue = (value) => {
    const num = safeNumber(value);
    if (Number.isInteger(num)) return num.toLocaleString();
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  // 📈 Derived Metrics
  const completionRate =
    safeNumber(normalized.Total_No_of_Works_Takenup) > 0
      ? (
          (safeNumber(normalized.Number_of_Completed_Works) /
            safeNumber(normalized.Total_No_of_Works_Takenup)) *
          100
        ).toFixed(1)
      : 0;

  const activeWorkerRate =
    safeNumber(normalized.Total_No_of_Workers) > 0
      ? (
          (safeNumber(normalized.Total_No_of_Active_Workers) /
            safeNumber(normalized.Total_No_of_Workers)) *
          100
        ).toFixed(1)
      : 0;

  const womenParticipation =
    safeNumber(normalized.Persondays_of_Central_Liability_so_far) > 0
      ? (
          (safeNumber(normalized.Women_Persondays) /
            safeNumber(normalized.Persondays_of_Central_Liability_so_far)) *
          100
        ).toFixed(1)
      : 0;

  // 🧾 Key Metrics Cards
  const keyMetrics = [
    {
      icon: Users,
      label: t("Total Workers"),
      value: formatValue(normalized.Total_No_of_Workers),
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      subtext: `${formatValue(normalized.Total_No_of_Active_Workers)} Active`,
    },
    {
      icon: Briefcase,
      label: t("Total Works Taken Up"),
      value: formatValue(normalized.Total_No_of_Works_Takenup),
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      subtext: `${formatValue(normalized.Number_of_Completed_Works)} Completed`,
    },
    {
      icon: IndianRupee,
      label: t("Total Expenditure"),
      value: `₹${formatValue(normalized.Total_Exp)}`,
      color: "from-violet-500 to-violet-600",
      bgColor: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      subtext: `Wages: ₹${formatValue(normalized.Wages)}`,
    },
    {
      icon: TrendingUp,
      label: t("Average Days/HH"),
      value: formatValue(
        normalized.Average_days_of_employment_provided_per_Household
      ),
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      subtext: `₹${formatValue(
        normalized.Average_Wage_rate_per_day_per_person
      )}/day`,
    },
  ];

  // 🔁 Progress Bars (KPIs)
  const progressBars = [
    {
      label: t("Works Completion"),
      value: completionRate,
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-100",
      icon: CheckCircle,
      iconColor: "text-emerald-600",
    },
    {
      label: t("Active Workers"),
      value: activeWorkerRate,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-100",
      icon: Users,
      iconColor: "text-blue-600",
    },
    {
      label: t("Women Participation"),
      value: womenParticipation,
      color: "from-pink-400 to-pink-600",
      bgColor: "bg-pink-100",
      icon: Award,
      iconColor: "text-pink-600",
    },
    {
      label: t("Payments within 15 days"),
      value: safeNumber(
        normalized.percentage_Payments_Generated_Within_15_Days
      ),
      color: "from-violet-400 to-violet-600",
      bgColor: "bg-violet-100",
      icon: Clock,
      iconColor: "text-violet-600",
    },
  ];

  // 🧱 Detailed Sections
  const detailSections = [
    {
      title: "Employment Details",
      icon: Briefcase,
      color: "text-blue-600",
      items: [
        { label: "Households Worked", value: formatValue(normalized.Total_Households_Worked) },
        { label: "Individuals Worked", value: formatValue(normalized.Total_Individuals_Worked) },
        { label: "HHs Completed 100 Days", value: formatValue(normalized.Total_No_of_HHs_completed_100_Days_of_Wage_Employment) },
        { label: "Differently Abled Workers", value: formatValue(normalized.Differently_abled_persons_worked) },
      ],
    },
    {
      title: "Work Progress",
      icon: Target,
      color: "text-emerald-600",
      items: [
        { label: "Ongoing Works", value: formatValue(normalized.Number_of_Ongoing_Works) },
        { label: "Completed Works", value: formatValue(normalized.Number_of_Completed_Works) },
        { label: "Category B Works", value: `${formatValue(normalized.percent_of_Category_B_Works)}%` },
        { label: "GPs with NIL Expenditure", value: formatValue(normalized.Number_of_GPs_with_NIL_exp) },
      ],
    },
    {
      title: "Social Inclusion",
      icon: UserCheck,
      color: "text-purple-600",
      items: [
        { label: "SC Persondays", value: formatValue(normalized.SC_persondays) },
        { label: "SC Workers", value: formatValue(normalized.SC_workers_against_active_workers) },
        { label: "ST Persondays", value: formatValue(normalized.ST_persondays) },
        { label: "ST Workers", value: formatValue(normalized.ST_workers_against_active_workers) },
      ],
    },
    {
      title: "Financial Breakdown",
      icon: BarChart3,
      color: "text-violet-600",
      items: [
        { label: "Wages", value: `₹${formatValue(normalized.Wages)}` },
        { label: "Material & Skilled Wages", value: `₹${formatValue(normalized.Material_and_skilled_Wages)}` },
        { label: "Admin Expenditure", value: `₹${formatValue(normalized.Total_Adm_Expenditure)}` },
        { label: "Total Expenditure", value: `₹${formatValue(normalized.Total_Exp)}` },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 text-white p-8 relative">
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-2.5 transition-all hover:rotate-90 duration-300"
            onClick={onClose}
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-white/20 rounded-2xl">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-bold">{normalized.district_name}</h2>
              <div className="flex items-center gap-3 mt-2 text-blue-100 text-sm">
                <div className="flex items-center gap-1">
                  <Building2 size={16} /> {normalized.state_name}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar size={16} /> {normalized.fin_year}
                </div>
                <span>•</span>
                <span>{normalized.month}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-8 space-y-8 bg-gradient-to-br from-slate-50 to-blue-50">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {keyMetrics.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className={`${metric.bgColor} rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`${metric.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                  <p className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    {metric.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 my-2">
                    {metric.value}
                  </p>
                  <p className="text-sm text-slate-700">{metric.subtext}</p>
                </div>
              );
            })}
          </div>

          {/* KPI Progress Bars */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-7">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></div>
              {t("Key Performance Indicators")}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {progressBars.map((bar, idx) => {
                const Icon = bar.icon;
                return (
                  <div key={idx} className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className={`${bar.bgColor} p-2 rounded-lg`}>
                          <Icon className={`w-4 h-4 ${bar.iconColor}`} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {bar.label}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">
                        {bar.value}%
                      </span>
                    </div>
                    <div className="relative bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${bar.color} h-full rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${Math.min(bar.value, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detail Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {detailSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200">
                    <div className="p-2.5 bg-slate-100 rounded-xl">
                      <Icon className={`w-5 h-5 ${section.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {section.title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                        <span className="text-sm font-bold text-slate-900 ml-4 text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
