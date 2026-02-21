import { AvailableDoctors } from '@/components/available-doctors'
import AppointmentChart from '@/components/charts/appointment-chart'
import { StatSummary } from '@/components/charts/stat-summary'
import RecentAppointments from '@/components/tables/recent-appointments'
import { Button } from '@/components/ui/button'
import StatCard from '@/components/ui/stat-card'
import { getDoctorDashboardStats } from '@/utils/services/doctor'
import { currentUser } from '@clerk/nextjs/server'
import { BriefcaseBusiness, BriefcaseMedical, User, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const DoctorsDashboard = async () => {
  const user = await currentUser()

  const {totalPatient, totalNurses, totalAppointments, appointmentCounts, availableDoctors, monthlyData, last5Records} = await getDoctorDashboardStats()


  const cardData= [
    {
      title:"Patients",
      value: totalPatient,
      icon: Users,
      className: "bg-blue-600/15",
      iconClassName:"bg-blue-600/25 text-blue-600",
      note:"TotalPatients",
      link: "record/patients",
    },
    {
      title:"Nurses",
      value: totalNurses,
      icon: User,
      className: "bg-blue-600/15",
      iconClassName:"bg-rose-600/25 text-rose-600",
      note:"TotalNurses",
      link: " ",
    },
    {
      title:"Appointment",
      value: totalAppointments,
      icon: BriefcaseBusiness,
      className: "bg-yellow-600/15",
      iconClassName:"bg-yellow-600/25 text-yellow-600",
      note:"TotalAppointments",
      link: "record/appointments ",
    },
    {
      title:"consultation",
      value: appointmentCounts?.Completed,
      icon: BriefcaseMedical,
      className: "bg-emerald-600/15",
      iconClassName:"bg-emerald-600/25 text-emerald-600",
      note:"TotalConsultation",
      link: "record/appointments ",
    },
  ]
  
  return (
    <div className="rounded-xl py-6 px-3 flex flex-col xl:flex-row gap-6">
     {/*left*/}
      <div className="w-full xl:w-[69%]">
        <div className="bg-white rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-lg xl:2xl font-semibold">Welcome Dr.{user?.firstName}</h1>
              
            <Button size="sm" variant="outline" asChild>
              <Link
              href={`/record/doctors/${user?.id}`}
              
              >View Profile</Link>
            </Button>
          </div>

       <div className="w-full flex flex-wrap gap-2">
        {cardData?.map((el, index)=>(
          <StatCard  
          key={index}
          title ={el?.title}
          value ={el?.value!}
          icon = {el?.icon}
          className={el?.className}
          iconClassName={el?.iconClassName}
          note={el?.note}
          link={el?.link}

          />
        ))}

       </div>
          
        </div>

        <div className="h-[500px]">
          <AppointmentChart data={monthlyData!}/>
        </div>

        <div className="bg-white rounded-xl p-4 mt-8">
          <RecentAppointments data={last5Records!}/>

        </div>

      </div>
       {/*Right*/}
       <div className="w-full xl:w-[30%]">
        <div className="w-full h-[450px] mb-8">
          <StatSummary data={appointmentCounts} total ={totalAppointments!}/>

        </div>
        <AvailableDoctors data={availableDoctors as any} />
       </div>
    </div>
  )
}

export default DoctorsDashboard