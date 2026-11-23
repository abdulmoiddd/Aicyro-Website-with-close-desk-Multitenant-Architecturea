import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  CalendarClock,
  Info
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';

// --- COMPONENTS ---
import Navbar from '../components/Essntials/Navbar'; //
import Footer from '../components/Essntials/footer'; //

// Aurora redesign: the aurora Banner (eyebrow, h1, line), then two columns: the
// Google connection and the fields in an elevated panel, the two facts beside it
// as small icon cards. The sign-in, the token and the POST to /api/schedule are
// unchanged.
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
        <section className="ax-banner ax-aurora" aria-labelledby="meet-title">
          <div className="ax-container">
            <p className="ax-eyebrow">
              <CalendarClock aria-hidden="true" />
              Strategy call
            </p>
            <h1 id="meet-title" className="ax-h1--s">
              Let’s Build Something Extraordinary
            </h1>
            <p className="ax-lead">
              Book a free 60-minute technical strategy session. We’ll discuss your architecture, security needs, and growth goals.
            </p>
          </div>
        </section>

        <section className="ax-section meet" aria-label="Schedule a meeting">
          <div className="ax-container about-formgrid">

            {/* --- FORM --- */}
            <form onSubmit={handleSubmit} className="ax-panel about-formpanel meet-form" data-reveal>

              {/* GOOGLE AUTH */}
              {!accessToken ? (
                <div className="meet-auth">
                  <div className="grid gap-2">
                    <h2 className="ax-h3">Connect Your Calendar</h2>
                    <p className="ax-meta">Authorize access to check availability and schedule the meet.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => login()}
                    className="ax-btn ax-btn--quiet ax-btn--sm"
                  >
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
                <p className="meet-connected" role="status">
                  <ShieldCheck size={20} aria-hidden="true" />
                  <span>Google Account Connected Securely</span>
                </p>
              )}

              {/* INPUT FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
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
                    className="ax-input meet-date"
                  />
                </div>
                <div className="ax-field">
                  <label htmlFor="meet-time" className="ax-label">Time slot</label>
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
                </div>

                <div className="ax-field md:col-span-2">
                  <label htmlFor="meet-notes" className="ax-label">Project requirements</label>
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
                  className={`meet-status ${status === 'success' ? 'text-success' : 'text-danger'}`}
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

            </form>

            {/* --- INFO --- */}
            <aside className="about-aside" aria-labelledby="meet-facts-title" data-reveal style={{ "--i": 1 }}>
              <p id="meet-facts-title" className="ax-eyebrow">
                <Info aria-hidden="true" />
                What to expect
              </p>
              <ul className="about-infocards">
                <li className="ax-card">
                  <span className="ax-icon-tile">
                    <Clock aria-hidden="true" />
                  </span>
                  <div className="about-infocards__text">
                    <p className="about-infocards__label about-infocards__label--strong">60 Minutes</p>
                    <p>Deep dive into your requirements.</p>
                  </div>
                </li>
                <li className="ax-card">
                  <span className="ax-icon-tile">
                    <CalendarIcon aria-hidden="true" />
                  </span>
                  <div className="about-infocards__text">
                    <p className="about-infocards__label about-infocards__label--strong">Auto-Sync</p>
                    <p>Instant Google Calendar invitation.</p>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default MeetingScheduler;
