import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Brain, MessageSquare, Lightbulb, CheckCircle } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">PromptEngineer</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  <span className="animate-pulse">✨ Introducing PromptEngineer</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  Craft Perfect AI Prompts
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Transform vague ideas into powerful, precise prompts that get exactly what you want from AI models.
                  Unlock the full potential of AI with expertly engineered prompts.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="flex items-center gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                    >
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative rounded-lg bg-card p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <div className="ml-auto text-xs text-muted-foreground">Prompt Enhancement</div>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-md bg-muted p-3">
                        <p className="text-sm text-muted-foreground">Original:</p>
                        <p className="font-medium">Write about climate change</p>
                      </div>
                      <div className="rounded-md bg-primary/10 p-3 border border-primary/20">
                        <p className="text-sm text-primary">Enhanced:</p>
                        <p className="font-medium">
                          Write a comprehensive analysis of climate change, including its causes, current impacts, and
                          potential solutions. Include scientific data and perspectives from different stakeholders.
                          Format the response with clear headings and bullet points for readability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  <Zap className="mr-1 h-3.5 w-3.5 text-primary" />
                  <span>Powerful Features</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Why Choose PromptEngineer?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our platform offers everything you need to create perfect prompts for any AI model
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute right-0 top-0 h-16 w-16 translate-x-4 -translate-y-4 bg-primary/10 rounded-full blur-xl"></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Our system uses advanced AI to analyze your prompts and suggest targeted improvements
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute right-0 top-0 h-16 w-16 translate-x-4 -translate-y-4 bg-primary/10 rounded-full blur-xl"></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Interactive Refinement</h3>
                <p className="text-muted-foreground">
                  Answer clarifying questions to help our system understand exactly what you need
                </p>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="absolute right-0 top-0 h-16 w-16 translate-x-4 -translate-y-4 bg-primary/10 rounded-full blur-xl"></div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Model Flexibility</h3>
                <p className="text-muted-foreground">
                  Choose between OpenAI or Hugging Face models to power your prompt enhancements
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our prompt engineering assistant helps you create more effective prompts in three simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border"></div>

              <div className="relative flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Enter Your Prompt</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Start by entering your initial prompt for any AI model
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>No need for perfect wording</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Works with any prompt length</span>
                  </li>
                </ul>
              </div>

              <div className="relative flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Answer Questions</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Respond to clarifying questions to refine your intent
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Targeted, relevant questions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Review improvement suggestions</span>
                  </li>
                </ul>
              </div>

              <div className="relative flex flex-col items-center space-y-4 rounded-lg bg-background p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Get Enhanced Prompt</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Receive a structured, optimized prompt for better results
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground text-left">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Copy directly to clipboard</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                    <span>Save to your prompt history</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Discover how PromptEngineer has helped users get better results from AI
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      "PromptEngineer has completely transformed how I interact with AI. My prompts are now so much more
                      effective, and I get exactly what I need on the first try."
                    </p>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-muted-foreground">Content Creator</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-primary"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      "As a developer, I need to communicate clearly with AI models. PromptEngineer has cut my
                      development time in half by helping me craft precise prompts that get the right code the first
                      time."
                    </p>
                    <div>
                      <p className="font-medium">Michael Chen</p>
                      <p className="text-sm text-muted-foreground">Software Engineer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your AI Experience?
                </h2>
                <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed opacity-90">
                  Join thousands of users who are getting better results from AI with expertly crafted prompts
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="flex items-center gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 PromptEngineer. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
