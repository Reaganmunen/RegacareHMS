import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NoDataFound } from "../no-data-found";
import { AddDiagnosis } from "../dialogs/add-diagnosis";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { checkRole } from "@/utils/roles";
import { MedicalHistoryCard } from "./medical-history-card";

interface DiagnosisContainerProps {
  patientId: string;
  doctorId: string;
  id: string;
}

export const DiagnosisContainer = async ({
  patientId,
  doctorId,
  id,
}: DiagnosisContainerProps) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch medical record + diagnosis
  const data = await db.medicalRecords.findFirst({
    where: { appointment_id: Number(id) },
    include: {
      diagnosis: {
        include: { doctor: true },
        orderBy: { created_at: "desc" },
      },
    },
    orderBy: { created_at: "desc" },
  });

  // Fetch patient info for the left panel
  const patient = await db.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      gender: true,
      date_of_birth: true,
      blood_group: true,
      allergies: true,
      insurance_provider: true,
      insurance_number: true,
      // last visit = most recent appointment before this one
      appointments: {
        orderBy: { appointment_date: "desc" },
        take: 2,
        select: { appointment_date: true, id: true },
      },
    },
  });

  if (!patient) redirect("/sign-in");

  // Last visit = second most recent appointment (skip the current one)
  const lastVisit =
    patient.appointments.length > 1
      ? patient.appointments[1].appointment_date
      : patient.appointments[0]?.appointment_date ?? null;

  const patientInfo = {
    id: patient.id,
    first_name: patient.first_name,
    last_name: patient.last_name,
    gender: patient.gender,
    date_of_birth: patient.date_of_birth,
    blood_group: patient.blood_group,
    allergies: patient.allergies,
    insurance_provider: patient.insurance_provider,
    insurance_number: patient.insurance_number,
    last_visit: lastVisit,
  };

  const diagnosis = data?.diagnosis ?? [];
  const isPatient = await checkRole("Patient");

  // Shared AddDiagnosis props
  const addDiagnosisProps = {
    patientId,
    doctorId,
    appointmentId: id,
    medicalId: data?.id?.toString() ?? "",
    patient: patientInfo,
  };

  return (
    <div className="space-y-6">
      {diagnosis.length === 0 ? (
        // ── No diagnosis yet: show full-page form ──────────────────────
        <div className="space-y-4">
          <NoDataFound note="No diagnosis found for this appointment." />
          {!isPatient && <AddDiagnosis key="new" {...addDiagnosisProps} />}
        </div>
      ) : (
        // ── Diagnosis exists: show records + add-more button ───────────
        <section className="space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Medical Records
              </CardTitle>
              {!isPatient && (
                <AddDiagnosis key={new Date().getTime()} {...addDiagnosisProps} />
              )}
            </CardHeader>

            <CardContent className="space-y-8">
              {diagnosis.map((record, index) => (
                <div key={record.id}>
                  <MedicalHistoryCard record={record} index={index} />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};