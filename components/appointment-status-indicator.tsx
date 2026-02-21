import { cn } from '@/lib/utils'
import { Appointment, AppointmentStatus } from '@prisma/client'
import React from 'react'


const status_color ={
    Pending: "bg-yellow-600/15 text-yellow-600",
    Scheduled:"bg-emerald-600/15 text-emerald-600",
    Cancelled: "bg-red-600/15 text-red-600",
    Completed: "bg-blue-600/15 text-blue-600"

}

export const AppointmentStatusIndicator = ({status}:{status:AppointmentStatus}) => {
  return (
    <p
    className={cn("w-fit px-2 py-1 rounded-full capitalize text-xs lg:text-sm", 
        status_color[status])}>{status.toUpperCase()}</p>
  )
}
