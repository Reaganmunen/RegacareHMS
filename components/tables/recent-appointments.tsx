import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { Table } from './table'
import { Appointment } from '@/types/data-types'
import { ProfileImage } from '../ui/profile-image'
import { format } from 'date-fns'
import { AppointmentStatusIndicator } from '../appointment-status-indicator'
import { ViewAppointment } from '../view-appointments'

interface DataProps {
  data: any[];
}

const columns = [
  { header: "Info", key: "name" },
  {
    header: "Date",
    key: "appointment_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    key: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Status",
    key: "status",
    className: "hidden xl:table-cell",
  },
  {
    header: "Actions",
    key: "action",
  },
];

export const RecentAppointments = ({ data }: DataProps) => {
  const renderRow = (item: Appointment) => {
    const patientName = `${item?.patient?.first_name || ""} ${item?.patient?.last_name || ""}`;
    const doctorName = item?.doctor?.name || "";

    return (
      <tr
        key={item?.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-slate-50"
      >
        {/* Patient info */}
        <td className="flex items-center gap-2 2xl:gap-4 py-2 xl:py-4">
          <ProfileImage
            url={item?.patient?.img!}
            name={patientName}
            className="bg-violet-600"
          />
          <div>
            <h3 className="text-sm md:text-base md:font-small uppercase">
              {patientName}
            </h3>
            <span className="text-xs capitalize">
              {item?.patient?.gender?.toLowerCase()}
            </span>
          </div>
        </td>

        {/* Date */}
        <td className="hidden md:table-cell">
          {format(item?.appointment_date, "yyyy-MM-dd")}
        </td>

        {/* Time */}
        <td className="hidden md:table-cell">{item?.time}</td>

        {/* Doctor info with image */}
        <td className="hidden md:table-cell py-2">
          <div className="flex items-center gap-2">
            <ProfileImage
              url={item?.doctor?.img!}
              name={doctorName}
              className="bg-sky-600"
            />
            <div>
              <h3 className="text-sm font-medium">{doctorName}</h3>
              <span className="text-xs capitalize text-gray-500">
                {item?.doctor?.specialization}
              </span>
            </div>
          </div>
        </td>

        {/* Status */}
        <td className="hidden xl:table-cell">
          <AppointmentStatusIndicator status={item?.status} />
        </td>

        {/* Actions */}
        <td>
          <div className="flex items-center gap-x-2">
            <ViewAppointment id={item?.id} />
            <Link href={`/record/appointments/${item?.id}`} className="text-sm text-blue-600 hover:underline">
              See All
            </Link>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 2xl:p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Recent Appointments</h1>
        <Button asChild variant={"outline"}>
          <Link href="/record/appointments">View All</Link>
        </Button>
      </div>

      <Table columns={columns} renderRow={renderRow} data={data} />
    </div>
  );
};

export default RecentAppointments;
