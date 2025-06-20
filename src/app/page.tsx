import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { List, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function Home() {
  const userId = (await auth()).userId;

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-primary/10 py-12">
      <Card className="w-full max-w-md mx-auto p-8 border-none shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10 mb-8">
        <CardHeader className="flex flex-col items-center">
          <div className="mb-4">
            <img
              src="/window.svg"
              alt="TodoMaster Logo"
              className="h-14 w-14"
            />
          </div>
          <CardTitle className="text-3xl font-extrabold text-center text-black">
            TodoMaster
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-base text-muted-foreground mb-8">
            The ultimate minimal task manager for professionals and teams.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="text-lg w-full">
              <Link href="/sign-up">Start for Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg w-full"
            >
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <List className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-semibold mb-1">Smart Organization</h4>
              <p className="text-muted-foreground text-sm">
                Categorize and prioritize tasks with ease.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Clock className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-semibold mb-1">Reminders</h4>
              <p className="text-muted-foreground text-sm">
                Never miss a deadline with timely reminders.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h4 className="font-semibold mb-1">Collaboration</h4>
              <p className="text-muted-foreground text-sm">
                Share and manage tasks with your team.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Why Choose Us?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 text-base mx-auto max-w-md">
            <li>Lightning-fast and intuitive interface</li>
            <li>Secure and privacy-focused</li>
            <li>Perfect for both individuals and teams</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
