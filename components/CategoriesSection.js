
import Link from 'next/link'
import { Shield, Code, Coins, Gamepad2, Wrench, Users, Sparkles } from 'lucide-react'

export default function CategoriesSection() {
  const categories = [
    {
      name: 'Admin Tools',
      icon: <Shield className="h-6 w-6" />,
      description: 'Server management and moderation plugins',
      color: 'bg-red-100 text-red-600'
    },
    {
      name: 'Utility',
      icon: <Wrench className="h-6 w-6" />,
      description: 'Essential tools for server functionality',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      name: 'Economy',
      icon: <Coins className="h-6 w-6" />,
      description: 'Currency and trading system plugins',
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      name: 'Game Mechanics',
      icon: <Code className="h-6 w-6" />,
      description: 'Enhance and modify gameplay features',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      name: 'Fun',
      icon: <Gamepad2 className="h-6 w-6" />,
      description: 'Entertainment and mini-games',
      color: 'bg-green-100 text-green-600'
    },
    {
      name: 'Anti-Grief',
      icon: <Shield className="h-6 w-6" />,
      description: 'Protect your server from damage',
      color: 'bg-orange-100 text-orange-600'
    },
  ]
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Plugin Categories</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              href={`/?category=${category.name}`} 
              key={category.name}
              className="bg-white rounded-xl shadow-soft overflow-hidden group hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                <p className="mt-2 text-gray-600">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
