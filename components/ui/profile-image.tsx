'use client'

import { cn } from '@/lib/utils'
import { getInitials, generateRandomColor } from '@/utils'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export const ProfileImage = ({
  url,
  name,
  className,
  textClassName,
  colorCode,
}: {
  url?: string
  name?: string
  className?: string
  textClassName?: string
  colorCode?: string
}) => {
  const [bgColor, setBgColor] = useState('#ccc')

  useEffect(() => {
    setBgColor(generateRandomColor())
  }, [])

  // If image URL exists
  if (url && url.trim() !== '') {
    return (
      <Image
        src={url}
        alt={name ? `Profile image of ${name}` : 'Profile image'} // ✅ fallback
        width={40}
        height={40}
        className={cn(
          'w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm',
          className
        )}
      />
    )
  }

  // If using initials avatar
  return (
    <div
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium uppercase shadow-sm',
        className
      )}
      style={{ backgroundColor: bgColor }}
    >
      <span className={cn('tracking-wide', textClassName)}>
        {getInitials(name || '')}
      </span>
    </div>
  )
}
