"use client"

import {  StaffSchema } from '@/lib/schema';
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
import { createNewDoctor, createNewStaff } from '@/app/actions/admin';


const TYPES =[
    {
        label:"Nurse", value: "Nurse",

    },
    {
        label:"Laboratory", value: "Laboratory",
    }
];





export const StaffForm = () => {
    const [isLoading, setIsLoading]= useState(false)
    const router =useRouter();
    


    const form =useForm<z.infer<typeof StaffSchema>>({
        resolver: zodResolver(StaffSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            address: "",
            role:"Nurse",
            
          
          
            license_number: "",
            department: "",
            img: "",
            password: "",
        }
    });

    const handleSubmit = async(values: z.infer<typeof StaffSchema>)=>{
        try {
           
            setIsLoading(true);
            const resp = await createNewStaff(values);

            if(resp.success) {
                toast.success("Staff created Successfully");

               
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

    

  
  return (
    <Sheet>
        
            <SheetTrigger asChild>
                <Button>
                     <Plus  size={20}  />
                Add Staff
                </Button>
               
            </SheetTrigger>
            <SheetContent className="rounded-xl rounded-r-xl md:h-[90%] md:top-[5%] md:right-[1%] w-full overflow-y-scroll">
                <SheetHeader>
                    <SheetTitle>
                        Add New Staff
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

                            name="role"
                            label="Type"
                            placeholder=""
                            defaultValue="Nurse"

                            
                            />


                            <CustomInput 
                            type="input"
                            control={form.control}
                            name="name"
                            placeholder="Staff Name"
                            label="Full Name"
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
                                name="department"
                                placeholder="OPD"
                                label="Department"
                            />

        
                                
               <CustomInput 
                                type="input"
                                control={form.control}
                                name="license_number"
                                placeholder="License Number"
                                label="License Number"
                            />
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
