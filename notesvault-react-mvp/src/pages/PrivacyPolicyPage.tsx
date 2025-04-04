import styles from './SimplePage.module.css'; // Use generic simple page style

const PrivacyPolicyPage = () => {
  return (
    <div className={`${styles.pageContainer} container`}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <h2>Introduction</h2>
        <p>
          NotesVault (“we,” “our,” “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.notesvault.in. Please read this policy carefully to understand our views and practices regarding your data.
        </p>

        <h2>Information We Collect</h2>
        <p>
          <strong>Personal Data:</strong> We may collect personally identifiable information such as your name, email address, and other contact details when you register on our site, subscribe to our newsletter, or fill out a form.
        </p>
        <p>
          <strong>Usage Data:</strong> We collect information about your interactions with our website, including IP address, browser type, operating system, pages visited, and the date and time of your visit.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
            <li>To provide, operate, and maintain our website.</li>
            <li>To improve, personalize, and expand our website.</li>
            <li>To understand and analyze how you use our website.</li>
            <li>To develop new products, services, features, and functionality.</li>
            <li>To communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website.</li>
            <li>To send you emails with updates, newsletters, and promotional materials, provided you have opted to receive such communications.</li>
        </ul>


        <h2>Legal Basis for Processing</h2>
        <p>We process your data in accordance with the following legal bases:</p>
        <ul>
            <li><strong>Consent:</strong> We may process your data if you have permission for a specific purpose.</li>
            <li><strong>Contractual Necessity:</strong> We may process your data to fulfill our contractual obligations.</li>
            <li><strong>Legal Obligations:</strong> We may process your data to comply with legal obligations under applicable law.</li>
        </ul>


        <h2>Sharing Your Information</h2>
        <p>
          We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information. Your personal data is stored on secure servers and is protected by industry-standard encryption.
        </p>

        <h2>Your Rights</h2>
        <p>Under Indian law, you have the following rights regarding your personal data:</p>
        <ul>
            <li><strong>Access:</strong> You have the right to request a copy of the personal data we hold about you.</li>
            <li><strong>Correction:</strong> You have the right to request that we correct any inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> You have the right to request that we delete your personal data, subject to certain exceptions.</li>
            <li><strong>Objection:</strong> You have the right to object to the processing of your personal data under certain circumstances.</li>
            <li><strong>Restriction:</strong> You have the right to request that we restrict the processing of your personal data under certain conditions.</li>
        </ul>
        <p>If you have any concerns about your privacy, please contact us at <a href="mailto:privacy@notesvault.example.com">privacy@notesvault.example.com</a>.</p>


        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2>Content Preparation and Sources</h2>
        <p>
            All the educational material and content available on NotesVault are prepared by professionals, including esteemed university professors and highly qualified experts. In creating this content, we may refer to a variety of sources, including:
        </p>
        <ul>
            <li>Books: Academic textbooks and reference materials.</li>
            <li>Online Articles: Reputable online articles and journals.</li>
            <li>AI Models: Assistance from artificial intelligence models for generating or enhancing content.</li>
        </ul>
        <p>
            We ensure that all content is accurate, reliable, and adheres to the highest academic standards. However, users are advised to cross-reference with primary sources and consult professionals when necessary.
        </p>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;