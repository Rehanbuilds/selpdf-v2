import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b bg-muted/30 py-16 md:py-24">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h2>Acceptance of Terms</h2>
              <p>
                By accessing and using SelfPDF, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>

              <h2>Description of Service</h2>
              <p>
                SelfPDF provides free, open-source PDF processing tools that run entirely in your web browser. 
                Our services include merging, splitting, compressing, converting, and editing PDF files.
              </p>

              <h2>Use of Service</h2>
              <p>
                You may use SelfPDF for any lawful purpose. You agree not to:
              </p>
              <ul>
                <li>Use the service for any illegal activities</li>
                <li>Attempt to compromise the security or integrity of the service</li>
                <li>Interfere with other users' access to the service</li>
                <li>Use automated systems to access the service in a manner that sends more requests than a human can reasonably produce</li>
              </ul>

              <h2>No Warranties</h2>
              <p>
                SelfPDF is provided "as is" without any warranties, expressed or implied. 
                We do not guarantee that the service will be error-free, secure, or uninterrupted. 
                You use the service at your own risk.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, SelfPDF and its contributors shall not be liable 
                for any damages arising from your use of the service, including but not limited to data loss, 
                corruption, or any other damages.
              </p>

              <h2>Open Source License</h2>
              <p>
                SelfPDF is released under the MIT License. You are free to use, modify, and distribute 
                the software in accordance with the license terms.
              </p>

              <h2>Privacy</h2>
              <p>
                Your use of SelfPDF is also governed by our Privacy Policy. Please review our 
                Privacy Policy to understand how we handle your information (or rather, how we don't collect any).
              </p>

              <h2>Modifications to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately 
                upon posting. Your continued use of the service constitutes acceptance of the modified terms.
              </p>

              <h2>Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws, 
                without regard to conflict of law provisions.
              </p>

              <h2>Contact</h2>
              <p>
                For questions about these Terms of Service, please open an issue on our GitHub repository.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
