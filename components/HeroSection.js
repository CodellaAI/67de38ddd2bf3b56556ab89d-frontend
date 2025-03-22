
import Link from 'next/link'
import { ArrowRight, Package, Shield, Code, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white">
      <div className="container-custom py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              The Ultimate Minecraft Plugin Marketplace
            </h1>
            <p className="mt-6 text-lg text-white/90 leading-relaxed">
              Discover high-quality plugins to enhance your Minecraft server. Buy from trusted developers or sell your own creations to the community.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/#plugins" className="btn bg-white text-primary-700 hover:bg-gray-100">
                Browse Plugins
              </Link>
              <Link href="/upload" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20">
                Sell Your Plugins
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white/20">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Secure Marketplace</h3>
                  <p className="mt-1 text-sm text-white/80">
                    All plugins are verified for safety and quality
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white/20">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Developer-Friendly</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Easy upload and version management
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] bg-white/10 rounded-xl backdrop-blur-sm p-6 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-secondary-500/20 z-0"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm shadow-sm">
                      <div className="w-full aspect-square rounded-md bg-white/20 mb-3 flex items-center justify-center">
                        <Package className="h-8 w-8 text-white/70" />
                      </div>
                      <div className="h-3 bg-white/20 rounded-full w-2/3 mb-2"></div>
                      <div className="h-2 bg-white/20 rounded-full w-1/2"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <div className="h-4 bg-white/20 rounded-full w-24 mb-2"></div>
                    <div className="h-3 bg-white/20 rounded-full w-16"></div>
                  </div>
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-secondary-500/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 h-32 w-32 bg-primary-500/30 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Wave SVG */}
      <div className="w-full overflow-hidden leading-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[60px]">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="#ffffff" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="#ffffff" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ffffff"></path>
        </svg>
      </div>
    </div>
  )
}
