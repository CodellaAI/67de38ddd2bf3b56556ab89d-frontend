
import Link from 'next/link'
import { ArrowRight, Upload } from 'lucide-react'

export default function CallToAction() {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl overflow-hidden shadow-lg">
          <div className="px-6 py-12 md:px-12 md:py-16 text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:max-w-2xl">
              <h2 className="text-3xl font-bold text-white">
                Are you a Minecraft plugin developer?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Join our marketplace and start selling your plugins to thousands of server owners. 
                Set your own prices, manage versions, and build your reputation in the community.
              </p>
            </div>
            <div className="mt-8 md:mt-0 flex-shrink-0">
              <Link
                href="/upload"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-white"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your Plugin
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
