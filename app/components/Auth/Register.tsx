  import React, { useState } from "react";
  import axios from "axios";
  import { redirect, useNavigate } from '@remix-run/react';

  const Register: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [pass, setPass] = useState<string>("");
    const [mobile, setMobile] = useState<string>("");
    const navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await axios.post(
          "https://chabbi-ai-backend.onrender.com/api/blog/register",
          {
            name,
            email,
            mobile,
            pass,
          },
          {
            withCredentials: true,
          }
        );
        alert("Register Successful");
        return redirect("/login");
      } catch (e) {
        console.error("Error:", e);
      }
      setName("");
      setEmail("");
      setPass("");
      setMobile("");
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
              Register Form
            </div>
            <form onSubmit={handleSubmit} className="font-semibold">
              <div className="py-2">
                <label className="text-sm md:text-base">Username:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border outline-none rounded-md bg-white text-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="py-2">
                <label className="text-sm md:text-base">Email:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border outline-none rounded-md bg-white text-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="py-2">
                <label className="text-sm md:text-base">Mobile:</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border outline-none rounded-md bg-white text-black"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="py-2">
                <label className="text-sm md:text-base">Password:</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border outline-none rounded-md bg-white text-black"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>
              <div className="py-2">
                <button className="px-4 py-2 bg-blue-400 rounded-lg text-white">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default Register;
