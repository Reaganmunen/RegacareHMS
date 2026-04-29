import { DiagnosisContainer } from "./appointments/diagnosis-container";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface DataProps {
    id: string | number;
    patientId: string;
    medicalId?: string;
    doctor_id: string | number;
    label: React.ReactNode;
}

export const MedicalHistoryDialog = async ({
    id,
    patientId,
    doctor_id,
    label,
}:DataProps)=> {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                variant="outline"
                className="flex items-center justify-center rounded-full bg-blue-600/10 hover:underline text-blue-600 px-1.5 py-1 text-sm" >
                    {label}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90%] max-w-[90vw] md:max-w-5xl p-8 overflow-y-auto">
                {<DiagnosisContainer
                id= {String(id)}
                patientId ={patientId!}
                doctorId={String(doctor_id)}
                />}

                <p>Diagnosis Container Form</p>

            </DialogContent>
        </Dialog>
    )
}