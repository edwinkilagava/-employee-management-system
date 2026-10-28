import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
} from "../../services/employee.service.js";

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

const icon = (paths) =>
  function Icon({ className = "h-4 w-4" }) {
    return (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths}
      </svg>
    );
  };

const SearchIcon = icon(
  <>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </>
);

const PlusIcon = icon(
  <>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </>
);

const XIcon = icon(
  <>
    <path d="M6 6l12 12" />
    <path d="M18 6 6 18" />
  </>
);

const EyeIcon = icon(
  <>
    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </>
);

const EditIcon = icon(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </>
);

const RefreshIcon = icon(
  <>
    <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
    <path d="M3 5v5h5" />
    <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
    <path d="M21 19v-5h-5" />
  </>
);

const MailIcon = icon(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>
);

const UserIcon = icon(
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </>
);

const CalendarIcon = icon(
  <>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>
);

const BriefcaseIcon = icon(
  <>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </>
);

const ShieldIcon = icon(
  <>
    <path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z" />
  </>
);

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STATUS = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },

  invited: {
    label: "Invited",
    dot: "bg-sky-500",
    bg: "bg-sky-50",
    text: "text-sky-700",
  },

  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },

  suspended: {
    label: "Suspended",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },

  deactivated: {
    label: "Deactivated",
    dot: "bg-stone-400",
    bg: "bg-stone-100",
    text: "text-stone-600",
  },

  inactive: {
    label: "Inactive",
    dot: "bg-stone-400",
    bg: "bg-stone-100",
    text: "text-stone-600",
  },
};

const AVATAR_TONES = [
  "bg-teal-100 text-teal-800",
  "bg-indigo-100 text-indigo-800",
  "bg-orange-100 text-orange-800",
  "bg-pink-100 text-pink-800",
  "bg-lime-100 text-lime-800",
  "bg-sky-100 text-sky-800",
];

const EMPTY_FORM = {
  name: "",
  email: "",

  nationalId: "",
  dateOfBirth: "",
  gender: "",
  phone: "",

  employeeId: "",
  department: "",
  jobTitle: "",
  employmentType: "full-time",
  dateOfJoining: "",
  salary: "",

  address: "",
  city: "",

  emergencyContactName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
};

const REQUIRED_FIELDS = [
  "name",
  "email",
  "nationalId",
  "dateOfBirth",
  "gender",
  "phone",
  "employeeId",
  "department",
  "jobTitle",
  "employmentType",
  "dateOfJoining",
  "salary",
  "address",
  "city",
  "emergencyContactName",
  "emergencyContactPhone",
  "emergencyContactRelationship",
];

const FIELD_LABELS = {
  name: "Full name",
  email: "Email address",
  nationalId: "National ID number",
  dateOfBirth: "Date of birth",
  gender: "Gender",
  phone: "Phone number",
  employeeId: "Employee ID",
  department: "Department",
  jobTitle: "Job title",
  employmentType: "Employment type",
  dateOfJoining: "Date of joining",
  salary: "Salary",
  address: "Address",
  city: "City / town",
  emergencyContactName: "Emergency contact name",
  emergencyContactPhone: "Emergency contact phone",
  emergencyContactRelationship: "Emergency contact relationship",
};

/* -------------------------------------------------------------------------- */
/* Shared styles                                                              */
/* -------------------------------------------------------------------------- */

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

const primaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/10 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButton =
  "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-300/50 disabled:cursor-not-allowed disabled:opacity-60";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getSafeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getDateInputValue(value) {
  if (!value) return "";

  const stringValue = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(stringValue)) {
    return stringValue.substring(0, 10);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().substring(0, 10);
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function capitalize(value) {
  if (!value) return "";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function formatEmploymentType(value) {
  if (!value) return "—";

  return value
    .split("-")
    .map(capitalize)
    .join("-");
}

function formatSalary(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 2,
  }).format(number);
}

function normalizeFormForPayload(formData) {
  const salary =
    getSafeText(formData.salary) === ""
      ? null
      : Number(formData.salary);

  return {
    name: getSafeText(formData.name),
    email: getSafeText(formData.email).toLowerCase(),

    nationalId: getSafeText(formData.nationalId),
    dateOfBirth: getSafeText(formData.dateOfBirth),
    gender: getSafeText(formData.gender),
    phone: getSafeText(formData.phone),

    employeeId: getSafeText(formData.employeeId),
    department: getSafeText(formData.department),
    jobTitle: getSafeText(formData.jobTitle),
    employmentType: getSafeText(
      formData.employmentType
    ),
    dateOfJoining: getSafeText(
      formData.dateOfJoining
    ),
    salary,

    address: getSafeText(formData.address),
    city: getSafeText(formData.city),

    emergencyContactName: getSafeText(
      formData.emergencyContactName
    ),
    emergencyContactPhone: getSafeText(
      formData.emergencyContactPhone
    ),
    emergencyContactRelationship: getSafeText(
      formData.emergencyContactRelationship
    ),
  };
}

function validateEmployeeForm(formData) {
  const errors = {};

  REQUIRED_FIELDS.forEach((field) => {
    if (
      field === "salary" &&
      getSafeText(formData.salary) !== ""
    ) {
      return;
    }

    if (
      field !== "salary" &&
      getSafeText(formData[field]) !== ""
    ) {
      return;
    }

    errors[field] = `${FIELD_LABELS[field]} is required.`;
  });

  const name = getSafeText(formData.name);

  if (name && (name.length < 2 || name.length > 100)) {
    errors.name =
      "Full name must be between 2 and 100 characters.";
  }

  const email = getSafeText(formData.email);

  if (
    email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email =
      "Please enter a valid email address.";
  }

  const salary = getSafeText(formData.salary);

  if (salary !== "") {
    const numericSalary = Number(salary);

    if (
      !Number.isFinite(numericSalary) ||
      numericSalary < 0
    ) {
      errors.salary =
        "Salary must be a valid non-negative amount.";
    }
  }

  if (formData.gender && !["male", "female", "other"].includes(formData.gender)) {
    errors.gender = "Please select a valid gender.";
  }

  if (
    formData.employmentType &&
    ![
      "full-time",
      "part-time",
      "contract",
      "intern",
    ].includes(formData.employmentType)
  ) {
    errors.employmentType =
      "Please select a valid employment type.";
  }

  if (
    formData.phone &&
    (formData.phone.trim().length < 7 ||
      formData.phone.trim().length > 20)
  ) {
    errors.phone =
      "Phone number must be between 7 and 20 characters.";
  }

  if (
    formData.emergencyContactPhone &&
    (formData.emergencyContactPhone.trim().length < 7 ||
      formData.emergencyContactPhone.trim().length > 20)
  ) {
    errors.emergencyContactPhone =
      "Emergency contact phone must be between 7 and 20 characters.";
  }

  if (
    formData.employeeId &&
    formData.employeeId.trim().length > 50
  ) {
    errors.employeeId =
      "Employee ID cannot exceed 50 characters.";
  }

  if (
    formData.department &&
    formData.department.trim().length < 2
  ) {
    errors.department =
      "Department must be at least 2 characters.";
  }

  if (
    formData.jobTitle &&
    formData.jobTitle.trim().length < 2
  ) {
    errors.jobTitle =
      "Job title must be at least 2 characters.";
  }

  if (
    formData.address &&
    formData.address.trim().length < 2
  ) {
    errors.address =
      "Address must be at least 2 characters.";
  }

  if (
    formData.city &&
    formData.city.trim().length < 2
  ) {
    errors.city =
      "City / town must be at least 2 characters.";
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const normalizedStatus =
    typeof status === "string"
      ? status.toLowerCase()
      : "";

  const current =
    STATUS[normalizedStatus] || {
      label: status || "Unknown",
      dot: "bg-stone-400",
      bg: "bg-stone-100",
      text: "text-stone-600",
    };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ${current.bg} ${current.text}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
      />

      {current.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Employee Avatar                                                            */
/* -------------------------------------------------------------------------- */

function EmployeeAvatar({
  name = "",
  image,
  size = "h-10 w-10",
}) {
  const safeName =
    typeof name === "string" ? name.trim() : "";

  const initials =
    safeName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase()
      )
      .join("") || "?";

  const tone =
    AVATAR_TONES[
      [...safeName].reduce(
        (sum, character) =>
          sum + character.charCodeAt(0),
        0
      ) % AVATAR_TONES.length
    ];

  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);

  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt={
          safeName
            ? `${safeName} profile`
            : "Employee profile"
        }
        loading="lazy"
        onError={() => setImageFailed(true)}
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full ${tone} text-sm font-bold shadow-sm`}
      aria-label={
        safeName
          ? `${safeName} initials`
          : "Employee avatar"
      }
    >
      {initials}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Banner                                                                     */
/* -------------------------------------------------------------------------- */

function Banner({
  tone,
  title,
  message,
  onDismiss,
}) {
  const styles =
    tone === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div
      className={`mb-5 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm ${styles}`}
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <p>
        <span className="font-bold">{title}.</span>{" "}
        {message}
      </p>

      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current/20"
        aria-label="Dismiss message"
      >
        <XIcon />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Form Field                                                                 */
/* -------------------------------------------------------------------------- */

function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span
            className="ml-1 text-rose-500"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p
          className="mt-1.5 text-xs font-medium text-rose-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Information Box                                                            */
/* -------------------------------------------------------------------------- */

function InfoBox({
  icon: iconElement,
  label,
  value,
  mono = false,
  breakWords = false,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
      <div className="flex items-center gap-2 text-slate-400">
        {iconElement}

        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>

      <div
        className={`mt-2 font-semibold text-slate-800 ${
          mono ? "font-mono text-xs" : ""
        } ${breakWords ? "break-all" : ""}`}
      >
        {value || "—"}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */

function Employee() {
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [viewingEmployee, setViewingEmployee] =
    useState(null);

  const [formData, setFormData] = useState(
    () => ({ ...EMPTY_FORM })
  );

  const [validationErrors, setValidationErrors] =
    useState({});

  const formRef = useRef(null);
  const viewCloseButtonRef = useRef(null);
  const formCloseButtonRef = useRef(null);

  /* ---------------------------------------------------------------------- */
  /* Load Employees                                                         */
  /* ---------------------------------------------------------------------- */

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getEmployees();

      const result = response?.data?.data;

      if (!Array.isArray(result)) {
        throw new Error(
          "The server returned an invalid employee list."
        );
      }

      setEmployees(result);
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      setError(
        err?.message ||
          "Failed to load employees. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  /* ---------------------------------------------------------------------- */
  /* Clear messages                                                         */
  /* ---------------------------------------------------------------------- */

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /* ---------------------------------------------------------------------- */
  /* Open Create Form                                                       */
  /* ---------------------------------------------------------------------- */

  const openCreateForm = () => {
    setEditingEmployee(null);
    setFormData({ ...EMPTY_FORM });
    setValidationErrors({});
    clearMessages();
    setShowForm(true);
  };

  /* ---------------------------------------------------------------------- */
  /* Open Edit Form                                                         */
  /* ---------------------------------------------------------------------- */

  const openEditForm = (employee) => {
    if (!employee?._id) {
      setError(
        "This employee cannot be edited because the employee ID is missing."
      );
      return;
    }

    setEditingEmployee(employee);

    setFormData({
      name: employee.name || "",
      email: employee.email || "",

      nationalId: employee.nationalId || "",
      dateOfBirth: getDateInputValue(
        employee.dateOfBirth
      ),
      gender: employee.gender || "",
      phone: employee.phone || "",

      employeeId: employee.employeeId || "",
      department: employee.department || "",
      jobTitle: employee.jobTitle || "",
      employmentType:
        employee.employmentType || "full-time",
      dateOfJoining: getDateInputValue(
        employee.dateOfJoining
      ),
      salary:
        employee.salary !== null &&
        employee.salary !== undefined
          ? String(employee.salary)
          : "",

      address: employee.address || "",
      city: employee.city || "",

      emergencyContactName:
        employee.emergencyContactName || "",
      emergencyContactPhone:
        employee.emergencyContactPhone || "",
      emergencyContactRelationship:
        employee.emergencyContactRelationship || "",
    });

    setValidationErrors({});
    clearMessages();
    setShowForm(true);
  };

  /* ---------------------------------------------------------------------- */
  /* View Employee                                                          */
  /* ---------------------------------------------------------------------- */

  const openViewEmployee = (employee) => {
    if (!employee?._id) {
      setError(
        "This employee record cannot be opened because the employee ID is missing."
      );
      return;
    }

    setViewingEmployee(employee);
    setShowView(true);
  };

  const closeViewEmployee = useCallback(() => {
    setShowView(false);
    setViewingEmployee(null);
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Close Form                                                             */
  /* ---------------------------------------------------------------------- */

  const closeForm = useCallback(() => {
    if (saving) return;

    setShowForm(false);
    setEditingEmployee(null);
    setFormData({ ...EMPTY_FORM });
    setValidationErrors({});
  }, [saving]);

  /* ---------------------------------------------------------------------- */
  /* Focus Management                                                       */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (showForm) {
      window.setTimeout(() => {
        formCloseButtonRef.current?.focus();
      }, 0);
    }
  }, [showForm]);

  useEffect(() => {
    if (showView) {
      window.setTimeout(() => {
        viewCloseButtonRef.current?.focus();
      }, 0);
    }
  }, [showView]);

  /* ---------------------------------------------------------------------- */
  /* Escape Key                                                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      if (showForm && !saving) {
        closeForm();
        return;
      }

      if (showView) {
        closeViewEmployee();
      }
    };

    if (showForm || showView) {
      window.addEventListener(
        "keydown",
        handleEscape
      );
    }

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    showForm,
    showView,
    saving,
    closeForm,
    closeViewEmployee,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Form Input                                                             */
  /* ---------------------------------------------------------------------- */

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationErrors((previous) => {
      if (!previous[name]) {
        return previous;
      }

      const next = { ...previous };
      delete next[name];

      return next;
    });

    if (error) {
      setError("");
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Submit                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setError("");
    setSuccess("");

    const errors = validateEmployeeForm(formData);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      const firstInvalidField =
        Object.keys(errors)[0];

      window.setTimeout(() => {
        const element = document.getElementById(
          `employee-${firstInvalidField}`
        );

        element?.focus();
      }, 0);

      setError(
        "Please correct the highlighted fields before saving."
      );

      return;
    }

    const payload = normalizeFormForPayload(formData);

    if (
      payload.salary !== null &&
      (!Number.isFinite(payload.salary) ||
        payload.salary < 0)
    ) {
      setValidationErrors({
        salary:
          "Salary must be a valid non-negative amount.",
      });

      setError(
        "Please enter a valid salary amount."
      );

      return;
    }

    setSaving(true);

    try {
      if (editingEmployee) {
        if (!editingEmployee._id) {
          throw new Error(
            "The employee ID is missing. The employee cannot be updated."
          );
        }

        await updateEmployee(
          editingEmployee._id,
          payload
        );

        setSuccess(
          "Employee details updated successfully."
        );
      } else {
        await createEmployee(payload);

        setSuccess(
          "Employee created successfully. An invitation email will be sent to the employee."
        );
      }

      setShowForm(false);
      setEditingEmployee(null);
      setFormData({ ...EMPTY_FORM });
      setValidationErrors({});

      await loadEmployees();
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      setError(
        err?.message ||
          "Unable to save employee. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Filtering                                                              */
  /* ---------------------------------------------------------------------- */

  const filteredEmployees = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const name =
        typeof employee.name === "string"
          ? employee.name.toLowerCase()
          : "";

      const email =
        typeof employee.email === "string"
          ? employee.email.toLowerCase()
          : "";

      const employeeId =
        typeof employee.employeeId === "string"
          ? employee.employeeId.toLowerCase()
          : "";

      const department =
        typeof employee.department === "string"
          ? employee.department.toLowerCase()
          : "";

      const jobTitle =
        typeof employee.jobTitle === "string"
          ? employee.jobTitle.toLowerCase()
          : "";

      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        email.includes(searchText) ||
        employeeId.includes(searchText) ||
        department.includes(searchText) ||
        jobTitle.includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        employee.status?.toLowerCase() ===
          statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  /* ---------------------------------------------------------------------- */
  /* Counts                                                                 */
  /* ---------------------------------------------------------------------- */

  const statusCounts = useMemo(() => {
    return employees.reduce(
      (counts, employee) => {
        const status =
          employee.status?.toLowerCase();

        if (status === "active") {
          counts.active += 1;
        }

        if (status === "invited") {
          counts.invited += 1;
        }

        if (status === "suspended") {
          counts.suspended += 1;
        }

        return counts;
      },
      {
        active: 0,
        invited: 0,
        suspended: 0,
      }
    );
  }, [employees]);

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  /* ---------------------------------------------------------------------- */
  /* Render                                                                 */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-full w-full min-w-0 bg-slate-50 text-slate-800">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
              Manage Employees
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              View and manage all employees in your
              organization.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadEmployees}
              disabled={loading}
              className={secondaryButton}
              title="Refresh employees"
              aria-label="Refresh employees"
            >
              <RefreshIcon
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className={primaryButton}
            >
              <PlusIcon />
              Add New Employee
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Notifications                                                    */}
        {/* ---------------------------------------------------------------- */}

        {error && !showForm && (
          <Banner
            tone="error"
            title="Something went wrong"
            message={error}
            onDismiss={() => setError("")}
          />
        )}

        {success && (
          <Banner
            tone="success"
            title="Success"
            message={success}
            onDismiss={() => setSuccess("")}
          />
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Main Card                                                        */}
        {/* ---------------------------------------------------------------- */}

        <section
          aria-label="Employee management"
          className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)]"
        >
          {/* -------------------------------------------------------------- */}
          {/* Filters                                                        */}
          {/* -------------------------------------------------------------- */}

          <div className="flex flex-col gap-4 border-b border-slate-100 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div className="relative w-full sm:max-w-sm">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, email, ID, department..."
                aria-label="Search employees"
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              aria-label="Filter employees by status"
              className={`${inputClass} sm:w-44`}
            >
              <option value="all">
                All employees
              </option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="pending">Pending</option>
              <option value="suspended">
                Suspended
              </option>
              <option value="deactivated">
                Deactivated
              </option>
            </select>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Stats                                                          */}
          {/* -------------------------------------------------------------- */}

          <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/60 sm:grid-cols-4">
            <button
              type="button"
              onClick={() =>
                setStatusFilter("all")
              }
              className={`border-r border-slate-100 px-5 py-4 text-left transition hover:bg-indigo-50/40 ${
                statusFilter === "all"
                  ? "border-b-2 border-b-indigo-600 bg-indigo-50/70"
                  : ""
              }`}
            >
              <p className="text-xs text-slate-500">
                All Employees
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {employees.length}
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setStatusFilter("active")
              }
              className={`border-r border-slate-100 px-5 py-4 text-left transition hover:bg-indigo-50/40 ${
                statusFilter === "active"
                  ? "border-b-2 border-b-indigo-600 bg-indigo-50/70"
                  : ""
              }`}
            >
              <p className="text-xs text-slate-500">
                Active
              </p>

              <p className="mt-1 text-xl font-bold text-emerald-600">
                {statusCounts.active}
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setStatusFilter("invited")
              }
              className={`border-r border-slate-100 px-5 py-4 text-left transition hover:bg-indigo-50/40 ${
                statusFilter === "invited"
                  ? "border-b-2 border-b-indigo-600 bg-indigo-50/70"
                  : ""
              }`}
            >
              <p className="text-xs text-slate-500">
                Invited
              </p>

              <p className="mt-1 text-xl font-bold text-sky-600">
                {statusCounts.invited}
              </p>
            </button>

            <button
              type="button"
              onClick={() =>
                setStatusFilter("suspended")
              }
              className={`px-5 py-4 text-left transition hover:bg-indigo-50/40 ${
                statusFilter === "suspended"
                  ? "border-b-2 border-b-indigo-600 bg-indigo-50/70"
                  : ""
              }`}
            >
              <p className="text-xs text-slate-500">
                Suspended
              </p>

              <p className="mt-1 text-xl font-bold text-rose-600">
                {statusCounts.suspended}
              </p>
            </button>
          </div>

          {/* -------------------------------------------------------------- */}
          {/* Table                                                          */}
          {/* -------------------------------------------------------------- */}

          {loading ? (
            <div
              className="flex min-h-[350px] items-center justify-center"
              aria-live="polite"
            >
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />

                <p className="mt-3 text-sm text-slate-500">
                  Loading employees...
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <caption className="sr-only">
                  Employee list
                </caption>

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80 text-left">
                    <th
                      scope="col"
                      className="w-16 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      S No
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Image
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Name
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Employee ID
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Department
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Email
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-500"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map(
                    (employee, index) => (
                      <tr
                        key={
                          employee._id ||
                          `${employee.email}-${index}`
                        }
                        className="border-b border-slate-100 transition-colors hover:bg-indigo-50/30"
                      >
                        <td className="px-4 py-4 text-sm text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-4">
                          <EmployeeAvatar
                            name={employee.name}
                            image={employee.profileImage}
                            size="h-9 w-9"
                          />
                        </td>

                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {employee.name ||
                                "Unnamed employee"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {employee.jobTitle ||
                                "Employee"}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-mono text-xs text-slate-600">
                            {employee.employeeId || "—"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm text-slate-600">
                            {employee.department || "—"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="max-w-[240px] truncate text-sm text-slate-600">
                            {employee.email || "—"}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge
                            status={employee.status}
                          />
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openViewEmployee(
                                  employee
                                )
                              }
                              className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-4 focus:ring-slate-300/40"
                              aria-label={`View ${
                                employee.name ||
                                "employee"
                              }`}
                            >
                              <EyeIcon className="mr-1.5 h-3.5 w-3.5" />
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEditForm(employee)
                              }
                              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                              aria-label={`Edit ${
                                employee.name ||
                                "employee"
                              }`}
                            >
                              <EditIcon className="mr-1.5 h-3.5 w-3.5" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}

                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-16 text-center"
                      >
                        <div className="mx-auto max-w-sm">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <UserIcon className="h-6 w-6 text-slate-400" />
                          </div>

                          <h3 className="mt-4 font-semibold text-slate-800">
                            {hasFilters
                              ? "No employees found"
                              : "No employees yet"}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {hasFilters
                              ? "Try changing your search or filter."
                              : "Add your first employee to get started."}
                          </p>

                          <button
                            type="button"
                            onClick={
                              hasFilters
                                ? clearFilters
                                : openCreateForm
                            }
                            className={`${primaryButton} mt-5`}
                          >
                            {hasFilters
                              ? "Clear filters"
                              : "Add New Employee"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* -------------------------------------------------------------- */}
          {/* Footer                                                         */}
          {/* -------------------------------------------------------------- */}

          {!loading && (
            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredEmployees.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {employees.length}
                </span>{" "}
                employees
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="font-semibold text-indigo-700 hover:text-indigo-800 focus:outline-none focus:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </section>
      </div>

      {/* ================================================================== */}
      {/* VIEW EMPLOYEE MODAL                                                */}
      {/* ================================================================== */}

      {showView && viewingEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeViewEmployee();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-view-title"
            aria-describedby="employee-view-description"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2
                  id="employee-view-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Employee Details
                </h2>

                <p
                  id="employee-view-description"
                  className="text-sm text-slate-500"
                >
                  View complete employee information
                </p>
              </div>

              <button
                ref={viewCloseButtonRef}
                type="button"
                onClick={closeViewEmployee}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300/50"
                aria-label="Close employee details"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-slate-200 bg-slate-50 px-6 py-6">
              <div className="flex items-center gap-4">
                <EmployeeAvatar
                  name={viewingEmployee.name}
                  image={viewingEmployee.profileImage}
                  size="h-20 w-20"
                />

                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-slate-900">
                    {viewingEmployee.name ||
                      "Unnamed employee"}
                  </h3>

                  <p className="mt-2 break-all text-sm leading-6 text-slate-500">
                    {viewingEmployee.email || "—"}
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={viewingEmployee.status}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              {/* Personal Information */}

              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-indigo-700">
                  Personal Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox
                    icon={<UserIcon />}
                    label="Full Name"
                    value={viewingEmployee.name}
                  />

                  <InfoBox
                    icon={<ShieldIcon />}
                    label="National ID"
                    value={viewingEmployee.nationalId}
                  />

                  <InfoBox
                    icon={<CalendarIcon />}
                    label="Date of Birth"
                    value={formatDate(
                      viewingEmployee.dateOfBirth
                    )}
                  />

                  <InfoBox
                    icon={<UserIcon />}
                    label="Gender"
                    value={
                      viewingEmployee.gender
                        ? capitalize(
                            viewingEmployee.gender
                          )
                        : "—"
                    }
                  />

                  <InfoBox
                    icon={<MailIcon />}
                    label="Email"
                    value={viewingEmployee.email}
                    breakWords
                  />

                  <InfoBox
                    icon={<UserIcon />}
                    label="Phone"
                    value={viewingEmployee.phone}
                  />
                </div>
              </section>

              {/* Employment Information */}

              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-indigo-700">
                  Employment Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox
                    icon={<BriefcaseIcon />}
                    label="Employee ID"
                    value={viewingEmployee.employeeId}
                    mono
                  />

                  <InfoBox
                    icon={<BriefcaseIcon />}
                    label="Department"
                    value={viewingEmployee.department}
                  />

                  <InfoBox
                    icon={<BriefcaseIcon />}
                    label="Job Title"
                    value={viewingEmployee.jobTitle}
                  />

                  <InfoBox
                    icon={<BriefcaseIcon />}
                    label="Employment Type"
                    value={formatEmploymentType(
                      viewingEmployee.employmentType
                    )}
                  />

                  <InfoBox
                    icon={<CalendarIcon />}
                    label="Date of Joining"
                    value={formatDate(
                      viewingEmployee.dateOfJoining
                    )}
                  />

                  <InfoBox
                    icon={<BriefcaseIcon />}
                    label="Salary"
                    value={formatSalary(
                      viewingEmployee.salary
                    )}
                  />

                  <InfoBox
                    icon={<ShieldIcon />}
                    label="Role"
                    value={
                      viewingEmployee.role
                        ? capitalize(
                            viewingEmployee.role
                          )
                        : "Employee"
                    }
                  />

                  <InfoBox
                    icon={<ShieldIcon />}
                    label="Account Status"
                    value={
                      <StatusBadge
                        status={viewingEmployee.status}
                      />
                    }
                  />
                </div>
              </section>

              {/* Contact Information */}

              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-indigo-700">
                  Contact Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox
                    icon={<UserIcon />}
                    label="Address"
                    value={viewingEmployee.address}
                  />

                  <InfoBox
                    icon={<UserIcon />}
                    label="City / Town"
                    value={viewingEmployee.city}
                  />

                  <InfoBox
                    icon={<UserIcon />}
                    label="Emergency Contact"
                    value={
                      viewingEmployee.emergencyContactName
                    }
                  />

                  <InfoBox
                    icon={<UserIcon />}
                    label="Emergency Phone"
                    value={
                      viewingEmployee.emergencyContactPhone
                    }
                  />

                  <InfoBox
                    icon={<UserIcon />}
                    label="Relationship"
                    value={
                      viewingEmployee.emergencyContactRelationship
                    }
                  />
                </div>
              </section>

              {/* Account Information */}

              <section>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-indigo-700">
                  Account Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox
                    icon={<CalendarIcon />}
                    label="Account Created"
                    value={formatDate(
                      viewingEmployee.createdAt
                    )}
                  />

                  <InfoBox
                    icon={<CalendarIcon />}
                    label="Last Updated"
                    value={formatDate(
                      viewingEmployee.updatedAt
                    )}
                  />

                  <InfoBox
                    icon={<UserIcon />}
                    label="Database ID"
                    value={viewingEmployee._id}
                    mono
                    breakWords
                  />
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeViewEmployee}
                className={secondaryButton}
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  closeViewEmployee();
                  openEditForm(viewingEmployee);
                }}
                className={primaryButton}
              >
                <EditIcon />
                Edit Employee
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ================================================================== */}
      {/* CREATE / EDIT MODAL                                                */}
      {/* ================================================================== */}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              closeForm();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-form-title"
            aria-describedby="employee-form-description"
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <h2
                  id="employee-form-title"
                  className="text-xl font-bold text-slate-900"
                >
                  {editingEmployee
                    ? "Edit Employee"
                    : "Add New Employee"}
                </h2>

                <p
                  id="employee-form-description"
                  className="mt-2 text-sm leading-6 text-slate-500"
                >
                  {editingEmployee
                    ? "Update employee information."
                    : "Create an employee account and send an invitation."}
                </p>
              </div>

              <button
                ref={formCloseButtonRef}
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300/50 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close employee form"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="space-y-8 px-6 py-6">
                {/* Form Error */}

                {error && (
                  <div
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
                    role="alert"
                  >
                    <p className="font-semibold">
                      Unable to save employee
                    </p>

                    <p className="mt-1">{error}</p>
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* Personal Information                                    */}
                {/* -------------------------------------------------------- */}

                <section>
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Personal Information
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Basic information about the employee.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Full Name"
                      htmlFor="employee-name"
                      required
                      error={validationErrors.name}
                    >
                      <input
                        id="employee-name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        minLength={2}
                        maxLength={100}
                        placeholder="e.g. John Kamau"
                        autoComplete="name"
                        autoFocus
                        disabled={saving}
                        aria-invalid={
                          Boolean(
                            validationErrors.name
                          )
                        }
                        className={`${inputClass} ${
                          validationErrors.name
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="National ID Number"
                      htmlFor="employee-nationalId"
                      required
                      error={
                        validationErrors.nationalId
                      }
                    >
                      <input
                        id="employee-nationalId"
                        name="nationalId"
                        type="text"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        maxLength={30}
                        placeholder="e.g. 12345678"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.nationalId
                        )}
                        className={`${inputClass} ${
                          validationErrors.nationalId
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Date of Birth"
                      htmlFor="employee-dateOfBirth"
                      required
                      error={
                        validationErrors.dateOfBirth
                      }
                    >
                      <input
                        id="employee-dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.dateOfBirth
                        )}
                        className={`${inputClass} ${
                          validationErrors.dateOfBirth
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Gender"
                      htmlFor="employee-gender"
                      required
                      error={validationErrors.gender}
                    >
                      <select
                        id="employee-gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.gender
                        )}
                        className={`${inputClass} ${
                          validationErrors.gender
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      >
                        <option value="">
                          Select gender
                        </option>

                        <option value="male">
                          Male
                        </option>

                        <option value="female">
                          Female
                        </option>

                        <option value="other">
                          Other
                        </option>
                      </select>
                    </FormField>

                    <FormField
                      label="Phone Number"
                      htmlFor="employee-phone"
                      required
                      error={validationErrors.phone}
                    >
                      <input
                        id="employee-phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        maxLength={20}
                        placeholder="e.g. 0712345678"
                        autoComplete="tel"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.phone
                        )}
                        className={`${inputClass} ${
                          validationErrors.phone
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Email Address"
                      htmlFor="employee-email"
                      required
                      error={validationErrors.email}
                    >
                      <input
                        id="employee-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        maxLength={254}
                        placeholder="employee@company.com"
                        autoComplete="email"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.email
                        )}
                        className={`${inputClass} ${
                          validationErrors.email
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>
                  </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* Employment Information                                  */}
                {/* -------------------------------------------------------- */}

                <section>
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Employment Information
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Information about the employee's
                      position and employment.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Employee ID"
                      htmlFor="employee-employeeId"
                      required
                      error={
                        validationErrors.employeeId
                      }
                    >
                      <input
                        id="employee-employeeId"
                        name="employeeId"
                        type="text"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        maxLength={50}
                        placeholder="e.g. EMP-001"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.employeeId
                        )}
                        className={`${inputClass} ${
                          validationErrors.employeeId
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Department"
                      htmlFor="employee-department"
                      required
                      error={
                        validationErrors.department
                      }
                    >
                      <select
                        id="employee-department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.department
                        )}
                        className={`${inputClass} ${
                          validationErrors.department
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      >
                        <option value="">Choose a department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                        <option value="Other">Other</option>
                      </select>
                    </FormField>

                    <FormField
                      label="Job Title / Position"
                      htmlFor="employee-jobTitle"
                      required
                      error={validationErrors.jobTitle}
                    >
                      <input
                        id="employee-jobTitle"
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        maxLength={100}
                        placeholder="e.g. Software Developer"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.jobTitle
                        )}
                        className={`${inputClass} ${
                          validationErrors.jobTitle
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Employment Type"
                      htmlFor="employee-employmentType"
                      required
                      error={
                        validationErrors.employmentType
                      }
                    >
                      <select
                        id="employee-employmentType"
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleInputChange}
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.employmentType
                        )}
                        className={`${inputClass} ${
                          validationErrors.employmentType
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      >
                        <option value="full-time">
                          Full-time
                        </option>

                        <option value="part-time">
                          Part-time
                        </option>

                        <option value="contract">
                          Contract
                        </option>

                        <option value="intern">
                          Intern
                        </option>
                      </select>
                    </FormField>

                    <FormField
                      label="Date of Joining"
                      htmlFor="employee-dateOfJoining"
                      required
                      error={
                        validationErrors.dateOfJoining
                      }
                    >
                      <input
                        id="employee-dateOfJoining"
                        name="dateOfJoining"
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={handleInputChange}
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.dateOfJoining
                        )}
                        className={`${inputClass} ${
                          validationErrors.dateOfJoining
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Salary"
                      htmlFor="employee-salary"
                      required
                      error={validationErrors.salary}
                    >
                      <input
                        id="employee-salary"
                        name="salary"
                        type="number"
                        value={formData.salary}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        placeholder="e.g. 50000"
                        inputMode="decimal"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.salary
                        )}
                        className={`${inputClass} ${
                          validationErrors.salary
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>
                  </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* Contact Information                                     */}
                {/* -------------------------------------------------------- */}

                <section>
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Contact Information
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Address and emergency contact details.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Address"
                      htmlFor="employee-address"
                      required
                      error={validationErrors.address}
                    >
                      <input
                        id="employee-address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        maxLength={255}
                        placeholder="e.g. P.O. Box 123"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.address
                        )}
                        className={`${inputClass} ${
                          validationErrors.address
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="City / Town"
                      htmlFor="employee-city"
                      required
                      error={validationErrors.city}
                    >
                      <input
                        id="employee-city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleInputChange}
                        maxLength={100}
                        placeholder="e.g. Nairobi"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.city
                        )}
                        className={`${inputClass} ${
                          validationErrors.city
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Emergency Contact Name"
                      htmlFor="employee-emergencyContactName"
                      required
                      error={
                        validationErrors.emergencyContactName
                      }
                    >
                      <input
                        id="employee-emergencyContactName"
                        name="emergencyContactName"
                        type="text"
                        value={
                          formData.emergencyContactName
                        }
                        onChange={handleInputChange}
                        maxLength={100}
                        placeholder="e.g. Jane Kamau"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.emergencyContactName
                        )}
                        className={`${inputClass} ${
                          validationErrors.emergencyContactName
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Emergency Contact Phone"
                      htmlFor="employee-emergencyContactPhone"
                      required
                      error={
                        validationErrors.emergencyContactPhone
                      }
                    >
                      <input
                        id="employee-emergencyContactPhone"
                        name="emergencyContactPhone"
                        type="tel"
                        value={
                          formData.emergencyContactPhone
                        }
                        onChange={handleInputChange}
                        maxLength={20}
                        placeholder="e.g. 0798765432"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.emergencyContactPhone
                        )}
                        className={`${inputClass} ${
                          validationErrors.emergencyContactPhone
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>

                    <FormField
                      label="Relationship"
                      htmlFor="employee-emergencyContactRelationship"
                      required
                      error={
                        validationErrors.emergencyContactRelationship
                      }
                    >
                      <input
                        id="employee-emergencyContactRelationship"
                        name="emergencyContactRelationship"
                        type="text"
                        value={
                          formData.emergencyContactRelationship
                        }
                        onChange={handleInputChange}
                        maxLength={50}
                        placeholder="e.g. Sister"
                        disabled={saving}
                        aria-invalid={Boolean(
                          validationErrors.emergencyContactRelationship
                        )}
                        className={`${inputClass} ${
                          validationErrors.emergencyContactRelationship
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : ""
                        }`}
                      />
                    </FormField>
                  </div>
                </section>

                {/* -------------------------------------------------------- */}
                {/* Invitation Notice                                       */}
                {/* -------------------------------------------------------- */}

                {!editingEmployee && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                    <div className="flex gap-3">
                      <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

                      <div>
                        <p className="text-sm font-semibold text-indigo-900">
                          Invitation email
                        </p>

                        <p className="mt-1 text-sm leading-5 text-indigo-800">
                          The employee will receive an
                          invitation email and create their
                          password from the invitation link.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Form Actions                                               */}
              {/* ---------------------------------------------------------- */}

              <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className={secondaryButton}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={primaryButton}
                >
                  {saving && (
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      aria-hidden="true"
                    />
                  )}

                  {saving
                    ? "Saving..."
                    : editingEmployee
                    ? "Save Changes"
                    : "Create Employee"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Employee;