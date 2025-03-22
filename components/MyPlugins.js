
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { Plus, Edit, Trash2, Star, Download, Eye } from 'lucide-react'

export default function MyPlugins() {
  const [plugins, setPlugins] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  
  useEffect(() => {
    const fetchMyPlugins = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/my-plugins`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        )
        setPlugins(response.data)
      } catch (error) {
        console.error('Error fetching my plugins:', error)
        toast.error('Failed to load your plugins')
      } finally {
        setLoading(false)
      }
    }
    
    fetchMyPlugins()
  }, [user])
  
  const handleDeletePlugin = async (id) => {
    if (!confirm('Are you sure you want to delete this plugin? This action cannot be undone.')) {
      return
    }
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      
      setPlugins(plugins.filter(plugin => plugin._id !== id))
      toast.success('Plugin deleted successfully')
    } catch (error) {
      console.error('Delete plugin error:', error)
      toast.error('Failed to delete plugin')
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Plugins</h2>
        <Link href="/upload" className="btn btn-primary flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Upload New
        </Link>
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="mb-4 bg-gray-100 rounded-lg p-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : plugins.length > 0 ? (
        <div className="space-y-6">
          {plugins.map((plugin) => (
            <div key={plugin._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="md:flex">
                <div className="md:w-1/4 relative">
                  <div className="aspect-square relative">
                    <Image 
                      src={plugin.thumbnail ? `${process.env.NEXT_PUBLIC_API_URL}${plugin.thumbnail}` : '/placeholder-plugin.png'} 
                      alt={plugin.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="p-4 md:p-6 md:w-3/4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{plugin.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={`w-4 h-4 ${star <= plugin.averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          ({plugin.ratings?.length || 0} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link 
                        href={`/plugins/${plugin._id}`}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeletePlugin(plugin._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-2 text-gray-600 text-sm line-clamp-2">{plugin.description}</p>
                  
                  <div className="mt-4 flex flex-wrap items-center justify-between">
                    <div className="flex space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Price:</span>{' '}
                        <span className="font-medium">${plugin.price.toFixed(2)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Version:</span>{' '}
                        <span className="font-medium">{plugin.version}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Sales:</span>{' '}
                        <span className="font-medium">{plugin.purchases?.length || 0}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-0">
                      <Link 
                        href={`/upload/${plugin._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Update Plugin
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
          <p className="text-gray-500 mb-4">You haven't uploaded any plugins yet.</p>
          <Link href="/upload" className="btn btn-primary">
            Upload Your First Plugin
          </Link>
        </div>
      )}
    </div>
  )
}
