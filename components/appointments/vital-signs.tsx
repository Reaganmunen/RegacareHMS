import db from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { calculateBMI } from "@/utils";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import { checkRole } from "@/utils/roles";
import { AddVitalSigns } from "../dialogs/add-vital-signs";

interface VitalSignsProps {
    id: string | number;
    patientId: string;
    doctorId: string;
    medicalId?:string;
    appointmentId?:string;
}


const ItemCard = ({label, value}:{label:string, value:string}) => {
    return(
        <div className="w-full">
           <p className="text-lg xl:text-xl font-medium">{value}</p>
           <p className="text-sm xl:text-base text-gray-500">{label}</p>
        </div>
    )
}


export const VitalSigns = async ({patientId, doctorId, id, medicalId,
  appointmentId,
}: VitalSignsProps) => {

  if (!appointmentId || isNaN(Number(appointmentId))) {
    return null
  }

  const data = await db.medicalRecords.findFirst({
    where: {
      appointment_id: Number(appointmentId),
    },
    include: {
      vital_signs: {
        orderBy: { created_at: "desc" },
      },
    },
    orderBy: { created_at: "desc" },
  })

  const vitals = data?.vital_signs ?? []

  const isPatient = await checkRole("Patient")

    return (
        <section id="vital-signs">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Vital Signs</CardTitle>
                    {!isPatient &&(<AddVitalSigns 
                    key={new Date().getTime()}  
                    patientId={patientId}
                    doctorId={doctorId}
                    appointmentId={id!.toString()}
                    medicalId={data? data?.id!.toString(): ""}
                    
                      
                    />)}
                </CardHeader>
                <CardContent className="space-y-4">
                    {vitals?.map((el)=>{
                        const {bmi, status, colorCode} = calculateBMI(el.weight || 0, el.height || 0);

                        return <div className="space-y-4" key={el?.id}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <ItemCard label="Body Temperature" value={`${el.body_temperature} °C`}/>
                                <ItemCard label="Blood Pressure" value={`${el?.systolic}/${el?.diastolic} mmHg`}/>
                                <ItemCard label="Heart Rate" value={`${el?.heartRate} bpm`}/>

                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> 
                                <ItemCard label="Weight" value={`${el.weight || 0} kg`}/>
                                <ItemCard label="Height" value={`${el.height || 0} cm`}/>
                              
                              <div className="w-full">
                                <div className="flex gap-x-2 items-center">
                                    <p className="text-lg xl:text-xl font-medium">
                                       

                                    {bmi}

                                     <span style={{color: colorCode}} className="text-sm xl:text-base font-medium ">({status})</span>
                                    </p>

                                </div>

                              </div>

                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <ItemCard label="Respiratory Rate" value={`${el.respiratory_rate} breaths/min`}/>  
                                <ItemCard label="Oxygen Saturation" value={`${el.oxygen_saturation} %`}/>
                                <ItemCard label="Reading date" value ={format(el?.created_at, "MM/dd/yyyy hh:mm a")}/>
                            </div>

                            <Separator className="mt-4"/>

                        </div>

                        
                    })}

                </CardContent>
            </Card>
        </section>
    )
}