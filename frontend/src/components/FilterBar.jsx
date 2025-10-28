import React, { useContext, useEffect, useState } from "react";
import { FilterContext } from "../context/FilterContext";
import { getStates, getDistrictsByState } from "../api/mgnregaApi";
import { Filter, MapPin, Calendar, Map, LocateFixed } from "lucide-react";

const FilterBar = () => {
  const {
    districtNameFilter,
    setDistrictNameFilter,
    finYearFilter,
    setFinYearFilter,
    monthFilter,
    setMonthFilter,
  } = useContext(FilterContext);

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [stateFilter, setStateFilter] = useState("TAMIL NADU");
  const [detecting, setDetecting] = useState(false);

  const finYears = ["2024-2025", "2023-2024", "2022-2023", "2021-2022", "2020-2021"];
  const months = [
    "Jan", "Feb", "March", "April", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  useEffect(() => {
    const loadStates = async () => {
      const data = await getStates();
      setStates(data);
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadDistricts = async () => {
      if (stateFilter) {
        const data = await getDistrictsByState(stateFilter);
        setDistricts(data.map((d) => d.toUpperCase()));
      }
    };
    loadDistricts();
  }, [stateFilter]);

  // 📍 Detect user location and auto-set district
  const detectLocation = async () => {
    setDetecting(true);
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`
          );
          const data = await res.json();
          const addr = data.address || {};
          const possibleDistrict =
            addr.state_district ||
            addr.district ||
            addr.city_district ||
            addr.county ||
            addr.region ||
            addr.city ||
            addr.town ||
            addr.village ||
            "";
          const cleanDistrict = possibleDistrict.toUpperCase().trim();

          let finalDistrict = districts.find(
            (d) => d.toUpperCase() === cleanDistrict
          );
          if (!finalDistrict) finalDistrict = findClosestDistrict(cleanDistrict, districts);

          if (finalDistrict) {
            setDistrictNameFilter(finalDistrict);
            alert(`✅ Detected District: ${finalDistrict}`);
          } else {
            alert(`⚠️ Could not find "${cleanDistrict}" in the records.`);
          }
          setDetecting(false);
        },
        (error) => {
          console.error("Location error:", error);
          alert("❌ Location access denied or unavailable.");
          setDetecting(false);
        }
      );
    } catch (error) {
      console.error("Location detection failed:", error);
      setDetecting(false);
    }
  };

  const findClosestDistrict = (input, districtList) => {
    if (!input || districtList.length === 0) return null;
    const norm = input.toUpperCase();
    const close = districtList.find(
      (d) => d.includes(norm) || norm.includes(d) || similarity(d, norm) > 0.7
    );
    return close || null;
  };

  const similarity = (a, b) => {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    return intersection.size / Math.max(setA.size, setB.size);
  };

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-md border border-blue-200 backdrop-blur-sm">
      <div className="flex flex-wrap gap-4 justify-center lg:justify-between items-center">
        {/* State Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <MapPin className="text-blue-600" size={20} />
          <select
            className="w-full sm:w-40 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white shadow-sm"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">Select State</option>
            {states.map((state, i) => (
              <option key={i} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* District Name Input */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Map className="text-blue-600" size={20} />
          <input
            type="text"
            placeholder="District name"
            className="w-full sm:w-44 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white shadow-sm"
            value={districtNameFilter}
            onChange={(e) => setDistrictNameFilter(e.target.value.toUpperCase())}
          />
        </div>

        {/* Financial Year */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="text-blue-600" size={20} />
          <select
            className="w-full sm:w-36 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white shadow-sm"
            value={finYearFilter}
            onChange={(e) => setFinYearFilter(e.target.value)}
          >
            {finYears.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="text-blue-600" size={20} />
          <select
            className="w-full sm:w-32 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white shadow-sm"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* My Location Button */}
        <button
          onClick={detectLocation}
          disabled={detecting}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition w-full sm:w-auto justify-center"
        >
          <LocateFixed size={18} />
          {detecting ? "Locating..." : "My Location"}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
