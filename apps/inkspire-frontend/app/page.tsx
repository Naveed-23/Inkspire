import { ModeToggle } from "@/components/ModeToggle";
import { ArrowRight, Circle, Pencil, Ruler, Share2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
            <Pencil className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inkspire
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Login
          </Link>
          <ModeToggle />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center gap-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
          Unleash Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Creativity</span> with Collaborative Drawing
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Inkspire brings people together through real-time collaborative drawing. Create, share, and inspire with our intuitive canvas tools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/app"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Start Drawing <ArrowRight className="h-4 w-4" />
          </Link>
          <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium rounded-lg transition-colors">
            Learn More
          </button>
        </div>
        <div className="mt-8 w-full max-w-5xl aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
          {/* Placeholder for app screenshot or demo */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center p-6">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-indigo-400" />
              <p className="text-lg font-medium">Inkspire Canvas Preview</p>
              <p className="text-sm mt-2">Real-time collaborative drawing experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Share2 className="h-8 w-8 text-indigo-600" />,
              title: "Real-time Collaboration",
              description: "Draw together with others in perfect sync, seeing changes as they happen."
            },
            {
              icon: <Pencil className="h-8 w-8 text-indigo-600" />,
              title: "Intuitive Tools",
              description: "Shapes, freehand drawing, and more with our easy-to-use interface."
            },
            {
              icon: <Ruler className="h-8 w-8 text-indigo-600" />,
              title: "Precision Controls",
              description: "Adjust stroke width, colors, and more for perfect designs every time."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-gray-700 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Create Together?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-6">
            Join thousands of users who are already collaborating and creating amazing drawings with Inkspire.
          </p>
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 hover:bg-gray-100 font-medium rounded-lg transition-colors"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()} Inkspire. All rights reserved.</p>
      </footer>
    </div>
  );
}