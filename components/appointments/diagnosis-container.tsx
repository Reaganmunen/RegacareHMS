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
  // Authenticate user
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Fetch medical record for the appointment
  const data = await db.medicalRecords.findFirst({
    where: {
      appointment_id: Number(id),
    },
    include: {
      diagnosis: {
        include: { doctor: true },
        orderBy: { created_at: "desc" },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const diagnosis = data?.diagnosis || null;
  const isPatient = await checkRole("Patient");

  return (
    <div className="space-y-6">
      {/* Case: No diagnosis found */}
      {diagnosis?.length === 0 || !diagnosis ? (
        <div className="flex flex-col items-center justify-center mt-20 space-y-4">
          <NoDataFound note="No diagnosis found for this appointment." />

          <AddDiagnosis
            key={new Date().getTime()}
            patientId={patientId}
            doctorId={doctorId}
            appointmentId={Number(id)}
            medicalId={data?.id?.toString() || ""}
          />
        </div>
      ) : (
        // Case: Diagnosis exists
        <section className="space-y-6">
          <Card>
            {/* Card Header: Title on left, button on right */}
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Medical Records
              </CardTitle>

              {/* Show AddDiagnosis button only for non-patients */}
              {!isPatient && (
                <AddDiagnosis
                  key={new Date().getTime()}
                  patientId={patientId}
                  doctorId={doctorId}
                  appointmentId={Number(id)}
                  medicalId={data?.id?.toString() || ""}
                />
              )}
            </CardHeader>
        <CardContent className="space-y-8">
            {
                diagnosis?.map((record, id)=>(

                    <div key={record.id}>
                        <MedicalHistoryCard   
                        record={record}
                        index={id}
                        />

                    </div>

                )
                    
                )
            }
        </CardContent>
            
          </Card>
        </section>
      )}
    </div>
  );
};