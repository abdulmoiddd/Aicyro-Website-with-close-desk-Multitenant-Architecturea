"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  Download,
  FileCheck2,
  Info,
  ScanSearch,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

const TOTAL_STEPS = 16;
const CALENDLY_URL = "#";
const SITE_URL = "https://aicyro.pro/";

export default function FreeWebsiteAudit() {
  const [cur, setCur] = useState(1);
  const [ans, setAns] = useState({});
  const [ansLabel, setAnsLabel] = useState({});
  const [errors, setErrors] = useState({});

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeText, setAnalyzeText] = useState("Mapping your lead flow…");
  const [isFinished, setIsFinished] = useState(false);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [cur, isAnalyzing, isFinished]);

  // Handle choice selections
  const handleOptClick = (stepName, value, label, isMulti, isAuto) => {
    setErrors((prev) => ({ ...prev, [stepName]: false }));

    if (isMulti) {
      setAns((prev) => {
        const currentVals = prev[stepName] || [];
        const isSelected = currentVals.includes(value);
        return {
          ...prev,
          [stepName]: isSelected
            ? currentVals.filter((v) => v !== value)
            : [...currentVals, value],
        };
      });
      setAnsLabel((prev) => {
        const currentLabels = prev[stepName] || [];
        const isSelected = currentLabels.includes(label);
        return {
          ...prev,
          [stepName]: isSelected
            ? currentLabels.filter((l) => l !== label)
            : [...currentLabels, label],
        };
      });
    } else {
      setAns((prev) => ({ ...prev, [stepName]: value }));
      setAnsLabel((prev) => ({ ...prev, [stepName]: label }));
      if (isAuto) {
        setTimeout(() => nextStep(stepName), 380);
      }
    }
  };

  const handleInputChange = (e, fieldId) => {
    setAns((prev) => ({ ...prev, [fieldId]: e.target.value }));
    setErrors((prev) => ({ ...prev, [fieldId]: false }));
  };

  const handleBlur = (e, fieldId) => {
    let value = e.target.value.trim();
    if (fieldId === "bSite" && value.length > 0) {
      if (!/^https?:\/\//i.test(value)) {
        value = "https://" + value;
        setAns((prev) => ({ ...prev, [fieldId]: value }));
      }
    }
  };

  const validate = () => {
    let ok = true;
    const newErrors = {};

    const checkField = (id, type = "text") => {
      const v = (ans[id] || "").trim();
      let isValid = v.length > 0;

      if (isValid && type === "email") {
        isValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      }
      if (isValid && type === "phone") {
        const digitCount = v.replace(/\D/g, "").length;
        isValid =
          digitCount >= 7 && digitCount <= 15 && /^[\d\s()+-]+$/.test(v);
      }
      if (isValid && type === "url") {
        isValid = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i.test(v);
      }

      if (!isValid) {
        newErrors[id] = true;
        ok = false;
      }
    };

    if (cur === 1 && !ans.industry) {
      ok = false;
      newErrors.industry = true;
    }
    if (cur === 2 && (!ans.channels || ans.channels.length === 0)) {
      ok = false;
      newErrors.channels = true;
    }
    if (cur === 3 && !ans.mainAction) {
      ok = false;
      newErrors.mainAction = true;
    }
    if (cur === 4 && !ans.marketing) {
      ok = false;
      newErrors.marketing = true;
    }
    if (cur === 5 && !ans.biggestIssue) {
      ok = false;
      newErrors.biggestIssue = true;
    }
    if (cur === 6 && !ans.instantResponse) {
      ok = false;
      newErrors.instantResponse = true;
    }
    if (cur === 7 && !ans.urgentFrequency) {
      ok = false;
      newErrors.urgentFrequency = true;
    }
    if (cur === 8 && !ans.ahHandling) {
      ok = false;
      newErrors.ahHandling = true;
    }
    if (cur === 9 && !ans.ahMissing) {
      ok = false;
      newErrors.ahMissing = true;
    }
    if (cur === 10 && !ans.canBook) {
      ok = false;
      newErrors.canBook = true;
    }
    if (cur === 11 && (!ans.wants || ans.wants.length === 0)) {
      ok = false;
      newErrors.wants = true;
    }
    if (cur === 12 && (!ans.leadsGo || ans.leadsGo.length === 0)) {
      ok = false;
      newErrors.leadsGo = true;
    }
    if (cur === 13 && !ans.crm) {
      ok = false;
      newErrors.crm = true;
    }
    if (cur === 14 && !ans.improve) {
      ok = false;
      newErrors.improve = true;
    }
    if (cur === 15 && !ans.timeline) {
      ok = false;
      newErrors.timeline = true;
    }
    if (cur === 16) {
      checkField("bName", "text");
      checkField("bSite", "url");
      checkField("bCity", "text");
      checkField("bTeam", "text");
      checkField("cName", "text");
      checkField("cRole", "text");
      checkField("cEmail", "email");
      checkField("cPhone", "phone");
    }

    setErrors(newErrors);
    return ok;
  };

  const nextStep = (triggerSource = null) => {
    if (!validate() && !triggerSource) return;
    if (cur < TOTAL_STEPS) {
      setCur(cur + 1);
    } else {
      processAudit();
    }
  };

  const prevStep = () => {
    if (cur > 1) setCur(cur - 1);
  };

  const getContext = () => {
    const tradeCtx = {
      Restoration:
        "Water-damage leads are the most time-sensitive in the trades. This audit was built for exactly that.",
      HVAC: "No-cool and no-heat visitors don't wait. Let's see if your site keeps up with them.",
      Plumbing:
        "Burst pipes don't book appointments for Tuesday. Let's check your emergency path.",
      Roofing:
        "Storm-damage visitors are searching while the tarp is still on. Speed decides who they hire.",
      "Pest Control":
        "Pest panic converts fast, when the site lets it. Let's check yours.",
      Electrical:
        "Sparking-outlet visitors call whoever responds first. Let's see if that's you.",
      "Garage Door":
        "A stuck door at 7 AM is an instant buyer. Let's see who they reach.",
      "Appliance Repair":
        "A dead fridge is a same-day decision. Let's check your capture path.",
      Other: "Field-service urgency is field-service urgency. Let's map yours.",
    };

    if (cur === 2 && ans.industry)
      return { text: tradeCtx[ans.industry] || tradeCtx.Other, type: "normal" };
    if (cur === 5 && ans.marketing === "yes")
      return {
        text: "So every visitor costs you money, which makes every unanswered one expensive. Noted.",
        type: "normal",
      };
    if (cur === 5 && ans.marketing === "somewhat")
      return {
        text: "Seasonal spend, same math: paid visitors who leave unanswered are paid losses.",
        type: "normal",
      };
    if (cur === 6 && ans.biggestIssue)
      return {
        text: `“${ansLabel.biggestIssue || ""}”: got it. That goes in your report, and the next answers trace its cause.`,
        type: "normal",
      };
    if (cur === 8 && ans.urgentFrequency === "often")
      return {
        text: "Urgent all the time: then response speed isn't a metric for you, it's the whole business.",
        type: "amber",
      };
    if (cur === 9 && ["voicemail", "nextday", "form"].includes(ans.ahHandling))
      return {
        text: "That 9:30 PM homeowner just opened a competitor's tab. This is the leak we audit hardest.",
        type: "amber",
      };
    if (cur === 9 && ans.ahHandling === "notsure")
      return {
        text: "Not knowing is the most common answer we get, and usually the most expensive one.",
        type: "amber",
      };
    if (cur === 10 && ["yes", "maybe"].includes(ans.ahMissing))
      return {
        text: "You already suspect it. Your report will show exactly where after-hours capture fits.",
        type: "amber",
      };
    if (cur === 11 && ["no", "notsure"].includes(ans.canBook))
      return {
        text: "No direct path from visitor to booked job: that's booking friction, and it's fixable.",
        type: "normal",
      };
    if (cur === 12 && ans.wants?.length && ans.wants[0] !== "Not sure yet")
      return {
        text: "Good. Your report will scope CloseDesk to create exactly those.",
        type: "normal",
      };
    if (cur === 14 && ans.crm && !["No CRM yet", "Other"].includes(ans.crm))
      return {
        text: `${ans.crm}: noted. Leads would flow alongside it, not around it.`,
        type: "normal",
      };
    if (cur === 15 && ans.improve)
      return {
        text: `“${ansLabel.improve}”: that becomes the headline goal of your audit.`,
        type: "normal",
      };
    if (cur === 16 && ans.timeline === "asap")
      return {
        text: "ASAP noted. Your report generates instantly, and the review call can happen this week.",
        type: "amber",
      };

    return null;
  };

  const activeContext = getContext();

  const processAudit = async () => {
    setIsAnalyzing(true);
    const lines = [
      "Saving responses…",
      "Analyzing lead flow with AI…",
      "Identifying leaks…",
      "Generating custom report…",
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % lines.length;
      setAnalyzeText(lines[step]);
    }, 1500);

    try {
      const response = await fetch("/api/generate-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: ans, labels: ansLabel }),
      });

      const data = await response.json();

      if (data.success) {
        setResultData({
          ...data.aiReport,
          name: ans.cName,
          business: ans.bName,
          website: (ans.bSite || "").replace(/^https?:\/\//, ""),
          industry: ans.industry || "Field Service",
        });
      } else {
        alert("There was an issue generating your report. Please try again.");
      }
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
      setIsFinished(true);
    }
  };

  // --- PREMIUM VISUAL FLOW PDF GENERATOR ---
  const generatePDF = () => {
    if (!resultData) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const W = 612,
      H = 792,
      M = 48;
    let y = 0;

    // AICYRO Brand Colors
    const PRIMARY = [138, 43, 226]; // #8a2be2
    const SECONDARY = [123, 113, 219]; // #7b71db
    const DARK_SLATE = [28, 28, 35]; // Premium Dark Background
    const TEXT_MAIN = [50, 50, 55];
    const TEXT_MUTED = [120, 120, 130];
    const ALERT_RED = [230, 80, 80];
    const SUCCESS_GREEN = [46, 204, 113];

    // Page Break Helper
    const checkPageBreak = (needed) => {
      if (y + needed > H - 60) {
        doc.addPage();
        y = 60;

        // Background line continuation on new page
        doc.setDrawColor(220, 220, 230);
        doc.setLineWidth(2);
        doc.setLineDashPattern([5, 5], 0);
        doc.line(W / 2, 0, W / 2, H);
        doc.setLineDashPattern([], 0);
      }
    };

    // --- Dynamic Geometric Industry Icons using jsPDF primitives ---
    const drawIndustryIcon = (doc, industry, x, y, size) => {
      const cx = x + size / 2;
      const cy = y + size / 2;
      const r = size / 2;

      // Outer Glow & Background
      doc.setFillColor(255, 255, 255);
      doc.circle(cx, cy, r, "F");
      doc.setLineWidth(2.5);
      doc.setDrawColor(...PRIMARY);

      // Icon specifics
      switch (industry) {
        case "HVAC":
          // Red/Blue Hot & Cold Geometric
          doc.setFillColor(230, 80, 80);
          doc.triangle(
            cx,
            cy - r * 0.45,
            cx - r * 0.4,
            cy + r * 0.25,
            cx + r * 0.4,
            cy + r * 0.25,
            "F",
          );
          doc.setFillColor(80, 160, 255);
          doc.circle(cx, cy + r * 0.1, r * 0.25, "F");
          break;
        case "Plumbing":
          // Water Drop
          doc.setFillColor(80, 180, 255);
          doc.circle(cx, cy + r * 0.15, r * 0.35, "F");
          doc.triangle(
            cx,
            cy - r * 0.5,
            cx - r * 0.35,
            cy + r * 0.15,
            cx + r * 0.35,
            cy + r * 0.15,
            "F",
          );
          break;
        case "Restoration":
          // Shield / Cross
          doc.setFillColor(138, 43, 226);
          doc.rect(cx - r * 0.15, cy - r * 0.45, r * 0.3, r * 0.9, "F");
          doc.rect(cx - r * 0.45, cy - r * 0.15, r * 0.9, r * 0.3, "F");
          break;
        case "Roofing":
          // House & Roof
          doc.setFillColor(138, 43, 226);
          doc.triangle(
            cx,
            cy - r * 0.4,
            cx - r * 0.6,
            cy,
            cx + r * 0.6,
            cy,
            "F",
          );
          doc.rect(cx - r * 0.4, cy, r * 0.8, r * 0.4, "F");
          break;
        case "Electrical":
          // Lightning Bolt
          doc.setFillColor(255, 180, 0);
          doc.setDrawColor(255, 180, 0);
          doc.setLineWidth(4);
          doc.line(cx + r * 0.2, cy - r * 0.5, cx - r * 0.2, cy + r * 0.1);
          doc.line(cx - r * 0.2, cy + r * 0.1, cx + r * 0.3, cy);
          doc.line(cx + r * 0.3, cy, cx - r * 0.3, cy + r * 0.5);
          break;
        case "Pest Control":
          // Bug Body & Legs
          doc.setFillColor(138, 43, 226);
          doc.circle(cx, cy, r * 0.3, "F");
          doc.setDrawColor(138, 43, 226);
          doc.setLineWidth(2);
          doc.line(cx - r * 0.2, cy - r * 0.1, cx - r * 0.6, cy - r * 0.3);
          doc.line(cx + r * 0.2, cy - r * 0.1, cx + r * 0.6, cy - r * 0.3);
          doc.line(cx - r * 0.2, cy + r * 0.1, cx - r * 0.6, cy + r * 0.3);
          doc.line(cx + r * 0.2, cy + r * 0.1, cx + r * 0.6, cy + r * 0.3);
          break;
        case "Garage Door":
          // Door Grid
          doc.setDrawColor(138, 43, 226);
          doc.rect(cx - r * 0.4, cy - r * 0.4, r * 0.8, r * 0.8, "S");
          doc.line(cx - r * 0.4, cy - r * 0.13, cx + r * 0.4, cy - r * 0.13);
          doc.line(cx - r * 0.4, cy + r * 0.13, cx + r * 0.4, cy + r * 0.13);
          doc.line(cx, cy - r * 0.4, cx, cy + r * 0.4);
          break;
        case "Appliance Repair":
          // Washing Machine
          doc.setDrawColor(138, 43, 226);
          doc.setFillColor(138, 43, 226);
          doc.rect(cx - r * 0.4, cy - r * 0.4, r * 0.8, r * 0.8, "S");
          doc.circle(cx, cy + r * 0.1, r * 0.2, "S");
          doc.circle(cx, cy + r * 0.1, r * 0.1, "F");
          break;
        default:
          // Center Node / Abstract Tech
          doc.setDrawColor(138, 43, 226);
          doc.setFillColor(138, 43, 226);
          doc.circle(cx, cy, r * 0.5, "S");
          doc.circle(cx, cy, r * 0.2, "F");
          break;
      }

      // Draw outer circle frame
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(3);
      doc.circle(cx, cy, r, "S");
    };

    // 1. Premium Header Block
    doc.setFillColor(...DARK_SLATE);
    doc.rect(0, 0, W, 140, "F");

    // Top primary accent line
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, W, 6, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("AI Lead Flow & Automation Blueprint", M, 55);

    // Subtitle Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(180, 180, 190);
    doc.text(
      `Prepared for: ${resultData.business} | ${resultData.website}`,
      M,
      80,
    );

    // Render Dynamic Industry Icon in Header Right
    drawIndustryIcon(doc, resultData.industry, W - M - 60, 35, 60);

    // Readiness Badge
    doc.setFillColor(40, 40, 50);
    doc.roundedRect(M, 95, 220, 24, 12, 12, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);

    let tierColor = PRIMARY;
    if (resultData.tier === "high") tierColor = SUCCESS_GREEN;
    if (resultData.tier === "medium") tierColor = [240, 170, 50];

    doc.setTextColor(...tierColor);
    doc.text(
      `AUDIT READINESS: ${resultData.tier.toUpperCase()} FIT`,
      M + 15,
      111,
    );

    y = 180;

    // Draw central pipeline track for the whole document background
    doc.setDrawColor(230, 230, 240);
    doc.setLineWidth(2);
    doc.setLineDashPattern([5, 5], 0);
    doc.line(W / 2, 150, W / 2, H - 150);
    doc.setLineDashPattern([], 0);

    // 2. Visual Flow Diagram (Mapping Leaks to Solutions)
    const renderFlow = (insights) => {
      insights.forEach((insight, index) => {
        let probTitle = insight.title;
        let probAnalysis = insight.analysis || "";
        let solText =
          insight.fix || "CloseDesk captures and converts this automatically.";

        let probLines = doc.splitTextToSize(probAnalysis, 190);
        let solLines = doc.splitTextToSize(solText, 190);

        // Dynamic Height Calculation
        let boxH = Math.max(
          60 + probLines.length * 14,
          60 + solLines.length * 14,
          100,
        );

        checkPageBreak(boxH + 40);

        // --- LEFT NODE: The Leak ---
        // Shadow
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(M + 3, y + 3, 215, boxH, 8, 8, "F");

        // Card
        doc.setFillColor(255, 250, 250);
        doc.setDrawColor(...ALERT_RED);
        doc.setLineWidth(1.5);
        doc.roundedRect(M, y, 215, boxH, 8, 8, "FD");

        // Leak Badge/Header
        doc.setFillColor(...ALERT_RED);
        doc.roundedRect(M, y, 215, 25, 8, 8, "F");
        doc.rect(M, y + 10, 215, 15, "F"); // Flatten bottom of header

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("CURRENT LEAK", M + 12, y + 17);

        // Leak Content
        doc.setFontSize(11);
        doc.setTextColor(...TEXT_MAIN);
        let splitTitle = doc.splitTextToSize(probTitle, 190);
        doc.text(splitTitle, M + 12, y + 42);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...TEXT_MUTED);
        doc.text(probLines, M + 12, y + 46 + splitTitle.length * 12);

        // --- MIDDLE: Connecting Arrow ---
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(2);
        doc.setFillColor(...PRIMARY);
        let arrowY = y + boxH / 2;

        // Line crossing the middle dashed line
        doc.line(M + 215, arrowY, W - M - 225, arrowY);
        // Arrow head
        doc.triangle(
          W - M - 225,
          arrowY - 6,
          W - M - 225,
          arrowY + 6,
          W - M - 215,
          arrowY,
          "FD",
        );

        // Center node dot
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(2);
        doc.circle(W / 2, arrowY, 6, "FD");

        // --- RIGHT NODE: AI Solution ---
        // Shadow
        doc.setFillColor(240, 240, 245);
        doc.roundedRect(W - M - 212, y + 3, 215, boxH, 8, 8, "F");

        // Card
        doc.setFillColor(252, 250, 255);
        doc.setDrawColor(...PRIMARY);
        doc.setLineWidth(1.5);
        doc.roundedRect(W - M - 215, y, 215, boxH, 8, 8, "FD");

        // Solution Badge/Header
        doc.setFillColor(...PRIMARY);
        doc.roundedRect(W - M - 215, y, 215, 25, 8, 8, "F");
        doc.rect(W - M - 215, y + 10, 215, 15, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text("CLOSEDESK AUTOMATION", W - M - 203, y + 17);

        // Solution Content
        doc.setFontSize(10);
        doc.setTextColor(...TEXT_MAIN);
        doc.setFont("helvetica", "normal");
        doc.text(solLines, W - M - 203, y + 42);

        y += boxH + 35; // Vertical spacing between nodes
      });
    };

    if (resultData.aiInsights && resultData.aiInsights.length > 0) {
      renderFlow(resultData.aiInsights);
    } else if (resultData.focus) {
      renderFlow(
        resultData.focus.map((f) => ({
          title: f[0],
          analysis: f[1],
          fix: "Automated seamlessly via CloseDesk integration.",
        })),
      );
    }

    // 3. Footer CTA Block
    checkPageBreak(140);

    doc.setFillColor(...SECONDARY);
    doc.roundedRect(M, y + 20, W - M * 2, 80, 10, 10, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text(
      "Ready to plug these leaks and automate your lead flow?",
      M + 25,
      y + 50,
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.textWithLink(
      `Book your system review at: ${SITE_URL}`,
      M + 25,
      y + 75,
      {
        url: SITE_URL,
      },
    );

    // Save PDF
    doc.save(
      `CloseDesk-Audit-${resultData.business.replace(/[^a-z0-9]/gi, "-")}.pdf`,
    );
  };

  // Hallmark redesign: each answer is a pressed-state button (one tap answers and
  // moves on, as before); the handlers, values and labels sent to the API are unchanged.
  const renderOption = (
    stepName,
    value,
    label,
    isMulti = false,
    isAuto = false,
  ) => {
    const isSelected = isMulti
      ? (ans[stepName] || []).includes(value)
      : ans[stepName] === value;
    return (
      <button
        key={value}
        type="button"
        aria-pressed={isSelected}
        onClick={() => handleOptClick(stepName, value, label, isMulti, isAuto)}
        className="rs-opt"
      >
        <span>{label}</span>
        <Check size={16} className="rs-tick" aria-hidden="true" />
      </button>
    );
  };

  const renderInput = (id, label, placeholder, type = "text") => (
    <div className="ax-field">
      <label htmlFor={id} className="ax-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={ans[id] || ""}
        onChange={(e) => handleInputChange(e, id)}
        onBlur={(e) => handleBlur(e, id)}
        aria-invalid={errors[id] ? true : undefined}
        aria-describedby={errors[id] ? `${id}-err` : undefined}
        className="ax-input"
      />
      <span id={`${id}-err`} className="ax-help ax-help--error">
        {errors[id] ? `Please enter a valid ${label.toLowerCase()}.` : ""}
      </span>
    </div>
  );

  // The question head and the answer group for one step
  const stepHead = (title, help) => (
    <div className="rs-stepper__head">
      <h2 id="audit-q" className="ax-h3">
        {title}
      </h2>
      {help && <p className="ax-meta">{help}</p>}
    </div>
  );

  const group = (stepName, cols, children) => (
    <div
      className="rs-choices"
      role="group"
      aria-labelledby="audit-q"
      aria-invalid={errors[stepName] ? true : undefined}
      style={{ "--cols": cols }}
    >
      {children}
    </div>
  );

  const progress = Math.round(((cur - 1) / TOTAL_STEPS) * 100);

  // Aurora: the progress as a stepped track, one segment per question
  const stepTrack = (doneCount, activeIndex) =>
    Array.from({ length: TOTAL_STEPS }, (_, i) => (
      <span
        key={i}
        className={`h-1.5 min-w-0 flex-1 rounded-full transition-colors ${
          i < doneCount
            ? "bg-primary"
            : i === activeIndex
              ? "bg-primary opacity-40"
              : "bg-rule"
        }`}
      />
    ));

  // Aurora: the readiness tier as a pass / warn / fail chip
  const tierTone = {
    high: { cls: "text-success border-success", Icon: CircleCheck },
    medium: { cls: "text-warn border-warn", Icon: TriangleAlert },
    low: { cls: "text-danger border-danger", Icon: CircleAlert },
  };

  return (
    <>
      <Navbar />

      <main id="main">
        {/* Aurora banner: what this is, with the audit itself as the hero's action */}
        <section className="ax-banner ax-aurora" aria-labelledby="audit-title">
          <div className="ax-container">
            <p className="ax-eyebrow">
              <ScanSearch aria-hidden="true" />
              <span>
                <b className="font-bold">Free Website Lead Audit</b> by AICYRO
              </span>
            </p>
            <h1 id="audit-title" className="ax-h1--s">
              Find out where your website is losing service leads.
            </h1>
            <p className="ax-lead">
              One question at a time, about 90 seconds. At the end you’ll get
              your Audit Readiness result and a personalized PDF report of where
              leads are leaking and how to fix it.
            </p>
            <ul
              className="m-0 flex list-none flex-wrap justify-center gap-2 p-0"
              aria-label="Free Website Lead Audit"
            >
              {["Free audit", "Instant PDF report", "No obligation"].map(
                (badge) => (
                  <li key={badge} className="ax-chip">
                    <Check size={14} className="text-primary" aria-hidden="true" />
                    {badge}
                  </li>
                ),
              )}
              <li className="ax-chip ax-chip--accent">
                <Sparkles size={14} aria-hidden="true" />
                Founding 25 eligible
              </li>
            </ul>

            {/* The audit itself, in a glass frame */}
            <div className="ax-glass mt-4 w-full max-w-[52rem] rounded-[var(--radius-xl)] p-1.5 text-left shadow-[var(--shadow-lg)] sm:p-2">
            <div className="ax-panel rs-stepper" aria-live="polite">
              {/* Default Form Flow */}
              {!isAnalyzing && !isFinished && (
                <>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                      <span className="ax-icon-tile ax-icon-tile--solid">
                        <ClipboardList aria-hidden="true" />
                      </span>
                      <div className="flex min-w-0 grow flex-wrap items-center justify-between gap-2 ax-num">
                        <span className="font-semibold text-ink">
                          Step {cur} of {TOTAL_STEPS}
                        </span>
                        <span className="ax-chip ax-chip--accent">{progress}%</span>
                      </div>
                    </div>
                    <div
                      className="flex gap-1"
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                      aria-label={`Step ${cur} of ${TOTAL_STEPS}`}
                    >
                      {stepTrack(cur - 1, cur - 1)}
                    </div>
                  </div>

                  {/* Reactive Context Strip */}
                  {activeContext && (
                    <p
                      className={`rs-context ${activeContext.type === "amber" ? "rs-context--warn" : ""}`}
                    >
                      {activeContext.type === "amber" ? (
                        <TriangleAlert size={16} aria-hidden="true" />
                      ) : (
                        <Info size={16} aria-hidden="true" />
                      )}
                      <span>{activeContext.text}</span>
                    </p>
                  )}

                  {/* STEP 1 */}
                  {cur === 1 && (
                    <div className="rs-stepper">
                      {stepHead("First, what kind of service business do you run?")}
                      {group(
                        "industry",
                        3,
                        [
                          "HVAC",
                          "Plumbing",
                          "Restoration",
                          "Roofing",
                          "Pest Control",
                          "Electrical",
                          "Garage Door",
                          "Appliance Repair",
                          "Other",
                        ].map((i) =>
                          renderOption(
                            "industry",
                            i,
                            i === "Other" ? "Other Field Service" : i,
                            false,
                            true,
                          ),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 2 */}
                  {cur === 2 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "How do customers actually reach you today?",
                        "Pick everything that’s true.",
                      )}
                      {group(
                        "channels",
                        2,
                        [
                          "Phone calls",
                          "Website form",
                          "Booking page",
                          "Text / SMS",
                          "Email",
                          "Google Business Profile",
                          "Not sure",
                        ].map((c) =>
                          renderOption(
                            "channels",
                            c,
                            c === "Not sure" ? "Honestly not sure" : c,
                            true,
                          ),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 3 */}
                  {cur === 3 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "When a visitor lands on your site, what do you WANT them to do?",
                      )}
                      {group(
                        "mainAction",
                        2,
                        [
                          "Call us",
                          "Request a quote",
                          "Book an appointment",
                          "Schedule an inspection",
                          "Request emergency service",
                          "Submit a contact form",
                        ].map((c) => renderOption("mainAction", c, c, false, true)),
                      )}
                    </div>
                  )}

                  {/* STEP 4 */}
                  {cur === 4 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "Are you paying to get visitors: Google Ads, Local Services Ads, SEO?",
                      )}
                      {group("marketing", 1, [
                        renderOption(
                          "marketing",
                          "yes",
                          "Yes — every month",
                          false,
                          true,
                        ),
                        renderOption(
                          "marketing",
                          "somewhat",
                          "Somewhat / seasonal",
                          false,
                          true,
                        ),
                        renderOption(
                          "marketing",
                          "no",
                          "Not really — mostly referrals & Maps",
                          false,
                          true,
                        ),
                      ])}
                    </div>
                  )}

                  {/* STEP 5 */}
                  {cur === 5 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "What’s the most frustrating thing about your website leads right now?",
                        "Your words end up in your report. Pick the one that stings.",
                      )}
                      {group(
                        "biggestIssue",
                        1,
                        [
                          {
                            v: "Visitors don't convert",
                            l: "Visitors come, but they don't convert",
                          },
                          {
                            v: "We miss after-hours inquiries",
                            l: "We miss after-hours inquiries",
                          },
                          {
                            v: "We respond too slowly",
                            l: "We respond too slowly",
                          },
                          {
                            v: "Many call but don't book",
                            l: "People call — but don't book",
                          },
                          {
                            v: "Forms don't bring enough leads",
                            l: "The form barely brings leads",
                          },
                          {
                            v: "Not sure where leads drop off",
                            l: "No idea where leads drop off",
                          },
                          {
                            v: "We want more booked jobs",
                            l: "We just want more booked jobs",
                          },
                        ].map((opt) =>
                          renderOption("biggestIssue", opt.v, opt.l, false, true),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 6 */}
                  {cur === 6 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "When a lead comes in, how fast does a human actually reply?",
                        "The honest average, not your best day.",
                      )}
                      {group(
                        "instantResponse",
                        2,
                        [
                          { v: "always", l: "Instantly, always" },
                          { v: "usually", l: "Fast — during business hours" },
                          { v: "notalways", l: "Not always — it slips" },
                          { v: "notsure", l: "I honestly don't know" },
                        ].map((opt) =>
                          renderOption(
                            "instantResponse",
                            opt.v,
                            opt.l,
                            false,
                            true,
                          ),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 7 */}
                  {cur === 7 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "How often do urgent, same-day jobs come at you?",
                        "The “I need someone TODAY” calls.",
                      )}
                      {group(
                        "urgentFrequency",
                        2,
                        [
                          { v: "often", l: "All the time" },
                          { v: "sometimes", l: "Sometimes" },
                          { v: "rarely", l: "Rarely" },
                          { v: "notsure", l: "Not sure" },
                        ].map((opt) =>
                          renderOption(
                            "urgentFrequency",
                            opt.v,
                            opt.l,
                            false,
                            true,
                          ),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 8 */}
                  {cur === 8 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "It’s 9:30 PM. A homeowner with an emergency finds your website. What happens?",
                      )}
                      {group(
                        "ahHandling",
                        1,
                        [
                          { v: "voicemail", l: "They call — and get voicemail" },
                          {
                            v: "form",
                            l: "They fill the form — someone sees it tomorrow",
                          },
                          { v: "text", l: "They can text us" },
                          { v: "live", l: "A live person answers" },
                          { v: "nextday", l: "Realistically… we respond next day" },
                          { v: "notsure", l: "I'm not actually sure" },
                        ].map((opt) =>
                          renderOption("ahHandling", opt.v, opt.l, false, true),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 9 */}
                  {cur === 9 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "Gut feeling: are after-hours leads slipping away from you?",
                      )}
                      {group(
                        "ahMissing",
                        2,
                        [
                          { v: "yes", l: "Yes — I know they are" },
                          { v: "maybe", l: "Probably" },
                          { v: "no", l: "No, we're covered" },
                          { v: "notsure", l: "No way to know" },
                        ].map((opt) =>
                          renderOption("ahMissing", opt.v, opt.l, false, true),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 10 */}
                  {cur === 10 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "Can a visitor book or request a service time on your site without calling?",
                      )}
                      {group(
                        "canBook",
                        1,
                        [
                          { v: "direct", l: "Yes — they can book directly" },
                          { v: "request", l: "They can request a time" },
                          { v: "no", l: "No — call or form only" },
                          { v: "notsure", l: "Not sure" },
                        ].map((opt) =>
                          renderOption("canBook", opt.v, opt.l, false, true),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 11 */}
                  {cur === 11 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "If CloseDesk went live on your site tonight, what should it create for you?",
                        "Pick everything you’d want.",
                      )}
                      {group(
                        "wants",
                        2,
                        [
                          "Quote call",
                          "Service request",
                          "Inspection booking",
                          "Emergency callback",
                          "Appointment booking",
                          "Lead capture only",
                          "Not sure yet",
                        ].map((c) => renderOption("wants", c, c, true)),
                      )}
                    </div>
                  )}

                  {/* STEP 12 */}
                  {cur === 12 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "The second a lead is captured, where should it land?",
                        "Pick all that apply.",
                      )}
                      {group(
                        "leadsGo",
                        2,
                        [
                          "Email",
                          "SMS to my phone",
                          "WhatsApp",
                          "Google Sheets",
                          "Our CRM",
                          "Calendar",
                          "Not sure",
                        ].map((c) =>
                          renderOption(
                            "leadsGo",
                            c === "SMS to my phone" ? "SMS" : c,
                            c,
                            true,
                          ),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 13 */}
                  {cur === 13 && (
                    <div className="rs-stepper">
                      {stepHead("What runs your back office today?")}
                      {group(
                        "crm",
                        3,
                        [
                          "Housecall Pro",
                          "ServiceTitan",
                          "Jobber",
                          "GoHighLevel",
                          "HubSpot",
                          "Google Calendar",
                          "Calendly",
                          "Other",
                          "No CRM yet",
                        ].map((c) =>
                          renderOption(
                            "crm",
                            c,
                            c === "Other" ? "Something else" : c,
                            false,
                            true,
                          ),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 14 */}
                  {cur === 14 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "If we could fix ONE thing in the next 30 days, what would move the needle most?",
                      )}
                      {group(
                        "improve",
                        2,
                        [
                          "More calls",
                          "More booked jobs",
                          "More quote requests",
                          "Faster response",
                          "Better after-hours capture",
                          "Better lead qualification",
                          "Less manual follow-up",
                        ].map((c) =>
                          renderOption(
                            "improve",
                            c,
                            c === "Better after-hours capture"
                              ? "After-hours capture"
                              : c,
                            false,
                            true,
                          ),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 15 */}
                  {cur === 15 && (
                    <div className="rs-stepper">
                      {stepHead("How soon do you want this leak fixed?")}
                      {group(
                        "timeline",
                        2,
                        [
                          { v: "asap", l: "ASAP — it's costing me now" },
                          { v: "month", l: "This month" },
                          { v: "3060", l: "Next 30 to 60 days" },
                          { v: "research", l: "Just researching" },
                        ].map((opt) =>
                          renderOption("timeline", opt.v, opt.l, false, true),
                        ),
                      )}
                    </div>
                  )}

                  {/* STEP 16: Combined Details */}
                  {cur === 16 && (
                    <div className="rs-stepper">
                      {stepHead(
                        "Last step: where do we send your audit report?",
                        "Tell us about your business and where to send the instantly generated PDF.",
                      )}

                      <div className="ax-well max-sm:p-4">
                      <fieldset className="rs-fields m-0 p-0 border-0 min-w-0">
                        <legend className="ax-label text-lg mb-4">
                          Business Details
                        </legend>
                        {renderInput(
                          "bName",
                          "Business name",
                          "Carter Restoration",
                          "text",
                        )}
                        {renderInput("bSite", "Website", "yourcompany.com", "url")}
                        {renderInput("bCity", "City / State", "Dallas, TX")}
                        <div className="ax-field">
                          <label htmlFor="bTeam" className="ax-label">
                            Team size
                          </label>
                          <select
                            id="bTeam"
                            onChange={(e) => handleInputChange(e, "bTeam")}
                            value={ans.bTeam || ""}
                            aria-invalid={errors.bTeam ? true : undefined}
                            aria-describedby={errors.bTeam ? "bTeam-err" : undefined}
                            className="ax-select"
                          >
                            <option value="">Select…</option>
                            <option value="1–2">1 to 2</option>
                            <option value="3–10">3 to 10</option>
                            <option value="11–25">11 to 25</option>
                            <option value="26–50">26 to 50</option>
                            <option>50+</option>
                          </select>
                          <span id="bTeam-err" className="ax-help ax-help--error">
                            {errors.bTeam ? "Please select your team size." : ""}
                          </span>
                        </div>
                      </fieldset>
                      </div>

                      <div className="ax-well max-sm:p-4">
                      <fieldset className="rs-fields m-0 p-0 border-0 min-w-0">
                        <legend className="ax-label text-lg mb-4">
                          Contact Details
                        </legend>
                        {renderInput("cName", "Your name", "Name", "text")}
                        <div className="ax-field">
                          <label htmlFor="cRole" className="ax-label">
                            Your role
                          </label>
                          <select
                            id="cRole"
                            onChange={(e) => handleInputChange(e, "cRole")}
                            value={ans.cRole || ""}
                            aria-invalid={errors.cRole ? true : undefined}
                            aria-describedby={errors.cRole ? "cRole-err" : undefined}
                            className="ax-select"
                          >
                            <option value="">Select…</option>
                            <option>Owner</option>
                            <option>Founder</option>
                            <option>President</option>
                            <option>General Manager</option>
                            <option>Operations Manager</option>
                            <option>Service Manager</option>
                            <option>Marketing Manager</option>
                            <option>Other</option>
                          </select>
                          <span id="cRole-err" className="ax-help ax-help--error">
                            {errors.cRole ? "Please select your role." : ""}
                          </span>
                        </div>
                        {renderInput("cEmail", "Email", "you@company.com", "email")}
                        {renderInput("cPhone", "Phone", "(000) 000-0000", "tel")}
                      </fieldset>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="rs-actions flex-nowrap">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={cur === 1}
                      aria-label="Previous step"
                      className={`ax-btn ax-btn--quiet max-sm:w-12 max-sm:px-0 ${cur === 1 ? "invisible" : ""}`}
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => nextStep()}
                      className="ax-btn min-w-0 grow max-sm:px-4 max-sm:text-sm"
                    >
                      {cur === TOTAL_STEPS ? "Get My Audit Report" : "Next"}
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <p className="ax-meta text-center">
                    {cur === TOTAL_STEPS
                      ? "Free. Your PDF generates on the next screen."
                      : "Free. No obligation. Your info is never shared."}
                  </p>
                </>
              )}

              {/* Analyzing State */}
              {isAnalyzing && (
                <div className="grid justify-items-center gap-6 py-12 text-center" role="status">
                  <span className="ax-icon-tile ax-icon-tile--solid h-16 w-16 rounded-[20px]">
                    <Sparkles aria-hidden="true" />
                  </span>
                  <span className="rs-spinner rs-spinner--lg" aria-hidden="true" />
                  <p className="text-lg font-semibold text-ink">{analyzeText}</p>
                  <div className="flex w-full max-w-sm gap-1" aria-hidden="true">
                    {stepTrack(TOTAL_STEPS, -1)}
                  </div>
                </div>
              )}

              {/* Results State */}
              {isFinished && resultData && (
                <div className="rs-stepper">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="ax-icon-tile ax-icon-tile--solid">
                      <FileCheck2 aria-hidden="true" />
                    </span>
                    {(() => {
                      const tone = tierTone[resultData.tier] || {
                        cls: "",
                        Icon: Info,
                      };
                      return (
                        <span className={`ax-chip ${tone.cls}`} role="status">
                          <tone.Icon size={14} aria-hidden="true" />
                          Audit readiness:{" "}
                          {resultData.tier ? resultData.tier : "evaluating"} fit
                        </span>
                      );
                    })()}
                  </div>

                  <div className="rs-stepper__head">
                    <h2 className="ax-h3 text-2xl sm:text-3xl">
                      Your AI audit is ready, {resultData.name.split(" ")[0]}.
                    </h2>
                    <p className="ax-body">
                      Our AI has mapped out a visual conversion blueprint based on
                      your specific flow.
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <h3 className="ax-label">Key Insights Found</h3>
                    <ul className="ax-bento">
                      {resultData.aiInsights &&
                        resultData.aiInsights.map((insight, i, all) => (
                          <li
                            key={i}
                            className={`ax-card max-sm:p-5 ${
                              i === all.length - 1 && all.length % 2 === 1
                                ? "ax-span-12"
                                : "ax-span-6"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="ax-icon-tile !text-danger">
                                <TriangleAlert aria-hidden="true" />
                              </span>
                              <span className="ax-chip text-danger ax-num">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            </div>
                            <p className="font-semibold text-ink">{insight.title}</p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            </div>

            {/* Closing band: the report's actions, once the audit is ready */}
            {isFinished && resultData && (
              <div className="ax-cta w-full max-w-[52rem] px-6 py-8 max-sm:px-4 sm:py-10">
                <div className="ax-cta__actions w-full">
                  <button
                    type="button"
                    onClick={generatePDF}
                    className="ax-btn ax-btn--light ax-btn--lg max-sm:w-full max-sm:min-h-[48px] max-sm:px-4 max-sm:text-sm"
                  >
                    <Download size={18} aria-hidden="true" />
                    Download Visual Blueprint (PDF)
                  </button>

                  <a
                    href={SITE_URL}
                    className="ax-btn ax-btn--outline-light ax-btn--lg max-sm:w-full max-sm:min-h-[48px] max-sm:px-4 max-sm:text-sm"
                  >
                    Return to Website
                  </a>
                </div>
              </div>
            )}

            <p className="ax-body mt-2">
              Built for{" "}
              <b className="font-semibold text-ink">
                HVAC, plumbing, restoration, roofing, pest control, and electrical
              </b>{" "}
              businesses.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
