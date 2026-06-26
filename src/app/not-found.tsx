import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-muted/50 p-6 rounded-full mb-6">
        <FileQuestion className="w-16 h-16 text-muted-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-[500px] mb-8 text-lg">
        Oops! The page you are looking for doesn&apos;t exist, has been moved,
        or is temporarily unavailable.
      </p>
      <Button
        render={<Link href="/" />}
        className="bg-indigo-600 hover:bg-indigo-700 text-white"
        size="lg"
      >
        Go Back Home
      </Button>
    </div>
  );
}
