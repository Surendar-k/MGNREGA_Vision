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

  // Financial years and months
  const finYears = ["2024-2025", "2023-2024", "2022-2023", "2021-2022", "2020-2021"];
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Load states once
  useEffect(() => {
    const loadStates = async () => {
      const data = await getStates();
      setStates(data);
    };
    loadStates();
  }, []);

  // Load districts for current state
  useEffect(() => {
    const loadDistricts = async () => {
      if (stateFilter) {
        const data = await getDistrictsByState(stateFilter);
        setDistricts(data.map((d) => d.toUpperCase()));
      }
    };
    loadDistricts();
  }, [stateFilter]);

  // --- Detect user district from location ---
const detectLocation = async () => {
  setDetecting(true);
  try {
    // Get user coordinates
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Fetch detailed location info from OpenStreetMap Nominatim
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&addressdetails=1`
        );
        const data = await res.json();

        const addr = data.address || {};

        // Try to find the best district-like field dynamically
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

        if (!possibleDistrict) {
          alert("⚠️ Could not detect your district automatically.");
          setDetecting(false);
          return;
        }

        // Clean and standardize the name
        const cleanDistrict = possibleDistrict
          .toUpperCase()
          .replace(/DISTRICT|TALUK|BLOCK|DIVISION|ZONE|CITY|URBAN|RURAL/g, "")
          .trim();

        // Check if the cleaned name directly exists in the list
        let finalDistrict = districts.find(
          (d) => d.toUpperCase() === cleanDistrict
        );

        // Fallback: fuzzy match if no exact match found
        if (!finalDistrict) {
          finalDistrict = findClosestDistrict(cleanDistrict, districts);
        }

   if (finalDistrict) {
  setDistrictNameFilter(finalDistrict);
  alert(
    `✅ Location Detected Successfully\n\nDetected District: ${finalDistrict}\n\nYour data will now be filtered accordingly.`
  );
} else {
  alert(
    `⚠️ District Name Mismatch Detected\n\nWe couldn't find an exact match for "${cleanDistrict}" in the records.\n\nPlease verify the spelling — it may slightly differ from the stored name (for example, "Thiruvallur" vs "Tiruvallur").`
  );
  setDistrictNameFilter(cleanDistrict);
}



        setDetecting(false);
      },
      (error) => {
        console.error("Location access error:", error);
        alert("❌ Location access denied or unavailable.");
        setDetecting(false);
      }
    );
  } catch (error) {
    console.error("Location detection failed:", error);
    setDetecting(false);
  }
};


  // --- Fuzzy match: find closest district name ---
  const findClosestDistrict = (input, districtList) => {
    if (!input || districtList.length === 0) return null;
    const norm = input.toUpperCase();

    // 1. Exact match
    if (districtList.includes(norm)) return norm;

    // 2. Partial / similarity match
    const close = districtList.find(
      (d) => d.includes(norm) || norm.includes(d) || similarity(d, norm) > 0.7
    );
    return close || null;
  };

  // --- String similarity function (simple Jaccard index) ---
  const similarity = (a, b) => {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter((x) => setB.has(x)));
    return intersection.size / Math.max(setA.size, setB.size);
  };

  return (
    <div className="flex flex-wrap justify-center items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow-lg border border-blue-200 backdrop-blur-sm">
      {/* State dropdown */}
      <div className="flex items-center gap-2">
        <MapPin className="text-blue-600" size={20} />
        <select
          className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white shadow-sm"
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

      {/* District code */}

      {/* Districtname */}
      <div className="flex items-center gap-2">
        <Map className="text-blue-600" size={20} />
        <input
          type="text"
          placeholder="District name"
          className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none w-44 text-sm shadow-sm"
          value={districtNameFilter}
          onChange={(e) => setDistrictNameFilter(e.target.value.toUpperCase())}
        />
      </div>

      {/* Financial year */}
      <div className="flex items-center gap-2">
        <Calendar className="text-blue-600" size={20} />
        <select
          className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white shadow-sm"
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
      <div className="flex items-center gap-2">
        <Calendar className="text-blue-600" size={20} />
        <select
          className="p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white shadow-sm"
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

      {/* My Location Button - shifted to the right */}
      <div className="ml-auto">
        <button
          onClick={detectLocation}
          disabled={detecting}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <LocateFixed size={18} />
          {detecting ? "Locating..." : "My Location"}
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
