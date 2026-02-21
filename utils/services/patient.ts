import db from "@/lib/db";
import {getMonth, format, startOfYear, endOfMonth} from "date-fns"
import { daysOfWeek } from "..";

type AppointmentStatus = "Pending" | "Scheduled" |"Completed"| "Cancelled"

interface Appointment{
    status: AppointmentStatus;
    appointment_date: Date;
}


function isValidStatus(status:string): status is AppointmentStatus{
    return ["Pending", "Scheduled", "Completed", "Cancelled"].includes(status)
}





const initializeMonthlyData = () =>{
    const this_year = new Date().getFullYear();

    const months = Array.from(
        {
            length: getMonth(new Date()) + 1 
        },
        (_, index) => ({
            name: format(new Date(this_year, index), "MMM"),
            appointment: 0,
            completed:0,

        })
    );
    return months
}









export const processAppointments = async (appointments: Appointment[]) =>{
    const monthlyData = initializeMonthlyData();
    const appointmentCounts = appointments.reduce
    <Record<AppointmentStatus, number>
    >(
        (acc, appointment) => {
            const status = appointment.status;
            const appointmentDate = appointment?.appointment_date;
            const monthIndex = getMonth(appointmentDate);


            if (
                appointmentDate >= startOfYear(new Date()) &&
                appointmentDate <= endOfMonth(new Date())
            )  {
                monthlyData[monthIndex].appointment +=1;
                if (status==="Completed") {
                    monthlyData[monthIndex].completed +=1;
                }
            }



            //grouping by status
            if(isValidStatus(status)) {
                acc[status] = (acc[status] || 0) +1;
        
            }
            return acc;

        },
        {
            Pending : 0,
            Scheduled: 0,
            Cancelled: 0,
            Completed: 0,
        }

        
    );
    return { appointmentCounts, monthlyData}
}















export async function getPatientDashboardStatistics(id:string) {
    try{
        if(!id){
            return{
                success: false,
                message:"No data found",
                data: null
            };
    
        }

        const data = await db.patient.findUnique({
            where: {id},
            select: {
                id: true,
                first_name:true,
                last_name:true,
                gender: true,
                img: true,
            },
        }

        );

        if(!data){
            return{
                success: false, message:"patient data not found", data: null
            }
        }

        const appointments = await db.appointment.findMany({
            where: { patient_id: data?.id},
            include: {
                doctor: {
                    select:{
                        name:true,
                        id: true,
                        specialization: true,
                        
                        
                    },
                },

                   patient:{
                    select:{
                        first_name: true,
                        last_name: true,
                        date_of_birth:true,
                        gender:true,
                        img: true,
                    }
                   }
            },
        
            orderBy: {appointment_date: "desc"}
        })

     const {appointmentCounts, monthlyData} = await processAppointments(appointments)
     const last5Records = appointments.slice(0,5)

     const today = daysOfWeek[(new Date().getDay())]

     const availableDoctor = await db.doctor.findMany({
        select:{id: true, name:true, specialization: true, working_days:true},
    where:{
        working_days:{
            some:{ day: {
                equals: today,
                mode: "insensitive"
            }

            },
        },
    } ,   
    take: 4,})
        
      return{ success:true, data, appointmentCounts, totalAppointments:appointments.length,
        last5Records, availableDoctor, monthlyData, status:200}
    } catch (error){
        console.log(error);
        return { success:false, message:"Internal Server Error", status:500};


    }
}














export async function getPatientById(id:string) {
    try{
        const patient = await db.patient.findUnique({
            where: { id },
        });
        if(!patient) {
            return{
                success: false,
                message: "Patient data not found",
                status: 200,
                data: null,
            }
        }
      return{ success:true, data:patient, status:200}
    } catch (error){
        console.log(error);
        return { success:false, message:"Internal Server Error", status:500};


    }
}
export async function getPatientFullDataById(id: string) {
    try{
        const patient = await db.patient.findFirst({
            where: {
                OR: [
                    {
                        id,
                    },
                    {email: id},

                ],
            },
            include: {
                _count:{
                    select: {
                        appointments: true,
                    },
                },
                appointments:{
                    select:{
                        appointment_date: true,
                    },
                    orderBy:{
                        appointment_date: "desc",

                    },
                    take: 1
                },
            },
        });

        if (!patient) {
            return {
                success: false,
                message: "Patient Data is not Found",
                status: 404
            };
        }
        const lastVisit = patient.appointments[0]?.appointment_date || null;

        return{
            success: true,
            data: {
                ...patient, 
                totalAppointments:patient._count.appointments,
                lastVisit
            },
            status: 200
        };
    }catch(error) {
        console.log(error);
        return{ success: false, message: "Internal Server error", status:500}
    }
}


export async function getAllPatients(
    {
        page,
        limit,
        search
    }:{
        page:number | string;
        limit?:number | string;
        search?: string;
    }
) {
    try {
        const PAGE_NUMBER = Number(page) <=0 ?1 :Number(page);
        const LIMIT = Number(limit) || 10;
        const SKIP = (PAGE_NUMBER - 1) * LIMIT;


        const[patients, totalRecords]= await Promise.all([
            db.patient.findMany({
                where:{
                    OR:[
                        {first_name:{contains: search, mode:"insensitive"}},
                        {last_name: {contains: search, mode:"insensitive"}},
                        {phone_number: {contains: search, mode:"insensitive"}},
                        {email: {contains: search, mode:"insensitive"}}
                       
                    ],
                },

                include:{
                    appointments:{
                        select:{
                            medical:{
                                select:{
                                    created_at:true, treatment_plan:true
                                },
                                orderBy:{created_at:"desc"},
                                take:1
                            }
                        },
                        orderBy:{appointment_date:"desc"}
                    }

                },
             
                skip: SKIP,
                take: LIMIT,
                orderBy:{ first_name:"asc"}
            }),
            db.patient.count()
        ]);

        const totalPages = Math.ceil(totalRecords / LIMIT);
        

        return { success: true, data: patients, totalRecords, totalPages, currentPage:PAGE_NUMBER, status: 200 }
    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal Server Error", status: 500 };
    }
}


