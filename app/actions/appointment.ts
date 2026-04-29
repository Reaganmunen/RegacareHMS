"use server";

import { VitalSignsFormData } from "@/components/dialogs/add-vital-signs";
import db from "@/lib/db";
import { AppointmentSchema, VitalSignsSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { AppointmentStatus } from "@prisma/client";
import { sendSMS } from "@/lib/sms";

/* ======================================================
   UPDATE APPOINTMENT STATUS (Schedule / Cancel / Complete)
====================================================== */
export async function appointmentAction(
  id: string | number,
  status: AppointmentStatus,
  reason: string
) {
  try {
    const appointment = await db.appointment.update({
      where: { id: Number(id) },
      data: {
        status,
        reason,
      },
      include: {
        patient: true, // IMPORTANT for SMS
      },
    });

    let message = "";

    if (status === "Scheduled") {
      message = `Hello ${appointment.patient.first_name}, your appointment has been scheduled for ${appointment.appointment_date.toDateString()} at ${appointment.time}. Please arrive on time.`;
    }

    if (status === "Cancelled") {
      message = `Hello ${appointment.patient.first_name}, your appointment has been cancelled. Reason: ${reason}`;
    }

    if (status === "Completed") {
      message = `Hello ${appointment.patient.first_name}, your appointment has been completed. Thank you for visiting our clinic.`;
    }

    if (message && appointment.patient.phone_number) {
      await sendSMS(appointment.patient.phone_number, message);
    }

    return {
      success: true,
      error: false,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.error("AppointmentAction Error:", error);
    return {
      success: false,
      msg: "Internal Server Error",
    };
  }
}

/* ======================================================
   CREATE NEW APPOINTMENT
====================================================== */
export async function createNewAppointment(data: any) {
  try {
    const validatedData = AppointmentSchema.safeParse(data);

    if (!validatedData.success) {
      return { success: false, msg: "Invalid data" };
    }

    const validated = validatedData.data;

    const appointment = await db.appointment.create({
      data: {
        patient_id:data.patient_id,
        doctor_id:validated?.doctor_id,
        time: validated.time,
        type: validated.type,
        appointment_date: new Date(validated.appointment_date),
        note: validated.note,
        status: "Pending",
      },
      include: {
        patient: true, // REQUIRED for SMS
      },
    });

    // Send SMS to patient after booking
    if (appointment.patient.phone_number) {
      await sendSMS(
        appointment.patient.phone_number,
        `Hello ${appointment.patient.first_name}, your appointment request has been received. Please wait for confirmation from the clinic.`
      );
    }

    return {
      success: true,
      message: "Appointment created successfully",
    };
  } catch (error) {
    console.error("CreateAppointment Error:", error);
    return {
      success: false,
      msg: "Internal Server Error",
    };
  }
}

/* ======================================================
   ADD VITAL SIGNS
====================================================== */
export async function AddVitalSign(
  data: VitalSignsFormData,
  doctorId: string
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        msg: "Unauthorized",
      };
    }

    const validatedData = VitalSignsSchema.parse(data);

    let medicalRecord = null;

    if (!validatedData.medical_id) {
      medicalRecord = await db.medicalRecords.create({
        data: {
          patient_id: validatedData.patient_id,
          appointment_id: Number(validatedData.appointment_id),
          doctor_id: doctorId,
        },
      });
    }

    const med_id = validatedData.medical_id || medicalRecord?.id;

    const { appointment_id, ...vitalData } = validatedData;

    await db.vitalSigns.create({
      data: {
        ...vitalData,
        medical_id: Number(med_id),
      },
    });

    return {
      success: true,
      msg: "Vital signs added successfully",
    };
  } catch (error) {
    console.error("AddVitalSign Error:", error);
    return {
      success: false,
      msg: (error as Error)?.message || "Internal Server Error",
    };
  }
}