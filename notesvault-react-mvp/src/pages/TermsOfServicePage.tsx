import styles from './SimplePage.module.css'; // Use generic simple page style

const TermsOfServicePage = () => {
  return (
    <div className={`${styles.pageContainer} container`}>
      <h1 className={styles.title}>Terms of Service</h1>
      <div className={styles.content}>
        <h2>Introduction</h2>
        <p>
          Welcome to NotesVault. By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website.
        </p>

        <h2>User Responsibilities</h2>
        <ul>
            <li><strong>Account Registration:</strong> You may be required to register an account to access certain features of our website. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
            <li><strong>Use of Content:</strong> You agree to use the content provided on NotesVault for lawful purposes only and in accordance with these Terms of Service.</li>
            <li><strong>Prohibited Activities:</strong> You agree not to engage in any activities that could harm or interfere with the operation of NotesVault, including but not limited to distributing viruses, spamming, or attempting to gain unauthorized access to our systems.</li>
        </ul>


        <h2>Content Responsibility</h2>
        <p>
          NotesVault is not responsible for plagiarism or any content violations made by the authors, writers, or any contributors to the website. It is the sole responsibility of the author or content creator to ensure that their work is original and properly cited. By submitting content to NotesVault, you agree that you are solely responsible for any claims, losses, damages, or expenses resulting from the content you provide.
        </p>

        <h2>Dispute Resolution</h2>
        <p>
          In the event of any dispute arising out of or in connection with these Terms of Service, the parties shall attempt to resolve the dispute amicably through mutual negotiations. If the dispute cannot be resolved through mutual negotiations within 30 days, the parties agree to submit the dispute to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The arbitration shall be conducted in English and the seat of arbitration shall be Pune, India.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          NotesVault provides the website and its content on an “as is” and “as available” basis without any warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted or error-free.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          In no event shall NotesVault, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website, even if we have been advised of the possibility of such damages.
        </p>

        <h2>Governing Law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at <a href="mailto:contact@notesvault.example.com">contact@notesvault.example.com</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;