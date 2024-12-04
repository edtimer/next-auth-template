import { getCurrentUser } from "@/lib/dal";

export default async function Home() {
  const user = await getCurrentUser();
  console.log("User on the home page: ", user);

  return (
    <>
      <h1 className="text-2xl text-center mt-10">Hello World!</h1>
    </>
  );
}
