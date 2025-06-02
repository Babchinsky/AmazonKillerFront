import { Link } from "react-router";
import legalDocsStyles from "./LegalDocs.module.scss";


function PrivacyPolicy() {
  return (
    <div className={legalDocsStyles.legalDocsContainer}>
      <div className={legalDocsStyles.titleContainer}>
        <h1>Privacy policy</h1>
        <h3>Last updated: May 7, 2024</h3>
      </div>

      <hr className={`${legalDocsStyles.docsDivider} divider`} />

      <div className={legalDocsStyles.infoContainer}>
        <div className={legalDocsStyles.info}>
					<span className={legalDocsStyles.infoHighlight}>Perry</span> is committed to protecting your privacy. This privacy policy explains how <span className={legalDocsStyles.infoHighlight}>Perry</span> collects, uses, and discloses your personal information when you visit or make a purchase from <Link className="docs-info-link link main-color-secondary-link" to="/">https://perry.ua</Link> (the "<span className={legalDocsStyles.infoHighlight}>Site</span>").<br />
					By using the <span className={legalDocsStyles.infoHighlight}>Site</span>, you agree to the collection and use of information in accordance with this policy.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Information collection and use</h3>
				<div className={legalDocsStyles.info}>
					We collect several types of information to provide and improve our services to you.
        </div>

        <h3 className={legalDocsStyles.infoTitle}>Types of data collected</h3>
        <div className={legalDocsStyles.info}>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Personal information</span>: while using our <span className={legalDocsStyles.infoHighlight}>Site</span>, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to:
            </li>
            <ul className={legalDocsStyles.infoSublist}>
              <li className={legalDocsStyles.infoSublistHighlight}>Name</li>
              <li className={legalDocsStyles.infoSublistHighlight}>Email address</li>
              <li className={legalDocsStyles.infoSublistHighlight}>Phone number</li>
              <li className={legalDocsStyles.infoSublistHighlight}>Address</li>
            </ul>
						<li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Payment information</span>: when you make a purchase, we collect payment details such as <span className={legalDocsStyles.infoHighlight}>credit card numbers</span> or other payment information.
            </li>
						<li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>Log data</span>: we collect information that your browser sends whenever you visit our <span className={legalDocsStyles.infoHighlight}>Site</span>. This Log Data may include information such as your computer's <span className={legalDocsStyles.infoHighlight}>Internet Protocol ("IP") address</span>, browser type, browser version, the pages of our <span className={legalDocsStyles.infoHighlight}>Site</span> that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
            </li>
          </ul>
        </div>

				<h3 className={legalDocsStyles.infoTitle}>Use of data</h3>
        <div className={legalDocsStyles.info}>
					<p><span className={legalDocsStyles.infoHighlight}>Perry uses</span> the collected <span className={legalDocsStyles.infoHighlight}>data</span> for various purposes:</p>  
					<ul className={legalDocsStyles.infoSublist}>
						<li className={legalDocsStyles.infoSublistHighlight}>To provide and maintain the <span className={legalDocsStyles.infoHighlight}>Site</span></li>
						<li className={legalDocsStyles.infoSublistHighlight}>To notify you about changes to our <span className={legalDocsStyles.infoHighlight}>Site</span></li>
						<li className={legalDocsStyles.infoSublistHighlight}>To allow you to participate in interactive features of our <span className={legalDocsStyles.infoHighlight}>Site</span> when you choose to do so</li>
						<li className={legalDocsStyles.infoSublistHighlight}>To provide customer support</li>
						<li className={legalDocsStyles.infoSublistHighlight}>To gather analysis or valuable information so that we can improve our <span className={legalDocsStyles.infoHighlight}>Site</span></li>
						<li className={legalDocsStyles.infoSublistHighlight}>To monitor the usage of the <span className={legalDocsStyles.infoHighlight}>Site</span></li>
						<li className={legalDocsStyles.infoSublistHighlight}>To detect, prevent, and address technical issues</li>
						<li className={legalDocsStyles.infoSublistHighlight}>To provide you with news, special offers, and general information about other goods, services, and events which we offer unless you have opted not to receive such information</li>
					</ul>
        </div>

				<h3 className={legalDocsStyles.infoTitle}>Disclosure of data</h3>
        <div className={legalDocsStyles.info}>
          <p><span className={legalDocsStyles.infoHighlight}>Perry</span> may <span className={legalDocsStyles.infoHighlight}>disclose</span> your <span className={legalDocsStyles.infoHighlight}>personal information</span> in the good faith belief that such action is necessary to:</p>  
					<ul className={legalDocsStyles.infoSublist}>
						<li className={legalDocsStyles.infoSublistHighlight}>Comply with a legal obligation</li>
						<li className={legalDocsStyles.infoSublistHighlight}>Protect and defend the rights or property of <span className={legalDocsStyles.infoHighlight}>Perry</span></li>
						<li className={legalDocsStyles.infoSublistHighlight}>Prevent or investigate possible wrongdoing in connection with the <span className={legalDocsStyles.infoHighlight}>Site</span></li>
						<li className={legalDocsStyles.infoSublistHighlight}>Protect the personal safety of users of the <span className={legalDocsStyles.infoHighlight}>Site</span> or the public</li>
						<li className={legalDocsStyles.infoSublistHighlight}>Protect against legal liability</li>
					</ul>
        </div>

				<h3 className={legalDocsStyles.infoTitle}>Security of data</h3>
				<div className={legalDocsStyles.info}>
					The <span className={legalDocsStyles.infoHighlight}>security of</span> your <span className={legalDocsStyles.infoHighlight}>data</span> is important to us but remember that no method of transmission over the Internet or method of electronic storage is <span className={legalDocsStyles.infoHighlight}>100% secure</span>. While we strive to use commercially acceptable means to protect your <span className={legalDocsStyles.infoHighlight}>personal information</span>, we cannot guarantee its absolute <span className={legalDocsStyles.infoHighlight}>security</span>.
        </div>

				<h3 className={legalDocsStyles.infoTitle}>Your data protection rights</h3>
        <div className={legalDocsStyles.info}>
					<p>Depending on your location, you may have the following rights regarding your <span className={legalDocsStyles.infoHighlight}>personal information</span>:</p>
          <ul className={legalDocsStyles.infoList}>
            <li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>The right to access</span>: you have the right to request copies of your personal information.
            </li>
						<li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>The right to rectification</span>: you have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.
            </li>
						<li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>The right to erasure</span>: you have the right to request that we erase your personal information, under certain conditions.
            </li>
						<li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>The right to restrict processing</span>: you have the right to request that we restrict the processing of your personal information, under certain conditions.
            </li>
						<li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>The right to object to processing</span>: you have the right to object to our processing of your personal information, under certain conditions.
            </li>
						<li className={legalDocsStyles.infoListHighlight}>
              <span className={legalDocsStyles.infoHighlight}>The right to data portability</span>: you have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
            </li>
          </ul>
        </div>

				<h3 className={legalDocsStyles.infoTitle}>Changes to this privacy policy</h3>
				<div className={legalDocsStyles.info}>
					This privacy policy is effective as of May 7, 2024, and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.<br />
					We reserve the right to update or change our privacy policy at any time, and you should check this privacy policy periodically. Your continued use of the service after we post any modifications to the privacy policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified privacy policy.
					If we make any material changes to this privacy policy, we will notify you either through the email address you have provided us or by placing a prominent notice on our website.
        </div>
			</div>
    </div>
  );
}

export default PrivacyPolicy;