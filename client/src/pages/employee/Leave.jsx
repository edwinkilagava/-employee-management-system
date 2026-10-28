import { useState } from "react";
import { Link } from "react-router-dom";

function Leave() {
  const [form, setForm] = useState({
    leaveType: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.leaveType ||
      !form.startDate ||
      !form.endDate ||
      !form.reason.trim()
    ) {
      setMessage("Please complete all required fields.");
      return;
    }

    if (form.endDate < form.startDate) {
      setMessage("The end date cannot be before the start date.");
      return;
    }

    setMessage(
      "Your request is valid, but leave submission is not connected to the backend yet."
    );
  }

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
                Leave Management
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
        {/* ==================== PAGE INTRO ==================== */}
        <section>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700">
              Time off
            </span>

            <span className="text-xs text-slate-400">
              Employee self-service
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Leave Management
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Request time away from work, review your leave information, and
            keep track of your previous requests.
          </p>
        </section>

        {/* ==================== OVERVIEW ==================== */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {/* Annual Leave */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Annual leave
                </p>

                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  —
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Days remaining
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <rect
                    x="4"
                    y="5.5"
                    width="16"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M8 3.75v3.5M16 3.75v3.5M4 10h16"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Pending requests
                </p>

                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  —
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Awaiting approval
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.25"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />

                  <path
                    d="M12 7.5v4.75l3 1.75"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Leave Taken */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Leave taken
                </p>

                <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  —
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Days used this year
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
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
            </div>
          </div>
        </section>

        {/* ==================== WORKSPACE ==================== */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ==================== FORM ==================== */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <path
                      d="M6 4.5h12v15H6v-15Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M9 8h6M9 11.5h6M9 15h3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">
                    New request
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Request time off
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Provide the details below to prepare your leave request.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="px-6 py-7 sm:px-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Leave Type */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="leaveType"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Leave type
                  </label>

                  <div className="relative">
                    <select
                      id="leaveType"
                      name="leaveType"
                      value={form.leaveType}
                      onChange={handleChange}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option>Annual Leave</option>
                      <option>Sick Leave</option>
                      <option>Emergency Leave</option>
                      <option>Unpaid Leave</option>
                      <option>Maternity Leave</option>
                      <option>Paternity Leave</option>
                    </select>

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    >
                      <path
                        d="m7 9 5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Start Date */}
                <div>
                  <label
                    htmlFor="startDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Start date
                  </label>

                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    End date
                  </label>

                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={form.startDate || undefined}
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                {/* Reason */}
                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="reason"
                      className="block text-sm font-semibold text-slate-700"
                    >
                      Reason
                    </label>

                    <span className="text-xs font-medium text-slate-400">
                      {form.reason.length}/1000
                    </span>
                  </div>

                  <textarea
                    id="reason"
                    name="reason"
                    rows={6}
                    value={form.reason}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                    placeholder="Provide a brief explanation for your leave request..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <div
                  role="status"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3.5 text-sm leading-6 text-blue-800"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="mt-0.5 h-5 w-5 shrink-0"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="8.25"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />

                    <path
                      d="M12 10.5v4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />

                    <path
                      d="M12 7.75h.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <span>{message}</span>
                </div>
              )}

              {/* Actions */}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  to="/employee/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f2747] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#17375f] focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                >
                  Validate request

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
                </button>
              </div>
            </form>
          </div>

          {/* ==================== SIDEBAR ==================== */}
          <aside className="space-y-6">
            {/* Guidelines */}
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
                Before you submit
              </h3>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />

                  <p className="text-sm leading-6 text-slate-300">
                    Make sure your requested dates are correct.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />

                  <p className="text-sm leading-6 text-slate-300">
                    Provide enough information to support your request.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300" />

                  <p className="text-sm leading-6 text-slate-300">
                    Your request may require HR or manager approval.
                  </p>
                </div>
              </div>
            </div>

            {/* Request Process */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Request process
              </p>

              <div className="mt-6">
                {/* Step 1 */}
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                    1
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Submit request
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Complete and submit your leave details.
                    </p>
                  </div>
                </div>

                <div className="ml-4 h-6 border-l border-dashed border-slate-200" />

                {/* Step 2 */}
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    2
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Review
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Your manager or HR reviews the request.
                    </p>
                  </div>
                </div>

                <div className="ml-4 h-6 border-l border-dashed border-slate-200" />

                {/* Step 3 */}
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    3
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Decision
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Track the final status from your leave history.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* ==================== HISTORY ==================== */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Records
              </p>

              <h2 className="mt-1.5 text-xl font-bold text-slate-900">
                Leave history
              </h2>
            </div>

            <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
              No requests yet
            </span>
          </div>

          <div className="px-6 py-14 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
              >
                <path
                  d="M6 4.5h12v15H6v-15Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                <path
                  d="M9 8h6M9 11.5h6M9 15h3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h3 className="mt-5 text-sm font-bold text-slate-800">
              Your leave requests will appear here
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Once the leave service is connected to the backend, submitted
              requests and their approval statuses will be displayed in this
              section.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Leave;