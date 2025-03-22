
'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

export default function RatingStars({ rating, setRating, size = 6 }) {
  const [hoverRating, setHoverRating] = useState(0)
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`w-${size} h-${size} focus:outline-none`}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <Star 
            className={`w-${size} h-${size} ${
              (hoverRating || rating) >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`} 
          />
        </button>
      ))}
    </div>
  )
}
