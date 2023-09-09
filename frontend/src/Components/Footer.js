import React from "react";
import { FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  };
  return (
    <footer className="footer clear">
      <div className="footer-row">
        <div className="footer-section">
          <h4 className="social-footer-title">ما را دنبال کنید</h4>
          <div className="social">
            <a
              rel="noreferrer"
              href="https://www.linkedin.com/company/ui-sace"
              target="_blank"
              className="social-icon-link"
            >
              <FaLinkedin className="social-icon" />
            </a>

            <a
              rel="noreferrer"
              href="https://www.instagram.com/ui_sace/"
              target="_blank"
              className="social-icon-link"
            >
              <FaInstagram className="social-icon" />
            </a>

            <a
              rel="noreferrer"
              href="https://t.me/ui_sace"
              target="_blank"
              className="social-icon-link"
            >
              <FaTelegram className="social-icon" />
            </a>
          </div>

          <img
            src="/sciconnect.png"
            alt="sciconnect-logo"
            className="sciconnect-logo"
            onClick={scrollToTop}
          />
        </div>
        <div className="footer-section">
          <h4 className="contactus-footer-title">تماس با ما</h4>
          <div style={{ textAlign: "center" }}>
            <p>۰۳۱-تلفن تماس : ۳۷۹۳۴۵۰۰</p>
            <p>info@comp.ui.ac.ir :پست الکترونیکی</p>
          </div>
        </div>
        <div className="footer-section">
          <h4 className="aboutus-footer-title">درباره ما</h4>
          <p></p>
        </div>
      </div>
    </footer>
  );
}
