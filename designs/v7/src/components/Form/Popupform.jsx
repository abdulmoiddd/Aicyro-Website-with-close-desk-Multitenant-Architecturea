import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, CircleCheck, X } from "lucide-react";
// Submissions go through /api/founding-application (Closedesk engine); the
// database rules no longer allow direct client writes to founding_applications.
import {
  submitFoundingApplication,
  submitFoundingSegmentation,
} from "@/lib/foundingApplicationClient";

export default function Popupform({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);

  // 1. Step & State Management
  const [step, setStep] = useState(1); // 1: Main form, 2: Segmentation, 3: Final Success
  const [formData, setFormData] = useState({
    name: "",
    business: "",
    website: "",
    phone: "",
    email: "",
    industry: "",
  });
  const [segmentationAnswer, setSegmentationAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store the Firebase reference generated in Step 1 to update it in Step 2
  const [dbRef, setDbRef] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset state when opened
      setStep(1);
      setErrors({});
      setSubmitError("");
      setSegmentationAnswer("");
      setDbRef(null);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    // Clear error for field when user starts typing
    if (errors[e.target.id]) {
      setErrors((prev) => ({ ...prev, [e.target.id]: false }));
    }
    setSubmitError("");
  };

  // Auto-prefix https:// on blur
  const handleWebsiteBlur = (e) => {
    let val = e.target.value.trim();
    if (val && !/^https?:\/\//i.test(val)) {
      val = "https://" + val;
      setFormData((prev) => ({ ...prev, website: val }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.business.trim()) newErrors.business = true;
    if (!formData.website.trim()) newErrors.website = true;
    if (!formData.phone.trim()) newErrors.phone = true;
    if (!formData.industry) newErrors.industry = true;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 2. Main Form Submit (Saves to Firebase)
  const handleMainSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const reference = await submitFoundingApplication(formData, "desktop_modal");

      // Save the server reference to append segmentation in the next step
      setDbRef(reference);
      setStep(2);
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmitError("Something went wrong. Email us at info@aicyro.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Segmentation Submit (Updates the existing Firebase record)
  const handleSegmentationSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      if (dbRef) {
        await submitFoundingSegmentation(dbRef, segmentationAnswer);
      }

      setStep(3);
      setTimeout(() => {
        onClose();
        setFormData({
          name: "",
          business: "",
          website: "",
          phone: "",
          email: "",
          industry: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Segmentation submission failed:", error);
      setSubmitError("Something went wrong. Email us at info@aicyro.com");
    } finally {
      setIsSubmitting(false);
    }
  };

  // The kit's field classes; the error state rides on aria-invalid, and its message sits
  // right under the field (shown only when the unchanged validation flags it)
  const inputClass = (fieldId) => (fieldId === "industry" ? "ax-select" : "ax-input");
  const errorText = {
    name: "Please enter your name.",
    business: "Please enter your business name.",
    website: "Please enter your website URL.",
    phone: "Please enter your phone number.",
    email: "Please enter a valid email address.",
    industry: "Please select your industry.",
  };
  const fieldError = (fieldId) => (
    <span id={`${fieldId}-err`} className="ax-help ax-help--error">
      {errors[fieldId] ? errorText[fieldId] : ""}
    </span>
  );
  const describedBy = (fieldId) => (errors[fieldId] ? `${fieldId}-err` : undefined);

  // Dialog accessibility: Escape closes, Tab stays inside, focus moves in on open (and to
  // each step's first field) and returns to the opener on close. Presentation only.
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const opener = document.activeElement;
    const onKey = (e) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (e.key === "Escape") {
        e.preventDefault();
        if (onCloseRef.current) onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = Array.from(
        dialog.querySelectorAll(
          "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
        ),
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = dialog.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (opener && typeof opener.focus === "function" && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    // Wait for the dialog to become visible (its visibility flips with the open state)
    const id = setTimeout(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const target = dialog.querySelector("form input, form select, form textarea") || dialog;
      target.focus({ preventScroll: true });
    }, 80);
    return () => clearTimeout(id);
  }, [isOpen, step]);

  if (!mounted) return null;

  // Obsidian redesign: one glass dialog on a blurred scrim, the program as a framed list,
  // one filled primary per step. Steps, fields, validation and the submit calls are unchanged.
  return (
    <div
      className="rs-scrim rs-modal"
      data-open={isOpen ? "true" : "false"}
      aria-hidden={!isOpen}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        className="rs-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="founding-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="ax-icon-btn rs-dialog__close"
          aria-label="Close modal"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {step === 1 && (
          <>
            <div className="rs-dialog__head">
              <p className="ob-eyebrow">CloseDesk</p>
              <h2 id="founding-title" className="rs-dialog__title">
                Claim a Founding 25 Spot
              </h2>
              <p className="ax-meta">
                We’re opening CloseDesk to the first 25 field-service
                businesses. Done-for-you setup, founder pricing, 60-day
                optimization.
              </p>
            </div>

            <div className="rs-dialog__program">
              <h3 id="founding-program" className="ax-label">
                Founding 25 Launch Program
              </h3>
              <ul className="rs-bullets" aria-labelledby="founding-program">
                {[
                  "Done-for-you setup",
                  "Custom service-specific AI flow",
                  "Lead capture + qualification",
                  "Booking/request flow",
                  "Pulse dashboard access",
                  "60-day optimization",
                ].map((bullet, i) => (
                  <li key={i}>
                    <Check size={16} aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <form className="grid gap-4" onSubmit={handleMainSubmit} noValidate>
              <div className="rs-fields">
                <div className="ax-field">
                  <label htmlFor="name" className="ax-label">Name</label>
                  <input
                    type="text"
                    id="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={describedBy("name")}
                    className={inputClass("name")}
                  />
                  {fieldError("name")}
                </div>
                <div className="ax-field">
                  <label htmlFor="business" className="ax-label">Business Name</label>
                  <input
                    type="text"
                    id="business"
                    autoComplete="organization"
                    value={formData.business}
                    onChange={handleChange}
                    aria-invalid={errors.business ? true : undefined}
                    aria-describedby={describedBy("business")}
                    className={inputClass("business")}
                  />
                  {fieldError("business")}
                </div>

                <div className="ax-field rs-span">
                  <label htmlFor="website" className="ax-label">Website URL</label>
                  <input
                    type="url"
                    id="website"
                    autoComplete="url"
                    inputMode="url"
                    value={formData.website}
                    onChange={handleChange}
                    onBlur={handleWebsiteBlur}
                    aria-invalid={errors.website ? true : undefined}
                    aria-describedby={describedBy("website")}
                    className={inputClass("website")}
                  />
                  {fieldError("website")}
                </div>

                <div className="ax-field">
                  <label htmlFor="phone" className="ax-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    aria-invalid={errors.phone ? true : undefined}
                    aria-describedby={describedBy("phone")}
                    className={inputClass("phone")}
                  />
                  {fieldError("phone")}
                </div>
                <div className="ax-field">
                  <label htmlFor="email" className="ax-label">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    inputMode="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={describedBy("email")}
                    className={inputClass("email")}
                  />
                  {fieldError("email")}
                </div>

                <div className="ax-field rs-span">
                  <label htmlFor="industry" className="ax-label">Industry</label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    aria-invalid={errors.industry ? true : undefined}
                    aria-describedby={describedBy("industry")}
                    className={inputClass("industry")}
                  >
                    <option value="" disabled>
                      Select your industry…
                    </option>
                    <option value="hvac">HVAC</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="restoration">Restoration</option>
                    <option value="roofing">Roofing</option>
                    <option value="pest-control">Pest Control</option>
                    <option value="electrical">Electrical</option>
                    <option value="other">Other</option>
                  </select>
                  {fieldError("industry")}
                </div>
              </div>

              <p className="ax-help ax-help--error rs-error" role="alert">
                {submitError}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="ax-btn ax-btn--block"
              >
                {isSubmitting
                  ? "Submitting Request…"
                  : "Claim a Founding 25 Spot"}
                {!isSubmitting && <ArrowRight size={18} aria-hidden="true" />}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <form onSubmit={handleSegmentationSubmit} className="grid gap-5">
            <div className="rs-dialog__head">
              <h2 id="founding-title" className="rs-dialog__title">
                Almost done!
              </h2>
            </div>
            <div className="ax-field">
              <label htmlFor="founding-more" className="ax-label">
                What do you want more of from your business?
              </label>
              <textarea
                id="founding-more"
                required
                rows={4}
                value={segmentationAnswer}
                onChange={(e) => {
                  setSegmentationAnswer(e.target.value);
                  setSubmitError("");
                }}
                placeholder="E.g., More qualified leads, saving time on callbacks…"
                className="ax-textarea"
              />
            </div>

            <p className="ax-help ax-help--error rs-error" role="alert">
              {submitError}
            </p>

            <button
              type="submit"
              disabled={isSubmitting || !segmentationAnswer.trim()}
              aria-busy={isSubmitting}
              className="ax-btn ax-btn--block"
            >
              {isSubmitting ? "Submitting…" : "Complete Application"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="rs-done rs-done--center" role="status">
            <span className="rs-badge" aria-hidden="true">
              <CircleCheck size={32} strokeWidth={1.5} />
            </span>
            <h2 id="founding-title" className="rs-dialog__title">
              Application Received
            </h2>
            <p className="ax-meta">
              We will be in touch shortly to discuss your setup.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
