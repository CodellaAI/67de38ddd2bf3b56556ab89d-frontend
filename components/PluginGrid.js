
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { Star, Filter, ChevronDown } from 'lucide-react'

export default function PluginGrid() {
  const [plugins, setPlugins] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('newest')
  
  useEffect(() => {
    const fetchPlugins = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins`, {
          params: { category: filter !== 'all' ? filter : undefined, sort }
        })
        setPlugins(response.data)
      } catch (error) {
        console.error('Error fetching plugins:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlugins()
  }, [filter, sort])
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Utility', label: 'Utility' },
    { value: 'Economy', label: 'Economy' },
    { value: 'Admin Tools', label: 'Admin Tools' },
    { value: 'Fun', label: 'Fun' },
    { value: 'Game Mechanics', label: 'Game Mechanics' },
    { value: 'Anti-Grief', label: 'Anti-Grief' },
    { value: 'Other', label: 'Other' }
  ]
  
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ]
  
  return (
    <section id="plugins" className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">Browse Plugins</h2>
        
        <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md text-sm py-1.5 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-300 rounded-md text-sm py-1.5 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-t-lg w-full"></div>
                <div className="p-4 border border-gray-200 border-t-0 rounded-b-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : plugins.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {plugins.map((plugin) => (
              <Link href={`/plugins/${plugin._id}`} key={plugin._id} className="card group hover:translate-y-[-4px]">
                <div className="aspect-square relative">
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
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {plugin.name}
                  </h3>
                  <div className="flex items-center mt-1 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= plugin.averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      ({plugin.ratings?.length || 0})
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {plugin.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">${plugin.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500">v{plugin.version}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No plugins found matching your criteria.</p>
          </div>
        )}
        
        {plugins.length > 0 && (
          <div className="mt-12 text-center">
            <button className="btn btn-outline">
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
