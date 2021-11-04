import { Typography } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";

const securityContent = [
  {
    title: "Privacy Prcatices",
    content: (
      <Paragraph>
        We shall never sell or rent users’ information or data to anyone. We
        never use or transfer your data for serving ads, including retargeting,
        personalised, or interest-based advertising. We will never provide any
        part of your information to anyone unless consented by the user. Please
        refer to our privacy policy for more information.
      </Paragraph>
    ),
  },
  {
    title: "Infrastructure/Peripheral Security",
    content: (
      <Typography>
        <Paragraph>
          Moneo’s infrastructure is based on Amazon Web Services (AWS). We have
          robust and scalable multi-level architecture using the most secure
          services of AWS. Our infrastructure strictly follows the AWS
          Well-Architected Framework, making stack most secure, high-performing,
          resilient, and efficient.
          <Paragraph>
            All of our servers are kept under Virtual Private Cloud (VPC) and
            environments are isolated using sub-netting. The servers are
            physically located in the AWS Asia Pacific Region (India).
          </Paragraph>
        </Paragraph>
        <Paragraph>
          We use HTTPS protocol for our website and mobile applications
          (hereinafter referred to as “Platform”). All communication between the
          Platform and our servers are protected via 256bit encrypted HTTPS
          protocol. This prevents MITM (Man in the Middle) attacks on our
          platform and connection between us and our user is fully secure. We
          have strict network segmentation and isolation of environments and
          services in place.
        </Paragraph>
        <Paragraph>
          We have a ‘Network and Application Firewall’ in place and have
          implemented industry best practices like OWASP guidelines to make it
          secure. We have also deployed the latest version of ModSecurity on Web
          Application Firewall, to mitigate new immersing attacks on public
          applications. Distributed Denial-of-Service (DDoS) attacks are
          prevented using the multi-level defence firewalls.
        </Paragraph>
      </Typography>
    ),
  },
  {
    title: "Data Security",
    content: (
      <Paragraph>
        <li>
          All users&apos; data is managed in the encrypted format at all times. This
          encryption on data is applied at both in-transit and in-rest.
        </li>
        <li>
          The transmission of data is encrypted by a bank-grade TLS encryption
          algorithm, which helps in protecting users&apos; data from
          Man-in-the-middle and eavesdropping attacks.
        </li>
        <li>
          At the data storage level, we are conscious of data atomicity, data
          consistency, data integrity, and durability of the data. We have also
          enabled activity logging and auditing for swift intrusion detection
          into the system. We utilise data replication for data resiliency and
          disaster recovery as well as backup testing for data reliability.
        </li>
        <li>
          Additionally, multi-level role-based access control is implemented to
          secure users&apos; data. Internally, we limit the access of development
          server through bundling identity management and secured multi-tunnel
          private VPN channels.
        </li>
        <li>
          The user log-in is based on One-Time Password (OTP) authentication on
          Moneo website and mobile application.
        </li>
        <li>
          All user data and internal stored data is protected by encryption at
          rest and sensitive data by application level encryption.
        </li>
        <li>
          We employ separation of environments and segregation of duties and
          have strict role-based access control on a documented, authorized &
          need-to-use basis.
        </li>
        <li>
          We use key management services to limit access to data except the data
          team.
        </li>
        <li>
          Stored data is protected by encryption at rest and sensitive data by
          application level encryption.
        </li>
        <li>
          We use data replication for data resiliency & disaster recovery,
          snapshotting for data durability and backup/restore testing for data
          reliability.
        </li>
        <li>
          We only use anonymized and aggregated data for internal analytics and
          business intelligence purposes.
        </li>
      </Paragraph>
    ),
  },
  {
    title: "Application Security",
    content: (
      <Typography>
        <Paragraph>
          We have implemented strict password policy and a mandatory Two-Factor
          Authentication (2FA) protocol for user login. Additionally,
          location-based security control is also incorporated to restrict
          unauthorised access to the application.
        </Paragraph>
        <Paragraph>
          All data transfers back and forth needs to pass through our data
          validation layer to protect the application from the malicious code
          injections.
        </Paragraph>
      </Typography>
    ),
  },
  {
    title: "System Breach Detection and PEN-Testing",
    content: (
      <Typography>
        <Paragraph>
          Our internal team as well as external stakeholders support us in
          undertaking periodic security and vulnerability testing/ assessments,
          utilising standardised products for both manual and automated
          testing.Our internal team as well as external stakeholders support us
          in undertaking periodic security and vulnerability testing/
          assessments, utilising standardised products for both manual and
          automated testing.
        </Paragraph>
        <Paragraph>
          We have also engaged CERT-IN certified auditors for performing
          external testing and audits at regular intervals.
        </Paragraph>
      </Typography>
    ),
  },
  {
    title: "Standards and Compliance's",
    content: (
      <Paragraph>
        We have implemented the laid out compliance requirements and standards
        by the National Payment Corporation of India (NPCI) for the Bharat Bill
        Payment System (BBPS). We are also compliant to the “Data Localisation”
        requirements as per the guidelines of the Reserve Bank of India (RBI).
      </Paragraph>
    ),
  },
  {
    title: "Host Security",
    content: (
      <Paragraph>
        We use industry leading solutions around anti-virus, anti-malware,
        intrusion prevention systems, intrusion detection systems, file
        integrity monitoring, application control, application and audit log
        aggregation, and automated patching. All our servers are launched using
        the Center for Internet Security Benchmarks for Amazon Linux.
      </Paragraph>
    ),
  },
  {
    title: "Incident and Change Management",
    content: (
      <Paragraph>
        <li>
          {" "}
          • We have deployed mature processes around Change Management which
          enables us to release thoroughly tested features for you both reliably
          and securely enabling you to enjoy the Moneo experience with maximum
          assurance and security.
        </li>
        <li>
          • We have a very aggressive stance on Incident Management on both
          Systems downtime and Security and Network Operations Center and an
          Information Security Management System in place which quickly reacts,
          remediates or escalates any Incidents arising out of planned or
          unplanned changes.
        </li>
      </Paragraph>
    ),
  },
  {
    title: "Vulnerability Assessment and Penetration Testing",
    content: (
      <Paragraph>
        <li>
          • We have an in-house network security team which uses industry
          leading products to conduct manual and automated VA/PT activities
        </li>
        <li>
          • We employ both static application security testing and dynamic
          application security testing which is incorporated into our continuous
          integration / continuous deployment pipeline
        </li>
        <li>
          • We will leverage CERT-IN certified auditors to do periodic external
          testing and audits.
        </li>
      </Paragraph>
    ),
  },
  {
    title: "Annual security assessment",
    content: (
      <Paragraph>
        We will be undergoing annual security assessment from a
        Google-designated third party and keep the same updated from time and
        time or as per instructions from Google and will publish the “letter of
        assessment” on Moneo website and mobile applications.
      </Paragraph>
    ),
  },
  {
    title: "Responsible Disclosure",
    content: (
      <Typography>
        <Paragraph>
          We are committed to keeping our users&apos; data safe and secure. Keeping
          up with our users&apos; trust, we have implemented the highest grade of
          security standards and perform vulnerability scans, conduct
          penetration tests, and apply security patches to our systems
          periodically.
        </Paragraph>
        <Paragraph>
          Despite our best efforts, if you are a tech enthusiast or a researcher
          and identify any potential security vulnerability issue, we encourage
          you to report the same responsibly by writing to us at
          xxx@xxxx.co along with supporting screenshots/videos and
          detailed steps required to reproduce the vulnerability.
        </Paragraph>
        <Paragraph>
          We shall put in our best efforts to address and fix the issue within a
          reasonable time frame, requesting you not to disclose it publicly in
          the meantime.
        </Paragraph>
        <Paragraph>
          Note: While we appreciate your effort, if the vulnerability has been
          used for unlawful gains, we might take legal action against you.
        </Paragraph>
      </Typography>
    ),
  },
];

export default securityContent;
