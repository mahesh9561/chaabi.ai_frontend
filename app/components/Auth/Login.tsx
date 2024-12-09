import axios from "axios";
import React, { useState, FormEvent } from "react";
import { useNavigate } from '@remix-run/react';
import { jwtDecode } from "jwt-decode"; // Correct import

function Login() {
  const [email, setEmail] = useState<string>(""); // Type for email state
  const [pass, setPass] = useState<string>(""); // Type for password state
  const [error, setError] = useState<string | null>(null); // Error state for user feedback
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error before submission

    if (!email || !pass) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await axios.post(
        "https://chabbi-ai-backend.onrender.com/api/blog/login",
        { email, pass },
        { withCredentials: true }
      );

      if (response.data.token) {
        // Decode the JWT to get the role

        const decodedToken: any = jwtDecode(response.data.token); // Decode token
        const role = decodedToken.role; // Extract role from decoded token
        console.log(role);
        // Store token and role
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", role); // Store the role

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin"); // Redirect to admin panel
        } else {
          navigate("/user"); // Redirect to user dashboard
        }
      } else {
        setError("Invalid login credentials.");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <div>
      <nav className="w-full bg-slate-100 shadow-lg">
      <div className="px-10 py-3 lg:text-lg md:text-sm sm:text-xs flex justify-between flex-wrap">
        <div>Welcome to Quiz Portal</div>
        <div className="flex justify-between gap-10">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-blue-500 hover:text-blue-700"
          >
            Register
          </button>
        </div>
      </div>
    </nav>
      <div className="flex justify-center bg-white ext-slate-700 mt-10">
        <div className="p-5 border lg:w-1/2 md:w-1/2 sm:w-full items-center shadow-md rounded-lg bg-white">
          <div className="text-center text-2xl font-semibold uppercase py-3">
            Login Form
          </div>
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="font-semibold">
            <div className="py-2">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                className="w-full px-3 py-2 border outline-none rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="py-2">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                className="w-full px-3 py-2 border outline-none rounded-md"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
            </div>
            <div className="py-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-400 rounded-lg text-white"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
