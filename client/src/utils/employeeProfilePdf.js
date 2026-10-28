import { jsPDF } from "jspdf";
import logoUrl from "../assets/eklee.logo.jpg";

/* -------------------------------------------------------------------------
 * Employee Profile PDF module
 *
 * Data preparation, downloadable PDF rendering, and browser print rendering
 * are separated. The downloadable PDF remains unchanged because its visual
 * presentation is produced by jsPDF drawing commands rather than CSS.
 * ---------------------------------------------------------------------- */

const COMPANY = {
  name: "Eklee ManagementSX",
  postalCode: "00100",
  phone: "0741355766",
  email: "eddieanalo3@gmail.com",
  website: "www.eklee.managementSX",
};

const COLORS = {
  rail: [15, 61, 62],
  railSoft: [24, 84, 85],
  railText: [236, 246, 243],
  railMuted: [149, 189, 181],
  accent: [224, 165, 38],
  ink: [20, 33, 36],
  text: [44, 56, 58],
  muted: [108, 122, 124],
  rule: [218, 228, 226],
  tint: [241, 246, 245],
  white: [255, 255, 255],
  activeBg: [214, 240, 228],
  activeText: [15, 100, 66],
  neutralBg: [230, 236, 235],
  neutralText: [70, 84, 86],
};

const PAGE = { width: 210, height: 297 };
const RAIL = { width: 68, pad: 8 };
const MAIN = { x: 80, right: 200, width: 120 };

/* ----------------------------- data helpers ----------------------------- */

function displayValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" && !value.trim()) return "—";
  if (typeof value === "object" && !(value instanceof Date)) return "—";
  return String(value).trim();
}

function firstAvailable(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value;
    }
  }
  return "—";
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function safeFilename(value) {
  const name = displayValue(value)
    .replace(/[^a-z0-9_-]/gi, "_")
    .replace(/^_+|_+$/g, "");
  return name || "employee";
}

function escapeHtml(value) {
  return String(value ?? "—").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function getInitials(name) {
  return (
    name
      .split(/\s+/)
      .filter((part) => part && part !== "—")
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "E"
  );
}

function getEmployeeData(user) {
  return {
    name: displayValue(firstAvailable(user.name, user.fullName)),
    employeeId: displayValue(firstAvailable(user.employeeId, user._id, user.id)),
    email: displayValue(user.email),
    phone: displayValue(
      firstAvailable(user.phone, user.phoneNumber, user.mobile)
    ),
    dateOfBirth: formatDate(user.dateOfBirth),
    gender: displayValue(user.gender),
    nationalId: displayValue(firstAvailable(user.nationalId, user.idNumber)),
    jobTitle: displayValue(
      firstAvailable(user.jobTitle, user.position, user.designation)
    ),
    department: displayValue(user.department),
    employmentType: displayValue(user.employmentType),
    salary: displayValue(user.salary),
    dateOfJoining: formatDate(
      firstAvailable(user.dateOfJoining, user.joiningDate)
    ),
    reportingManager: displayValue(
      firstAvailable(user.reportingManager, user.managerName)
    ),
    workLocation: displayValue(
      firstAvailable(user.workLocation, user.city, user.location)
    ),
    status: displayValue(firstAvailable(user.status, user.employmentStatus)),
    street: displayValue(
      firstAvailable(user.street, user.address, user.postalAddress)
    ),
    city: displayValue(firstAvailable(user.city, user.location)),
    postalCode: displayValue(firstAvailable(user.postalCode, user.zipCode)),
    emergencyName: displayValue(
      firstAvailable(user.emergencyContactName, user.emergencyContact?.name)
    ),
    emergencyRelationship: displayValue(
      firstAvailable(
        user.emergencyContactRelationship,
        user.emergencyContact?.relationship
      )
    ),
    emergencyPhone: displayValue(
      firstAvailable(
        user.emergencyContactPhone,
        user.emergencyContact?.phone,
        user.emergencyContact?.phoneNumber
      )
    ),
    profileImage: firstAvailable(
      user.profileImage,
      user.profileImageUrl,
      user.avatar
    ),
  };
}

/* ----------------------------- image helpers ---------------------------- */

async function loadImageAsDataUrl(source) {
  if (!source || source === "—") return null;

  try {
    const response = await fetch(source);
    if (!response.ok) return null;

    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    // A remote image may be inaccessible because of network or CORS rules.
    return null;
  }
}

async function loadLogo() {
  return loadImageAsDataUrl(logoUrl);
}

function imageFormat(imageData) {
  if (imageData.startsWith("data:image/png")) return "PNG";
  if (imageData.startsWith("data:image/webp")) return "WEBP";
  return "JPEG";
}

function addImageSafely(pdf, imageData, x, y, width, height) {
  if (!imageData) return false;

  try {
    pdf.addImage(imageData, imageFormat(imageData), x, y, width, height);
    return true;
  } catch {
    return false;
  }
}

// Draws an image scaled to fit inside a box without stretching it.
function addImageContained(pdf, imageData, x, y, boxWidth, boxHeight) {
  if (!imageData) return false;

  let width = boxWidth;
  let height = boxHeight;

  try {
    const props = pdf.getImageProperties(imageData);
    const scale = Math.min(boxWidth / props.width, boxHeight / props.height);
    width = props.width * scale;
    height = props.height * scale;
  } catch {
    // Fall back to the full box if the image properties cannot be read.
  }

  return addImageSafely(
    pdf,
    imageData,
    x + (boxWidth - width) / 2,
    y + (boxHeight - height) / 2,
    width,
    height
  );
}

/* ------------------------------ PDF drawing ----------------------------- */

function setText(pdf, color, style = "normal", size = 8, family = "helvetica") {
  pdf.setFont(family, style);
  pdf.setFontSize(size);
  pdf.setTextColor(...color);
}

function drawPageBackground(pdf) {
  pdf.setFillColor(...COLORS.white);
  pdf.rect(0, 0, PAGE.width, PAGE.height, "F");

  pdf.setFillColor(...COLORS.rail);
  pdf.rect(0, 0, RAIL.width, PAGE.height, "F");

  // A thin saffron edge where the rail meets the page.
  pdf.setFillColor(...COLORS.accent);
  pdf.rect(RAIL.width, 0, 1.4, PAGE.height, "F");
}

// A labelled block inside the rail. Returns the next free y position.
function addRailBlock(pdf, title, items, y) {
  const x = RAIL.pad;
  const width = RAIL.width - RAIL.pad * 2;

  setText(pdf, COLORS.accent, "bold", 8.5);
  pdf.text(title, x, y);

  pdf.setDrawColor(...COLORS.railSoft);
  pdf.setLineWidth(0.3);
  pdf.line(x, y + 2.5, x + width, y + 2.5);

  let cursor = y + 9;

  for (const [label, value] of items) {
    setText(pdf, COLORS.railMuted, "normal", 6.8);
    pdf.text(label, x, cursor);

    setText(pdf, COLORS.railText, "normal", 8);
    const lines = pdf.splitTextToSize(displayValue(value), width).slice(0, 3);
    pdf.text(lines, x, cursor + 4.2);

    cursor += 4.2 + lines.length * 3.8 + 4.2;
  }

  return cursor;
}

function addRail(pdf, employee, logoData, profileImageData) {
  const x = RAIL.pad;
  const width = RAIL.width - RAIL.pad * 2;

  // Company mark on a light tile so any logo background stays readable.
  pdf.setFillColor(...COLORS.white);
  pdf.roundedRect(x, 12, width, 24, 2, 2, "F");

  const logoAdded = addImageContained(pdf, logoData, x + 4, 14.5, width - 8, 19);

  if (!logoAdded) {
    setText(pdf, COLORS.rail, "bold", 9, "times");
    pdf.text(
      pdf.splitTextToSize(COMPANY.name, width - 6).slice(0, 2),
      x + width / 2,
      23,
      { align: "center" }
    );
  }

  setText(pdf, COLORS.railText, "bold", 9);
  pdf.text(COMPANY.name, x, 43);

  // Portrait frame.
  const photoY = 52;
  const photoW = width;
  const photoH = 58;

  pdf.setFillColor(...COLORS.railSoft);
  pdf.roundedRect(x, photoY, photoW, photoH, 2, 2, "F");

  const photoAdded = addImageContained(
    pdf,
    profileImageData,
    x,
    photoY,
    photoW,
    photoH
  );

  if (!photoAdded) {
    setText(pdf, COLORS.railText, "bold", 30, "times");
    pdf.text(getInitials(employee.name), x + photoW / 2, photoY + photoH / 2 + 4, {
      align: "center",
    });
  }

  pdf.setDrawColor(...COLORS.accent);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(x, photoY, photoW, photoH, 2, 2, "S");

  let y = addRailBlock(
    pdf,
    "Contact",
    [
      ["Phone", employee.phone],
      ["Email", employee.email],
    ],
    124
  );

  y = addRailBlock(
    pdf,
    "Emergency contact",
    [
      ["Name", employee.emergencyName],
      ["Relationship", employee.emergencyRelationship],
      ["Phone", employee.emergencyPhone],
    ],
    y + 6
  );

  // Company details at the foot of the rail.
  setText(pdf, COLORS.railMuted, "normal", 6.5);
  const footLines = [
    COMPANY.phone,
    COMPANY.email,
    COMPANY.website,
    `Postal code ${COMPANY.postalCode}`,
  ];
  let footY = 276;
  for (const line of footLines) {
    pdf.text(pdf.splitTextToSize(line, width)[0], x, footY);
    footY += 3.8;
  }
}

function addMainHeader(pdf, employee) {
  const { x, right, width } = MAIN;

  setText(pdf, COLORS.muted, "normal", 8);
  pdf.text("Employee profile", x, 18);

  setText(pdf, COLORS.muted, "normal", 7);
  pdf.text(`Generated ${formatDate(new Date())}`, right, 18, {
    align: "right",
  });

  // Name in a serif face; it is the one expressive element on the page.
  const nameSize = employee.name.length > 28 ? 20 : 26;
  setText(pdf, COLORS.ink, "bold", nameSize, "times");
  const nameLines = pdf.splitTextToSize(employee.name, width).slice(0, 2);
  pdf.text(nameLines, x, 33);

  let y = 33 + (nameLines.length - 1) * (nameSize * 0.42) + 8;

  setText(pdf, COLORS.text, "normal", 11);
  const titleLines = pdf.splitTextToSize(employee.jobTitle, width).slice(0, 2);
  pdf.text(titleLines, x, y);
  y += titleLines.length * 5 + 2;

  // Status pill.
  const statusText = employee.status === "—" ? "Employee" : employee.status;
  const isActive = employee.status.toLowerCase() === "active";

  setText(pdf, isActive ? COLORS.activeText : COLORS.neutralText, "bold", 7.5);
  const pillWidth = Math.min(pdf.getTextWidth(statusText) + 9, 60);

  pdf.setFillColor(...(isActive ? COLORS.activeBg : COLORS.neutralBg));
  pdf.roundedRect(x, y, pillWidth, 6.5, 3.25, 3.25, "F");
  pdf.text(statusText, x + pillWidth / 2, y + 4.5, {
    align: "center",
    maxWidth: 58,
  });

  y += 13;

  // Quick facts strip.
  const stripHeight = 17;
  pdf.setFillColor(...COLORS.tint);
  pdf.rect(x, y, width, stripHeight, "F");
  pdf.setFillColor(...COLORS.accent);
  pdf.rect(x, y, 1.4, stripHeight, "F");

  const facts = [
    ["Employee ID", employee.employeeId, 44],
    ["Department", employee.department, 40],
    ["Joined", employee.dateOfJoining, 36],
  ];

  let factX = x + 6;
  for (const [label, value, factWidth] of facts) {
    setText(pdf, COLORS.muted, "normal", 6.8);
    pdf.text(label, factX, y + 6);

    setText(pdf, COLORS.ink, "bold", 8.2);
    pdf.text(
      pdf.splitTextToSize(displayValue(value), factWidth - 4).slice(0, 2),
      factX,
      y + 11
    );

    factX += factWidth;
  }

  return y + stripHeight + 11;
}

// Two-column list of label and value pairs with a heading. Returns next y.
function addDetailSection(pdf, title, fields, y) {
  const { x, width } = MAIN;
  const gap = 8;
  const columnWidth = (width - gap) / 2;
  const columns = [x, x + columnWidth + gap];

  pdf.setFillColor(...COLORS.accent);
  pdf.rect(x, y - 3.6, 1.4, 5, "F");

  setText(pdf, COLORS.ink, "bold", 10.5);
  pdf.text(title, x + 4, y);

  pdf.setDrawColor(...COLORS.rule);
  pdf.setLineWidth(0.3);
  pdf.line(x, y + 2.5, x + width, y + 2.5);

  let cursor = y + 9;

  for (let index = 0; index < fields.length; index += 2) {
    const rowFields = fields.slice(index, index + 2);
    let rowHeight = 0;

    rowFields.forEach(([label, value], column) => {
      const fx = columns[column];

      setText(pdf, COLORS.muted, "normal", 6.8);
      pdf.text(label, fx, cursor);

      setText(pdf, COLORS.text, "normal", 9);
      const lines = pdf
        .splitTextToSize(displayValue(value), columnWidth)
        .slice(0, 2);
      pdf.text(lines, fx, cursor + 4.6);

      rowHeight = Math.max(rowHeight, 4.6 + lines.length * 4);
    });

    cursor += rowHeight + 5.5;
  }

  return cursor + 3;
}

function addFooter(pdf) {
  const pageCount = pdf.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);

    pdf.setDrawColor(...COLORS.rule);
    pdf.setLineWidth(0.3);
    pdf.line(MAIN.x, 282, MAIN.right, 282);

    setText(pdf, COLORS.muted, "normal", 7);
    pdf.text("Employee Management System", MAIN.x, 288);
    pdf.text(`Page ${page} of ${pageCount}`, MAIN.right, 288, {
      align: "right",
    });
  }
}

function buildPdf(user, logoData, profileImageData) {
  const employee = getEmployeeData(user);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  pdf.setProperties({
    title: `Employee Profile - ${employee.name}`,
    subject: "Employee personal and employment details",
    author: COMPANY.name,
    creator: "Eklee ManagementSX Employee Management System",
  });

  drawPageBackground(pdf);
  addRail(pdf, employee, logoData, profileImageData);

  let y = addMainHeader(pdf, employee);

  y = addDetailSection(
    pdf,
    "Employment details",
    [
      ["Job title", employee.jobTitle],
      ["Employment type", employee.employmentType],
      ["Department", employee.department],
      ["Salary", employee.salary],
      ["Date of joining", employee.dateOfJoining],
      ["Reporting manager", employee.reportingManager],
      ["Work location", employee.workLocation],
    ],
    y
  );

  y = addDetailSection(
    pdf,
    "Personal information",
    [
      ["Full name", employee.name],
      ["Date of birth", employee.dateOfBirth],
      ["Gender", employee.gender],
      ["National ID", employee.nationalId],
      ["Phone number", employee.phone],
      ["Email address", employee.email],
    ],
    y
  );

  addDetailSection(
    pdf,
    "Address",
    [
      ["Street", employee.street],
      ["City / location", employee.city],
      ["Postal code", employee.postalCode],
    ],
    y
  );

  addFooter(pdf);

  return pdf;
}

/* --------------------------- print data helpers -------------------------- */

function getPrintStatus(employee) {
  return {
    statusText: employee.status === "—" ? "Employee" : employee.status,
    isActive: employee.status.toLowerCase() === "active",
  };
}

function createPrintField(label, value) {
  return { label, value: displayValue(value) };
}

function getPrintData(user) {
  const employee = getEmployeeData(user);
  const { statusText } = getPrintStatus(employee);

  return {
    employee,
    generated: formatDate(new Date()),
    statusText,
    contact: [
      createPrintField("Phone", employee.phone),
      createPrintField("Email", employee.email),
    ],
    emergencyContact: [
      createPrintField("Name", employee.emergencyName),
      createPrintField("Relationship", employee.emergencyRelationship),
      createPrintField("Phone", employee.emergencyPhone),
    ],
    quickFacts: [
      createPrintField("Employee ID", employee.employeeId),
      createPrintField("Department", employee.department),
      createPrintField("Joined", employee.dateOfJoining),
    ],
    employmentDetails: [
      createPrintField("Job title", employee.jobTitle),
      createPrintField("Employment type", employee.employmentType),
      createPrintField("Department", employee.department),
      createPrintField("Salary", employee.salary),
      createPrintField("Date of joining", employee.dateOfJoining),
      createPrintField("Reporting manager", employee.reportingManager),
      createPrintField("Work location", employee.workLocation),
    ],
    personalInformation: [
      createPrintField("Full name", employee.name),
      createPrintField("Date of birth", employee.dateOfBirth),
      createPrintField("Gender", employee.gender),
      createPrintField("National ID", employee.nationalId),
      createPrintField("Phone number", employee.phone),
      createPrintField("Email address", employee.email),
    ],
    address: [
      createPrintField("Street", employee.street),
      createPrintField("City / location", employee.city),
      createPrintField("Postal code", employee.postalCode),
    ],
  };
}

/* --------------------------- print rendering ----------------------------- */

function renderPrintFields(fields) {
  return fields
    .map(
      (field) => `
      <div>
        <span>${escapeHtml(field.label)}</span>
        <span>${escapeHtml(field.value)}</span>
      </div>`
    )
    .join("");
}

function renderPrintSection(title, fields) {
  return `
    <section>
      <h2>${escapeHtml(title)}</h2>
      ${renderPrintFields(fields)}
    </section>`;
}

function buildPrintDocument(printData, logo, profileImage) {
  const { employee, generated, statusText } = printData;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Employee Profile - ${escapeHtml(employee.name)}</title>
  </head>
  <body>
    <article>
      <header>
        <p>Employee profile</p>
        <p>Generated ${escapeHtml(generated)}</p>
      </header>

      <aside>
        <figure>
          ${
            logo
              ? `<img src="${logo}" alt="Company logo">`
              : `<figcaption>${escapeHtml(COMPANY.name)}</figcaption>`
          }
        </figure>

        <p>${escapeHtml(COMPANY.name)}</p>

        <figure>
          ${
            profileImage
              ? `<img src="${profileImage}" alt="Employee photo">`
              : `<figcaption>${escapeHtml(getInitials(employee.name))}</figcaption>`
          }
        </figure>

        <section>
          <h2>Contact</h2>
          ${renderPrintFields(printData.contact)}
        </section>

        <section>
          <h2>Emergency contact</h2>
          ${renderPrintFields(printData.emergencyContact)}
        </section>

        <footer>
          <p>${escapeHtml(COMPANY.phone)}</p>
          <p>${escapeHtml(COMPANY.email)}</p>
          <p>${escapeHtml(COMPANY.website)}</p>
          <p>Postal code ${escapeHtml(COMPANY.postalCode)}</p>
        </footer>
      </aside>

      <main>
        <h1>${escapeHtml(employee.name)}</h1>
        <p>${escapeHtml(employee.jobTitle)}</p>
        <p>Status: ${escapeHtml(statusText)}</p>

        <section>
          <h2>Quick facts</h2>
          ${renderPrintFields(printData.quickFacts)}
        </section>

        ${renderPrintSection("Employment details", printData.employmentDetails)}

        ${renderPrintSection("Personal information", printData.personalInformation)}

        ${renderPrintSection("Address", printData.address)}

        <footer>
          <p>Employee Management System</p>
          <p>Generated ${escapeHtml(generated)}</p>
        </footer>
      </main>
    </article>

    <script>
      window.addEventListener("load", () => {
        setTimeout(() => {
          window.focus();
          window.print();
        }, 300);
      });
    </script>
  </body>
</html>`;
}

async function renderPrintDocument(user, printWindow) {
  const printData = getPrintData(user);

  const [logo, profileImage] = await Promise.all([
    loadLogo(),
    loadImageAsDataUrl(printData.employee.profileImage),
  ]);

  if (printWindow.closed) return;

  const html = buildPrintDocument(printData, logo, profileImage);

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

/* ------------------------------ public API ------------------------------ */

export async function downloadEmployeeProfilePdf(user) {
  if (!user || typeof user !== "object") {
    throw new Error("Employee information is not available.");
  }

  const [logoData, profileImageData] = await Promise.all([
    loadLogo(),
    loadImageAsDataUrl(getEmployeeData(user).profileImage),
  ]);

  const pdf = buildPdf(user, logoData, profileImageData);

  pdf.save(
    `employee-profile-${safeFilename(
      firstAvailable(user.name, user.fullName)
    )}.pdf`
  );
}

export function printEmployeeProfile(user) {
  if (!user || typeof user !== "object") {
    throw new Error("Employee information is not available.");
  }

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    throw new Error(
      "The print window was blocked. Allow pop-ups and try again."
    );
  }

  // Open the window immediately from the click handler, before awaiting images.
  printWindow.document.open();
  printWindow.document.write(
    "<!doctype html><html><head><title>Employee Profile</title></head><body>Preparing employee profile...</body></html>"
  );
  printWindow.document.close();

  renderPrintDocument(user, printWindow).catch(() => {
    if (!printWindow.closed) {
      printWindow.document.body.textContent =
        "Unable to prepare the employee profile for printing. Please try again.";
    }
  });
}