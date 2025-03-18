import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from 'next/image';
import { AnimationStyles } from './components/AnimationStyles';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-fade-in">
                IELTS Essay Checker
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 animate-slide-up">
                Master your IELTS writing skills with our advanced essay checking system.
                Get detailed feedback and track your progress over time.
              </p>
            </div>
            <div className="space-x-4 animate-bounce-in">
              {!session ? (
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  Go to Dashboard
                </Link>
              )}
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Excel</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides comprehensive tools to help you improve your IELTS writing skills and achieve your target score.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="rounded-full bg-blue-100 p-4">
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
                  className="h-6 w-6 text-blue-600"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Academic Task 1</h3>
              <p className="text-gray-500 text-center">
                Practice describing charts, graphs, and diagrams with our specialized feedback system. Learn to identify key trends and make accurate comparisons.
              </p>
              <Link
                href="/academic-task1"
                className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Try Academic Task 1
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="rounded-full bg-green-100 p-4">
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
                  className="h-6 w-6 text-green-600"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" y1="22" x2="12" y2="12" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">General Task 1</h3>
              <p className="text-gray-500 text-center">
                Master the art of letter writing for different purposes and audiences. Learn proper formatting, tone, and language for formal, semi-formal, and informal letters.
              </p>
              <Link
                href="/general-task1"
                className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Try General Task 1
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
              <div className="rounded-full bg-purple-100 p-4">
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
                  className="h-6 w-6 text-purple-600"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Task 2</h3>
              <p className="text-gray-500 text-center">
                Develop strong essay writing skills with detailed corrections and suggestions. Learn to structure arguments, provide relevant examples, and write cohesively.
              </p>
              <Link
                href="/task2"
                className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Try Task 2
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Process</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our simple 3-step process helps you improve your writing skills quickly and effectively.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 pt-12">
            <div className="flex flex-col items-center space-y-4 relative">
              <div className="rounded-full bg-blue-600 text-white text-2xl font-bold h-12 w-12 flex items-center justify-center">1</div>
              <div className="h-1 w-full bg-blue-600 absolute top-6 left-1/2 hidden md:block"></div>
              <h3 className="text-xl font-bold">Choose an Essay Type</h3>
              <p className="text-gray-500 text-center">
                Select from Academic Task 1, General Task 1, or Task 2 based on your practice needs.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 relative">
              <div className="rounded-full bg-blue-600 text-white text-2xl font-bold h-12 w-12 flex items-center justify-center">2</div>
              <div className="h-1 w-full bg-blue-600 absolute top-6 left-1/2 hidden md:block"></div>
              <h3 className="text-xl font-bold">Write Your Response</h3>
              <p className="text-gray-500 text-center">
                Compose your essay following the prompt and guidelines provided for your chosen task.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-blue-600 text-white text-2xl font-bold h-12 w-12 flex items-center justify-center">3</div>
              <h3 className="text-xl font-bold">Get Feedback</h3>
              <p className="text-gray-500 text-center">
                Submit your essay and receive detailed feedback on your writing to help you improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">Testimonials</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from students who have improved their IELTS scores using our platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 pt-12">
            <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 p-1">
                  <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Sarah J.</h3>
                  <p className="text-sm text-gray-500">Achieved Band 7.5 in Writing</p>
                </div>
              </div>
              <p className="text-gray-500">
                "The detailed feedback on my Task 2 essays helped me understand my weaknesses in argument development. After just 4 weeks of practice, I improved from Band 6 to 7.5!"
              </p>
            </div>
            <div className="flex flex-col space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-100 p-1">
                  <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Michael T.</h3>
                  <p className="text-sm text-gray-500">Achieved Band 8 in Writing</p>
                </div>
              </div>
              <p className="text-gray-500">
                "The Academic Task 1 practice was invaluable. I learned how to analyze different types of charts and present the information clearly. My score jumped from 6.5 to 8!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Improve Your IELTS Score?</h2>
              <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed">
                Join thousands of students who have achieved their target scores with our platform.
              </p>
            </div>
            <div className="space-x-4">
              {!session ? (
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  Get Started Now
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-600 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-800 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-400">© 2023 IELTS Essay Checker. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Add animation styles */}
      <AnimationStyles />
    </main>
  );
}
