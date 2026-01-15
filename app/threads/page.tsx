import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Construction } from "lucide-react";

export default function ThreadsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-6">
        <Construction className="w-16 h-16 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Feature Coming Soon</h1>
      <p className="text-xl text-muted-foreground max-w-md mb-8">
        We are working hard to build an amazing community forum for you. Stay tuned for updates!
      </p>
      <Link href="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
