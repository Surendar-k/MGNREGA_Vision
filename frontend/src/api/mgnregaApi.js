// src/api/mgnregaApi.js
const BASE_URL = "http://localhost:5000/api/mgnrega"; // Update with your server URL

// Fetch MGNREGA data with filters
export const getMgnregaData = async (
  state = "TAMIL NADU",
  districtCode = "",
  finYear = "",
  month = "",
  districtName = ""
) => {
  try {
    const params = new URLSearchParams();
    params.append("filters[state_name]", state);
    if (districtCode) params.append("district_code", districtCode);
    if (districtName) params.append("district_name", districtName);
    if (finYear) params.append("filters[fin_year]", finYear);
    if (month) params.append("month", month);

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch MGNREGA data");
    return await response.json();
  } catch (err) {
    console.error(err);
    return { totalRecords: 0, data: [] };
  }
};

// Fetch all states (if needed, currently only Tamil Nadu)
export const getStates = async () => {
  try {
    const response = await fetch(`${BASE_URL}/states`);
    if (!response.ok) throw new Error("Failed to fetch states");
    return await response.json();
  } catch (err) {
    console.error(err);
    return ["TAMIL NADU"];
  }
};
// Fetch districts for a specific state
export const getDistrictsByState = async (stateName = "TAMIL NADU") => {
  try {
    const response = await fetch(
      `${BASE_URL}/districts?state=${encodeURIComponent(stateName)}`
    );
    if (!response.ok) throw new Error("Failed to fetch districts");
    return await response.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};
