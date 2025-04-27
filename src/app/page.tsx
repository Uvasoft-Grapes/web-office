"use client"

import { useContext } from "react";
import { userContext } from "@context/UserContext";
import { useRouter } from "next/navigation";
import Loader from "@components/Loader";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useContext(userContext);

  if(loading) return <Loader/>;

  if(!user) return router.push("/auth/login");

  return router.push("/dashboard");
}
