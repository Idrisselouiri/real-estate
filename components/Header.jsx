"use client";

import Link from "next/link";
import { User } from "./User";
import { useSession } from "next-auth/react";

export default function Header() {
  const session = useSession();
  const { status } = session;
  const { data: userData } = User();
  console.log(userData);
  return (
    <header className="py-6  border-b">
      <div className="w-[90%] mx-auto flex justify-between items-center">
        <Link href="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        {status === "authenticated" && (
          <Link href="/profile">
            <img
              className="rounded-full h-10 w-10 object-cover"
              src={userData.image}
              alt="profile"
            />
          </Link>
        )}
        {status === "unauthenticated" && (
          <div className="flex items-center gap-6">
            <Link className="hover:text-slate-700 transition" href={"/login"}>
              Log In
            </Link>
            <Link
              className="bg-slate-500 hover:bg-slate-700 text-white px-4 py-3 rounded-lg transition"
              href={"/signin"}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
