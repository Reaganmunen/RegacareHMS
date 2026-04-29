import { AvailableDoctors } from '@/components/available-doctors';
import AppointmentChart from '@/components/charts/appointment-chart';
import { StatSummary } from '@/components/charts/stat-summary';
import { PatientRatingContainer } from '@/components/patient-rating-container';
import RecentAppointments from '@/components/tables/recent-appointments';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/ui/stat-card';
import { AvailableDoctorProps } from '@/types/data-types';
import { getPatientDashboardStatistics } from '@/utils/services/patient';
import { currentUser } from '@clerk/nextjs/server';
import { Briefcase, BriefcaseBusiness, BriefcaseMedical } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const PatientsDashboard = async () => {
  const user = await currentUser();
  const {
    data,
    appointmentCounts,
    totalAppointments,
    last5Records,
    availableDoctor,
    monthlyData,
  } = await getPatientDashboardStatistics(user?.id!);

  if (user && !data) redirect('/patient/registration');
  if (!data) return null;

  const cardData = [
    {
      title: 'appointments',
      value: totalAppointments ?? 0,
      icon: Briefcase,
      className: 'bg-blue-600/15',
      iconClassName: 'bg-blue-600/25 text-blue-600',
      note: 'Total appointments',
    },
    {
      title: 'cancelled',
      value: appointmentCounts?.Cancelled ?? 0,
      icon: Briefcase,
      className: 'bg-rose-600/15',
      iconClassName: 'bg-rose-600/25 text-rose-600',
      note: 'Cancelled Appointments',
    },
    {
      title: 'pending',
      value:
        (appointmentCounts?.Pending ?? 0) +
        (appointmentCounts?.Scheduled ?? 0),
      icon: BriefcaseBusiness,
      className: 'bg-yellow-600/15',
      iconClassName: 'bg-yellow-600/25 text-yellow-600',
      note: 'Pending Appointments',
    },
    {
      title: 'completed',
      value: appointmentCounts?.Completed ?? 0,
      icon: BriefcaseMedical,
      className: 'bg-emerald-600/15',
      iconClassName: 'bg-emerald-600/25 text-emerald-600',
      note: 'Successfully appointed',
    },
  ];

  return (
    <div className="p-4 xl:p-6 flex flex-col gap-8">
      {/* -------- TOP SECTION (StatCards + Summary + Available Doctors) -------- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Stat Cards */}
        <div className="col-span-2 bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg xl:text-2xl font-semibold">
              Welcome {data?.first_name || user?.firstName}
            </h1>
            <div className="space-x-2">
              <Button size="sm">{new Date().getFullYear()}</Button>
              <Button size="sm" variant="outline" className="hover:underline">
                <Link href="/patient/self">View Profile</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {cardData.map((el, id) => (
              <StatCard key={id} {...el} link="#" />
            ))}
          </div>
        </div>

        {/* Right: Stat Summary + Available Doctors stacked */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl p-4 flex items-center justify-center">
            <StatSummary data={appointmentCounts} total={totalAppointments} />
          </div>

          {/* Available Doctors just below Stat Summary */}
          <div className="bg-white rounded-xl p-4">
            <AvailableDoctors data={availableDoctor as AvailableDoctorProps} />
          </div>

          <div className="bg-white rounded-xl p-4">
            <PatientRatingContainer />
          </div>
        </div>
      </div>

      {/* -------- MIDDLE SECTION (Appointments Chart) -------- */}
      <div className="bg-white rounded-xl p-4 h-125">
        <AppointmentChart data={monthlyData!} />
      </div>

      {/* -------- BOTTOM SECTION (Recent Appointments) -------- */}
      <div className="bg-white rounded-xl p-4">
        <RecentAppointments data={last5Records} />
      </div>
    </div>
  );
};

export default PatientsDashboard;