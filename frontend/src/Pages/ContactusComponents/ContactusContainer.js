import "./Contactus.css";
import { FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";

export default function ContactusContainer() {
  return (
    <div className="contact-us-container">
      <h2 className="contact-us-title-sp">تماس با ما</h2>
      <div className="contact-us-text-sp">
        <p>
          به ما در سای‌کانکت بپیوندید تا راه را برای انجمن‌های علمی یکپارچه،
          پویا و پر رونق هموار کنیم. بیایید با هم آینده همکاری و پیشرفت علمی را
          رقم بزنیم.
        </p>
        <p style={{ marginBottom: "40px" }}>
          برای سوالات و فرصت‌های مشارکت، با ما در تماس باشید. 👇🏻
        </p>
        <p>📞 تلفن تماس : ۳۷۹۳۴۵۰۰-۰۳۱</p>
        <p> 📩 پست الکترونیکی: info@comp.ui.ac.ir</p>
        <div className="social-sp">
          <p>📱 لینک شبکه‌های اجتماعی:</p>
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
      </div>
    </div>
  );
}
