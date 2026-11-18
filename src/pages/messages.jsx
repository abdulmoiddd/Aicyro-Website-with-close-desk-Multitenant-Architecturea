import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Mail,
  Briefcase,
  Calendar,
  Layers,
  GitBranch,
  ArrowUpRight,
  RefreshCw,
  Clock,
  LogOut,
} from "lucide-react";

// --- COMPONENTS ---
import Navbar from "../components/Essntials/Navbar";
import Footer from "../components/Essntials/footer";

// --- FIREBASE ---
import { ref, onValue, remove } from "firebase/database";
import { database } from "../lib/firebase12";

// --- UTILITY COMPONENTS ---
// Hallmark redesign: the counts sit in one figure row parted by hairlines (no
// icon tiles); the props are unchanged.
const StatCard = ({ icon: Icon, label, value, delay }) => (
  <div>
    <b className="ax-num">{value}</b>
    <span className="ax-meta">{label}</span>
  </div>
);

const ServiceBadge = ({ icon: Icon, text }) => (
  <span className="ax-chip gap-1 max-w-full">
    <Icon size={14} aria-hidden="true" />
    <span className="truncate max-w-[150px]">{text}</span>
  </span>
);

const MessagesPage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null); // Local State User
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("All");

  // --- 1. CHECK CUSTOM AUTHENTICATION (LocalStorage) ---
  useEffect(() => {
    // Check if user info is stored in LocalStorage
    const storedUser = localStorage.getItem("aicyro_admin_user");

    if (!storedUser) {
      // Not logged in? Redirect to login
      router.push("/mes");
    } else {
      setCurrentUser(JSON.parse(storedUser));
      setAuthChecking(false);
    }
  }, [router]);

  // --- 2. FETCH DATA (Only if authenticated) ---
  useEffect(() => {
    if (authChecking) return; // Wait for auth check

    const inquiriesRef = ref(database, "inquiries");
    const unsubscribeDb = onValue(inquiriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data)
          .map((key) => ({
            id: key,
            ...data[key],
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setMessages(list);
      } else {
        setMessages([]);
      }
      setLoading(false);
    });

    return () => unsubscribeDb();
  }, [authChecking]);

  // --- 3. LOGOUT FUNCTION ---
  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("aicyro_admin_user");
    router.push("/lg");
  };

  // --- 4. FILTER LOGIC ---
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesService =
        selectedService === "All" || msg.coreService === selectedService;

      return matchesSearch && matchesService;
    });
  }, [messages, searchTerm, selectedService]);

  // --- 5. STATS ---
  const stats = useMemo(() => {
    const total = messages.length;
    const today = new Date().toDateString();
    const newToday = messages.filter(
      (m) => new Date(m.timestamp).toDateString() === today,
    ).length;
    const uniqueServices = new Set(
      messages.map((m) => m.coreService).filter(Boolean),
    ).size;
    return { total, newToday, uniqueServices };
  }, [messages]);

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this inquiry?")) {
      try {
        await remove(ref(database, `inquiries/${id}`));
      } catch (e) {
        console.error("Delete failed", e);
      }
    }
  };

  // --- RENDER LOADING ---
  if (authChecking || (loading && !authChecking)) {
    return (
      <main id="main" className="grid place-items-center min-h-dvh bg-paper" aria-busy="true">
        <span className="rs-spinner rs-spinner--lg" aria-hidden="true" />
        <span className="sr-only">Loading inquiries</span>
      </main>
    );
  }

  // If we reached here but have no user (rare race condition), return null
  if (!currentUser) return null;

  return (
    <>
      <Navbar />

      <main id="main">
        {/* --- HEADER SECTION --- */}
        <header className="ax-container rs-banner">
          <div className="flex flex-wrap items-end justify-between gap-6 w-full">
            <div className="grid gap-3">
              <h1 className="ax-h1--s">Inquiries</h1>
              <p className="ax-meta">
                Logged in as{" "}
                <span className="font-semibold text-ink">{currentUser.name}</span>
              </p>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="ax-btn ax-btn--quiet"
            >
              <LogOut size={18} aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>

          {/* Stats */}
          <div className="ax-stats w-full pt-6 border-t border-rule" style={{ "--cols": 3 }}>
            <StatCard icon={MessageSquare} label="Total" value={stats.total} delay={0.1} />
            <StatCard icon={Clock} label="Today" value={stats.newToday} delay={0.2} />
            <StatCard icon={Layers} label="Services" value={stats.uniqueServices} delay={0.3} />
          </div>
        </header>

        <section className="ax-section pt-0" aria-label="Inquiries">
          <div className="ax-container grid gap-8">
            {/* --- CONTROLS SECTION --- */}
            <div className="rs-toolbar">
              <div className="ax-field">
                <label htmlFor="msg-search" className="ax-label">
                  <Search size={14} className="inline mr-1 align-[-2px]" aria-hidden="true" />
                  Search
                </label>
                <input
                  id="msg-search"
                  type="search"
                  placeholder="Search by name, email or company…"
                  className="ax-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="ax-field">
                <label htmlFor="msg-filter" className="ax-label">
                  <Filter size={14} className="inline mr-1 align-[-2px]" aria-hidden="true" />
                  Service
                </label>
                <select
                  id="msg-filter"
                  className="ax-select"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="All">All Services</option>
                  {[
                    ...new Set(
                      messages.map((m) => m.coreService).filter(Boolean),
                    ),
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* --- MESSAGES LIST --- */}
            {filteredMessages.length > 0 ? (
              <ul className="rs-inbox">
                {filteredMessages.map((msg, index) => (
                  <MessageCard
                    key={msg.id}
                    msg={msg}
                    onDelete={handleDelete}
                    index={index}
                  />
                ))}
              </ul>
            ) : (
              <div className="rs-empty">
                <RefreshCw size={24} className="text-ink-2" aria-hidden="true" />
                <h2 className="ax-h3">No messages found</h2>
                <p className="ax-body">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

// --- MESSAGE ROW ---
const MessageCard = ({ msg, onDelete, index }) => {
  return (
    <li className="rs-msg">
      {/* Who and when */}
      <div className="rs-msg__who">
        <h2 title={msg.name}>{msg.name}</h2>
        <p className="rs-msg__meta">
          <Calendar size={14} aria-hidden="true" />
          {new Date(msg.timestamp).toLocaleDateString()}
          <Clock size={14} aria-hidden="true" />
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="rs-msg__meta">
          <Mail size={14} aria-hidden="true" />
          <a href={`mailto:${msg.email}`}>{msg.email}</a>
        </p>
        {msg.company && (
          <p className="rs-msg__meta">
            <Briefcase size={14} aria-hidden="true" />
            {msg.company}
          </p>
        )}

        {/* Tags */}
        {(msg.coreService || msg.subService) && (
          <div className="flex flex-wrap gap-2 mt-2">
            {msg.coreService && (
              <span className="ax-chip gap-1">
                <Layers size={14} aria-hidden="true" /> {msg.coreService}
              </span>
            )}
            {msg.subService && (
              <ServiceBadge icon={GitBranch} text={msg.subService} />
            )}
          </div>
        )}
      </div>

      {/* Message Body */}
      <p className="rs-msg__body">“{msg.message}”</p>

      {/* Actions */}
      <div className="rs-msg__side">
        <button
          type="button"
          onClick={() => onDelete(msg.id)}
          className="ax-icon-btn"
          title="Delete Message"
          aria-label={`Delete Message from ${msg.name}`}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
        <a
          href={`mailto:${msg.email}?subject=Re: Inquiry about ${msg.coreService || "Services"}`}
          className="ax-link inline-flex items-center gap-1 text-sm whitespace-nowrap"
        >
          Reply via Email <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </li>
  );
};

export default MessagesPage;
