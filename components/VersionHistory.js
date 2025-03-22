
import { Code, Calendar } from 'lucide-react'

export default function VersionHistory({ versions = [] }) {
  // Sort versions by date, newest first
  const sortedVersions = [...versions].sort((a, b) => new Date(b.date) - new Date(a.date))
  
  return (
    <div className="space-y-4">
      {sortedVersions.length > 0 ? (
        sortedVersions.map((version, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Code className="w-4 h-4 text-primary-600 mr-2" />
                <span className="font-medium text-gray-900">{version.version}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{new Date(version.date).toLocaleDateString()}</span>
              </div>
            </div>
            {version.changelog && (
              <div className="mt-2 text-sm text-gray-600">
                {version.changelog}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          No version history available.
        </div>
      )}
    </div>
  )
}
