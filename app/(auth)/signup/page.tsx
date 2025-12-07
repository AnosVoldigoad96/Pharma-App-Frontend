import { getSiteSettings } from "@/lib/supabase/queries";
import { SignUpForm } from "./signup-form";

export default async function SignUpPage() {
  const { data: settings } = await getSiteSettings();
  const authSettings = {
    brandName: settings?.brand_name || "ePharmatica",
    brandLogo: settings?.brand_logo || null,
    subtitle: "Your comprehensive pharmaceutical knowledge platform",
  };
  
  return <SignUpForm settings={authSettings} />;
}

