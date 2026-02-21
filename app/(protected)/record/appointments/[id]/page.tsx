import { AppointmentDetails } from '@/components/appointments/appointment-details'
import AppointmentQuickLinks from '@/components/appointments/appointments-quick-links'
import { BillsContainer } from '@/components/appointments/bills-container'
import ChartContainer from '@/components/appointments/chart-container'
import { DiagnosisContainer } from '@/components/appointments/diagnosis-container'
import { PatientDetailsCard } from '@/components/appointments/patient-details-card'
import { PaymentsContainer } from '@/components/appointments/payment-container'
import { VitalSigns } from '@/components/appointments/vital-signs'
import { MedicalHistoryContainer } from '@/components/medical-history-container'
import { getAppointmentsWithMedicalRecordsById } from '@/utils/services/appointment'
import React from 'react'

const AppointmentDetailsPage = async ({params, searchParams}:{params:Promise<{id:string}>
    searchParams: Promise<{[key:string]:string|string[]|undefined}>
}) => {

    const {id} = await params;
    const search = await searchParams;
    const cat = search?.cat as string || "charts"

    const {data} = await getAppointmentsWithMedicalRecordsById(Number(id))
    
  return (
    <div className="flex p-6 flex-col-reverse lg:flex-row w-full min-h-screen gap-10">
        {/*left*/}
        <div className="w-full lg:w-[65%] flex flex-col gap-6">
            {cat==="charts" && <ChartContainer id={data?.patient_id!}/>}
            {cat==="appointments" && 
             <>
             <AppointmentDetails
             id={data?.id!}
             patient_id={data?.patient_id!}
             appointment_date={data?.appointment_date!}
             time={data?.time!}
             note={data?.note!}
             

             />

             <VitalSigns   
             id={data?.id!}
             appointmentId={id}
             patientId={data?.patient_id!}
             doctorId={data?.doctor_id!}/>
             </>
             
             }
             {cat=== "diagnosis" && <DiagnosisContainer id={id} patientId={data?.patient_id!}
             doctorId={data?.doctor_id!} />}
             {cat=== "medical-history" && <MedicalHistoryContainer id={id!} patientId={data?.patient_id!}/>}
             {cat=== "billing" && <BillsContainer id={id}/>}
             {cat=== "payments" && <PaymentsContainer patientId={data?.patient_id!}/>}
        </div>
        {/*right*/}
         <div className="flex-1 space-y-6">
        <AppointmentQuickLinks staffId={data?.doctor_id as string}/>
         <PatientDetailsCard data={data?.patient!}/>
         </div>
    </div>
  )
}

export default AppointmentDetailsPage