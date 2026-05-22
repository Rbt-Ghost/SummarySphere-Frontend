import LegalLayout from "../components/LegalLayout";

export default function GDPR() {
  return (
    <LegalLayout title="GDPR & Cookie Policy">
      <div className="space-y-6">
        <p className="text-sm opacity-70">Last updated: May 22, 2026</p>

        <p>
          At <strong>Summary Sphere</strong>, we are committed to compliance with the General Data Protection Regulation (GDPR) to protect the privacy and personal data of our users within the European Union (EU) and European Economic Area (EEA).
        </p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">1. Data Controller</h2>
          <p>
            Summary Sphere acts as the Data Controller for your account information and contact data. 
            For any inquiries regarding how your data is handled or to exercise your data subject rights, please email: 
            <span className="text-blue-500 dark:text-blue-400 ml-1">gdpr@summarysphere.bcbeno.me</span>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">2. Core Principles of Data Processing</h2>
          <p>We process your personal data in accordance with the GDPR principles:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Lawfulness, Fairness, and Transparency:</strong> We only collect data with your consent or for performance of our services, and we explain exactly why.</li>
            <li><strong>Purpose Limitation:</strong> Personal data is processed solely for document analysis, summarization, account management, and service improvement.</li>
            <li><strong>Data Minimization:</strong> We only collect the minimal personal data required to run the service (email, name, uploaded document content).</li>
            <li><strong>Storage Limitation:</strong> Your files and summaries are kept only as long as your account is active, or until you choose to delete them.</li>
            <li><strong>Integrity and Confidentiality:</strong> We implement strict encryption measures to prevent unauthorized access to your files.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">3. Your Rights as a Data Subject</h2>
          <p>Under the GDPR, you possess rights which we facilitate directly in the application:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Right of Access & Portability:</strong> You can access all your documents and summaries directly from your dashboard.</li>
            <li><strong>Right to Rectification:</strong> You can update your account settings at any time.</li>
            <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You can permanently delete individual documents or delete your entire account, which immediately and irrevocably erases all associated files, metadata, and AI-generated summaries from our servers.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">4. Cookie Policy</h2>
          <p>
            Cookies are small text files stored on your device when you visit websites. We use cookies and similar storage technologies to run our service safely and effectively.
          </p>
          
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-2">Types of Cookies We Use</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-zinc-200 dark:border-slate-700 text-left my-2 text-sm">
              <thead>
                <tr className="bg-zinc-50 dark:bg-slate-800">
                  <th className="border border-zinc-200 dark:border-slate-700 p-2 font-semibold">Cookie Name / Storage Key</th>
                  <th className="border border-zinc-200 dark:border-slate-700 p-2 font-semibold">Type / Purpose</th>
                  <th className="border border-zinc-200 dark:border-slate-700 p-2 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2 font-mono">session_token</td>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2">Essential. Maintains your authenticated session securely.</td>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2">Session / Persistent</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2 font-mono">darkMode</td>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2">Preferences. Remembers your choice of Light or Dark mode.</td>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2">Persistent (Local Storage)</td>
                </tr>
                <tr>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2 font-mono">summary-* / summaryType-*</td>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2">Performance & Caching. Caches generated summaries to load them instantly on your device without repeated API calls.</td>
                  <td className="border border-zinc-200 dark:border-slate-700 p-2">Persistent (Local Storage)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-4">Managing Cookies</h3>
          <p>
            You can control or delete cookies through your browser settings. However, disabling essential cookies will prevent you from logging in and using the document summarization dashboard.
          </p>
        </section>
      </div>
    </LegalLayout>
  );
}
