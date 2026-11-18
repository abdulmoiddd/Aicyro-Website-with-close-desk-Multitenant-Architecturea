// Hallmark redesign: one quote at a time. The CMS testimonials (testimonialSection)
// set large with the person beneath, previous and next below, swipe kept on touch.
// With three or fewer, they sit side by side. Same Firebase read, same handlers.
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

// --- REQUIRED FIREBASE IMPORTS ---
import { ref, onValue } from "firebase/database";
import { database } from "../../lib/firebase12";
// ---------------------------------

const cleanName = (name = "") => name.trim().replace(/,$/, "");

// --- COMPONENT ---

const TestimonialCard = ({ testimonial }) => (
  <>
    <blockquote>
      <p className="hm-quote__text">“{testimonial.feedback}”</p>
    </blockquote>
    <figcaption>
      {/* Hallmark F9: show a face only when it is the person's own photo; generated
          faces (pravatar, gravatar defaults, ui-avatars) and the stock fallback are skipped */}
      {testimonial.avatar && !/pravatar\.cc|gravatar\.com|ui-avatars\.com/i.test(testimonial.avatar) && (
        <img
          src={testimonial.avatar}
          alt={cleanName(testimonial.name)}
          width={56}
          height={56}
          className="hm-quote__avatar"
          data-drop-on-fail=""
        />
      )}
      <span className="hm-quote__who">
        <cite className="not-italic font-semibold text-ink">{cleanName(testimonial.name)}</cite>
        <span className="ax-meta">{testimonial.location}</span>
      </span>
      {testimonial.rating ? (
        <span className="hm-quote__stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              aria-hidden="true"
              fill={i < testimonial.rating ? "currentColor" : "none"}
            />
          ))}
          <span className="sr-only">Rated {testimonial.rating} out of 5</span>
        </span>
      ) : null}
    </figcaption>
  </>
);

const Testimonial = () => {
  const [testimonialData, setTestimonialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- CAROUSEL LOGIC STATE ---
  const [index, setIndex] = useState(0);

  // Fetch Data
  useEffect(() => {
    const testimonialsRef = ref(database, "testimonialSection");
    const unsubscribe = onValue(
      testimonialsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const fetchedData = snapshot.val();
          const testimonialsArray = Object.values(
            fetchedData.testimonials || {},
          );
          setTestimonialData({
            ...fetchedData,
            testimonials: testimonialsArray,
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firebase read error:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <section className="ax-section" role="status" aria-live="polite">
        <div className="ax-container hm-loading">
          <span className="sr-only">Loading testimonials…</span>
          <span
            className="block h-8 w-8 rounded-full border-2 border-rule border-t-ink animate-spin keep-motion"
            aria-hidden="true"
          />
        </div>
      </section>
    );
  }

  if (!testimonialData) {
    return (
      <section className="ax-section">
        <div className="ax-container">
          <p className="ax-body">No Data Found.</p>
        </div>
      </section>
    );
  }

  const { mainHeading, subText, testimonials } = testimonialData;
  const isSlider = testimonials.length > 3;

  // --- HANDLERS ---

  const handlePrev = () => {
    setIndex((prev) => {
      // Loop to end if at start
      if (prev === 0) return testimonials.length - 1;
      return prev - 1;
    });
  };

  const handleNext = () => {
    setIndex((prev) => {
      // Loop to start if at end
      if (prev >= testimonials.length - 1) return 0;
      return prev + 1;
    });
  };

  const onDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // If swiped right (positive) -> Go Prev
    if (offset > 100 || velocity > 500) {
      handlePrev();
    }
    // If swiped left (negative) -> Go Next
    else if (offset < -100 || velocity < -500) {
      handleNext();
    }
  };

  const current = testimonials[Math.min(index, testimonials.length - 1)];

  return (
    <section className="ax-band" aria-labelledby="voices-title">
      <div className="ax-container">
        <div className="ax-head ax-head--split">
          <h2 id="voices-title" className="ax-h2">{mainHeading}</h2>
          <p className="ax-lead">{subText}</p>
        </div>

        {isSlider ? (
          // === OPTION A: ONE AT A TIME (manual only; swipe on touch) ===
          <div aria-roledescription="carousel" aria-label={mainHeading}>
            <motion.figure
              key={index}
              className="hm-quote"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              dragSnapToOrigin
              onDragEnd={onDragEnd}
            >
              <TestimonialCard testimonial={current} />
            </motion.figure>

            <div className="hm-quote__nav">
              <button
                type="button"
                className="ax-icon-btn"
                onClick={handlePrev}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <p className="ax-meta ax-num hm-quote__count" aria-live="polite">
                {index + 1} of {testimonials.length}
              </p>
              <button
                type="button"
                className="ax-icon-btn"
                onClick={handleNext}
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        ) : (
          // === OPTION B: SIDE BY SIDE (<= 3 items) ===
          <ul className="hm-quotes">
            {testimonials.map((testimonial, i) => (
              <li key={i}>
                <figure className="hm-quote">
                  <TestimonialCard testimonial={testimonial} />
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Testimonial;
