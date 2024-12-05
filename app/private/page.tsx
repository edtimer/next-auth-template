export default async function ProtectedPage() {
  return (
    <p className="text-center text-gray-700 mt-10">
      This page is only accessible to authenticated users.
    </p>
  );
}
