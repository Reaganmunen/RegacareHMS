"use client"

import { AppointmentSchema } from '@/lib/schema';
import { generateTimes } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Doctor, Patient } from '@prisma/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { UserPen } from 'lucide-react';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { ProfileImage } from '../ui/profile-image';
import { CustomInput } from '../ui/custom-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { createNewAppointment } from '@/app/actions/appointment';

const TYPES = [
  { label: "General Consultation", value: "General Consultation" },
  { label: "General Checkup", value: "General Checkup" },
  { label: "Antenatal", value: "Antenatal" },
  { label: "Maternity", value: "Maternity" },
  { label: "Lab Test", value: "Lab Test" },
  { label: "ENT", value: "ENT" }
];

export const BookAppointment = ({ data, doctors }: { data: Patient; doctors: Doctor[] }) => {

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [physcians, setPhyscians] = useState<Doctor[] | undefined>(doctors);

  const appointmentTimes = generateTimes(8, 17, 30) // Generate times from 8:00 AM to 5:00 PM with 30-minute intervals;
  const patientName = `${data?.first_name} ${data?.last_name}`;

  const form = useForm<z.infer<typeof AppointmentSchema>>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      doctor_id: "",
      appointment_date: "",
      time: "",
      type: "",
      note: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof AppointmentSchema>> = async (values) => {
    try{
      setIsSubmitting(true);
      const newData = {...values, patient_id: data?.id!};
      const res  =  await createNewAppointment(newData);

      if (res.success) {
        form.reset({})
        router.refresh();
        toast.success("Appointment Created Successfully")

      }
    } catch(error) {
      console.log(error)
      toast.error("Something went wrong!")


    } finally{
      setIsSubmitting(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center gap-2 justify-start text-sm font-light bg-blue-600 text-white"
        >
          <UserPen size={16} />Book Appointment
        </Button>
      </SheetTrigger>

      <SheetContent className="rounded-xl rounded-r-2xl md:h-p[95%] md:top-[2.5%] md:right-[1%] w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span>Loading</span>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-4">
            <SheetHeader>
              <SheetTitle>Book Appointment</SheetTitle>
            </SheetHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5 2xl:mt-10">

                {/* === Patient Info + Fields Container === */}
                <div className="w-full rounded-md border border-input bg-background px-3 py-4 flex flex-col gap-6">

                  {/* Patient Info */}
                  <div className="flex items-center gap-4">
                    <ProfileImage
                      url={data?.img!}
                      name={patientName}
                      className="size-16 border border-input"
                      colorCode={data?.colorCode ?? undefined}
                    />
                    <div>
                      <p className="font-semibold text-lg">{patientName}</p>
                      <span className="text-sm text-gray-500 capitalize">{data?.gender}</span>
                    </div>
                  </div>

                  {/* Appointment Type */}
                  <CustomInput
                    type="select"
                    selectList={TYPES}
                    control={form.control}
                    name="type"
                    placeholder="Select appointment type"
                    label="Appointment Type"
                  />

                  {/* Physician Select */}
                  <FormField
                    control={form.control}
                    name="doctor_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Physician</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Physician" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {physcians?.map((i, id) => (
                              <SelectItem key={id} value={i.id} className="p-2">
                                <div className="flex flex-row gap-2 p-2">
                                  <ProfileImage
                                    url={i?.img!}
                                    name={i?.name}
                                    colorCode={i?.colorCode ?? undefined}
                                    textClassName="text-black"
                                  />
                                  <div>
                                    <p className="font-medium text-start">{i?.name}</p>
                                    <span className="font-medium text-start">{i?.specialization}</span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Appointment Date and Time side by side */}
                  <div className="flex flex-row gap-4">
                    <div className="w-1/2">
                      <CustomInput
                        type="input"
                        control={form.control}
                        name="appointment_date"
                        placeholder=""
                        label="Date"
                        inputType="date"
                      />
                    </div>

                    <div className="w-1/2">
                      <CustomInput
                        type="select"
                        control={form.control}
                        name="time"
                        placeholder="Select time"
                        label="Time"
                        selectList={appointmentTimes}
                      />
                    </div>
                  </div>

                  {/* Notes below Date & Time */}
                  <div>
                    <CustomInput
                      type="textarea"
                      control={form.control}
                      name="note"
                      placeholder="Additional Notes"
                      label="Notes"
                    />
                  </div>

                  {/* Submit button below Notes */}
                  <div>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      className="bg-blue-600 w-full"
                    >
                      Submit
                    </Button>
                  </div>

                </div>

              </form>
            </Form>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
