import { Col, Row, Tabs, Typography } from "antd";
import React, { Fragment } from "react";
import MajorAssumptions from "../calc/blog/MajorAssumptions";
import { isMobileDevice } from "../utils";
import { useFullScreenBrowser } from "react-browser-hooks";
import Text from "antd/lib/typography/Text";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";

interface PrivacyPolicyProps {
  stringParams: string;
}

export default function PrivacyPolicy({ stringParams }: PrivacyPolicyProps) {
  const fsb = useFullScreenBrowser();
  const { TabPane } = Tabs;

  const policyContent = [
    {
      title: "Introduction",
      content: (
        <Typography>
          <Paragraph>
            <Text strong>
              We are always committed to keeping your data secure, your private
              information private, and maintaining transparency regarding our
              practices.
            </Text>
            Invacia Labs Private Limited operate mobile applications and website
            https://moneo.in/ under brand names Moneo.Moneo enables you to
            track, save and earn extra by automatically bringing your entire
            financial life across investments, loans, credit cards & taxes, all
            in one app.
          </Paragraph>
          <Paragraph>
            Moneo is committed to operating its website and mobile applications
            with the highest ethical standards and required internal controls.
            We take your privacy extremely seriously. Your privacy is important
            to us and maintaining your trust is imperative. This Policy forms
            part and parcel of the Terms of Use and other terms on the Moneo
            Platform ("Terms of Use"). The Privacy Policy should always be read
            in conjunction with the Terms and Conditions. This Privacy Policy
            explains how Moneo collects, uses & protects your information when
            you access Moneo website(s) & mobile apps (collectively referred to
            as “Services” or “Application”). By using Moneo Services you agree
            to the terms of the Privacy Policy. If you are not comfortable with
            any of the terms or policies described in this Privacy Policy, you
            may choose to discontinue usage of Moneo Services. You can also
            email us at https://moneo.in/contact-us to update or delete your
            personal information that Moneo has collected.
          </Paragraph>
          <Paragraph>
            This Privacy Policy is applicable to a User who avails the Services.
            The term "User" for the purposes of this Privacy Policy shall mean
            You, in the capacity of an individual, a guest user, browser and/ or
            representative of an entity, who visits, accesses, uses, downloads,
            deals with, avails Services and/ or transacts through Moneo
            Platform. For the purpose of this Policy, wherever the context so
            requires "You" or "Your" shall mean User and the term "We", "Us",
            "Our" shall mean Company.
          </Paragraph>
          <Paragraph>
            In case You do not wish to provide any information, including
            personal or personally identifiable information, or in the event You
            do not agree to any or all the clauses of the Terms of Use, Privacy
            Policy and product specific Terms and Conditions, then Company may
            not be in a position to offer You all or some of the
            product/Services, including without limitation, certain features of
            the Moneo Platform, and may even restrict (partially or fully) the
            User from accessing the Moneo. Further, if You do not agree to this
            Privacy Policy, Terms of User and/ or product specific Terms and
            Conditions, You may also not register on Moneo Platform, not avail
            Our Services and/or deregister from Moneo Platform and stop using
            Our products/Services. We shall not be held responsible and/ or
            liable for any denial of Service due to User not providing the
            required information. Moneo does not knowingly collect or solicit
            personal information from anyone under the age of 18. If you are
            under 18, please do not attempt to register for the Services or send
            any personal information about yourself to Moneo. If Moneo learns
            that we have collected personal information from a person under age
            18, we will delete that information as quickly as possible. If you
            believe that a person under 18 may have provided us with personal
            information, please contact us at https://moneo.in/contact-us
          </Paragraph>
        </Typography>
      ),
    },
    {
      title: "Why does Moneo ask for this information",
      content: (
        <Paragraph>
          Moneo is a Wealth management platform that provides online financial
          advisory services to you. We receive information you knowingly provide
          to Moneo or with your explicit consent. This information enables you
          to organise and aggregate your financial information in one place on
          Moneo Services. This also enables Moneo to provide you analytics on
          your investments, liabilities & expenses all in one place. The
          information also enables Moneo Application to help you assess your
          risk profile from time to time and create your investment plans and
          make decisions on investments & execute purchase and sale of
          investment products and also enables you to manage your taxation.
        </Paragraph>
      ),
    },
    {
      title: "Information received, collected and stored by the company",
      content: (
        <>
          <Paragraph>
            While registering on /accessing Moneo Platform or while using Our
            Services, You may be required to provide some information about
            yourself, on a voluntary basis. We may also ask You to provide
            certain additional information from time to time or retrieve
            information about You from third parties. All information disclosed
            by You shall be disclosed willingly on a voluntary basis and without
            any coercion. Also, in some instances You might have to provide
            certain information on a mandatory basis (such as KYC information).
          </Paragraph>
          <Paragraph>
            <Title level={5}>A. Information supplied by users</Title>
            <Text>
              The Company shall collect Personal Information about the User,
              including, without limitation, at the time of:
            </Text>
            <li>1. registering /setting up an account on Moneo;</li>
            <li>2. while filling up forms;</li>
            <li>3. browsing/accessing the Moneo;</li>
            <li>4. while availing any product/services</li>
            Users may be required to provide certain personal information for
            the registration process that may include but not limited to:
            <li>1.Name;</li>
            <li> 2. PAN;</li>
            <li>3. email id;</li>
            <li>4. mobile number;</li>
            <li>6.bank account number;</li>
            <li> 7. address;</li>
            <li> 8. credit card numbers;</li>
            <li>9. medical records and history; </li>
            <li>10. nominee details;</li> <li>11. date of birth;</li>
            <li>12. Signatures;</li> <li>13. Income Details; </li>
            <li>
              14. Documents (like Address proof or Bank Statements) and other
              related information;
            </li>
            The Company shall also collect non-personal information pertaining
            to the behaviour of the User (Behavioural information), while
            using/browsing the Moneo Platform, messages posted by the User on
            Moneo Platform etc.
          </Paragraph>
          <Paragraph>
            Any personally identifiable information provided by You will not be
            considered as sensitive if it is freely available and / or
            accessible in the public domain like any comments, messages, blogs,
            scribbles available on social platforms like Facebook, twitter etc.
            Further, any posted/uploaded/conveyed/communicated by users on the
            public sections of the Sites becomes published content and is not
            considered personally identifiable information subject to this
            Privacy Policy. The Company/its partners/vendors/ service providers
            etc. may also contact You from time to time through any mode of
            communication about updating Your personal information in order to
            provide the Users with such features that We believe may benefit /
            interest You.
          </Paragraph>
          <Paragraph>
            The Personal Information, any non-personal information and
            behavioural information (collectively called as Information) is
            stored by the company on servers owned by its or its group companies
            or by third parties in India. Only on your explicit consent Moneo
            collects account information from respective institutions [as
            selected by you], by providing your account details and the
            corresponding password. The credentials are dual-encrypted, first by
            a unique-to-user key pair and second by our master key. These
            credentials are then passed to the institutions to screen scrape the
            data from the institutions website/platform. Data in transit is also
            encrypted using TLS and bank-grade public-private key exchange. This
            will enable Moneo to consolidate accurate information and present
            the same to you.
          </Paragraph>
        </>
      ),
    },
    {
      title: "2. Information from other Sources:",
      content: `Demographic and other information: 
        We may reference other sources of demographic and other information in order to provide You with more targeted communications and promotions. We use Google Analytics, among others, to track the user behaviour on Our Sites. Google Analytics specifically has been enabled to support display advertising towards helping Us gain understanding of Our users' demographics and interests. The reports are anonymous and cannot be associated with any individual personally identifiable information that You may have shared with Us. You can opt-out of Google Analytics for display advertising and customize Google Display Network ads using the Ads Settings options provided by Google.
        Links to third party sites/Ad-servers: 
        The Sites may include links to other websites or applications. Such websites or applications are governed by their respective privacy policies, which are beyond Our control. Once You leave Our servers (You can tell where You are by checking the URL in the location bar on Your browser), use of any information You provide is governed by the privacy policy of the operator of the application, you are visiting. That privacy policy may differ from Ours. If You can't find the privacy policy of any of these sites via a link from the application's homepage, You should contact the application owners directly for more information. We do not provide any personally identifiable Information to third party websites/ application/ advertisers/ ad-servers without Your consent except in the circumstances mentioned in Information Sharing section.
        When We present Information to Our advertisers -- to help them understand Our audience and confirm the value of advertising on Our Sites -- it is usually in the form of aggregated statistics on traffic to various pages / content within Our Sites. We use third-party advertising companies to serve ads when You visit Our Sites. These companies may use Information (excluding Your name, address, email address or telephone number or other personally identifiable information) about Your visits to this and other websites or application, in order to provide advertisements about goods and services of interest to You. We do not provide any personally identifiable information to third party websites/advertisers/ad-servers without Your consent.
        Information use by the company
        The Personal information provided by the User is used by the Company for the purposes, including, without limitation:
        •	provide a smooth, safe and customized experience to the User on Moneo Platform;
        •	provide/promoting its products and services on the Moneo Platform- general as well as customized and improve the same from time to time;
        •	provide You the most user-friendly experience and for developing new services;
        •	analyse flow, track user trends, measure promotional effectiveness;
        •	provide additional features on the Moneo Platform through Cookies;
        •	protect the safety and integrity of the Moneo Platform, information and maintain the confidentiality of the User and their data;
        •	Ensure smooth execution of transaction and payments;
        •	Maintain, improve and provide Service (including personalization of Moneo Platform);
        •	Inform the User about new/change in products/services/offers/updates/reminders, billing information, customer service(s) etc.;
        •	To detect and/or prevent any fraudulent/criminal/prohibited activity on Moneo Platform;
        •	To process Your request or respond to Your queries/grievances/comments;
        •	Send customized messages/notifications to You;
        •	Communicate any change in Our services/products/Terms and Conditions/Privacy policy;
        •	Marketing and commercial communications regarding services/products;
        •	Analyse Your behaviour on Moneo Platform;
        •	Facilitate Company's marketing, advertising and educational activities/initiatives;
        •	Auditing and investigation purposes;
        •	Updated regarding third party services and products and products and services offered on other Sites;
        •	Data analysis/analytics;
        •	Pre-filling of various forms;
        •	Maintain User Account;
        •	Provide general information/updates.
        We may also use Your email address or other personally identifiable information to send commercial or marketing messages about Our Services and/or such additional updates and features about third parties' products and services with an option to subscribe / unsubscribe. We may, however, use Your email address for non-marketing or administrative purposes (such as notifying You of major changes, for customer service purposes, billing, etc.).
        `,
    },
    {
      title: "3. Information sharing",
      content: `We neither rent nor sell your personal Information to anyone.  However, we may share your Personal Information with third parties as described in this section:
      1.	We only transfer the data to others if necessary to provide or improve user-facing features that are prominent in the requesting application's user interface. We may also transfer data as necessary to comply with applicable law or as part of a merger, acquisition, or sale of assets with notice to users. All other transfers or sales of the user data are prohibited
      2.	We don't use or transfer the data for serving ads, including retargeting, personalized, or interest-based advertising; and
      3.	We don't allow humans to read the data, unless :
      o	(a) We first obtain your affirmative agreement for specific purposes;
      o	(b) It is necessary for security purposes (such as investigating a bug or abuse);
      o	(c) It is necessary to comply with applicable law; or
      o	(d) Our use is limited to internal operations and the data (including derivations) have been aggregated and anonymized.
      These prohibitions of user of data apply to all the information/ data  obtained from you with your explicit consent .Our employees, agents, contractors, and successors comply with this Policy.
      `,
    },
    {
      title: "4. Accessing and updating personal information",
      content: `When You use the Services or Sites (or any of its sub sites), We make good faith efforts to provide You, as and when requested by You, with access to Your personal information and shall further ensure that any personal information or sensitive personal data or information found to be inaccurate or deficient shall be corrected or amended as feasible, subject to any requirement for such personal information or sensitive personal data or information to be retained by law or for legitimate business purposes. We ask individual users to identify themselves and the information requested to be accessed, corrected or removed before processing such requests, and We may decline to process requests that are unreasonably repetitive or systematic, require disproportionate technical effort, jeopardize the privacy of others, or would be extremely impractical (for instance, requests concerning information residing on backup tapes), or for which access is not otherwise required. In any case, where We provide information access and correction, We perform this service free of charge, except if doing so would require a disproportionate effort. Because of the way We maintain certain services, after You delete Your information, residual copies may take a period of time before they are deleted from Our active servers and may remain in Our backup systems.
          We encourage You to review, update and correct the personal information that We maintain about You, and You may request that We delete personal information about You that is inaccurate, incomplete or irrelevant for legitimate purposes, or are being processed in a way which infringes any applicable legal requirement.
          Your right to review, update, correct etc. Your information is subject to Our records retention policies and applicable law, including any statutory retention requirements.
          Retention of Data
          We shall retain the records as per applicable laws and such other statutory / regulatory requirements from time to time. In the event any legal / regulatory proceeding is pending, we can retain records for a longer period.
          We shall store the data in our database even if the User has chosen not to be contacted and/ or closed his/her account with the Company.
          We shall store the data/information/records on a server owned by Us or its group companies in India.
          We may keep Our records of the electronic instructions/transactions in any form as permitted under applicable Laws. In this regard, all records, whether in electronic form, magnetic form, documents or any other form with respect to electronic instructions/online transactions shall be conclusive evidence of such instructions/transactions and shall be binding on the User
          `,
    },
    {
      title: "5. Information Security",
      content: `We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. These include internal reviews of Our data collection, storage and processing practices and security measures, including appropriate encryption and physical security measures to guard against unauthorized access to systems where We store personal data. All information gathered on Moneo is securely stored within the Company controlled database. The database is stored on servers secured behind a firewall; access to the servers is password-protected and is strictly limited. However, as effective as Our security measures are, no security system is impenetrable. We cannot guarantee the security of Our database, nor can We guarantee that information You supply will not be intercepted while being transmitted to Us over the Internet. And, of course, any information You include in a posting to the discussion areas is available to anyone with Internet access.`,
    },
    {
      title: "6. Updates / Changes",
      content: `The internet is an ever-evolving medium. We may alter Our Policy from time to time to incorporate necessary changes in technology, applicable law or any other variant. In any case, We reserve the right to change (at any point of time) the terms of this Policy or the Terms of Use. Any changes We make will be effective immediately on notice, which We may give by posting the new policy on the Sites. Your use of the Sites or Services after such notice will be deemed acceptance of such changes. We may also make reasonable efforts to inform You via electronic mail. In any case, You are advised to review this Policy periodically on the Sites to ensure that You are aware of the latest version.`,
    },
    {
      title: "7. Changes to Privacy Policy",
      content:
        "Moneo reserves the right to change this policy from time to time. Any changes shall be effective immediately upon the posting of the revised Privacy Policy. While we will make reasonable efforts to keep you posted on any updates to this privacy policy, to make sure that you are aware of any changes, we recommend that you review this policy periodically. If you are not comfortable with any of the changes to Privacy Policy you may choose to discontinue usage of Moneo website or mobile applications. You can also email us at privacy@stackfinance.co to update or delete your personal information that Moneo has collected.",
    },
    {
      title: "8. Privacy Questions and Access",
      content: `If you have questions, concerns, or suggestions regarding our Privacy Policy, please contact us immediately at support@stackfinance.co or privacy@stackfinance.co In certain cases, you may have the ability to view or edit your personal information online. In the event your information is not accessible online and you wish to change or delete your personal information or other information that you may have provided, please contact us immediately at support@stackfinance.co or privacy@stackfinance.co
          The Prevention of Money Laundering Act 2002 and SEBI (Investment Advisors) Regulations, 2013 require record retention for a period of up to 5 years post the deletion of your account. In the event of the pendency of any legal/ regulatory proceeding or receipt of any legal and/or regulatory direction to that effect, we may retain your information for a longer period.
          `,
    },
    {
      title: "9. Security and Responsible Disclosure",
      content: `We at Moneo are committed to our client's data and privacy. We blend security at multiple steps within our products with state of the art technology to ensure our systems maintain strong security measures. The overall data and privacy security design allows us to defend our systems ranging from low hanging issues up to sophisticated attacks. You can read more about it here.
      If you are a security enthusiast or a researcher and you have found a possible security vulnerability on Moneo, we encourage you to report the issue to us responsibly.
      You could submit a bug report to us at security@stackfinance.co with detailed steps required to reproduce the vulnerability.
      We shall put best of our efforts to investigate and fix the legitimate issues in a reasonable time frame, meanwhile, requesting you not to publicly disclose it. Additionally, if you have suggestions on how we could improve our security systems to make it more robust and safe for all users, you can share those with us at security@indwealth.in, support@Moneo.com
      `,
    },
  ];

  const tabKey: any = {
    "Terms and Conditions": "terms-and-conditions",
    Privacy: "privacy",
    Security: "security",
  };

  const sections: any = {
    "Terms & Conditions": <MajorAssumptions elements={[]} />,
    Privacy: <MajorAssumptions elements={[...policyContent]} />,
    Security: <MajorAssumptions elements={[]} />,
  };
  return (
    <Fragment>
      <Row className="steps-content">
        <Col>
          <Tabs
            defaultActiveKey={stringParams}
            tabPosition={isMobileDevice(fsb) ? "top" : "left"}
            type={isMobileDevice(fsb) ? "card" : "line"}
            animated
          >
            {Object.keys(sections).map((key) => (
              <TabPane key={tabKey[key]} tab={key}>
                {sections[key]}
              </TabPane>
            ))}
          </Tabs>
        </Col>
      </Row>
    </Fragment>
  );
}
