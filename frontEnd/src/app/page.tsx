import { Metadata } from "next";
import { webAppPaths } from "@/paths";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "CRUD Home",
  description: "Home page",
};
export default function Page() {
  redirect(webAppPaths.user)
}
