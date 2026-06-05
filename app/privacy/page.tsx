import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="border-b bg-muted/30 py-16 md:py-24">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              <h2>Your Privacy Matters</h2>
              <p>
                SelfPDF is built with privacy as a core principle. We believe your documents are yours alone, 
                and we've designed our application to ensure maximum privacy and security.
              </p>

              <h2>No File Storage</h2>
              <p>
                All PDF processing happens entirely in your browser using client-side JavaScript. 
                Your files are never uploaded to our servers, and we never store, access, or transmit your documents. 
                When you close your browser, your files are immediately discarded from memory.
              </p>

              <h2>No Data Collection</h2>
              <p>
                We do not collect any personal information, usage data, or analytics. We don't use cookies 
                for tracking, and we don't employ third-party analytics services. Your use of SelfPDF is completely anonymous.
              </p>

              <h2>Open Source Transparency</h2>
              <p>
                SelfPDF is open source, which means anyone can audit our code to verify our privacy claims. 
                You can review the source code, run your own instance, or contribute improvements.
              </p>

              <h2>Security</h2>
              <p>
                Since all processing happens in your browser, your files never leave your device. 
                This client-side approach provides the highest level of security and privacy. 
                Your documents remain under your control at all times.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                SelfPDF uses the following client-side libraries for PDF processing:
              </p>
              <ul>
                <li>pdf-lib - For PDF manipulation</li>
                <li>pdfjs-dist - For PDF rendering</li>
              </ul>
              <p>
                These libraries run entirely in your browser and do not communicate with external servers.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Any changes will be posted on this page 
                with an updated revision date.
              </p>

              <h2>Contact</h2>
              <p>
                If you have any questions about this privacy policy, please open an issue on our GitHub repository.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
