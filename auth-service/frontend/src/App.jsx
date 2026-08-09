import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Login from "./pages/Login";
import LoginOtp from "./pages/LoginOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LoginPassword from "./pages/LoginPassword";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/login-otp" element={<LoginOtp />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/otp" element={<Otp />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        <Route path="/login-password" element={<LoginPassword />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
