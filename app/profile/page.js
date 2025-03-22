
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { User, Settings, Package, ShoppingBag, LogOut } from 'lucide-react'
import ProfileSettings from '@/components/ProfileSettings'
import MyPlugins from '@/components/MyPlugins'
import MyPurchases from '@/components/MyPurchases'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('settings')
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])
  
  if (!isAuthenticated || !user) {
    return (
      <div className="container-custom py-16 flex justify-center">
        <div className="animate-pulse text-xl">Please log in to view your profile...</div>
      </div>
    )
  }
  
  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    router.push('/')
  }
  
  return (
    <div className="container-custom py-10">
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-1/4 bg-gray-50 p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{user.username}</h2>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'settings' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Profile Settings
              </button>
              
              <button
                onClick={() => setActiveTab('plugins')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'plugins' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Package className="w-5 h-5 mr-3" />
                My Plugins
              </button>
              
              <button
                onClick={() => setActiveTab('purchases')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'purchases' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                My Purchases
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Log Out
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="md:w-3/4 p-6">
            {activeTab === 'settings' && <ProfileSettings />}
            {activeTab === 'plugins' && <MyPlugins />}
            {activeTab === 'purchases' && <MyPurchases />}
          </div>
        </div>
      </div>
    </div>
  )
}
