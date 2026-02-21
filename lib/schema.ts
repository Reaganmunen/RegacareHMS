import { z } from "zod";

export const PatientFormSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, "First name must be at least two characters")
    .max(30, "First name can't be more than 30 characters"),

  last_name: z
    .string()
    .trim()
    .min(2, "Last name must be at least two characters")
    .max(30, "Last name can't be more than 30 characters"),

  // accepts Date object directly from RHF defaultValues
  date_of_birth: z.coerce.date(),

  gender: z.enum(["MALE", "FEMALE"], {
    error: "Gender is required",
  }),

  email: z.string().email("Invalid email address"),

  phone_number: z
    .string()
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits"),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address can't exceed 500 characters"),

  marital_status: z.enum(
    ["Married", "Single", "Divorced", "Widowed", "Separated"],
    { error: "Marital status is required" }
  ),

  emergency_contact_name: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name can't be more than 50 characters"),

  emergency_contact_number: z
    .string()
    .min(10, "Contact number must be 10 digits")
    .max(10, "Contact number must be 10 digits"),

  relation: z.enum(["mother", "father", "husband", "wife", "other"], {
    error: "Relation is required",
  }),

  // checkboxes must exist as boolean
  privacy_consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the privacy policy",
    }),

  service_consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the terms of service",
    }),

  medical_consent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the treatment terms",
    }),

  // optional fields
  blood_group: z.string().optional(),
  allergies: z.string().optional(),
  medical_conditions: z.string().optional(),
  medical_history: z.string().optional(),
  insurance_provider: z.string().optional(),
  insurance_number: z.string().optional(),
  img: z.string().optional(),
});


export const AppointmentSchema = z.object({
  doctor_id: z.string().min(1, "Select Physician"),
  type: z.string().min(1, "Select Appointment Type"),
  appointment_date: z.string().min(1, "Select the Date of Appointment"),
  time: z.string().min(1, "Select the Time of Appointment"),
  note: z.string().optional(),
  
});

export const DoctorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least two characters")
    .max(50, "Name can't be more than 50 characters"),
    phone:z.string().min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits"),
    email: z.string().email("Invalid email address"),
    address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address can't exceed 500 characters"),
    specialization: z
    .string()
    .min(2, "Specialization is required"),
    license_number: z.string().min(2, "License number is required"),
    type: z.enum(["Full", "Part"], {message: "Type is required"}),
    department: z.string().min(2, "Department is required"),
    img: z.string().optional(),
    password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password can't be more than 20 characters")
    .optional()
    .or(z.literal("")),


})

export const workingDaySchema = z.object({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  start_time: z.string(),
  close_time: z.string(),
});


export const StaffSchema = z.object({
  name:z
       .string()
       .trim()
       .min(2, "name must be atleast 2 characters" )
       .max(50, "name must not exceed 50 characters"),

  role: z.enum(["Nurse", "Lab_technician"], {message:"Role is required"}),
  phone: z.string()
          .min(10, "phone number should not be less than 10 characters")
          .max(10, "phone number should not exceed 10 characters"),
  email:z.email("invalid email address"),
  address: z.string()
            .min(5, "Address must be atleast 5 characters")
            .max(500, "contact must not exceed 500 characters"),

  license_number: z.string().optional(),
  department: z.string().optional(),
  img: z.string().optional(),
  password: z.string()
              .min(8, {message:"Password must be atleast 8 characters long"})
              .optional()
              .or(z.literal(""))


})



export const WorkingDaysSchema = z.array(workingDaySchema).optional();

export const reviewSchema = z.object({
  patient_id: z.string(),
  staff_id: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters long").max(500, "Review must not exceed 500 characters"),
});



export const VitalSignsSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  appointment_id: z.string(),

  body_temperature: z.coerce
    .number({ message: "Enter recorded body temperature" })
    .pipe(z.number()),

  heartRate: z.string({
    message: "Enter recorded heartbeat rate",
  }),

  systolic: z.coerce
    .number({ message: "Enter recorded systolic blood pressure" })
    .pipe(z.number()),

  diastolic: z.coerce
    .number({ message: "Enter recorded diastolic blood pressure" })
    .pipe(z.number()),

  respiratory_rate: z.coerce.number().pipe(z.number()).optional(),

  oxygen_saturation: z.coerce.number().pipe(z.number()).optional(),

  weight: z.coerce
    .number({ message: "Enter recorded weight (Kg)" })
    .pipe(z.number()),

  height: z.coerce
    .number({ message: "Enter recorded height (Cm)" })
    .pipe(z.number()),
});

export const DiagnosisSchema = z.object({
  patient_id: z.string(),
  medical_id: z.string(),
  doctor_id: z.string(),
  symptoms: z.string().min(10, "Symptoms must be at least 10 characters long").max(1000, "Symptoms must not exceed 1000 characters"),
  diagnosis: z.string().min(10, "Diagnosis must be at least 10 characters long").max(1000, "Diagnosis must not exceed 1000 characters"),
  notes: z.string().optional(),
  prescribed_medications:z.string().optional(),
  follow_up_plan: z.string().optional()
})

export const PatientBillSchema = z.object({
  bill_id: z.string(),
  service_id: z.string(),
  service_date: z.string(),
  appointment_id: z.string(),
  quantity: z.string({ message: "Quantity is required" }),
  unit_cost: z.string({ message: "Unit cost is required" }),
  total_cost: z.string({ message: "Total cost is required" }),
});

export const ServicesSchema = z.object({
  service_name: z.string({ message: "Service name is required" }),
  price: z.string({ message: "Service price is required" }),
  description: z.string({ message: "Service description is required" }),
});

export const PaymentSchema = z.object({
  id: z.string(),
  // patient_id: z.string(),
  // appointment_id: z.string(),
  bill_date: z.date(),
  // payment_date: z.string(),
  discount: z.string({ message: "discount" }),
  total_amount: z.string(),
  // amount_paid: z.string(),
});




// inferred TypeScript type
export type PatientFormType = z.infer<typeof PatientFormSchema>;
export type AppointmentFormType = z.infer<typeof AppointmentSchema>;
export type DoctorFormType = z.infer<typeof DoctorSchema>;
export type StaffFormType = z.infer<typeof StaffSchema>;
export type ReviewFormValues = z.infer<typeof reviewSchema>;
export type VitalSignsFormValues = z.infer<typeof VitalSignsSchema>;
export type DiagnosisFormValues = z.infer<typeof DiagnosisSchema>;
export type PatientBillFormValues= z.infer<typeof PatientBillSchema>;
export type ServicesFormValues = z.infer<typeof ServicesSchema>;
export type PaymentFormType= z.infer<typeof PaymentSchema>