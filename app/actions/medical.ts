"use server"

import { DiagnosisFormValues } from "@/components/dialogs/add-diagnosis"
import db from "@/lib/db"
import { DiagnosisSchema, PatientBillSchema, PaymentSchema } from "@/lib/schema"
import { checkRole } from "@/utils/roles"

export const addDiagnosis = async (data: DiagnosisFormValues, appointmentId: number) => {
  try {

    const validatedData = DiagnosisSchema.parse(data)

    // 1️⃣ Check if medical record already exists for this appointment
    let medicalRecord = await db.medicalRecords.findFirst({
      where: {
        appointment_id: Number(appointmentId)
      }
    })

    // 2️⃣ If not, create one
    if (!medicalRecord) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          doctor_id: validatedData.doctor_id,
          appointment_id: Number(appointmentId),
        }
      })
    }

    // 3️⃣ Now create diagnosis linked to that record
    await db.diagnosis.create({
      data: {
        patient_id: validatedData.patient_id,
        doctor_id: validatedData.doctor_id,
        medical_id: medicalRecord.id,
        symptoms: validatedData.symptoms,
        diagnosis: validatedData.diagnosis,
        notes: validatedData.notes,
        prescribed_medications: validatedData.prescribed_medications,
        follow_up_plan: validatedData.follow_up_plan,
      }
    })

    return {
      message: "Diagnosis added successfully",
      success: true
    }

  } catch (error) {
    console.log(error)
    return { error: "Failed to add diagnosis" }
  }
}

export async function addNewBill(data: any) {
  try {
    const isAdmin = await checkRole("Admin");
    const isDoctor = await checkRole("Doctor");

    if (!isAdmin && !isDoctor) {
      return {
        success: false,
        msg: "You are not authorized to add a bill",
      };
    }

    const isValidData = PatientBillSchema.safeParse(data);

    const validatedData = isValidData.data;
    let bill_info = null;

    if (!data?.bill_id || data?.bill_id === "undefined") {
      const info = await db.appointment.findUnique({
        where: { id: Number(data?.appointment_id)! },
        select: {
          id: true,
          patient_id: true,
          bills: {
            where: {
              appointment_id: Number(data?.appointment_id),
            },
          },
        },
      });

      if (!info?.bills?.length) {
        bill_info = await db.payment.create({
          data: {
            appointment_id: Number(data?.appointment_id),
            patient_id: info?.patient_id!,
            bill_date: new Date(),
            payment_date: new Date(),
            discount: 0.0,
            amount_paid: 0.0,
            total_amount: 0.0,
          },
        });
      } else {
        bill_info = info?.bills[0];
      }
    } else {
      bill_info = {
        id: data?.bill_id,
      };
    }

    await db.patientBills.create({
      data: {
        bill_id: Number(bill_info?.id),
        service_id: Number(validatedData?.service_id),
        service_date: new Date(validatedData?.service_date!),
        quantity: Number(validatedData?.quantity),
        unit_cost: Number(validatedData?.unit_cost),
        total_cost: Number(validatedData?.total_cost),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Bill added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function generateBill(data: any) {
  try {
    const isValidData = PaymentSchema.safeParse(data);

    const validatedData = isValidData.data;

    const discountAmount =
      (Number(validatedData?.discount) / 100) *
      Number(validatedData?.total_amount);

    const res = await db.payment.update({
      data: {
        bill_date: validatedData?.bill_date,
        discount: discountAmount,
        total_amount: Number(validatedData?.total_amount)!,
      },
      where: { id: Number(validatedData?.id) },
    });

    await db.appointment.update({
      data: {
        status: "Completed",
      },
      where: { id: res.appointment_id },
    });
    return {
      success: true,
      error: false,
      msg: `Bill generated successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}