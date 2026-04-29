import { MedicalHistoryContainer } from '@/components/medical-history-container';
import { PatientRatingContainer } from '@/components/patient-rating-container';
import { Card } from '@/components/ui/card';
import { ProfileImage } from '@/components/ui/profile-image';
import { getPatientFullDataById } from '@/utils/services/patient';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import Link from 'next/link';
import React from 'react';

interface ParamsProps {
  params: Promise<{ patientId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PatientProfile = async (props: ParamsProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;

  let id = params.patientId;
  let patientId = params.patientId;
  const cat = searchParams?.cat || 'medical-history';

  if (patientId === 'self') {
    const { userId } = await auth();
    id = userId!;
  } else id = patientId;

  const { data } = await getPatientFullDataById(id);

  console.log(id)

  const SmallCard = ({ label, value }: { label: string; value: string }) => (
    <div className="w-full md:w-1/3">
      <span className="text-sm text-gray-500">{label}</span>
      <p className="text-sm md:text-base capitalize">{value}</p>
    </div>
  );

  return (
    <div className="bg-gray-100/60 rounded-xl py-6 px-3 2xl:p-6 flex flex-col lg:flex-row gap-6">
      {/* LEFT SIDE: Main info + medical history */}
      <div className="w-full xl:w-3/4 flex flex-col">
        {/* Profile and Info Cards */}
        <div className="w-full flex flex-col lg:flex-row gap-4">
          {/* Profile Card */}
          <Card className="bg-white rounded-xl p-4 w-full max-w-62.5 border-none flex flex-col items-center text-center shadow-sm">
            <ProfileImage
              url={data?.img!}
              name={data?.first_name + ' ' + data?.last_name}
              className="h-20 w-20 md:flex"
              textClassName="text-3xl"
              colorCode={data?.colorCode!}
            />
            <h1 className="font-semibold text-2xl mt-2 whitespace-nowrap">
              {data?.first_name + ' ' + data?.last_name}
            </h1>
            <span className="text-sm text-gray-500 truncate w-full px-2">
              {data?.email}
            </span>
            <div className="w-full flex flex-col items-center mt-3">
              <p className="text-xl font-medium">{data?.totalAppointments}</p>
              <span className="text-xs text-gray-500">Appointments</span>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="bg-white rounded-xl p-6 w-full lg:w-[70%] border-none space-y-6">
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Gender" value={data?.gender?.toLowerCase()!} />
              <SmallCard label="Phone Number" value={data?.phone_number!} />
             { /*<SmallCard
                label="Date of Birth"
                value={format(data?.date_of_birth!, "yyyy-MM-dd")}
              />*/}
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard label="Marital Status" value={data?.marital_status!} />
              <SmallCard label="Blood Group" value={data?.blood_group!} />
              <SmallCard label="Address" value={data?.address!} />
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center xl:justify-between gap-y-4 md:gap-x-0">
              <SmallCard
                label="Contact Person"
                value={data?.emergency_contact_name!}
              />
              <SmallCard
                label="Emergency Contact"
                value={data?.emergency_contact_number!}
              />
              <SmallCard
                label="Emergency Relationship"
                value={data?.relation!}
              />
            </div>
          </Card>
        </div>

        {/* ✅ Medical History BELOW cards */}
        <div className="mt-10">
          {cat === 'medical-history' && <MedicalHistoryContainer patientId={id} />}
          {/* {cat === 'payments' && <Payments patientId={id} />} */}
        </div>
      </div>

      {/* RIGHT SIDE: Quick Links + Rating */}
      <div className="w-full xl:w-1/3">
        <div className="bg-white p-4 rounded-md mb-8">
          <h1 className="text-xl font-semibold">QuickLinks</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-yellow-50 hover:underline"
              href={`/record/appointments?id=${id}`}
            >
              Patient&apos;s Appointments
            </Link>

            <Link
              className="p-3 rounded-md bg-purple-50 hover:underline"
              href="?cat=medical-history"
            >
              Medical Records
            </Link>

            <Link
              className="p-3 rounded-md bg-violet-100"
              href={`?cat=payments`}
            >
              Medical Bills
            </Link>

            <Link className="p-3 rounded-md bg-pink-50" href={`/`}>
              Dashboard
            </Link>

            <Link className="p-3 rounded-md bg-rose-100" href={`#`}>
              Lab Test & Result
            </Link>

            {patientId === 'self' && (
              <Link
                className="p-3 rounded-md bg-black/10"
                href={`/patient/registration`}
              >
                Edit Information
              </Link>
            )}
          </div>
        </div>

        <PatientRatingContainer id={id!} />
      </div>
    </div>
  );
};

export default PatientProfile;
