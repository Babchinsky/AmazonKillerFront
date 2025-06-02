import { Link } from "react-router";
import legalDocsStyles from "./LegalDocs.module.scss";


function TermsAndConditions() {
  return (
    <div className={legalDocsStyles.legalDocsContainer}>
      <div className={legalDocsStyles.titleContainer}>
        <h1>Terms and conditions</h1>
        <h3>Last updated: May 7, 2024</h3>
      </div>

      <hr className={`${legalDocsStyles.docsDivider} divider`} />

      <div className={legalDocsStyles.infoContainer}>
        <div className={legalDocsStyles.info}>
          Welcome to <span className={legalDocsStyles.infoHighlight}>Perry</span>! These terms and conditions ("<span className={legalDocsStyles.infoHighlight}>Agreement</span>") govern your use of the services and products provided on the website located at <Link className={`${legalDocsStyles.infoLink} link main-color-secondary-link`} to="/">https://perry.ua</Link> (the "<span className={legalDocsStyles.infoHighlight}>Site</span>"). By accessing or using the <span className={legalDocsStyles.infoHighlight}>Site</span>, you agree to be bound by the terms and conditions of this <span className={legalDocsStyles.infoHighlight}>Agreement</span>. If you do not agree to these terms, please do not use the <span className={legalDocsStyles.infoHighlight}>Site</span>.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Use of the site</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Eligibility</span>: by using the <span className={legalDocsStyles.infoHighlight}>Site</span>, you represent and warrant that you are at <span className={legalDocsStyles.infoHighlight}>least 18 years old</span> and have the legal capacity to enter into this <span className={legalDocsStyles.infoHighlight}>Agreement</span>.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Account registration</span>: to access certain features of the <span className={legalDocsStyles.infoHighlight}>Site</span>, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Prohibited activities</span>: you agree not to:
            </li>
            <ul className={legalDocsStyles.infoSublist}>
              <li className={legalDocsStyles.infoSublistHighlight}>Violate any applicable laws or regulations.</li>
              <li className={legalDocsStyles.infoSublistHighlight}>Engage in fraudulent or deceptive practices.</li>
              <li className={legalDocsStyles.infoSublistHighlight}>Infringe on the intellectual property rights of others.</li>
              <li className={legalDocsStyles.infoSublistHighlight}>Upload or transmit viruses or other harmful code.</li>
              <li className={legalDocsStyles.infoSublistHighlight}>Engage in any activity that could damage or overburden the <span className={legalDocsStyles.infoHighlight}>Site</span>.</li>
            </ul>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Marketplace transactions</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Seller obligations</span>: sellers must comply with our seller terms and conditions, which include providing accurate descriptions of products, fulfilling orders promptly, and adhering to all applicable laws and regulations.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Buyer obligations</span>: buyers must ensure that their payment information is accurate and up-to-date and that they comply with all payment obligations for purchases made through the <span className={legalDocsStyles.infoHighlight}>Site</span>.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Payment processing</span>: all payments are processed through our secure payment gateway. By submitting your payment information, you authorize us to charge the applicable fees for your purchases.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Order fulfillment</span>: sellers are responsible for fulfilling orders in a timely manner. <span className={legalDocsStyles.infoHighlight}>Perry</span> is not liable for any issues related to order fulfillment, including delays or non-delivery.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Returns and refunds</span>: our returns and refunds policy outlines the conditions under which returns and refunds may be granted. Buyers should review this policy before making a purchase.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Intellectual property</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Ownership</span>: all content on the <span className={legalDocsStyles.infoHighlight}>Site</span>, including but not limited to text, graphics, logos, images, and software, is the property of <span className={legalDocsStyles.infoHighlight}>Perry</span> or its content suppliers and is protected by <span className={legalDocsStyles.infoHighlight}>international copyright</span> and <span className={legalDocsStyles.infoHighlight}>trademark laws</span>.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>License to use</span>: <span className={legalDocsStyles.infoHighlight}>Perry</span> grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the <span className={legalDocsStyles.infoHighlight}>Site</span> for your personal or internal business use, subject to the terms and conditions of this <span className={legalDocsStyles.infoHighlight}>Agreement</span>.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>User contributions</span>: if you post, upload, or otherwise provide any content to the <span className={legalDocsStyles.infoHighlight}>Site</span> ("<span className={legalDocsStyles.infoHighlight}>User Contributions</span>"), you grant <span className={legalDocsStyles.infoHighlight}>Perry</span> a worldwide, non-exclusive, royalty-free, perpetual, and irrevocable right to use, reproduce, modify, adapt, publish, translate, distribute, perform, and display such content in any media.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Prohibited conduct</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Misuse of the platform</span>: you agree not to misuse <span className={legalDocsStyles.infoHighlight}>Perry’s platform</span> by engaging in activities such as hacking, fraud, or distribution of illegal products.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Respectful communication</span>: you agree to communicate respectfully with other users and not engage in harassment, threats, or abuse.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Accurate information</span>: you agree to provide accurate and truthful information in your interactions on the platform.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Content guidelines</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Product listings</span>: sellers must ensure that all product listings are accurate and not misleading. False advertising is strictly prohibited.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Reviews and feedback</span>: users are encouraged to leave honest and constructive feedback. Manipulating reviews or feedback is prohibited.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Service modifications</h3>
        <div className={legalDocsStyles.info}>
          <span className={legalDocsStyles.infoHighlight}>Perry</span> reserves the right to modify, suspend, or discontinue any aspect of the <span className={legalDocsStyles.infoHighlight}>Site</span> at any time, including the availability of any feature, database, or content. We may also impose limits on certain features and services or restrict your access to parts or all of the <span className={legalDocsStyles.infoHighlight}>Site</span> without notice or liability.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Governing law</h3>
        <div className={legalDocsStyles.info}>
          This <span className={legalDocsStyles.infoHighlight}>Agreement</span> shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding arising under this <span className={legalDocsStyles.infoHighlight}>Agreement</span> will be brought exclusively in the federal or state courts located in Los Angeles, California, and the parties hereby irrevocably consent to the personal jurisdiction and venue therein.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Severability</h3>
        <div className={legalDocsStyles.info}>
          If any provision of this <span className={legalDocsStyles.infoHighlight}>Agreement</span> is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions will continue to be in full force and effect.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Waiver</h3>
        <div className={legalDocsStyles.info}>
          The failure of <span className={legalDocsStyles.infoHighlight}>Perry</span> to enforce any right or provision of this <span className={legalDocsStyles.infoHighlight}>Agreement</span> will not be deemed a waiver of such right or provision.
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;