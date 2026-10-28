import { Link } from "react-router-dom";

function Documents() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/employee/dashboard"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to Dashboard
        </Link>

        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            My Documents
          </h1>
          <p className="mt-2 text-gray-600">
            Access employment documents made available to you.
          </p>
        </div>

        <section className="mt-6 rounded-xl border bg-white p-8 shadow-sm">
          <div className="mx-auto max-w-lg py-8 text-center">
            <div className="text-5xl" aria-hidden="true">
              📄
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Your documents
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600">
              Documents will appear here when document storage and retrieval
              are connected to the backend.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Documents;