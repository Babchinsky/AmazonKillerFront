import { Link } from "react-router";
import FacebookIcon from "../assets/icons/facebook.svg?react";
import XIcon from "../assets/icons/x.svg?react";
import InstagramIcon from "../assets/icons/instagram.svg?react";
import GmailIcon from "../assets/icons/gmail.svg?react";
import TelegramIcon from "../assets/icons/telegram.svg?react";
import LogoIcon from "../assets/icons/logo.svg?react";
import footerStyles from "./Footer.module.scss";

  
function Footer() {
  return (
    <footer>
      <div className={footerStyles.topContainer}>
        <div className={footerStyles.supportContainer}>
          <p>Support</p>
          <div className={footerStyles.supportLinks}>
            <Link className="link main-color-text-link" to="/">Contact us</Link>
            <Link className="link main-color-text-link" to="/">FAQ</Link>
          </div>
        </div>

        <div className={footerStyles.legalNoticeContainer}>
          <p>Legal notice</p>
          <div className={footerStyles.legalNoticeLinks}>
            <Link className="link main-color-text-link" to="/legal-notice?tab=0">Terms and Conditions</Link>
            <Link className="link main-color-text-link" to="/legal-notice?tab=1">License agreement</Link>
            <Link className="link main-color-text-link" to="/legal-notice?tab=2">Privacy Policy</Link>
          </div>
        </div>

        <div className={footerStyles.socialMediaContainer}>
          <p>Social media</p>
          <div className={footerStyles.socialMediaLinks}>
            <Link className="link" to="https://www.facebook.com/">
              <FacebookIcon className={`${footerStyles.socialMediaIcon} main-color-text-icon`} />
            </Link>

            <Link className="link" to="https://x.com/">
              <XIcon className={`${footerStyles.socialMediaIcon} main-color-text-icon`} />
            </Link>

            <Link className="link" to="https://www.instagram.com/">
              <InstagramIcon className={`${footerStyles.socialMediaIcon} main-color-text-icon`} />
            </Link>

            <Link className="link" to="https://www.gmail.com/">
              <GmailIcon className={`${footerStyles.socialMediaIcon} main-color-text-icon`} />
            </Link>

            <Link className="link" to="https://telegram.org/">
              <TelegramIcon className={`${footerStyles.socialMediaIcon} main-color-text-icon`} />
            </Link>
          </div>
        </div>
      </div>

      <div className={footerStyles.bottomContainer}>
        <div className={footerStyles.logoContainer}>
          <Link className="link" to="/">
            <LogoIcon className={footerStyles.logoIcon} />
          </Link>
        </div>

        <p>© 2025 Untitled. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;