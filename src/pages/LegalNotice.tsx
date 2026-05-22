import LegalLayout from "../components/LegalLayout";

export default function LegalNotice() {
  return (
    <LegalLayout title="Legal Notice">
      <div className="space-y-6">
        <p className="text-sm opacity-70">Information required according to European Union law (including § 5 TMG / German Telemedia Act):</p>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">1. Provider Information</h2>
          <p className="leading-relaxed">
            <strong>Summary Sphere Project</strong><br />
            Represented by the Summary Sphere Development Group<br />
            Email: <span className="text-blue-500 dark:text-blue-400">legal@summarysphere.bcbeno.me</span><br />
            Website: <a href="https://summarysphere.bcbeno.me" className="text-blue-500 dark:text-blue-400 hover:underline">summarysphere.bcbeno.me</a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">2. Contact Information</h2>
          <p>
            For rapid electronic communication or legal requests:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>General Enquiries: <span className="text-blue-500 dark:text-blue-400">info@summarysphere.bcbeno.me</span></li>
            <li>Legal & Compliance: <span className="text-blue-500 dark:text-blue-400">legal@summarysphere.bcbeno.me</span></li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">3. Dispute Resolution</h2>
          <p>
            The European Commission provides a platform for online dispute resolution (ODR): 
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline ml-1">https://ec.europa.eu/consumers/odr/</a>.
          </p>
          <p>
            We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">4. Liability for Content</h2>
          <p>
            As a service provider, we are responsible for our own content on these pages under general laws. 
            However, we are not obligated to monitor transmitted or stored external information or to investigate circumstances that indicate illegal activity. 
            Obligations to remove or block the use of information under general laws remain unaffected. 
            Liability in this regard is only possible from the time we become aware of a concrete legal infringement. 
            Upon notification of such violations, we will remove this content immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">5. Liability for Links</h2>
          <p>
            Our Service may contain links to external third-party websites over which we have no control. 
            Therefore, we cannot assume any liability for this external content. The respective provider or operator of the linked pages is always responsible for their content. 
            The linked pages were checked for possible legal violations at the time of linking, and no illegal content was recognizable. 
            A permanent control of the contents of the linked pages is not reasonable without concrete evidence of an infringement. 
            If we become aware of any infringements, we will remove such links immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-4">6. Copyright</h2>
          <p>
            The content and works created by the site operators on these pages are subject to copyright law. 
            The duplication, editing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator. 
            Downloads and copies of this site are permitted for private, non-commercial use only. 
            Insofar as the content on this site was not created by the operator, the copyrights of third parties are respected. 
            In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please notify us accordingly. 
            Upon notification of violations, we will remove such content immediately.
          </p>
          <p className="text-sm opacity-60 mt-4">© 2026 Summary Sphere. All rights reserved.</p>
        </section>
      </div>
    </LegalLayout>
  );
}
