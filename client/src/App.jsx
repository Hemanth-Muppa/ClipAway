import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import BuyCredit from "./pages/BuyCredit";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    
    <div className="min-h-screen flex flex-col bg-slate-50">
      <ToastContainer position="bottom-right" />

      {/* Navbar */}
      <Navbar />

      {/* Main content grow to fill space between navbar and footer */}
      <main className="flex-grow overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
          <Route path="/buy" element={<BuyCredit />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default App;