
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { Upload, X, FileText, Image as ImageIcon, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function UploadPlugin() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    version: '1.0.0',
    category: 'Utility',
  })
  const [jarFile, setJarFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please log in to upload plugins')
      router.push('/login')
    }
  }, [isAuthenticated, router])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleJarFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.name.endsWith('.jar')) {
      setJarFile(file)
    } else {
      toast.error('Please upload a valid JAR file')
      e.target.value = null
    }
  }
  
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onload = () => {
        setThumbnailPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error('Please upload a valid image file')
      e.target.value = null
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!jarFile) {
      toast.error('Please upload a JAR file')
      return
    }
    
    setLoading(true)
    
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('price', formData.price)
    formDataToSend.append('version', formData.version)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('jarFile', jarFile)
    if (thumbnail) {
      formDataToSend.append('thumbnail', thumbnail)
    }
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/plugins`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`
          }
        }
      )
      
      toast.success('Plugin uploaded successfully!')
      router.push(`/plugins/${response.data._id}`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload plugin')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isAuthenticated) {
    return null
  }
  
  return (
    <div className="container-custom py-10">
      <Link href="/profile" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to profile
      </Link>
      
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload New Plugin</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Plugin Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    required
                    placeholder="e.g. SuperEconomy"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="Utility">Utility</option>
                    <option value="Economy">Economy</option>
                    <option value="Admin Tools">Admin Tools</option>
                    <option value="Fun">Fun</option>
                    <option value="Game Mechanics">Game Mechanics</option>
                    <option value="Anti-Grief">Anti-Grief</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="version" className="block text-sm font-medium text-gray-700 mb-1">
                    Version *
                  </label>
                  <input
                    type="text"
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    className="input"
                    required
                    placeholder="e.g. 1.0.0"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="input"
                    required
                    min="0"
                    step="0.01"
                    placeholder="e.g. 9.99"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="jarFile" className="block text-sm font-medium text-gray-700 mb-1">
                    JAR File *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 ${jarFile ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}>
                    {jarFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-8 h-8 text-green-500 mr-3" />
                          <div>
                            <p className="font-medium">{jarFile.name}</p>
                            <p className="text-sm text-gray-500">{(jarFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setJarFile(null)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="file-upload" className="btn btn-outline cursor-pointer">
                            <span>Select JAR file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".jar"
                              onChange={handleJarFileChange}
                            />
                          </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Only .jar files are supported</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="input"
                    required
                    placeholder="Describe your plugin's features and functionality..."
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Image
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${thumbnail ? 'border-blue-300 bg-blue-50' : 'border-gray-300'}`}>
                    {thumbnailPreview ? (
                      <div className="text-center">
                        <div className="relative w-full aspect-square max-w-xs mx-auto">
                          <img 
                            src={thumbnailPreview} 
                            alt="Thumbnail preview" 
                            className="rounded-lg object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setThumbnail(null)
                              setThumbnailPreview(null)
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-2">
                          <label htmlFor="thumbnail-upload" className="btn btn-outline cursor-pointer">
                            <span>Upload image</span>
                            <input
                              id="thumbnail-upload"
                              name="thumbnail-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                            />
                          </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 flex justify-end">
              <Link href="/profile" className="btn btn-outline mr-3">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Uploading...' : 'Upload Plugin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
