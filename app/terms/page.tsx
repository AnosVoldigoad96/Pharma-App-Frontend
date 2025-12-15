import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/supabase/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LegalHero } from "@/components/legal-hero";

export const metadata: Metadata = {
  title: "Terms & Conditions | ePharmatica",
  description: "Terms and Conditions for using ePharmatica",
};

export default async function TermsPage() {
  const { data: settings } = await getSiteSettings();
  const brandName = settings?.brand_name || "ePharmatica";

  return (
    <div className="min-h-screen bg-background">
      <LegalHero
        heading="Terms & Conditions"
        subtitle="The rules and regulations for using our website."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using {brandName}, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to abide by the
                above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
              <p className="text-muted-foreground mb-2">
                Permission is granted to temporarily download one copy of the materials on
                {brandName}'s website for personal, non-commercial transitory viewing only.
              </p>
              <p className="text-muted-foreground">
                This is the grant of a license, not a transfer of title, and under this
                license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-muted-foreground">
                When you create an account with us, you must provide information that is
                accurate, complete, and current at all times. You are responsible for
                safeguarding the password and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The content on {brandName}, including but not limited to text, graphics,
                logos, images, and software, is the property of {brandName} and is protected
                by copyright and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Disclaimer</h2>
              <p className="text-muted-foreground">
                The materials on {brandName}'s website are provided on an 'as is' basis.
                {brandName} makes no warranties, expressed or implied, and hereby disclaims
                and negates all other warranties including, without limitation, implied
                warranties or conditions of merchantability, fitness for a particular purpose,
                or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Limitations</h2>
              <p className="text-muted-foreground">
                In no event shall {brandName} or its suppliers be liable for any damages
                (including, without limitation, damages for loss of data or profit, or due
                to business interruption) arising out of the use or inability to use the
                materials on {brandName}'s website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Revisions</h2>
              <p className="text-muted-foreground">
                {brandName} may revise these terms of service at any time without notice.
                By using this website you are agreeing to be bound by the then current
                version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. Contact Information</h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms & Conditions, please contact us
                through our contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

