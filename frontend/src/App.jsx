import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path='/login' element={<Login />} /> */}
          <Route path='/signup' element={<Signup />} />

          {/* <Route 
          path="/statement" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }/>

          <Route 
          path="/transfer" element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }/>

          <Route 
          path="/statement" element={
            <ProtectedRoute>
              <Statement />
            </ProtectedRoute>
          }/> */}
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
