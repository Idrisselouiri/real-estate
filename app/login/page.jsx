"use client";

import React, { useState } from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.email || !formData.password) {
      toast.error("Please fill out all fields.");
    }
    await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      callbackUrl: "/",
    });
    setLoading(true);
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link href={"/"} className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-emerald-500 rounded-lg text-white">
              Sahand's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        {/* right */}

        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label>Your email</label>
              <input
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                className="p-2 border-[3px] border-[lightgray] bg-slate-100 outline-none rounded"
              />
            </div>
            <div className="flex flex-col">
              <label>Your password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
                className="p-2 border-[3px] border-[lightgray] bg-slate-100 outline-none rounded"
              />
            </div>
            <button
              className="bg-emerald-500 px-5 py-2 rounded-lg font-bold text-white w-full  shadow-emerald-300 shadow-lg"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full flex items-center justify-center py-2 bg-transparent border rounded-lg text-black shadow-slate-300 shadow-lg"
            >
              <AiFillGoogleCircle className="w-6 h-6 mr-2" />
              Continue with Google
            </button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>I Dont Have an account?</span>
            <Link href={"/signin"} className="text-blue-500">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
