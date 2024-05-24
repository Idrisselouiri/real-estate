import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export const Banner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);
  return (
    <section className="h-full my-10 xl:mb-24 w-[90%] mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-10">
        <div className=" flex flex-col items-center lg:items-start text-center lg:text-left justify-center flex-1 px-4">
          <h1 className="text-4xl lg:text-[58px] font-semibold leading-none mb-6">
            <span className="text-slate-500">Rent</span> Your Dream House With
            Us.
          </h1>
          <p className="max-w-[480px] mb-5">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illum
            itaque veniam rem nemo ut deserunt doloremque veritatis hic
            voluptatem omnis.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-slate-100 py-2 px-3 rounded-lg flex items-center"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-60 md:w-70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="py-2 px-4 text-md rounded bg-slate-500 text-white">
              search
            </button>
          </form>
          <Link
            href={"/search"}
            className="text-xs sm:text-sm text-blue-800 font-bold hover:underline mt-5"
          >
            Let's get started...
          </Link>
        </div>
        {/*image*/}
        <div className="hidden flex-1 lg:flex justify-end items-end h-[500px]">
          <img
            className="rounded-3xl object-cover h-full"
            src="https://firebasestorage.googleapis.com/v0/b/next-real-estate-c2ab0.appspot.com/o/1716129608167pexels-binyaminmellish-1396122.jpg?alt=media&token=88fd49a0-556a-419d-bdce-e5b6fd2d66ec"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};
