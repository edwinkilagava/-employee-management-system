import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { acceptInvitation } from "../../services/invitation.service.js";

function AcceptInvitation() {
const { token } = useParams();
const navigate = useNavigate();

const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState(false);

const handleSubmit = async (event) => {
event.preventDefault();
setError("");


if (!token) {
  setError("This invitation link is missing its token.");
  return;
}

if (password.length < 8) {
  setError("Your password must contain at least 8 characters.");
  return;
}

if (new TextEncoder().encode(password).length > 72) {
  setError("Your password must not exceed 72 UTF-8 bytes.");
  return;
}

if (password !== confirmPassword) {
  setError("Your passwords do not match.");
  return;
}

try {
  setLoading(true);

  await acceptInvitation(token, password);

  setSuccess(true);
} catch (err) {
  setError(
    err?.message ||
      "We could not accept your invitation. Please try again."
  );
} finally {
  setLoading(false);
}


};

if (success) {
return ( <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12"> <section className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg"> <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
 </div>


      <h1 className="text-2xl font-bold text-slate-900">
        Invitation Accepted!
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Your password has been created and your account is ready.
        You can now log in to your employee account.
      </p>

      <button
        type="button"
        onClick={() => navigate("/login", { replace: true })}
        className="mt-6 w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Continue to Login
      </button>
    </section>
  </main>
);


}

return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12"> 
    <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <div className="mb-8 text-center"> 
   <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
     E.M.S </p>


      <h1 className="mt-3 text-3xl font-bold text-slate-900">
        Accept Invitation
      </h1>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Create a password to activate your employee account.
      </p>
    </div>

    {error && (
      <div
        role="alert"
        aria-live="polite"
        className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      >
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          New password
        </label>

        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={loading}
          placeholder="Enter your password"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Confirm password
        </label>

        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={loading}
          placeholder="Enter your password again"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(event) => setShowPassword(event.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
        />
        Show passwords
      </label>

     

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Accepting invitation..." : "Create Password"}
      </button>
    </form>

    <p className="mt-6 text-center text-sm text-slate-600">
      Already have an account?{" "}
      <Link
        to="/login"
        className="font-semibold text-blue-700 hover:text-blue-800"
      >
        Log in
      </Link>
    </p>
  </section>
</main>


);
}

export default AcceptInvitation;
