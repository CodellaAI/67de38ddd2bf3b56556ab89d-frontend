
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { Download, Calendar, Star, ExternalLink } from 'lucide-react'

export default function MyPurchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchMyPurchases = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/purchases`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        setPurchases(response.data)
      } catch (error) {
        console.error('Error fetching purchases:', error)
        toast.error('Failed to load your purchases')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMyPurchases()
  }, [user])
  
  const handleDownload = async (pluginId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${pluginId}/download`,
        { 
          headers: { Authorization: `Bearer ${user.token}` },
          responseType: 'blob'
        }
      )
      
      const plugin = purchases.find(p => p.plugin._id === pluginId)
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${plugin.plugin.name}.jar`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download plugin')
    }
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Purchases</h2>
      
      {loading ? (
        <div className="animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-4 bg-gray-100 rounded-lg p-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : purchases.length > 0 ? (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="md:flex">
                <div className="md:w-1/5 relative">
                  <div className="aspect-square relative">
                    <Image 
                      src={purchase.plugin.thumbnail ? `${process.env.NEXT_PUBLIC_API_URL}${purchase.plugin.thumbnail}` : '/placeholder-plugin.png'} 
                      alt={purchase.plugin.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="p-4 md:p-6 md:w-4/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{purchase.plugin.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-4 h-4 ${star <= purchase.plugin.averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          by {purchase.plugin.author?.username || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDownload(purchase.plugin._id)}
                      className="btn btn-primary btn-sm flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                  
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">{purchase.plugin.description}</p>
                  
                  <div className="mt-4 flex flex-wrap items-center justify-between">
                    <div className="flex space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Purchased:</span>{' '}
                        <span className="font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Price:</span>{' '}
                        <span className="font-medium">${purchase.price.toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Version:</span>{' '}
                        <span className="font-medium">{purchase.plugin.version}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-0">
                      <Link 
                        href={`/plugins/${purchase.plugin._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Plugin
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">You haven't purchased any plugins yet.</p>
          <Link href="/" className="btn btn-primary">
            Browse Plugins
          </Link>
        </div>
      )}
    </div>
  )
}
