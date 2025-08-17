import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">C.R.E.A.M</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Context Rules Everything Around Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop prompting like it's 2024
          </p>
        </div>
        <Link href="/projects">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Context Engineering Section */}
      <section className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Context Engineering</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg leading-relaxed">
              Transform your development workflow with intelligent context engineering. 
              Our platform helps you create comprehensive, tool-specific context files 
              that enhance your AI coding experience across multiple development environments.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Demo Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">See It In Action</h2>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-0">
            <AspectRatio ratio={16 / 9} className="relative">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground">Demo Video Coming Soon</p>
                </div>
              </div>
            </AspectRatio>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who are already using context engineering 
            to supercharge their AI coding experience.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/projects/new">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Your First Project
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            Learn More
          </Button>
        </div>
      </section>
    </div>
  );
}
