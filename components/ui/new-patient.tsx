"use client";

import { Patient } from '@prisma/client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Form } from './form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PatientFormSchema } from '@/lib/schema';
import { CustomInput } from './custom-input';
import { GENDER, MARITAL_STATUS, RELATION } from '@/lib';
import { Button } from './button';
import { createNewPatient, updatePatient } from '@/app/actions/patients';
import { toast } from 'sonner';

interface DataProps {
  data?: Patient
  type: "create" | "update";
}

export const NewPatient = ({ data, type }: DataProps) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const userData = {
    first_name: user?.firstName || "",
    last_name: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone_number: user?.phoneNumbers?.[0]?.phoneNumber || "",
  };

  const userId = user?.id;

  const form = useForm<z.infer<typeof PatientFormSchema>>({//@ts-ignore
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      ...userData,
      address: "",//@ts-ignore
      date_of_birth: new Date().toISOString().split("T")[0], // ✅ yyyy-MM-dd string
      gender: "MALE",
      marital_status: "Single",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "mother",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      insurance_number: "",
      insurance_provider: "",
      medical_history: "",
      privacy_consent: false,
      service_consent: false,
      medical_consent: false,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PatientFormSchema>> = async (values) => {
    setLoading(true);

    const targetId = type === "update" ? data?.id:userId!;
    const res = type === "create" ? await createNewPatient(values, userId!) :  null;
    setLoading(false);

    if (res?.success) {
      toast.success(res.msg);
      form.reset();
      router.push("/patient/registration");
    } else {
      console.log(res);
      toast.error("Failed to Create Patient");
    }
  };

  return (
    <Card className="max-w-6xl w-full p-4">
      <CardHeader>
        <CardTitle>Patient Registration</CardTitle>
        <CardDescription>
          Please fill out the form below to complete your patient profile.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
          //@ts-ignore
           onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-5">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="flex flex-col lg:flex-row gap-y-6 items-center gap-2 md:gap-x-4">
              <CustomInput
                type="input"
                control={form.control}
                name="first_name"
                placeholder="First name"
                label="First Name"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="last_name"
                placeholder="Last name"
                label="Last Name"
              />
            </div>

            <CustomInput
              type="input"
              control={form.control}
              name="email"
              placeholder="johndoe@example.com"
              label="Email Address"
            />

            <div className="flex flex-col lg:flex-row gap-y-6 items-center gap-2 md:gap-x-4">
              <CustomInput
                type="select"
                control={form.control}
                name="gender"
                placeholder="Select gender"
                label="Gender"
                selectList={GENDER}
              />
              <CustomInput
                type="input"
                control={form.control}
                name="date_of_birth"
                placeholder="1980-01-01"
                label="Date of Birth"
                inputType="date"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-y-6 items-center gap-2 md:gap-x-4">
              <CustomInput
                type="input"
                control={form.control}
                name="phone_number"
                placeholder="0712345678"
                label="Phone Number"
              />
              <CustomInput
                type="select"
                control={form.control}
                name="marital_status"
                placeholder="Select marital status"
                label="Marital Status"
                selectList={MARITAL_STATUS}
              />
            </div>

            <CustomInput
              type="input"
              control={form.control}
              name="address"
              placeholder="Chiromo lane, Westlands"
              label="Address"
            />

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Family Information</h3>
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_name"
                placeholder="John Doe"
                label="Emergency Contact Name"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="emergency_contact_number"
                placeholder="0712345678"
                label="Emergency Contact"
              />
              <CustomInput
                type="select"
                control={form.control}
                name="relation"
                placeholder="Select relation with the contact person"
                label="Relation"
                selectList={RELATION}
              />
            </div>

            <div className="space-y-8">
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <CustomInput
                type="input"
                control={form.control}
                name="blood_group"
                placeholder="A+"
                label="Blood Group"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="allergies"
                placeholder="Milk"
                label="Allergies"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_conditions"
                placeholder="Medical Conditions"
                label="Medical Conditions"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="medical_history"
                placeholder="Medical History"
                label="Medical History"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-y-6 items-center gap-2 md:gap-x-4">
              <CustomInput
                type="input"
                control={form.control}
                name="insurance_provider"
                placeholder="Insurance provider"
                label="Insurance Provider"
              />
              <CustomInput
                type="input"
                control={form.control}
                name="insurance_number"
                placeholder="Insurance number"
                label="Insurance Number"
              />
            </div>

            {type !== "update" && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Consent</h3>
                <div className="space-y-6">
                  <CustomInput
                    type="checkbox"
                    control={form.control}
                    name="privacy_consent"
                    label="Privacy Policy Agreement"
                    placeholder="I agree to the privacy policy regarding my personal and medical information."
                  />
                  <CustomInput
                    type="checkbox"
                    control={form.control}
                    name="service_consent"
                    label="Terms of Service Agreement"
                    placeholder="I agree to the terms and conditions of using this service."
                    
                  />
                  <CustomInput
                    type="checkbox"
                    control={form.control}
                    name="medical_consent"
                    label="Medical Consent Agreement"
                    placeholder="I agree to the collection and use of my medical information for healthcare services."
                  />
                </div>
              </div>
            )}

            <Button
              disabled={loading}
              type="submit"
              className="w-full md:w-fit px-6"
            >
              {type === "create" ? "Submit" : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default NewPatient;
