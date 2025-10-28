import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterContext } from "../../context/FilterContext";
import { getMgnregaData } from "../../api/mgnregaApi";
import FilterBar from "../FilterBar";
import { Loader2, AlertCircle, MapPin, TrendingUp, Users, Briefcase, Home } from "lucide-react";
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

      // ✅ Filter by financial year & month if selected
      if (finYearFilter) {
        records = records.filter((item) => item.fin_year === finYearFilter);
      }
      if (monthFilter) {
        records = records.filter((item) => item.month === monthFilter);
      }

      // ✅ Group by district_name (case-insensitive)
      const districtMap = new Map();

      for (const item of records) {
        const key = (item.district_name || "").trim().toUpperCase();
        if (!key) continue;

        if (!districtMap.has(key)) {
          districtMap.set(key, {
            ...item,
            district_name: item.district_name, // keep original name
            Total_Exp: Number(item.Total_Exp) || 0,
            Total_No_Of_Works_Takenup:
              Number(item.Total_No_Of_Works_Takenup || item.Total_No_of_Works_Takenup) || 0,
            Total_No_Of_Job_Cards_Issued:
              Number(item.Total_No_Of_Job_Cards_Issued || item.Total_No_of_JobCards_issued) || 0,
            Total_Households_Worked:
              Number(item.Total_Households_Worked || item.Total_No_of_Households_Worked) || 0,
          });
        } else {
          const existing = districtMap.get(key);
          existing.Total_Exp += Number(item.Total_Exp) || 0;
          existing.Total_No_Of_Works_Takenup +=
            Number(item.Total_No_Of_Works_Takenup || item.Total_No_of_Works_Takenup) || 0;
          existing.Total_No_Of_Job_Cards_Issued +=
            Number(item.Total_No_Of_Job_Cards_Issued || item.Total_No_of_JobCards_issued) || 0;
          existing.Total_Households_Worked +=
            Number(item.Total_Households_Worked || item.Total_No_of_Households_Worked) || 0;
        }
      }

      // ✅ Convert Map back to array
      const uniqueDistricts = Array.from(districtMap.values());
      setData(uniqueDistricts);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch MGNREGA data.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [
  stateFilter,
  districtFilter,
  finYearFilter,
  monthFilter,
  districtNameFilter,
]);


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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-12 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
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

        {/* Summary Stats Bar */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Districts</p>
                  <p className="text-2xl font-bold text-slate-900">{data.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Works</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatValue(data.reduce((sum, item) => sum + (Number(item.Total_No_Of_Works_Takenup || item.Total_No_of_Works_Takenup) || 0), 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Job Cards Issued</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatValue(data.reduce((sum, item) => sum + (Number(item.Total_No_Of_Job_Cards_Issued || item.Total_No_of_JobCards_issued) || 0), 0))}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-violet-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 font-medium">Total Expenditure</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatValue(data.reduce((sum, item) => sum + (Number(item.Total_Exp) || 0), 0), true)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="relative">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <div className="absolute inset-0 blur-xl bg-indigo-400 opacity-20 animate-pulse"></div>
            </div>
            <p className="text-lg font-semibold text-slate-700 mt-6">
              {t("loading")} Data...
            </p>
            <p className="text-sm text-slate-500 mt-2">Please wait while we fetch the latest information</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <p className="text-lg font-semibold text-red-900">{error}</p>
            <p className="text-sm text-red-600 mt-2">Please try again later or contact support</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-5 bg-slate-100 rounded-full">
                <MapPin className="w-10 h-10 text-slate-400" />
              </div>
            </div>
            <p className="text-xl font-semibold text-slate-900 mb-2">{t("noData")}</p>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              No data available for the selected filters. Try adjusting your filters or selecting a different district.
            </p>
          </div>
        ) : (
          <>
            {/* Dashboard Cards */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {visibleData.map((rec, idx) => (
                <div
                  key={idx}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                          <MapPin className="text-white w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-wide">
                            {rec.district_name || "N/A"}
                          </h3>
                          <p className="text-xs text-indigo-100 mt-0.5">
                            {rec.fin_year || "—"} • {rec.month || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-indigo-100 rounded-lg">
                            <Briefcase className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {t("totalWorks")}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-slate-900">
                          {formatValue(
                            rec.Total_No_Of_Works_Takenup ||
                              rec.Total_No_of_Works_Takenup
                          )}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {t("funds")}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-slate-900">
                          {formatValue(rec.Total_Exp, true)}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {t("jobCards")}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-slate-900">
                          {formatValue(
                            rec.Total_No_Of_Job_Cards_Issued ||
                              rec.Total_No_of_JobCards_issued
                          )}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 bg-violet-100 rounded-lg">
                            <Home className="w-4 h-4 text-violet-600" />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">
                            {t("households")}
                          </span>
                        </div>
                        <p className="text-xl font-bold text-slate-900">
                          {formatValue(
                            rec.Total_Households_Worked ||
                              rec.Total_No_of_Households_Worked
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedDistrict(rec)}
                      className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-blue-700 transition-all duration-200"
                    >
                      {t("ViewDetails")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-indigo-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`dots-${index}`}
                        className="px-4 py-2.5 text-slate-400 font-semibold"
                      >
                        •••
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm ${
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

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 hover:border-indigo-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                >
                  Next
                </button>
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