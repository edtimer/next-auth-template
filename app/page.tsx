import { getCurrentUser } from "@/lib/dal";

export default async function Home() {
  const user = await getCurrentUser();
  console.log("User on the home page: ", user);

  return (
    <>
      <h1 className="text-2xl">Hello World!</h1>
    </>
  );
}
