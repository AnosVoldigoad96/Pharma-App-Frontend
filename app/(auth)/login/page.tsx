import { getSiteSettings } from "@/lib/supabase/queries";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const { data: settings } = await getSiteSettings();
  const authSettings = {
    brandName: settings?.brand_name || "ePharmatica",
    brandLogo: settings?.brand_logo || null,
    subtitle: "Your comprehensive pharmaceutical knowledge platform",
  };
  
  return <LoginForm settings={authSettings} />;
}
