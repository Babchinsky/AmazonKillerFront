import { Link } from "react-router";
import Facebook from "../assets/icons/facebook.svg?react";
import X from "../assets/icons/x.svg?react";
import Instagram from "../assets/icons/instagram.svg?react";
import Gmail from "../assets/icons/gmail.svg?react";
import Telegram from "../assets/icons/telegram.svg?react";
import Logo from "../assets/icons/logo.svg?react";
import "./Footer.scss";

  
function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-top-container">
        <div className="support-container">
          <p className="support-title">Support</p>
          <div className="support-links">
            <Link className="link" to="/">Contact us</Link>
            <Link className="link" to="/">FAQ</Link>
          </div>
        </div>

        <div className="legal-notice-container">
          <p className="legal-notice-title">Legal notice</p>
          <div className="legal-notice-links">
            <Link className="link" to="/legal-notice?tab=0">Terms and Conditions</Link>
            <Link className="link" to="/legal-notice?tab=1">License agreement</Link>
            <Link className="link" to="/legal-notice?tab=2">Privacy Policy</Link>
          </div>
        </div>

        <div className="social-media-container">
          <p className="social-media-title">Social media</p>
          <div className="social-media-links">
            <Link className="link" to="https://www.facebook.com/">
              <Facebook className="social-media-icon" />
            </Link>

            <Link className="link" to="https://x.com/">
              <X className="social-media-icon" />
            </Link>

            <Link className="link" to="https://www.instagram.com/">
              <Instagram className="social-media-icon" />
            </Link>

            <Link className="link" to="https://www.gmail.com/">
              <Gmail className="social-media-icon" />
            </Link>

            <Link className="link" to="https://telegram.org/">
              <Telegram className="social-media-icon" />
            </Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom-container">
        <div className="logo-container">
          <Link className="link" to="/">
            <Logo className="logo-icon" />
          </Link>
        </div>

        <p>© 2025 Untitled. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;