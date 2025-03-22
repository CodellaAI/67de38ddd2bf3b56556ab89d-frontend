
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { Star, ChevronRight } from 'lucide-react'

export default function FeaturedPlugins() {
  const [featuredPlugins, setFeaturedPlugins] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchFeaturedPlugins = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/featured`)
        setFeaturedPlugins(response.data)
      } catch (error) {
        console.error('Error fetching featured plugins:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFeaturedPlugins()
  }, [])
  
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Featured Plugins</h2>
          <Link href="/#plugins" className="flex items-center text-primary-600 hover:text-primary-700 font-medium">
            View all
            <ChevronRight className="ml-1 w-5 h-5" />
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[4/3] rounded-t-lg w-full"></div>
                <div className="p-5 border border-gray-200 border-t-0 rounded-b-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredPlugins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPlugins.map((plugin) => (
              <Link href={`/plugins/${plugin._id}`} key={plugin._id} className="card group hover:translate-y-[-4px]">
                <div className="aspect-[4/3] relative">
                  <Image 
                    src={plugin.thumbnail ? `${process.env.NEXT_PUBLIC_API_URL}${plugin.thumbnail}` : '/placeholder-plugin.png'} 
                    alt={plugin.name}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  {plugin.category && (
                    <span className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                      {plugin.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {plugin.name}
                  </h3>
                  <div className="flex items-center mt-2 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${star <= plugin.averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      ({plugin.ratings?.length || 0})
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {plugin.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">${plugin.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">By {plugin.author?.username || 'Unknown'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No featured plugins available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
