import React from "react";
import { Link } from "react-router-dom";

export default function Events() {
  const scrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };
  return (
    <>
      <h2 className="events-title">
        <Link to="/events" onClick={scrollToTop} className="events-title-link">
          رویدادها / کارگاه‌ها
        </Link>
      </h2>
      <div className="events">
        <div className="event"></div>
        <div className="event"></div>
        <div className="event"></div>
        <div className="event"></div>
      </div>
      <button className="events-more-button">
        <Link
          to="/events"
          onClick={scrollToTop}
          className="events-more-button-link"
        >
          بیشتر
        </Link>
      </button>
    </>
  );
}
