


import React from 'react'
import { BookAppointment } from './form/book-appointments'
import { getPatientById } from '@/utils/services/patient'
import { getDoctors } from '@/utils/services/doctor'

export const AppointmentContainer =  async({id}:{id:string}) => {
    const {data} = await getPatientById(id)
    const {data:doctors} = await getDoctors()
  return (
    <div>
        <BookAppointment   data={data!} doctors={doctors!}
        /> 
    </div>
  )
}
