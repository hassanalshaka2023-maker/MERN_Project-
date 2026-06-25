import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("userId", data.user.id || data.user._id);
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "Professor") {
        navigate("/professor");
      } else if (data.user.role === "Student") {
        navigate("/student");
      } else if (data.user.role === "Manager") {
        navigate("/manager");
      } else {
        setMessage("Unknown role");
      }
    } catch (error) {
      console.log(error);
      setMessage("Cannot connect to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1f1b1b] via-[#2a1f3d] to-[#111827] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-4 w-20 h-20 rounded-3xl bg-gradient-to-br from-[#60a5fa] via-[#a855f7] to-[#ec4899] flex items-center justify-center shadow-lg"
          >
            <span className="text-white text-3xl font-bold">I</span>
          </motion.div>

          <h1 className="text-4xl font-extrabold text-white tracking-wide">
            IDEA
          </h1>

          <p className="text-lg text-purple-200 mt-1">Training Center</p>

          <p className="text-sm text-gray-300 mt-3">
            Integrated Institute Management System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-200 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/90 px-4 py-3 outline-none border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-2">Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/90 px-4 py-3 outline-none border border-transparent focus:border-purple-400 focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#ec4899] via-[#a855f7] to-[#60a5fa] hover:scale-[1.02] active:scale-[0.98] transition shadow-lg"
          >
            Login
          </button>

          {message && (
            <p className="text-center text-red-300 text-sm">{message}</p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
