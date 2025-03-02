import { getLoggedInUser } from "@/lib/appwrite";

import { SignInForm } from "./components/sign-in-form";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/");

  return (
    <div className="">
      <SignInForm />
    </div>
  );
}
