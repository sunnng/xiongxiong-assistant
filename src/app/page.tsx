import { getLoggedInUser } from "@/lib/appwrite";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getLoggedInUser();
  if (!user) redirect("/sign-in");

  return <div className="">HOME</div>;
}
