import { Link } from "react-router-dom";

function SalaryStatements() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-900">
      {/* ==================== HEADER ==================== */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-4 px-6 lg:px-10">
          <div className="flex items-center gap-3">
            <Link
              to="/employee/dashboard"
              aria-label="Back to employee dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M15 18 9 12l6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div>
              <p className="text-[15px] font-bold tracking-tight text-slate-900">
                Employee Portal
              </p>

              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Payroll & Statements
              </p>
            </div>
          </div>

          <Link
            to="/employee/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
            >
              <path
                d="m4 11 8-7 8 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <path
                d="M6.5 10.5v8h11v-8M9.5 18.5v-5h5v5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Dashboard
          </Link>
        </div>
      </header>

      {/* ==================== MAIN ==================== */}
      <main className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10 lg:py-10">
        {/* Page Heading */}
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              Payroll
            </span>

            <span className="text-xs text-slate-400">
              Salary statements
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Salary Statements
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            View and download your monthly payslips and salary statements.
          </p>
        </section>

        {/* Summary Cards */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {/* Latest Statement */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Latest statement
                </p>

                <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                  —
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Not available yet
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="M6 3.75h9l3 3v13.5H6V3.75Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M14 3.75v3h4M9 11h6M9 14.5h6M9 18h3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Statements */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Available statements
                </p>

                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  0
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Ready to view
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="M5.5 4.5h13v15h-13v-15Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M8.5 8h7M8.5 11.5h7M8.5 15h4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Downloads */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Downloads
                </p>

                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  0
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Documents downloaded
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="M12 4v10"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />

                  <path
                    d="m8 11 4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M5 19.5h14"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Main Statement Area */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <path
                    d="M6 3.75h9l3 3v13.5H6V3.75Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M14 3.75v3h4M9 11h6M9 14.5h6M9 18h3"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-600">
                  Payroll records
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Your salary statements
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Your monthly payslips will appear here once the payroll service
              has been connected.
            </p>
          </div>

          {/* Empty State */}
          <div className="px-6 py-16 text-center sm:px-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8"
              >
                <path
                  d="M6 3.75h9l3 3v13.5H6V3.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                <path
                  d="M14 3.75v3h4M9 11h6M9 14.5h6M9 18h3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="mt-6 text-base font-bold text-slate-800">
              No salary statements available
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-400">
              Once the payroll backend is connected and payslips are
              available, you will be able to view and download your salary
              statements from this page.
            </p>

            <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-slate-400"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="8.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M12 10.5v4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                <path
                  d="M12 7.5h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              Payroll service not connected
            </div>
          </div>
        </section>

        {/* Information Card */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
              What you will be able to do
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="m6.5 12.5 3.5 3.5 7.5-8"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    View monthly payslips
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Access your salary statement for each available payroll
                    period.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M12 4v10"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />

                    <path
                      d="m8 11 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M5 19.5h14"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Download statements
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Download available salary statements for your records.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0f2747] p-6 text-white shadow-lg shadow-slate-300/20">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
              >
                <path
                  d="M7 4.5h10M7 8.5h10M7 12.5h6M5 3.75h14v16.5H5V3.75Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3 className="mt-5 text-lg font-bold">
              Payroll information
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Your salary statements will become available here once the
              payroll functionality is implemented and connected to the
              employee portal.
            </p>

            <Link
              to="/employee/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0f2747] transition hover:bg-slate-100"
            >
              Return to dashboard

              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M5 12h13M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SalaryStatements;