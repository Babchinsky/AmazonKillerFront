import { Link } from "react-router";
import legalDocsStyles from "./LegalDocs.module.scss";


function LicenseAgreement() {
  return (
    <div className={legalDocsStyles.legalDocsContainer}>
      <div className={legalDocsStyles.titleContainer}>
        <h1>License agreement</h1>
        <h3>Last updated: May 7, 2024</h3>
      </div>

      <hr className="divider" />

      <div className={legalDocsStyles.infoContainer}>
        <div className={legalDocsStyles.info}>
          This license agreement ("<span className={legalDocsStyles.infoHighlight}>Agreement</span>") governs your use of the services and products provided on the website located at <Link className="docs-info-link link main-color-secondary-link" to="/">https://perry.ua</Link> (the "<span className={legalDocsStyles.infoHighlight}>Site</span>"). By accessing or using the <span className={legalDocsStyles.infoHighlight}>Site</span>, you agree to adhere to the terms and conditions outlined in this <span className={legalDocsStyles.infoHighlight}>Agreement</span>, which are designed to ensure a safe, lawful, and beneficial use of our services. This includes, but is not limited to, compliance with intellectual property laws, user contribution guidelines, and any other policies or rules that may be applicable to the <span className={legalDocsStyles.infoHighlight}>Site</span>.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>License grant</h3>
        <div className={legalDocsStyles.info}>
          <span className={legalDocsStyles.infoHighlight}>Perry</span> grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the <span className={legalDocsStyles.infoHighlight}>Site</span> and its services for your personal or internal business use, subject to the terms and conditions of this <span className={legalDocsStyles.infoHighlight}>Agreement</span>.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Marketplace services</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Buyer accounts</span>: buyers must create an account to purchase products, ensuring all provided information is accurate and up-to-date.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Transactions</span>: all transactions between buyers and sellers are facilitated through the <span className={legalDocsStyles.infoHighlight}>Site</span>. <span className={legalDocsStyles.infoHighlight}>Perry</span> may charge transaction fees as outlined in our fee schedule.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Product listings</span>: sellers are responsible for the accuracy of product listings, including descriptions, pricing, and availability. Listings must not contain misleading or false information.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Restrictions</h3>
        <div className={legalDocsStyles.info}>
          <p>You agree not to:</p>
          <ul className={legalDocsStyles.infoSublist}>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Modify, copy, distribute, or create derivative works based on the <span className={legalDocsStyles.infoHighlight}>Site</span> or its content.
            </li>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Use the <span className={legalDocsStyles.infoHighlight}>Site</span> for any unlawful purpose or in any manner that could damage, disable, overburden, or impair the <span className={legalDocsStyles.infoHighlight}>Site</span>.
            </li>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Access or attempt to access any systems or servers on which the <span className={legalDocsStyles.infoHighlight}>Site</span> is hosted or modify or alter the <span className={legalDocsStyles.infoHighlight}>Site</span> in any way.
            </li>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Use any automated means to access the <span className={legalDocsStyles.infoHighlight}>Site</span> for any purpose without our express written permission.
            </li>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Engage in any fraudulent activities, including creating multiple accounts to manipulate the marketplace.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Intellectual property</h3>
        <div className={legalDocsStyles.info}>
          All content on the <span className={legalDocsStyles.infoHighlight}>Site</span>, including but not limited to text, graphics, logos, images, and software, is the property of <span className={legalDocsStyles.infoHighlight}>Perry</span> or its content suppliers and is protected by <span className={legalDocsStyles.infoHighlight}>international copyright</span> and <span className={legalDocsStyles.infoHighlight}>trademark laws</span>. Unauthorized use of any content may violate <span className={legalDocsStyles.infoHighlight}>copyright</span>, <span className={legalDocsStyles.infoHighlight}>trademark</span>, and <span className={legalDocsStyles.infoHighlight}>other laws</span>.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>User contributions</h3>
        <div className={legalDocsStyles.info}>
          If you post, upload, or otherwise provide any content to the <span className={legalDocsStyles.infoHighlight}>Site</span> ("<span className={legalDocsStyles.infoHighlight}>User Contributions</span>"), you grant <span className={legalDocsStyles.infoHighlight}>Perry</span> a worldwide, non-exclusive, royalty-free, perpetual, and irrevocable right to use, reproduce, modify, adapt, publish, translate, distribute, perform, and display such content in any media. You represent and warrant that you own or have the necessary rights to make your <span className={legalDocsStyles.infoHighlight}>User Contributions</span> available and that your <span className={legalDocsStyles.infoHighlight}>User Contributions</span> do not infringe any third-party rights.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Dispute resolution</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Between buyers and sellers</span>: any disputes arising between buyers and sellers must be resolved between the parties involved. <span className={legalDocsStyles.infoHighlight}>Perry</span> is not responsible for mediating such disputes but may offer assistance at our discretion.
            </li>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>With <span className={legalDocsStyles.infoHighlight}>Perry</span></span>: any disputes arising out of or in connection with your use of the <span className={legalDocsStyles.infoHighlight}>Site</span> or this <span className={legalDocsStyles.infoHighlight}>Agreement</span> shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Termination</h3>
        <div className={legalDocsStyles.info}>
          <span className={legalDocsStyles.infoHighlight}>Perry</span> may terminate or suspend your license to use the <span className={legalDocsStyles.infoHighlight}>Site</span> and its services at any time, without prior notice or liability, for any reason, including if you breach this <span className={legalDocsStyles.infoHighlight}>Agreement</span>. Upon termination, your right to use the <span className={legalDocsStyles.infoHighlight}>Site</span> will immediately cease.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Disclaimer of warranties</h3>
        <div className={legalDocsStyles.info}>
          The <span className={legalDocsStyles.infoHighlight}>Site</span> and its <span className={legalDocsStyles.infoHighlight}>services</span> are provided on an "as is" and "as available" basis. <span className={legalDocsStyles.infoHighlight}>Perry</span> makes no warranties, express or implied, regarding the <span className={legalDocsStyles.infoHighlight}>Site</span> or its content, including but not limited to <span className={legalDocsStyles.infoHighlight}>warranties</span> of merchantability, fitness for a particular purpose, non-infringement, or availability.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Limitation of liability</h3>
        <div className={legalDocsStyles.info}>
          <p>
            In no event shall <span className={legalDocsStyles.infoHighlight}>Perry</span>, its directors, employees, or affiliates, be <span className={legalDocsStyles.infoHighlight}>liable</span> for any indirect, incidental, special, consequential, or punitive damages, including but <span className={legalDocsStyles.infoHighlight}>not limited</span> to loss of profits, data, use, or other intangible losses, resulting from:
          </p>
          <ul className={legalDocsStyles.infoSublist}>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Your use or inability to use the <span className={legalDocsStyles.infoHighlight}>Site</span>.
            </li>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Any unauthorized access to or alteration of your transmissions or data.
            </li>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Any content or conduct of any third party on the <span className={legalDocsStyles.infoHighlight}>Site</span>.
            </li>
            <li className={legalDocsStyles.infoSublistHighlight}>
              Any other matter related to the <span className={legalDocsStyles.infoHighlight}>Site</span>.
            </li>
          </ul>
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Indemnification</h3>
        <div className={legalDocsStyles.info}>
          You agree to indemnify, defend, and hold harmless <span className={legalDocsStyles.infoHighlight}>Perry</span>, its officers, directors, employees, and affiliates from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with your access to or use of the <span className={legalDocsStyles.infoHighlight}>Site</span>, your <span className={legalDocsStyles.infoHighlight}>User Contributions</span>, or your breach of this <span className={legalDocsStyles.infoHighlight}>Agreement</span>.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Changes to this agreement</h3>
        <div className={legalDocsStyles.info}>
          <span className={legalDocsStyles.infoHighlight}>Perry</span> reserves the right to modify or replace this <span className={legalDocsStyles.infoHighlight}>Agreement</span> at any time. If a revision is material, we will provide at least <span className={legalDocsStyles.infoHighlight}>30 days' notice</span> prior to any new terms taking effect. Your continued use of the <span className={legalDocsStyles.infoHighlight}>Site</span> after any such changes constitutes your acceptance of the new terms.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Governing law</h3>
        <div className={legalDocsStyles.info}>
          This <span className={legalDocsStyles.infoHighlight}>Agreement</span> shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of <span className={legalDocsStyles.infoHighlight}>law provisions</span>. Any legal action or proceeding arising under this <span className={legalDocsStyles.infoHighlight}>Agreement</span> will be brought exclusively in the federal or state courts located in Los Angeles, California, and the parties hereby irrevocably consent to the personal jurisdiction and venue therein.
        </div>
      </div>
    </div>
  );
}

export default LicenseAgreement;