import db from "@/lib/db";
import { daysOfWeek } from "..";
import { processAppointments } from "./patient";

export async function getAdminDashboardStats() {
  try {
    const todayDate = new Date().getDay();
    const today = daysOfWeek[todayDate];

    // Fetch all necessary data in parallel
    const [totalPatient, totalDoctors, appointments, doctors] = await Promise.all([
      db.patient.count(),
      db.doctor.count(),
      db.appointment.findMany({
        include: {
          patient: {
            select: {
              first_name: true,
              last_name: true,
              gender: true,
              img: true,
              colorCode: true,
              id: true,
              date_of_birth: true
            }
          },
          doctor: {
            select: {
              name: true,
              img: true,
              colorCode: true,
              specialization: true
            }
          }
        },
        orderBy: { appointment_date: "desc" }
      }),
      db.doctor.findMany({
        take: 5, // Top 5 doctors
        select: {
          id: true,
          name: true,
          img: true,
          colorCode: true,
          specialization: true,
          working_days: { // Include working days
            select: {
              day: true,
              start_time: true,
              close_time: true
            }
          }
        }
      })
    ]);

    const { appointmentCounts, monthlyData } = await processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);

    return {
      success: true,
      totalPatient,
      totalDoctors,
      appointmentCounts,
      availableDoctors: doctors, // now includes working_days
      monthlyData,
      last5Records,
      totalAppointments: appointments.length,
      status: 200
    };

  } catch (error) {
    console.log(error);
    return { error: true, message: "Something Went Wrong" };
  }
}

export async function getServices() {
  try {
    const data = await db.services.findMany({
      orderBy: { service_name: "asc" },
    });

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        status: 404,
        data: [],
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}