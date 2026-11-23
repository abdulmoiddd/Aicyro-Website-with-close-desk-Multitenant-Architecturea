import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

// --- COMPONENTS ---
import Navbar from '../components/Essntials/Navbar'; //
import Footer from '../components/Essntials/footer'; //

// Obsidian redesign: an ambient banner (the head, its line and the two facts as a
// hairline strip), then one centred glass card: 01 the Google connection, 02 the
// fields, then the action and its status. The sign-in, the token and the POST to
// /api/schedule are unchanged.

// Pointer position for the glass card's border glow (.ob-card reads --mx / --my)
const trackGlow = (e) => {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${e.clientX - r.left}px`);
  card.style.setProperty('--my', `${e.clientY - r.top}px`);
};

const MeetingScheduler = () => {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    notes: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Store the Google Access Token
  const [accessToken, setAccessToken] = useState(null);

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Configure Google Login
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Success:", tokenResponse);
      setAccessToken(tokenResponse.access_token);
      setStatus(null);
    },
    onError: () => setStatus('error'),
    scope: 'https://www.googleapis.com/auth/calendar',
    flow: 'implicit',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      // Trigger login if they try to submit without it
      login();
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const startDateTime = new Date(`${formData.date} ${formData.time}`).toISOString();
      const endDateTime = new Date(new Date(startDateTime).getTime() + 60 * 60000).toISOString();

      // Call the API endpoint defined in api/schedule.js
      const response = await fetch('/api/schedule', { //
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: accessToken,
          meetingData: {
            userName: formData.userName,
            userEmail: formData.userEmail,
            notes: formData.notes,
            start: startDateTime,
            end: endDateTime
          }
        })
      });

      if (!response.ok) throw new Error('Failed to schedule');
      setStatus('success');
      // Reset form on success
      setFormData({ userName: '', userEmail: '', notes: '', date: '', time: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main id="main">
        <section className="ob-banner ob-ambient ab-hero sch-hero" aria-labelledby="meet-title">
          <div className="ax-container ab-hero__inner">
            <div className="ab-hero__grid">
              <div className="ab-hero__head">
                <p className="ob-eyebrow" data-reveal>
                  Strategy call
                </p>
                <h1 id="meet-title" className="ob-banner__title" data-reveal style={{ "--i": 1 }}>
                  Let’s Build Something Extraordinary
                </h1>
              </div>
              <div className="ab-hero__side" data-reveal style={{ "--i": 2 }}>
                <p className="ob-banner__lead">
                  Book a free 60-minute technical strategy session. We’ll discuss your architecture, security needs, and growth goals.
                </p>
              </div>
            </div>

            <dl className="sch-facts" data-reveal style={{ "--i": 3 }}>
              <div>
                <dt>
                  <Clock size={20} aria-hidden="true" />
                  60 Minutes
                </dt>
                <dd>Deep dive into your requirements.</dd>
              </div>
              <div>
                <dt>
                  <CalendarIcon size={20} aria-hidden="true" />
                  Auto-Sync
                </dt>
                <dd>Instant Google Calendar invitation.</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="ab-section sch-section" aria-label="Schedule a meeting">
          <div className="ax-container">
            <form onSubmit={handleSubmit} onPointerMove={trackGlow} className="ob-card sch-form" data-reveal>

              {/* GOOGLE AUTH */}
              <div className="sch-step">
                <span className="ab-index sch-step__num" aria-hidden="true">01</span>
                {!accessToken ? (
                  <div className="sch-auth">
                    <div className="grid gap-2">
                      <h2 className="sch-auth__title">Connect Your Calendar</h2>
                      <p className="ax-meta">Authorize access to check availability and schedule the meet.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => login()}
                      className="ax-btn ax-btn--quiet sch-google"
                    >
                      {/* A 18px brand mark from a fixed URL; next/image adds nothing here */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                        alt=""
                        width="18"
                        height="18"
                      />
                      Sign in with Google
                    </button>
                  </div>
                ) : (
                  <p className="sch-connected" role="status">
                    <ShieldCheck size={20} aria-hidden="true" />
                    <span>Google Account Connected Securely</span>
                  </p>
                )}
              </div>

              {/* INPUT FIELDS */}
              <div className="sch-step">
                <span className="ab-index sch-step__num" aria-hidden="true">02</span>
                <div className="ct-fields">
                  <div className="ax-field">
                    <label htmlFor="meet-name" className="ax-label">Full name</label>
                    <input
                      id="meet-name"
                      required
                      name="userName"
                      autoComplete="name"
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="ax-input"
                    />
                  </div>
                  <div className="ax-field">
                    <label htmlFor="meet-email" className="ax-label">Work email</label>
                    <input
                      id="meet-email"
                      required
                      name="userEmail"
                      type="email"
                      autoComplete="email"
                      value={formData.userEmail}
                      onChange={handleInputChange}
                      className="ax-input"
                    />
                  </div>

                  <div className="ax-field">
                    <label htmlFor="meet-date" className="ax-label">Date</label>
                    <input
                      id="meet-date"
                      required
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="ax-input sch-date"
                    />
                  </div>
                  <div className="ax-field">
                    <label htmlFor="meet-time" className="ax-label">Time slot</label>
                    <div className="ct-select">
                      <select
                        id="meet-time"
                        required
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="ax-select"
                      >
                        <option value="">Select Time Slot</option>
                        {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={18} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="ax-field ct-fields__full">
                    <label htmlFor="meet-notes" className="ax-label ct-label">
                      Project requirements
                      <span className="ct-optional">Optional</span>
                    </label>
                    <textarea
                      id="meet-notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Tell us about your project requirements…"
                      className="ax-textarea"
                    />
                  </div>
                </div>
              </div>

              <div className="sch-submit">
                <button
                  type="submit"
                  disabled={loading || !accessToken}
                  aria-busy={loading}
                  className="ax-btn ax-btn--block"
                >
                  {loading ? (
                    <>
                      <span
                        className="keep-motion inline-block w-5 h-5 rounded-full border-2 border-current border-t-transparent motion-safe:animate-spin"
                        aria-hidden="true"
                      />
                      Scheduling…
                    </>
                  ) : (
                    "Confirm & Schedule Meeting"
                  )}
                </button>

                {status && (
                  <div
                    role={status === 'success' ? 'status' : 'alert'}
                    className={`sch-status ${status === 'success' ? 'sch-status--ok text-success' : 'sch-status--err text-danger'}`}
                  >
                    {status === 'success' ? <CheckCircle className="shrink-0" size={20} aria-hidden="true" /> : <AlertCircle className="shrink-0" size={20} aria-hidden="true" />}
                    <div>
                      <p className="font-semibold">{status === 'success' ? 'Meeting Scheduled!' : 'Scheduling Failed'}</p>
                      <p className="text-ink-2">
                        {status === 'success'
                          ? 'A Google Meet link has been sent to your email and added to your calendar.'
                          : 'We encountered an error connecting to Google Calendar. Please try again.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MeetingScheduler;
