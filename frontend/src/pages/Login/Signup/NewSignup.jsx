import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../../../Utils/helper";
import axiosInstance from "../../../Utils/axiosInstance";

const NewSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and Last name are required.");
      return;
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    } else if (!password) {
      setError("Please enter a password.");
      return;
    } else {
      setError("");
    }

    try {
      const response = await axiosInstance.post("/user/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      const token = response?.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        navigate("/userprofileform");
      } else {
        setError("Signup successful, but no token received.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      setError("Signup failed. Please try again.");
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

        <h1 className="text-center text-3xl font-extrabold text-white font-[Karantina] mt-6 mb-4">
          CREATE YOUR ACCOUNT
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            className="w-full h-12 bg-white/20 text-white placeholder-white px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            className="w-full h-12 bg-white/20 text-white placeholder-white px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-12 bg-white/20 text-white placeholder-white px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
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
            className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-full hover:scale-[1.03] transition-all duration-200 shadow-lg mt-2"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-center text-sm text-white mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 underline hover:text-blue-300 transition"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default NewSignup;
