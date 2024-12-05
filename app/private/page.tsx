// import { redirect } from "next/navigation";
// import { getCurrentUser } from "@/lib/dal";

export default async function ProtectedPage() {
  // const user = await getCurrentUser();

  // if (!user) {
  //   const searchParams = new URLSearchParams();
  //   searchParams.append("from", "private");

  //   const redirectUrl = `/signin?${searchParams.toString()}`;

  //   redirect(redirectUrl);
  // }

  return (
    <p className="text-center text-gray-700 mt-10">
      This page is only accessible to authenticated users.
    </p>
  );
}
