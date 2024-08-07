import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import SignIn from "./components/signIn";
import { StrictMode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/signUp";

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<App />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );


