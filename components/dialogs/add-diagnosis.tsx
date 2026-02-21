"use client"

import { DiagnosisSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CardDescription, CardHeader } from "../ui/card";
import { Form } from "../ui/form";
import { CustomInput } from "../ui/custom-input";
import { addDiagnosis } from "@/app/actions/medical";
import { toast } from "sonner";

interface AddDiagnosisProps {
    patientId: string;
    doctorId: string;
    appointmentId: number;
    medicalId: string;
}

export type DiagnosisFormValues = z.infer<typeof DiagnosisSchema>;

export const AddDiagnosis = ({
    patientId,
    doctorId,
    appointmentId,
    medicalId
}: AddDiagnosisProps) => {

    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<DiagnosisFormValues>({
        resolver: zodResolver(DiagnosisSchema),
        defaultValues: {
            patient_id: patientId,
            medical_id: medicalId,
            doctor_id: doctorId,
            symptoms: "",
            diagnosis: "",
            notes: "",
            prescribed_medications: "",
            follow_up_plan: ""
        },
    });

    const handleOnSubmit = async (data: DiagnosisFormValues) => {
        try {
            setLoading(true);

            const res = await addDiagnosis(data, appointmentId);

            if (res.success) {
                toast.success(res.message);
                router.refresh();
                form.reset();
            } else {
                toast.error(res.error);
            }

        } catch (error) {
            console.log(error);
            toast.error("Failed to add Diagnosis");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="bg-blue-600 text-white mt-4 flex items-center gap-2">
                    <Plus size={22} className="text-white" />
                    Add Diagnosis
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[60%] 2xl:max-w-[40%] p-6">
                <CardHeader className="px-0 mb-4">
                    <DialogTitle className="text-lg font-semibold">
                        Add New Diagnosis
                    </DialogTitle>
                    <CardDescription>
                        Ensure accurate findings are collected and presented accurately
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-6">
                        {/* Grid layout: 2 columns on medium screens and above */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput
                                type="textarea"
                                control={form.control}
                                name="symptoms"
                                label="Symptoms"
                                placeholder="Enter Symptoms here"
                            />

                            <CustomInput
                                type="textarea"
                                control={form.control}
                                name="diagnosis"
                                label="Diagnosis"
                                placeholder="Enter diagnosis here"
                            />

                            <CustomInput
                                type="textarea"
                                control={form.control}
                                name="prescribed_medications"
                                label="Prescribed Medication"
                                placeholder="Prescriptions for this patient"
                            />

                            <CustomInput
                                type="textarea"
                                control={form.control}
                                name="notes"
                                label="Notes"
                                placeholder="Additional notes for the treatment"
                            />

                            <CustomInput
                                type="textarea"
                                control={form.control}
                                name="follow_up_plan"
                                label="Follow up plan"
                                placeholder="Follow up"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 mt-4 w-full md:w-auto"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}