"use client"

import { DiagnosisSchema } from "@/lib/schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import {
  Plus,
  CalendarDays,
  Droplets,
  ShieldCheck,
  AlertCircle,
} from "lucide-react"
import { Button } from "../ui/button"
import { Form } from "../ui/form"
import { CustomInput } from "../ui/custom-input"
import { addDiagnosis } from "@/app/actions/medical"
import { toast } from "sonner"
import { ToothChart, ToothChartData } from "../appointments/tooth-chart"
import { Badge } from "../ui/badge"

// ─── Types ─────────────────────────────────────────────

export type DiagnosisFormValues = z.infer<typeof DiagnosisSchema>

interface PatientInfo {
  id: string
  first_name: string
  last_name: string
  gender: string
  date_of_birth: Date
  blood_group?: string | null
  allergies?: string | null
  insurance_provider?: string | null
  insurance_number?: string | null
  last_visit?: Date | null
}

interface AddDiagnosisProps {
  patientId: string
  doctorId: string
  appointmentId: string
  medicalId: string
  patient: PatientInfo
}

// ─── Helpers ───────────────────────────────────────────

function getAge(dob: Date): number {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

function formatDate(d?: Date | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// ─── Component ─────────────────────────────────────────

export const AddDiagnosis = ({
  patientId,
  doctorId,
  appointmentId,
  medicalId,
  patient,
}: AddDiagnosisProps) => {
  const [loading, setLoading] = useState(false)
  const [toothChart, setToothChart] = useState<ToothChartData>({})
  const [open, setOpen] = useState(false)
  const router = useRouter()

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
      follow_up_plan: "",
    },
  })

  const handleOnSubmit = async (data: DiagnosisFormValues) => {
    try {
      setLoading(true)

      const payload = {
        ...data,
        notes: data.notes
          ? `${data.notes}\n\n[Tooth Chart]: ${JSON.stringify(toothChart)}`
          : Object.keys(toothChart).length
          ? `[Tooth Chart]: ${JSON.stringify(toothChart)}`
          : "",
      }

      const res = await addDiagnosis(payload, appointmentId)

      if (res.success) {
        toast.success(res.message)
        router.refresh()
        form.reset()
        setToothChart({})
        setOpen(false)
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to add Diagnosis")
    } finally {
      setLoading(false)
    }
  }

  const age = getAge(new Date(patient.date_of_birth))
  const patientCode = `P-${patient.id.slice(-4).toUpperCase()}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 hover:text-white"
        >
          <Plus size={18} />
          Add Diagnosis
        </Button>
      </DialogTrigger>

      {/* FULLSCREEN MODAL */}
      <DialogContent
        className="
          fixed inset-0
          w-screen h-screen
          max-w-none max-h-none
          translate-x-0 translate-y-0
          rounded-none
          p-0
          overflow-hidden
        "
      >
        <div className="h-full w-full overflow-y-auto p-6 bg-gray-50">

          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl font-semibold">
              Dental Diagnosis & Chart
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-6 pb-20"
            >
              {/* Patient + Visit Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Patient Info */}
                <div className="rounded-xl border bg-white p-5 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Patient
                  </h3>

                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
                      {patient.first_name[0]}{patient.last_name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-base">
                        {patient.first_name} {patient.last_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {patientCode} · {age} yrs · {patient.gender}
                      </p>
                    </div>
                  </div>

                  <div className="divide-y text-sm">
                    <InfoRow
                      icon={<CalendarDays size={13} />}
                      label="Last Visit"
                      value={formatDate(patient.last_visit)}
                    />
                    <InfoRow
                      icon={<Droplets size={13} />}
                      label="Blood Type"
                      value={patient.blood_group ?? "—"}
                    />
                    <InfoRow
                      icon={<AlertCircle size={13} />}
                      label="Allergies"
                      value={patient.allergies ?? "None"}
                    />
                    <InfoRow
                      icon={<ShieldCheck size={13} />}
                      label="Insurance"
                      value={patient.insurance_provider ?? "—"}
                    />
                  </div>
                </div>

                {/* Visit Summary */}
                <div className="rounded-xl border bg-white p-5 space-y-4">
                  <CustomInput
                    type="textarea"
                    control={form.control}
                    name="symptoms"
                    label="Chief Complaint"
                  />
                  <CustomInput
                    type="textarea"
                    control={form.control}
                    name="notes"
                    label="Clinical Notes"
                  />
                </div>
              </div>

              {/* Tooth Chart */}
              <div className="rounded-xl border bg-white p-5 space-y-3">
                <div className="flex justify-between">
                  <h3 className="text-sm font-semibold">
                    Dental Chart — FDI
                  </h3>
                  {Object.keys(toothChart).length > 0 && (
                    <Badge variant="secondary">
                      {Object.keys(toothChart).length} marked
                    </Badge>
                  )}
                </div>
                <ToothChart value={toothChart} onChange={setToothChart} />
              </div>

              {/* Diagnosis Section */}
              <div className="rounded-xl border bg-white p-5 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <CustomInput
                    type="textarea"
                    control={form.control}
                    name="diagnosis"
                    label="Diagnosis"
                  />
                  <CustomInput
                    type="textarea"
                    control={form.control}
                    name="prescribed_medications"
                    label="Prescribed Medications"
                  />
                  <CustomInput
                    type="textarea"
                    control={form.control}
                    name="follow_up_plan"
                    label="Follow-up Plan"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-8"
                >
                  {loading ? "Saving..." : "Submit Diagnosis"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Info Row
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between py-2 text-xs">
      <div className="flex items-center gap-1.5 text-gray-500">
        {icon}
        {label}
      </div>
      <span className="text-gray-700">{value}</span>
    </div>
  )
}