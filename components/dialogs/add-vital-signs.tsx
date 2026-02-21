"use client";

import { VitalSignsSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Form } from "../ui/form";
import { CustomInput } from "../ui/custom-input";
import { toast } from "sonner";
import { AddVitalSign } from "@/app/actions/appointment";

interface AddVitalSignsProps {
    patientId: string;
    doctorId: string;
    appointmentId: string;
    medicalId?:string;
}



export type VitalSignsFormData = z.infer<typeof VitalSignsSchema>;
export const AddVitalSigns =({patientId, doctorId, appointmentId, medicalId}: AddVitalSignsProps) => {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


  const form = useForm<VitalSignsFormData>({
    resolver:zodResolver(VitalSignsSchema) as any,
    defaultValues:{
        patient_id: patientId,
    medical_id: medicalId ?? "",
    appointment_id: appointmentId,
    body_temperature: 36.5, // default valid number
    heartRate: "70",         // default valid string
    systolic: 120,
    diastolic: 80,
    respiratory_rate: 18, 
    oxygen_saturation: 99, 
    weight: 70,
    height: 170, 

        
    }
  });

  const handleOnSubmit = async (data: VitalSignsFormData) => {
    try {
        setIsLoading(true);
        const res = await AddVitalSign(data, doctorId);
        


        if(res?.success){
            router.refresh()
            toast.success(res.msg);
            form.reset();
        }else{
            toast.error(res?.msg || "Failed to add vital signs. Please try again.")
        }
    } catch (error) {
        console.log(error)
        toast.error("Failed to add vital signs. Please try again.")
        
    }finally {
        setIsLoading(false);
    }
  };



    return <>
    <Dialog>
        <DialogTrigger asChild>
            <Button size="sm" variant ="outline" className="text-sm font-normal">
                <Plus className="text-gray-500" size={22} /> Add Vital Signs
            </Button>


        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add Vital Signs</DialogTitle>
                <DialogDescription>Add Vital Signs for the patient</DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOnSubmit as any)} className="space-y-8">
                <div className="flex items-center gap-4">

                    <CustomInput 
                    type="input"
                    control={form.control}
                    name="body_temperature"
                    label="Body Temperature (°C)"
                    placeholder="eg. :37.5"
                    />

                    <CustomInput
                    type="input"
                    control={form.control}
                    name="heartRate"
                    placeholder="eg. : 80"
                    label="Heart Rate (bpm)"
                    />

                    

                </div>
                <div className="flex items-center gap-4">
                    <CustomInput
                    type="input"
                    control={form.control}
                    name="systolic"
                    placeholder="eg. : 120"
                    label="Systolic (mmHg)"
                    />
                    <CustomInput
                    type="input"
                    control={form.control}
                    name="diastolic"
                    placeholder="eg. : 80"
                    label="Diastolic (mmHg)"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <CustomInput
                    type="input"
                    control={form.control}
                    name="weight"
                    placeholder="eg. : 70"
                    label="Weight (Kg)"
                    />
                    <CustomInput
                    type="input"
                    control={form.control}
                    name="height"
                    placeholder="eg. : 170"
                    label="Height (Cm)"
                    />  
                </div>
                <div className="flex items-center gap-4">
                    <CustomInput
                    type="input"
                    control={form.control}
                    name="respiratory_rate"
                    placeholder="eg. : 16"
                    label="Respiratory Rate (breaths/min)"
                    />
                    <CustomInput
                    type="input"
                    control={form.control}  
                    name="oxygen_saturation"
                    placeholder="eg. : 98"
                    label="Oxygen Saturation (%)"
                    />  
                </div>
                <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting...": "Submit"}
                </Button> 
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    
    </>
    
}