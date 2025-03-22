
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { Star, Download, ShoppingCart, Calendar, Tag, User, Code, Clock, ArrowLeft } from 'lucide-react'
import VersionHistory from '@/components/VersionHistory'
import RatingStars from '@/components/RatingStars'
import Link from 'next/link'

export default function PluginDetail() {
  const { id } = useParams()
  const [plugin, setPlugin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [purchasing, setPurchasing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    const fetchPlugin = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}`)
        setPlugin(response.data)
        
        // Check if user has already rated this plugin
        if (isAuthenticated && user) {
          const ratingResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}/rating`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          )
          if (ratingResponse.data && ratingResponse.data.rating) {
            setUserRating(ratingResponse.data.rating)
          }
        }
      } catch (error) {
        console.error('Error fetching plugin:', error)
        toast.error('Failed to load plugin details')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchPlugin()
    }
  }, [id, isAuthenticated, user])
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to purchase this plugin')
      router.push('/login')
      return
    }
    
    setPurchasing(true)
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      toast.success('Plugin purchased successfully!')
      // Refresh plugin data to show download button
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}`)
      setPlugin(response.data)
    } catch (error) {
      console.error('Purchase error:', error)
      toast.error(error.response?.data?.message || 'Failed to purchase plugin')
    } finally {
      setPurchasing(false)
    }
  }
  
  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to download this plugin')
      router.push('/login')
      return
    }
    
    setDownloading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}/download`,
        { 
          headers: { Authorization: `Bearer ${user.token}` },
          responseType: 'blob'
        }
      )
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${plugin.name}.jar`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      toast.success('Download started!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download plugin')
    } finally {
      setDownloading(false)
    }
  }
  
  const handleRating = async (rating) => {
    if (!isAuthenticated) {
      toast.error('Please log in to rate this plugin')
      router.push('/login')
      return
    }
    
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}/rate`,
        { rating },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      setUserRating(rating)
      toast.success('Rating submitted!')
      
      // Refresh plugin data to show updated average rating
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}`)
      setPlugin(response.data)
    } catch (error) {
      console.error('Rating error:', error)
      toast.error('Failed to submit rating')
    }
  }
  
  if (loading) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <div className="animate-pulse text-xl">Loading plugin details...</div>
      </div>
    )
  }
  
  if (!plugin) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Plugin not found</h1>
          <p className="mt-4">The plugin you're looking for doesn't exist or has been removed.</p>
          <Link href="/" className="btn btn-primary mt-6 inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }
  
  const hasPlugin = plugin.purchases?.some(purchase => purchase.user === user?._id)
  
  return (
    <div className="container-custom py-10">
      <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to plugins
      </Link>
      
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="md:flex">
          {/* Plugin Image */}
          <div className="md:w-1/3 relative">
            <div className="aspect-square relative">
              <Image 
                src={plugin.thumbnail ? `${process.env.NEXT_PUBLIC_API_URL}${plugin.thumbnail}` : '/placeholder-plugin.png'} 
                alt={plugin.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Plugin Details */}
          <div className="md:w-2/3 p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{plugin.name}</h1>
                <div className="flex items-center mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-5 h-5 ${star <= plugin.averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {plugin.averageRating.toFixed(1)} ({plugin.ratings?.length || 0} reviews)
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-gray-900">${plugin.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0">
                {hasPlugin ? (
                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="btn btn-primary flex items-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    {downloading ? 'Downloading...' : 'Download'}
                  </button>
                ) : (
                  <button
                    onClick={handlePurchase}
                    disabled={purchasing}
                    className="btn btn-primary flex items-center"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {purchasing ? 'Processing...' : `Buy for $${plugin.price.toFixed(2)}`}
                  </button>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm">By {plugin.author?.username || 'Unknown'}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm">Published {new Date(plugin.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm">Category: {plugin.category || 'Miscellaneous'}</span>
                </div>
                <div className="flex items-center">
                  <Code className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="text-sm">Latest Version: {plugin.version}</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{plugin.description}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8 border-t border-gray-200">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Version History */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-600" />
                Version History
              </h2>
              <VersionHistory versions={plugin.versions || []} />
            </div>
            
            {/* Rating Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-gray-600" />
                Rate This Plugin
              </h2>
              
              {isAuthenticated ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    {userRating > 0 ? 'Your rating:' : 'Select your rating:'}
                  </p>
                  <RatingStars 
                    rating={userRating} 
                    setRating={handleRating}
                    size={8}
                  />
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Please <Link href="/login" className="text-primary-600 font-medium">log in</Link> to rate this plugin.
                  </p>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">User Ratings</h3>
                {plugin.ratings && plugin.ratings.length > 0 ? (
                  <div className="space-y-4">
                    {plugin.ratings.slice(0, 3).map((rating, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex items-center">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-4 h-4 ${star <= rating.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            by {rating.user?.username || 'Anonymous'}
                          </span>
                        </div>
                        {rating.comment && (
                          <p className="text-sm mt-1 text-gray-700">{rating.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No ratings yet. Be the first to rate this plugin!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
