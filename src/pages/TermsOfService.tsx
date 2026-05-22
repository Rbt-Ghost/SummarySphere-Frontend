import LegalLayout from "../components/LegalLayout";

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service">
      <div className="space-y-6">
        <p className="text-sm opacity-70">Last updated: May 22, 2026</p>

        <p>
          Welcome to <strong>Summary Sphere</strong>. These Terms of Service ("Terms") govern your access to and use of the Summary Sphere website, services, and applications (the "Service"). By using the Service, you agree to be bound by these Terms. If you do not agree, you may not use the Service.
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">1. Use of the Service</h2>
          <p>
            Summary Sphere grants you a limited, non-exclusive, non-transferable, and revocable license to use our Service for personal or professional document summarization and analysis, subject to these Terms.
          </p>
          <p>
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Upload or process any document or content that violates any third-party rights, including privacy, publicity, copyright, trademark, or patent rights.</li>
            <li>Use the Service for any illegal, harmful, or unauthorized purpose.</li>
            <li>Attempt to interfere with or compromise the security, integrity, or proper working of the Service.</li>
            <li>Use automated systems (like bots, scrapers, or spiders) to access the Service without our written permission.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">2. Account Registration and Security</h2>
          <p>
            To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during registration. 
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. 
            If you detect any unauthorized use of your account, you must notify us immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">3. User Content & Documents</h2>
          <p>
            You retain all ownership rights, copyrights, and intellectual property rights in the documents and texts you upload to the Service ("User Content"). 
            By uploading documents, you grant Summary Sphere a worldwide, royalty-free, and secure license to process, store, and analyze the documents solely to provide the services you request (e.g., generating summaries and enabling the AI assistant to chat about the documents).
          </p>
          <p>
            We do not share your documents with third parties for marketing purposes, nor do we use your documents to train public AI models. You can permanently delete your documents and account at any time.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">4. Intellectual Property Rights</h2>
          <p>
            The Service, including its logo, user interface, designs, software, code, and graphics, is the exclusive property of Summary Sphere and is protected by copyright, trademark, and other laws. 
            You may not copy, modify, distribute, or create derivative works based on the Service without our express written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">5. Disclaimer of Warranties</h2>
          <p className="italic">
            The Service is provided on an "as is" and "as available" basis. Summary Sphere makes no warranties, expressed or implied, regarding the accuracy, completeness, availability, reliability, or suitability of the summaries or services provided. 
            AI-generated summaries are automated reflections of the uploaded files and may contain inaccuracies. Users should verify critical details independently.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Summary Sphere shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your access to or use of, or inability to access or use, the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account or access to the Service at any time, without prior notice, if you violate these Terms or if we believe your actions pose a risk to other users or the Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">8. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes, we will notify you by posting the new Terms on this page and updating the "Last updated" date at the top. Your continued use of the Service after changes constitute acceptance of the updated Terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">9. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at: 
            <span className="text-blue-500 dark:text-blue-400 ml-1">terms@summarysphere.bcbeno.me</span>.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
