import styles from './SimplePage.module.css'; // Use generic simple page style

const CopyrightPolicyPage = () => {
  return (
    <div className={`${styles.pageContainer} container`}>
      <h1 className={styles.title}>Copyright Policy</h1>
      <div className={styles.content}>
        <h2>Copyright Notice</h2>
        <p>
          All content on NotesVault, including text, graphics, logos, images, and software, is the property of NotesVault or its content suppliers and is protected by Indian copyright laws and international copyright treaties. Unauthorized use of our content is strictly prohibited.
        </p>

        <h2>Content Usage</h2>
        <p>
          Users are granted a limited license to access and use the content on NotesVault for personal, non-commercial purposes only. Any other use, including the reproduction, modification, distribution, transmission, republication, or display of the content on this website, is strictly prohibited without our express written permission.
        </p>

        <h2>Intellectual Property Rights</h2>
        <p>
          NotesVault respects the intellectual property rights of others and expects our users to do the same. If you believe that your work has been copied in a way that constitutes copyright infringement, please contact us at <a href="mailto:contact@notesvault.example.com">contact@notesvault.example.com</a> with the following information.
        </p>
        <ul>
            <li>A description of the copyrighted work that you claim has been infringed.</li>
            <li>A description of where the material that you claim is infringing is located on the website.</li>
            <li>Your address, telephone number, and email address.</li>
            <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner’s behalf.</li>
        </ul>
      </div>
    </div>
  );
};

export default CopyrightPolicyPage;