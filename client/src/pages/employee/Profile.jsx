
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

import { useAuth } from "../../hooks/useAuth.js";

import {
  updateMyProfile,
  uploadMyProfileImage,
} from "../../services/employee.service.js";

import {
  downloadEmployeeProfilePdf,
  printEmployeeProfile,
} from "../../utils/employeeProfilePdf.js";

function Profile() {
  const { user, refreshUser } = useAuth();

  const fileInputRef = useRef(null);

  const [showUpdate, setShowUpdate] = useState(false);

  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [city, setCity] = useState(user?.city || "");

  const [selectedImage, setSelectedImage] = useState(null);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const employeeId =
    user?.employeeId || user?._id || user?.id || "Not available";

  function formatDate(value) {
    if (!value) return "Not provided";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function displayValue(value) {
    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      return "Not provided";
    }

    return String(value);
  }

  function getInitials(name) {
    if (!name) return "E";

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }

  function resetMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

  function resetFormValues() {
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
    setCity(user?.city || "");
    resetMessages();
  }

  // Download the employee profile as a PDF.
  async function handleDownloadPdf() {
    try {
      setGeneratingPdf(true);
      resetMessages();

      await downloadEmployeeProfilePdf(user);

      setSuccessMessage(
        "Your employee profile PDF has been downloaded."
      );
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Unable to download your employee profile PDF."
      );
    } finally {
      setGeneratingPdf(false);
    }
  }

  // Open a print-ready employee profile.
  function handlePrintProfile() {
    try {
      resetMessages();
      printEmployeeProfile(user);
    } catch (error) {
      setErrorMessage(
        error?.message || "Unable to print your profile."
      );
    }
  }

  // Validate a selected profile picture.
  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    resetMessages();

    if (!file.type.startsWith("image/")) {
      setSelectedImage(null);
      setErrorMessage("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedImage(null);
      setErrorMessage(
        "Profile image must be smaller than 5MB."
      );
      event.target.value = "";
      return;
    }

    setSelectedImage(file);
  }

  // Upload the selected image to the backend.
  async function handleUploadImage() {
    if (!selectedImage) {
      setErrorMessage("Please select an image first.");
      return;
    }

    try {
      setUploadingImage(true);
      resetMessages();

      await uploadMyProfileImage(selectedImage);
      await refreshUser();

      setSelectedImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSuccessMessage(
        "Your profile picture was updated successfully."
      );
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Unable to update your profile picture."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  // Update the employee's contact information.
  async function handleSaveDetails(event) {
    event.preventDefault();

    try {
      setSaving(true);
      resetMessages();

      await updateMyProfile({
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
      });

      await refreshUser();

      setShowUpdate(false);

      setSuccessMessage(
        "Your personal information was updated successfully."
      );
    } catch (error) {
      setErrorMessage(
        error?.message ||
          "Unable to update your personal information."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading your personal details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[74px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/employee/dashboard"
              aria-label="Back to dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                aria-hidden="true"
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

            <div>
              <p className="text-sm font-bold text-slate-900">
                Employee Portal
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Personal Information
              </p>
            </div>
          </div>

          <Link
            to="/employee/dashboard"
            className="text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Page heading */}
        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Employee profile
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Personal Details
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            View, update and download your personal employee information.
          </p>

          {/* PDF and print actions */}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={generatingPdf}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generatingPdf ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v4h14v-4"
                    />
                  </svg>
                  Download Profile PDF
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrintProfile}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8V3h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2m-11-4h10v8H7z"
                />
              </svg>
              Print Profile
            </button>
          </div>
        </div>

        {/* Feedback messages */}
        {successMessage && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3"
          >
            <p className="text-sm font-medium text-green-800">
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <p className="text-sm font-medium text-red-800">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Employee details card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-slate-900">
              Employee Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your information from the employee record.
            </p>
          </div>

          {/* Profile image and information */}
          <div className="px-5 py-7 sm:px-7 sm:py-9">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              {/* Profile image */}
              <div className="w-full shrink-0 sm:w-40">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={`${user.name || "Employee"} profile`}
                    className="mx-auto h-40 w-40 rounded-full border-4 border-white bg-slate-100 object-cover shadow-md ring-1 ring-slate-200 sm:mx-0"
                  />
                ) : (
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-4xl font-bold text-slate-500 shadow-md ring-1 ring-slate-200 sm:mx-0">
                    {getInitials(user.name)}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Choose a profile picture"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Choose Photo
                </button>

                <p className="mt-2 text-center text-xs text-slate-400">
                  Image files up to 5MB
                </p>

                {selectedImage && (
                  <div className="mt-3">
                    <p className="truncate text-xs text-slate-500">
                      {selectedImage.name}
                    </p>

                    <button
                      type="button"
                      onClick={handleUploadImage}
                      disabled={uploadingImage}
                      className="mt-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploadingImage ? "Uploading..." : "Upload Photo"}
                    </button>
                  </div>
                )}
              </div>

              {/* Employee information */}
              <div className="w-full min-w-0 flex-1">
                <div className="mb-6 border-b border-slate-100 pb-5">
                  <h3 className="text-xl font-bold text-slate-900">
                    {displayValue(user.name)}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {displayValue(user.jobTitle)}
                  </p>
                </div>

                <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  <Detail
                    label="Employee ID"
                    value={displayValue(employeeId)}
                  />

                  <Detail
                    label="Email Address"
                    value={displayValue(user.email)}
                  />

                  <Detail
                    label="Department"
                    value={displayValue(user.department)}
                  />

                  <Detail
                    label="Date of Birth"
                    value={formatDate(user.dateOfBirth)}
                  />

                  <Detail
                    label="Phone Number"
                    value={displayValue(user.phone)}
                  />

                  <Detail
                    label="Address"
                    value={displayValue(user.address)}
                  />

                  <Detail
                    label="City / Location"
                    value={displayValue(user.city)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Update personal information */}
          <div className="border-t border-slate-100 bg-slate-50 px-5 py-6 sm:px-7">
            {!showUpdate ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Update your information
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Change your phone number and location.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    resetFormValues();
                    setShowUpdate(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Update Details
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 12h14m-6-6 6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveDetails}>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Update Personal Details
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    You can update your contact and location information.
                    Employment information is managed by the administrator.
                  </p>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      maxLength={30}
                      placeholder="Enter your phone number"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      autoComplete="street-address"
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      maxLength={200}
                      placeholder="Enter your address"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      City / Location
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      maxLength={100}
                      placeholder="Enter your city or location"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      resetFormValues();
                      setShowUpdate(false);
                    }}
                    disabled={saving}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving Changes...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-slate-400">
          Keep your contact information up to date. Contact your administrator
          if your employment details need to be corrected.
        </p>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}

export default Profile;
