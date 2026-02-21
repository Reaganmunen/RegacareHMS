"use client"

import { DoctorSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Form } from '../ui/form';
import { CustomInput, SwitchInput } from '../ui/custom-input';
import { SPECIALIZATION } from '@/utils/settings';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { createNewDoctor } from '@/app/actions/admin';


const TYPES =[
    {
        label:"Full-Time", value: "Full",

    },
    {
        label:"Part-Time", value: "Part",
    }
];

const WORKING_DAYS = [
    {
        label: "Monday", value: "monday",},
    {
        label: "Tuesday", value: "tuesday",},
    {
        label: "Wednesday", value: "wednesday",},
    {
        label: "Thursday", value: "thursday",}, 
    {
        label: "Friday", value: "friday",},
    { 
        label: "Saturday", value: "saturday",},
        {
        label: "Sunday", value: "sunday",},
        
    

];

type Day ={
    day:string;
    start_time?:string;
    close_time?:string;
}


export const DoctorForm = () => {
    const [isLoading, setIsLoading]= useState(false)
    const router =useRouter();
    const [workingSchedule, setWORKING_DAYS] = useState<Day[]>([]);


    const form =useForm<z.infer<typeof DoctorSchema>>({
        resolver: zodResolver(DoctorSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            specialization: "",
            type: "Full",
            license_number: "",
            department: "",
            img: "",
            password: "",
        }
    });

    const handleSubmit = async(values: z.infer<typeof DoctorSchema>)=>{
        try {
            if(workingSchedule.length ===0){
                toast.error("Please select at least one working day.");
                return;
            }
            setIsLoading(true);
            const resp = await createNewDoctor({
                ...values,
                work_schedule: workingSchedule, 
            });

            if(resp.success) {
                toast.success("Doctor created Successfully");

                setWORKING_DAYS([]);
                form.reset();
                router.refresh();

            }else if (resp.error) {
                toast.error(resp.msg)
            }
            
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
            
        }
    }

    const selectedSpecialization =form.watch("specialization")

    useEffect(() =>{
        if(selectedSpecialization) {
            const department = SPECIALIZATION.find((el)=>el.value === selectedSpecialization)

            if (department){
                form.setValue("department", department.department);
            }
        }

    }, [selectedSpecialization, form])
  return (
    <Sheet>
        
            <SheetTrigger asChild>
                <Button>
                     <Plus  size={20}  />
                Add Doctor
                </Button>
               
            </SheetTrigger>
            <SheetContent className="rounded-xl rounded-r-xl md:h-[90%] md:top-[5%] md:right-[1%] w-full overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>
                        Add New Doctor
                    </SheetTitle>
                </SheetHeader>
                <div className="px-6">
                    <Form   {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-5 2xl:mt-10"
                        >
                            <CustomInput
                            type="radio"
                            selectList={TYPES}
                            control={form.control}

                            name="type"
                            label="Type"
                            placeholder=""
                            defaultValue="Full"

                            
                            />


                            <CustomInput 
                            type="input"
                            control={form.control}
                            name="name"
                            placeholder="Doctor's Full Name"
                            label="Full Name"
                            />




                            <div className="items-center flex gap-2">
                                <CustomInput 
                                type= "select"
                                control={form.control}
                                name="specialization"
                                placeholder="Select Specialization"
                                label="specialization"
                                selectList={SPECIALIZATION}
                                />
                                <CustomInput 
                                type="input"
                                control={form.control}
                                name="department"
                                placeholder="Department"
                                label="Department"
                                />

                            </div>
                             <CustomInput 
                                type="input"
                                control={form.control}
                                name="license_number"
                                placeholder="License Number"
                                label="License Number"
                                />
                    <div className="flex items-center gap-2">
                        <CustomInput
                                type="input"
                                control={form.control}
                                name="email"
                                placeholder="johndoe@gmail.com"
                                label="Email" 
                        
                        />
                        <CustomInput
                                type="input"
                                control={form.control}
                                name="phone"
                                placeholder="0712345678"
                                label="Contact Number" 
                        
                        />

                    </div>
                    <CustomInput
                                type="input"
                                control={form.control}
                                name="address"
                                placeholder="kiu river road, nairobi"
                                label="Address" 
                        
                        />
                        <CustomInput
                                type="input"
                                control={form.control}
                                name="password"
                                placeholder="********"
                                label="Password" 
                                inputType="password"
                        
                        />
                        <div className="mt-6">
                            <Label>
                                Working Days
                            </Label>
                            <SwitchInput data={WORKING_DAYS} setWorkSchedule={setWORKING_DAYS} />
                        </div>

                        <Button type="submit" disabled={isLoading} className="w-full mb-10 mt-4">
                            Submit
                        </Button>
                        </form>

                    </Form>
                </div>

            </SheetContent>
        
    </Sheet>
  )
}
