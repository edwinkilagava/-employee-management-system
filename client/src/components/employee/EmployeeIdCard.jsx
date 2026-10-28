import { useState } from "react";
import { jsPDF } from "jspdf";

const COMPANY_NAME = "EKLEE MANAGEMENTSX";
const CARD_WIDTH = 85.6;
const CARD_HEIGHT = 53.98;

function EmployeeIdCard({ user }) {
  const [downloading, setDownloading] = useState(false);

  const employeeName = user?.name?.trim() || "Employee";
  const employeeId = user?.employeeId || "";
  const profileImage = user?.profileImage || "";
  const phone = user?.phone || "Not provided";
  const department = user?.department || "Not assigned";
  const jobTitle = user?.jobTitle || "Not provided";

  const birthDate = user?.dateOfBirth ? new Date(user.dateOfBirth) : null;
  const birthYear =
    birthDate && !Number.isNaN(birthDate.getTime())
      ? birthDate.getUTCFullYear()
      : "Not provided";

  function getInitials(name) {
    return (
      name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "E"
    );
  }

  function handlePrint() {
    if (!employeeId) {
      window.alert("Your official employee ID has not been assigned. Please contact HR.");
      return;
    }
    window.print();
  }

  async function handleDownloadPdf() {
    if (!employeeId) {
      window.alert("Your official employee ID has not been assigned. Please contact HR.");
      return;
    }

    if (downloading) return;
    setDownloading(true);

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [CARD_WIDTH, CARD_HEIGHT],
        compress: true,
      });

      // -----------------------------------------------------
      // BACKGROUND & BRANDING ACCENTS
      // -----------------------------------------------------
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, CARD_WIDTH, CARD_HEIGHT, "F");

      // Top Navy Header Bar
      pdf.setFillColor(15, 23, 42); // slate-900
      pdf.rect(0, 0, CARD_WIDTH, 12, "F");

      // Gold Logo Emblem in PDF Header
      pdf.setFillColor(242, 190, 68);
      pdf.circle(7, 6, 3.8, "F");

      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("E", 7, 8.8, { align: "center" });

      // Company Name & Subtitle in Header
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.text(COMPANY_NAME, 13, 5.5);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(4.5);
      pdf.setTextColor(203, 213, 225);
      pdf.text("OFFICIAL STAFF IDENTIFICATION CARD", 13, 9);

      // Gold accent bar right under header
      pdf.setFillColor(217, 119, 6);
      pdf.rect(0, 12, CARD_WIDTH, 0.8, "F");

      // -----------------------------------------------------
      // EMPLOYEE PHOTO
      // -----------------------------------------------------
      const photoX = 6;
      const photoY = 16.5;
      const photoW = 18;
      const photoH = 22;

      pdf.setFillColor(241, 245, 249);
      pdf.setDrawColor(203, 213, 225);
      pdf.roundedRect(photoX, photoY, photoW, photoH, 1.5, 1.5, "FD");

      let photoAdded = false;

      if (profileImage) {
        try {
          const imageData = await loadImageData(profileImage);
          if (imageData) {
            const imageType = imageData.startsWith("data:image/png") ? "PNG" : "JPEG";
            pdf.addImage(
              imageData,
              imageType,
              photoX + 0.4,
              photoY + 0.4,
              photoW - 0.8,
              photoH - 0.8,
              undefined,
              "FAST"
            );
            photoAdded = true;
          }
        } catch {
          // Fallback to initials
        }
      }

      if (!photoAdded) {
        pdf.setTextColor(15, 23, 42);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(14);
        pdf.text(
          getInitials(employeeName),
          photoX + photoW / 2,
          photoY + photoH / 2 + 2,
          { align: "center" }
        );
      }

      // -----------------------------------------------------
      // NAME & ID SECTION
      // -----------------------------------------------------
      const contentX = 27;
      const contentWidth = 53;

      pdf.setTextColor(148, 163, 184);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(4.5);
      pdf.text("FULL NAME", contentX, 18);

      pdf.setTextColor(15, 23, 42);
      pdf.setFont("helvetica", "bold");
      let nameFontSize = 9.5;

      while (nameFontSize > 6) {
        pdf.setFontSize(nameFontSize);
        if (pdf.getTextWidth(employeeName) <= contentWidth) break;
        nameFontSize -= 0.5;
      }

      pdf.text(employeeName, contentX, 22, {
        maxWidth: contentWidth,
        baseline: "alphabetic",
      });

      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(4.5);
      pdf.text("EMPLOYEE ID", contentX, 27.5);

      pdf.setTextColor(217, 119, 6);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8.5);
      pdf.text(employeeId, contentX, 32, { maxWidth: contentWidth });

      // -----------------------------------------------------
      // METADATA GRID
      // -----------------------------------------------------
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.2);
      pdf.line(6, 40.5, CARD_WIDTH - 6, 40.5);

      const details = [
        { label: "DEPARTMENT", value: department },
        { label: "JOB TITLE", value: jobTitle },
        { label: "PHONE", value: phone },
        { label: "YEAR OF BIRTH", value: String(birthYear) },
      ];

      const columns = [6, 45];

      details.forEach((detail, index) => {
        const column = index % 2;
        const row = Math.floor(index / 2);
        const x = columns[column];
        const labelY = 43.5 + row * 5.2;
        const valueY = labelY + 2.6;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(4);
        pdf.setTextColor(148, 163, 184);
        pdf.text(detail.label, x, labelY);

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(5.5);
        pdf.setTextColor(51, 65, 85);

        const availableWidth = column === 0 ? 36 : 35;
        pdf.text(String(detail.value), x, valueY, { maxWidth: availableWidth });
      });

      // -----------------------------------------------------
      // FOOTER BAR
      // -----------------------------------------------------
      pdf.setFillColor(15, 23, 42);
      pdf.rect(0, CARD_HEIGHT - 3, CARD_WIDTH, 3, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(3.5);
      pdf.text("AUTHORIZED PERSONNEL ONLY", 6, CARD_HEIGHT - 1.1);

      const safeEmployeeId = employeeId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
      pdf.save(`Eklee-ID-${safeEmployeeId}.pdf`);
    } catch (error) {
      console.error("Employee ID PDF generation failed:", error);
      window.alert("We could not generate your work ID PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md print:hidden">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">
            Employee Services
          </span>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            Digital ID Card
          </h2>
          <p className="text-sm text-slate-500">
            Preview and export your official staff identification badge.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={!employeeId || downloading}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading ? "Generating PDF..." : "Download PDF ID"}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={!employeeId}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Print Card
          </button>
        </div>
      </div>

      {!employeeId && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
          Your official employee ID has not been assigned. Please contact HR.
        </div>
      )}

      {/* Modern Card Preview Container */}
      <div className="flex justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 p-6">
        <article
          id="employee-id-card"
          className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-slate-800 shadow-xl"
        >
          {/* Top Header with Re-integrated Gold Logo */}
          <header className="flex items-center gap-3 bg-slate-900 px-6 py-4 text-white">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 font-extrabold text-slate-900 shadow-md">
              E
            </div>

            <div className="min-w-0">
              <h3 className="text-xs font-black tracking-widest text-white">
                {COMPANY_NAME}
              </h3>
              <p className="text-[9px] font-semibold tracking-wider text-slate-300">
                OFFICIAL STAFF IDENTITY CARD
              </p>
            </div>
          </header>

          {/* Accent Line */}
          <div className="h-1 w-full bg-amber-600" />

          {/* Main Body */}
          <div className="flex items-center gap-5 px-6 py-4">
            <div className="relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-xl font-bold text-slate-700 shadow-inner">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`Profile of ${employeeName}`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                getInitials(employeeName)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400">
                  FULL NAME
                </span>
                <h4 className="truncate text-base font-extrabold text-slate-900">
                  {employeeName}
                </h4>
              </div>

              <div className="mt-3">
                <span className="text-[9px] font-bold tracking-widest text-slate-400">
                  EMPLOYEE ID
                </span>
                <p className="text-sm font-black text-amber-600">
                  {employeeId || "Not assigned"}
                </p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <Detail label="DEPARTMENT" value={department} />
            <Detail label="JOB TITLE" value={jobTitle} />
            <Detail label="PHONE" value={phone} />
            <Detail label="YEAR OF BIRTH" value={birthYear} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between bg-slate-900 px-6 py-2.5 text-[9px] font-bold tracking-wider text-slate-300">
            <span>AUTHORIZED PERSONNEL ONLY</span>
            <span className="text-amber-400">EKLEE</span>
          </div>
        </article>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        Optimized for standard ID card dimensions (CR80 format). Print at 100% scale.
      </p>
    </section>
  );
}

async function loadImageData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not load profile photo.");
  const blob = await response.blob();
  if (!blob.type.startsWith("image/")) throw new Error("Invalid image type.");

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read profile photo."));
    reader.readAsDataURL(blob);
  });
}

function Detail({ label, value }) {
  return (
    <div className="min-w-0">
      <span className="text-[9px] font-bold tracking-wider text-slate-400">
        {label}
      </span>
      <p className="truncate text-xs font-bold text-slate-700">
        {value}
      </p>
    </div>
  );
}

export default EmployeeIdCard;