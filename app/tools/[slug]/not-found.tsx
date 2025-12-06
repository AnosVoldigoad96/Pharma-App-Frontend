import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The tool you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/tools">Back to Tools</Link>
        </Button>
      </div>
    </div>
  );
}

