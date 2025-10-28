// src/App.jsx
import React from "react";
import { FilterProvider } from "./context/FilterContext";
import Header from "./components/Header";
import Dashboard from "./components/pages/Dashboard";
import Footer from "./components/Footer";


const App = () => {
  return (
    <FilterProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow p-4 bg-gray-50">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </FilterProvider>
  );
};

export default App;
