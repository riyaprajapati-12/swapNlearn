import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../../Utils/helper";
import axiosInstance from "../../../Utils/axiosInstance";

const NewLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    } else if (!password) {
      setError("Please enter your password.");
      return;
    } else {
      setError("");
    }

    try {
      const response = await axiosInstance.post("/user/signin", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token);

      setEmail("");
      setPassword("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] font-[Inter]">
      <div className="relative w-[90%] max-w-[400px] bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-orange-500">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-5 text-white text-3xl hover:text-orange-300 transition"
          aria-label="Close"
        >
          &times;
        </button>

        <h1 className="text-center text-3xl font-extrabold text-white font-[Karantina] mt-10 mb-6">
          LOGIN YOUR ACCOUNT
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full h-12 bg-white/20 text-white placeholder-white px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full h-12 bg-white/20 text-white placeholder-white px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-xl cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm font-medium animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-full hover:scale-[1.03] transition-all duration-200 shadow-lg"
          >
            LOGIN
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          New here?{" "}
          <a
            href="/signup"
            className="text-blue-400 underline hover:text-blue-300 transition"
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
};

export default NewLogin;
