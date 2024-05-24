"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function User() {
  const session = useSession();
  const { status } = session;
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      const fetchUserData = async () => {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok) {
          setData(data);
          console.log(data);
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [session, status]);
  return { loading, data };
}
