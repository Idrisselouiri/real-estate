"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return setErrorMessage("Please fill out all fields.");
    }
    setLoading(true);
    const savingPromise = new Promise(async (resolve, reject) => {
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/",
      });
      await toast.promise(savingPromise, {
        loading: "Saving...",
        success: "Login Successfully!",
        error: "Error",
      });
      resolve();
      setLoading(false);
    });
  };
  return (
    <div className="w-full h-screen flex items-start ">
      <div className="relative w-1/2 h-full flex flex-col hidden lg:block">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/next-real-estate-c2ab0.appspot.com/o/1716129425931pexels-sebastians-731082.jpg?alt=media&token=eb9cec7e-0130-4b53-8551-7707dc8b322e"
          className="w-full h-full object-cover "
          alt=""
        />
      </div>
      <div className="lg:w-1/2 w-[90%] sm:w-[70%] mx-auto lg:mx-0 h-full bg-[#f5f5f5] flex flex-col p-10 lg:p-20 justify-between lg:items-start items-center border">
        <h1 className="text-base text-[#060606] font-semibold">
          Interactive Brand
        </h1>
        <div className="w-full flex flex-col max-w-[500px]">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-3xl font-semibold mb-2">Login</h3>
            <p className="text-base mb-2">
              Welcome Back! Please enter your details
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col">
              <input
                type="email"
                className="w-full my-2 text-black border-b border-black outline-none focus:outline-none py-2 bg-transparent"
                onChange={handleChange}
                placeholder="name@company.com"
                id="email"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full my-2 text-black border-b border-black outline-none focus:outline-none py-2 bg-transparent"
                onChange={handleChange}
                id="password"
              />
            </div>
            <div className="w-full flex justify-between items-center">
              <div className="w-full flex">
                <input type="checkbox" className="w-4 h-4 mr-2" />
                <p className="text-sm">Remember Me</p>
              </div>
              <p className="text-sm cursor-pointer underline underline-offset-2 font-medium whitespace-nowrap">
                Forgot Password
              </p>
            </div>
            <div className="flex w-full flex-col my-4">
              <button
                type="submit"
                className="w-full bg-[#060606] rounded-md text-center flex items-center justify-center p-4 text-white my-2"
              >
                {loading ? (
                  <>
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </div>
          </form>
          <div className="w-full flex items-center justify-center relative py-2">
            <div className="w-full h-[1px] bg-black/40"></div>
            <p className="absolute text-black/80 bg-[#f5f5f5] text-lg">Or</p>
          </div>
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            type="button"
            className="w-full bg-white rounded-md text-center flex items-center justify-center p-4 text-black my-2"
          >
            <FaGoogle />
            Sign In With Google
          </button>
        </div>
        {errorMessage && <p className="text-red-500 mt-5">{errorMessage}</p>}
        <div className="w-full flex items-center justify-center">
          <Link href={"/signin"} className="text-sm font-normal text-[#060606]">
            Dont have a account?{" "}
            <span className="font-semibold underline underline-offset-2">
              Sign In free
            </span>{" "}
          </Link>
        </div>
      </div>
    </div>
  );
}
