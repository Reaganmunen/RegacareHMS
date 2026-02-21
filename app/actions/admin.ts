"use server"

import db from "@/lib/db";
import { DoctorSchema, ServicesSchema, StaffSchema, WorkingDaysSchema } from "@/lib/schema"
import { clerkClient } from "@clerk/nextjs/server";

export async function createNewDoctor(
    data: any
) {
    try {
        const values = DoctorSchema.safeParse(data)

        const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

        if(!values.success || !workingDaysValues.success) {
            return{
                success:false, error:true, msg: "Please provide all the info required."
            }
        }
        //create doctor

        const validatedValues = values.data;

        const workingDayData= workingDaysValues.data!;


        //clerk create user
        const client = await clerkClient();

        const user = await client.users.createUser({
            emailAddress:[validatedValues.email],
            password:validatedValues.password,
            firstName:validatedValues.name.split(" ")[0],
            lastName: validatedValues.name.split(" ")[1],
            publicMetadata: { role: "doctor"},
            username: validatedValues.email.split("@")[0]


        });

        //to avoid storing password in the database
        delete validatedValues["password"];

        //create doctor in database
        const doctor = await db.doctor.create({
            data:{
                ...validatedValues, id: user.id,
            }
        });

        await Promise.all(
            workingDayData?.map((el)=> db.workingDays.create({
                data:{
                    ...el, doctor_id:doctor.id
                }
            }))

        );
        return{
            success:true, message:"Doctor added successfully", error:false
        }
        
    } catch (error: any) {
        console.log(error)
        return{
            error:true, success: false, msg: "Something went wrong. Please try again."
        }
        
    }
}


export async function createNewStaff(
    data: any
) {
    try {
        const values = StaffSchema.safeParse(data)

       ;

        if(!values.success) {
            return{
                success:false, error:true, msg: "Please provide all the info required."
            }
        }
        //create staff

        const validatedValues = values.data;

        


        //clerk create user
        const client = await clerkClient();

        const user = await client.users.createUser({
            emailAddress:[validatedValues.email],
            password:validatedValues.password,
            firstName:validatedValues.name.split(" ")[0],
            lastName: validatedValues.name.split(" ")[1],
            publicMetadata: { role: "Nurse"},
            username: validatedValues.email.split("@")[0]


        });

        //to avoid storing password in the database
        delete validatedValues["password"];

        //create staff in database
        const staff= await db.staff.create({
            data:{
                name:validatedValues.name,
                phone:validatedValues.phone,
                email: validatedValues.email,
                role: validatedValues.role,
                id: user.id,
                license_number:validatedValues.license_number,
                address:validatedValues.address,
                department:validatedValues.department
                
            }
        });

     
        return{
            success:true, message:"Staff added successfully", error:false
        }
        
    } catch (error: any) {
        console.log(error)
        return{
            error:true, success: false, msg: "Something went wrong. Please try again."
        }
        
    }
}

export async function addNewService(data: any) {
  try {
    const isValidData = ServicesSchema.safeParse(data);

    const validatedData = isValidData.data;

    await db.services.create({
      data: { ...validatedData!, price: Number(data.price!) },
    });

    return {
      success: true,
      error: false,
      msg: `Service added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}