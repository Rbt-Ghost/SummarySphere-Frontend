import LegalLayout from "../components/LegalLayout";

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy">
      <div className="space-y-6">
        <p className="text-sm opacity-70">Last updated: May 22, 2026</p>
        
        <p>
          At <strong>Summary Sphere</strong>, accessible from our application, one of our main priorities is the privacy of our visitors and users. This Privacy Policy document contains types of information that is collected and recorded by Summary Sphere and how we use it.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">1. Information We Collect</h2>
          <p>
            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> When you register for an Account, we may ask for your contact information, including items such as name, email address, and authentication credentials.</li>
            <li><strong>Document Data:</strong> We collect and process the documents, files, and texts you upload to Summary Sphere solely for the purpose of generating summaries and providing AI assistant interactions.</li>
            <li><strong>Usage Data:</strong> We may collect info about how you interact with our service (e.g., access times, features used, pages viewed).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">2. How We Use Your Information</h2>
          <p>We use the information we collect in various ways, including to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, operate, and maintain our application.</li>
            <li>Improve, personalize, and expand our application services.</li>
            <li>Understand and analyze how you use our application.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you, either directly or through one of our partners, to provide updates and other information relating to the website, and for marketing and promotional purposes.</li>
            <li>Send you emails (such as password resets or account-related notifications).</li>
            <li>Find and prevent fraud.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">3. Data Processing and AI Integration</h2>
          <p>
            Summary Sphere processes your documents using advanced AI summarization APIs. 
            By uploading files, you consent to the transmission of document contents to our secure processing partners. We ensure that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your documents are encrypted both in transit and at rest.</li>
            <li>Our processing partners do not use your document content to train public models or store your documents longer than necessary to complete the processing.</li>
            <li>You can permanently delete any document at any time, which immediately deletes it and its corresponding summaries from our servers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">4. Log Files and Cookies</h2>
          <p>
            Summary Sphere follows a standard procedure of using log files and cookies. 
            Cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. 
            This information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
            For more details, please see our GDPR & Cookie Policy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">5. GDPR Data Protection Rights</h2>
          <p>We want to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
            <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions. You can also delete your account and all data directly through your profile settings.</li>
            <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">6. Contact Us</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at: 
            <span className="text-blue-500 dark:text-blue-400 ml-1">privacy@summarysphere.bcbeno.me</span>.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
