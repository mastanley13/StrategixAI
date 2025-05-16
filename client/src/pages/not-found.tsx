import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/main-layout";

export default function NotFoundPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-display font-bold mb-6">404 - Page Not Found</h1>
        <p className="text-xl mb-8 max-w-2xl">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              Browse Our Blog
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#book-call">
              Contact Us
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
