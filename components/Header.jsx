"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { User } from "./User";

export default function Header() {
  const { data: session } = useSession();
  const { data: userData } = User();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await signOut();
    router.push("/");
  }

  const searchParams = useSearchParams();
  useEffect(() => {
    const urlParams = new URLSearchParams(useSearchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [useSearchParams]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };
  const active = "text-black";
  const inActive = "hidden sm:inline text-slate-700 hover:underline";
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link href="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex items-center gap-4">
          <Link
            href="/"
            className={` transition hover:underline ${
              pathname === "/" ? "text-slate-700" : ""
            } `}
          >
            <li>Home</li>
          </Link>
          <Link
            className={` transition hover:underline ${
              pathname === "/about" ? "text-slate-700" : ""
            } `}
            href="/about"
          >
            <li>About</li>
          </Link>
          {session ? (
            <Link href="/profile">
              <img
                className="rounded-full h-10 w-10 object-cover"
                src={userData.image}
                alt="profile"
              />
            </Link>
          ) : (
            <Link href="signin" className=" text-slate-700 hover:underline">
              Sign in
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
