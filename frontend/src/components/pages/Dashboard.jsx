import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterContext } from "../../context/FilterContext";
import { getMgnregaData } from "../../api/mgnregaApi";
import FilterBar from "../FilterBar";

import banner from "../../assets/banner3.jpg";
import banner2 from "../../assets/banner2.png";
import {
  Loader2,
  AlertCircle,
  MapPin,
  TrendingUp,
  Users,
  Briefcase,
  Home,
} from "lucide-react";
import DetailModal from "../DetailModel";

const Dashboard = () => {
  const { t } = useTranslation();
  const {
    stateFilter,
    districtFilter,
    finYearFilter,
    monthFilter,
    districtNameFilter,
  } = useContext(FilterContext);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        setCurrentPage(1);

        const result = await getMgnregaData(
          stateFilter,
          districtFilter,
          finYearFilter,
          monthFilter,
          districtNameFilter
        );

        let records = result.data || [];

        // ✅ Default to most recent financial year if none selected
        if (!finYearFilter && records.length > 0) {
          const allYears = records
            .map((r) => r.fin_year)
            .filter(Boolean)
            .sort()
            .reverse();
          records = records.filter((r) => r.fin_year === allYears[0]);
        }

        // ✅ Apply manual filters if user selects
        if (finYearFilter)
          records = records.filter((r) => r.fin_year === finYearFilter);
        if (monthFilter)
          records = records.filter((r) => r.month === monthFilter);

        // ✅ Group by district_name
        const districtMap = new Map();
        for (const item of records) {
          const key = (item.district_name || "").trim().toUpperCase();
          if (!key) continue;

          if (!districtMap.has(key)) {
            districtMap.set(key, {
              ...item,
              Total_Exp: Number(item.Total_Exp) || 0,
              Total_No_Of_Works_Takenup:
                Number(item.Total_No_Of_Works_Takenup ||
                  item.Total_No_of_Works_Takenup) || 0,
              Total_No_Of_Job_Cards_Issued:
                Number(item.Total_No_Of_Job_Cards_Issued ||
                  item.Total_No_of_JobCards_issued) || 0,
              Total_Households_Worked:
                Number(item.Total_Households_Worked ||
                  item.Total_No_of_Households_Worked) || 0,
            });
          } else {
            const existing = districtMap.get(key);
            existing.Total_Exp += Number(item.Total_Exp) || 0;
            existing.Total_No_Of_Works_Takenup +=
              Number(item.Total_No_Of_Works_Takenup ||
                item.Total_No_of_Works_Takenup) || 0;
            existing.Total_No_Of_Job_Cards_Issued +=
              Number(item.Total_No_Of_Job_Cards_Issued ||
                item.Total_No_of_JobCards_issued) || 0;
            existing.Total_Households_Worked +=
              Number(item.Total_Households_Worked ||
                item.Total_No_of_Households_Worked) || 0;
          }
        }

        setData(Array.from(districtMap.values()));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch MGNREGA data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stateFilter, districtFilter, finYearFilter, monthFilter, districtNameFilter]);

  const formatValue = (value, isCurrency = false) => {
    if (value === null || value === undefined || value === "") return "—";
    const num = Number(value);
    if (isNaN(num)) return value;

    if (isCurrency) {
      let formattedValue, suffix;
      if (num >= 1e7) {
        formattedValue = (num / 1e7).toFixed(2);
        suffix = "Cr";
      } else if (num >= 1e5) {
        formattedValue = (num / 1e5).toFixed(2);
        suffix = "L";
      } else if (num >= 1e3) {
        formattedValue = (num / 1e3).toFixed(2);
        suffix = "K";
      } else {
        formattedValue = num.toFixed(2);
        suffix = "";
      }
      return `₹${formattedValue} ${suffix}`.trim();
    }
    return num.toLocaleString("en-IN");
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const visibleData = data.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);
    return range;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ✅ Image Slideshow */}
<div className="relative overflow-hidden rounded-2xl shadow-md mb-5 bg-white">
  <div className="flex w-[300%] animate-slide">
    <div className="w-1/3 h-64 sm:h-80 flex items-center justify-center bg-white p-2 sm:p-4">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Ministry_of_Rural_Development.png/1100px-Ministry_of_Rural_Development.png"
        alt="Ministry of Rural Development"
        className="w-[95%] h-auto object-contain"
      />
    </div>

    <div className="w-1/3 h-64 sm:h-40 flex items-center justify-center bg-white p-2 sm:p-4">
      <img
        src={banner}
        alt="MGNREGA Banner"
        className="w-[95%] h-auto object-contain"
      />
    </div>

    <div className="w-1/3 h-64 sm:h-80 flex items-center justify-center bg-white p-2 sm:p-4">
      <img
        src={banner2}
        alt="NREGA Works"
        className="w-[95%] h-auto object-contain"
      />
    </div>
  </div>
</div>


        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-12 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                MGNREGA Dashboard
              </h1>
              <p className="text-slate-600 mt-1.5 text-sm font-medium">
                Employment & Fund Utilization Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar />
        </div>

        {/* Summary Cards */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-indigo-600" />,
                title: "Total Districts",
                value: data.length,
                color: "bg-indigo-50",
              },
              {
                icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
                title: "Total Works",
                value: formatValue(
                  data.reduce(
                    (sum, i) =>
                      sum +
                      (Number(i.Total_No_Of_Works_Takenup || i.Total_No_of_Works_Takenup) ||
                        0),
                    0
                  )
                ),
                color: "bg-emerald-50",
              },
              {
                icon: <Users className="w-6 h-6 text-blue-600" />,
                title: "Job Cards Issued",
                value: formatValue(
                  data.reduce(
                    (sum, i) =>
                      sum +
                      (Number(i.Total_No_Of_Job_Cards_Issued || i.Total_No_of_JobCards_issued) ||
                        0),
                    0
                  )
                ),
                color: "bg-blue-50",
              },
              {
                icon: <TrendingUp className="w-6 h-6 text-violet-600" />,
                title: "Total Expenditure",
                value: formatValue(
                  data.reduce((sum, i) => sum + (Number(i.Total_Exp) || 0), 0),
                  true
                ),
                color: "bg-violet-50",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${stat.color}`}>{stat.icon}</div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Data Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-lg font-semibold text-slate-700 mt-6">
              {t("loading")} Data...
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Please wait while we fetch the latest information
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
            <p className="text-lg font-semibold text-red-900">{error}</p>
            <p className="text-sm text-red-600 mt-2">
              Please try again later or contact support.
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
            <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-xl font-semibold text-slate-900 mb-2">{t("noData")}</p>
            <p className="text-sm text-slate-600">
              No data available for the selected filters.
            </p>
          </div>
        ) : (
          <>
            {/* Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {visibleData.map((rec, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border  border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5">
                    <h3 className="text-lg font-bold text-white">
                      {rec.district_name || "N/A"}
                    </h3>
                    <p className="text-xs text-indigo-100">
                      {rec.fin_year || "—"} • {rec.month || "—"}
                    </p>
                  </div>

                  <div className="p-6 grid grid-cols-2 gap-4">
                    {[
                      {
                        label: t("totalWorks"),
                        icon: <Briefcase className="w-4 h-4 text-indigo-600" />,
                        value:
                          rec.Total_No_Of_Works_Takenup ||
                          rec.Total_No_of_Works_Takenup,
                      },
                      {
                        label: t("funds"),
                        icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
                        value: formatValue(rec.Total_Exp, true),
                      },
                      {
                        label: t("jobCards"),
                        icon: <Users className="w-4 h-4 text-blue-600" />,
                        value:
                          rec.Total_No_Of_Job_Cards_Issued ||
                          rec.Total_No_of_JobCards_issued,
                      },
                      {
                        label: t("households"),
                        icon: <Home className="w-4 h-4 text-violet-600" />,
                        value:
                          rec.Total_Households_Worked ||
                          rec.Total_No_of_Households_Worked,
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="bg-slate-200 rounded-xl p-4 border border-slate-200"
                      >
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-600">
                          {stat.icon}
                          {stat.label}
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          {formatValue(stat.value)}
                        </p>
                      </div>
                    ))}
                  </div>

                 <div className="px-6 pb-5">
        <button
          onClick={() => setSelectedDistrict(rec)}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow hover:from-orange-600 hover:to-amber-700 transition-all"
        >
          {t("ViewDetails")}
        </button>
      </div>
                </div>
              ))}
            </div>

            {/* ✅ Scrollable Pagination (Mobile Friendly) */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center mt-10 gap-3">
                <div className="flex items-center gap-2 flex-wrap justify-center w-full sm:w-auto">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium 
                               hover:bg-slate-50 hover:border-indigo-300 transition-all disabled:opacity-40 
                               disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                  >
                    Previous
                  </button>

                  {/* Scrollable Page Numbers */}
                  <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent px-1 max-w-full sm:max-w-[400px] md:max-w-[600px]">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`dots-${index}`}
                          className="px-3 py-2.5 text-slate-400 font-semibold select-none flex-shrink-0"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 shadow-sm transition-all duration-200 ${
                            currentPage === page
                              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                              : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-indigo-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium 
                               hover:bg-slate-50 hover:border-indigo-300 transition-all disabled:opacity-40 
                               disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {selectedDistrict && (
          <DetailModal
            district={selectedDistrict}
            onClose={() => setSelectedDistrict(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
