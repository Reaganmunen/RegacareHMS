"use server"


import db from "@/lib/db";
import { ReviewFormValues, reviewSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";
import { success } from "zod";

export async function deleteDataById(id:string,
    deleteType:"doctor" | "staff" |"patient"|"payment"|"bill"
){
    try {
        switch(deleteType){
            case "doctor": await db.doctor.delete({where:{id: id}})
            case "staff": await db.staff.delete({where:{id: id}})
            case "patient": await db.patient.delete({where:{id: id}})
             case "payment": await db.payment.delete({where:{id: Number(id)}})
        }


        if(deleteType==="staff"|| deleteType==="patient"|| deleteType==="doctor"){
           const client = await clerkClient();
            await client.users.deleteUser(id);
        }
        return{
            success:true,
            message:"Record deleted successfully",
            status:200,
        }

        
    } catch (error) {
        console.log(error);

        return{
            success:false,
            message:"Internal Server Error",
            status:500,

        }
        
    }
}



export async function createReview(values: ReviewFormValues) {
  try {
    // Validate incoming data
    const validatedFields = reviewSchema.parse(values);

    // Check if the patient exists
    const patient = await db.patient.findUnique({
      where: { id: validatedFields.patient_id },
    });

    if (!patient) {
      return {
        success: false,
        message: "Patient does not exist in the system",
        status: 400,
      };
    }

    // Optional: check if staff exists
    const staff = await db.staff.findUnique({
      where: { id: validatedFields.staff_id },
    });

    if (!staff) {
      return {
        success: false,
        message: "Staff member does not exist in the system",
        status: 400,
      };
    }

    // Create the review
    await db.rating.create({
      data: {
        patient_id: validatedFields.patient_id,
        staff_id: validatedFields.staff_id,
        rating: validatedFields.rating,
        comment: validatedFields.comment,
      },
    });

    return {
      success: true,
      message: "Review created successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Review error:", error);

    return {
      success: false,
      message: "Failed to create review",
      status: 500,
    };
  }
}
