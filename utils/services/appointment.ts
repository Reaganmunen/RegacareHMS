import db from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function getAppointmentById(id:number) {
    try{

        if(!id) {
            return{
                success:false,
                message:"Appointment Id doesnt exist",
                status: 404,


            };
        }







        const data = await db.appointment.findUnique({
            where: { id},

            include:{
                doctor:{
                    select: {id: true, name: true, specialization: true, img: true}
                },
                patient:{
                    select: {id:true, first_name:true, last_name:true, gender:true, img: true, date_of_birth:true, 
                        address:true, phone_number:true,
                    }
                }
            }
        });
        if(!data) {
            return{
                success: false,
                message: "Appointment data not found",
                status: 200,
                data: null,
            }
        }
      return{ success:true, data, status:200}
    } catch (error){
        console.log(error);
        return { success:false, message:"Internal Server Error", status:500};


    }
};



interface AllAppointmentsProps {
    page: number | string;
    limit ?: number| string;
    search?: string;
    id?: string;
}
 const buildQuery =(id?:string, search?:string)=>{
    //base conditions for search if it exists
    const searchConditions:Prisma.AppointmentWhereInput = search
    ? {
        OR:[
            {
                patient:{
                    first_name: {contains:search, mode: "insensitive"},
                },
                

            },
            {
                patient: {
                    last_name:{contains: search, mode:"insensitive"}
                },
            },
            {
                doctor:{
                    name:{contains: search, mode: "insensitive"}
                },
            },
        ],
    }
    :{};

   //id filtering conditions if  ID exists

   const idConditions: Prisma.AppointmentWhereInput = id
   ? {
    OR: [{patient_id:id}, {doctor_id:id}],
   }
   : {};


   //combine both conditions with AND kama zinaexist

   const combinedQuery: Prisma.AppointmentWhereInput =
      id || search
      ? {
           AND: [
            ...(Object.keys(searchConditions).length > 0
        ? [searchConditions]
          :[]),
          ...(Object.keys(idConditions).length > 0 ? [idConditions] :[])
           ],
      }
      :{};

      return combinedQuery



}

export async function getPatientAppointments({page, limit, search, id}: AllAppointmentsProps) {
    try{

        const PAGE_NUMBER = Number(page) <= 0? 1 : Number(page)
        const LIMIT = Number(limit) || 10;

        const SKIP = (PAGE_NUMBER - 1) * LIMIT //0-9

        const [data, totalRecord] = await Promise.all([
            db.appointment.findMany({
                where:buildQuery(id, search),
                skip: SKIP,
                take: LIMIT,
                select:{
                    id:true, patient_id: true, doctor_id: true, type:true, appointment_date:true, status:true, time:true,
                    patient:{
                    select:{
                        id:true, first_name:true, last_name:true, date_of_birth: true, gender: true, phone_number: true, colorCode:true}
                    },
                    doctor:{
                        select:{
                            id:true, name:true, specialization:true, img: true, colorCode:true
                        },
                    },
                },
                orderBy: { appointment_date:"desc"}
            }),
            db.appointment.count({
                where:buildQuery(id, search)
            })
        ])








        
        if(!data) {
            return{
                success: false,
                message: "Appointment data not found",
                status: 200,
                data: null,
            }
        }
        const totalPages = Math.ceil( totalRecord /LIMIT)
      return{ success:true, data, totalPages, currentPage: PAGE_NUMBER, totalRecord, status:200}
    } catch (error){
        console.log(error);
        return { success:false, message:"Internal Server Error", status:500};


    }
};

export async function getAppointmentsWithMedicalRecordsById(id:number) {
    try{
        if(!id){
            return{
                success:false,
                message:"appointment id doesnt exist",
                status: 404

            }
        }
        const data = await db.appointment.findUnique({
            where:{id},
            include:{
                patient:true, doctor:true, bills:true,
                medical:{
                    include:{
                        diagnosis:true,
                        lab_test:true,
                        vital_signs:true
                    }
                }
            },
        });

        if(!data) {
            return {
                success:false,
                message:"Appointment data found",
                status:200,
            }
        }
        return{
            success:true, data, status:200
        }

        
    } catch (error){
        console.log(error);
        return { success:false, message:"Internal Server Error", status:500};


    }
};





