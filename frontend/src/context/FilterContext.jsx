import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [stateFilter, setStateFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [districtNameFilter, setDistrictNameFilter] = useState("");
  const [finYearFilter, setFinYearFilter] = useState("2024-2025");
  const [monthFilter, setMonthFilter] = useState("");

  return (
    <FilterContext.Provider
      value={{
        stateFilter,
        setStateFilter,
        districtFilter,
        setDistrictFilter,
        districtNameFilter,
        setDistrictNameFilter,
        finYearFilter,
        setFinYearFilter,
        monthFilter,
        setMonthFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
