import { AvailableDoctorProps } from '@/types/data-types'
import { checkRole } from '@/utils/roles';
import Link from 'next/link';
import React from 'react'
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ProfileImage } from './ui/profile-image';
import { daysOfWeek } from '@/utils';

const getToday = () => {
  const today = new Date().getDay();
  return daysOfWeek[today];
};

const todayDay = getToday();

interface Days {
  day: string;
  start_time: string;
  close_time: string;
}

export const availableDays = ({ data }: { data: Days[] }) => {
  const isTodayWorkingDay = data?.find(
    (dayObj) => dayObj?.day?.toLowerCase() === todayDay
  );

  return isTodayWorkingDay
    ? `${isTodayWorkingDay?.start_time} - ${isTodayWorkingDay?.close_time}`
    : 'Not Available';
};

export const AvailableDoctors = async ({ data }: { data: AvailableDoctorProps }) => {
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Available Doctors</h1>

        {await checkRole("Admin") && (
          <Button
            asChild
            variant={"outline"}
            disabled={data?.length === 0}
            className="disabled:cursor-not-allowed disabled:text-gray-200"
          >
            <Link href="/record/doctors">View All</Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {data?.map((doc, id) => (
          <Card
            key={id}
            className="border-none w-full p-3 flex items-center gap-3 odd:bg-emerald-600/5 even:bg-yellow-600/5"
          >
            {/* Wrapping the image + text in a flex-row container */}
            <div className="flex items-center gap-3 w-full">
              <ProfileImage
                url={doc?.img}
                name={doc?.name}
                className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 flex-shrink-0"
                textClassName="text-sm font-semibold"
              />
              <div className="flex flex-col justify-center leading-tight">
                <h2 className="font-semibold text-sm md:text-base">{doc?.name}</h2>
                <p className="text-xs capitalize text-gray-600">
                  {doc?.specialization}
                </p>
                <p className="text-xs text-gray-500">
                  <span className="hidden lg:inline">Available: </span>
                  {availableDays({ data: doc?.working_days })}
                </p>
              </div>
            </div>
          </Card>
        ))}

        {data?.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-2">
            No available doctors today
          </div>
        )}
      </div>
    </div>
  );
};
