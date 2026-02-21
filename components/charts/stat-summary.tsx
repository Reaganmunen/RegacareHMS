"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Users } from "lucide-react";
import { formatNumber } from "@/utils";

export const StatSummary = ({ data, total }: { data: any; total: number }) => {
  // Safely extract values
  const pending = data?.Pending ?? 0;
  const scheduled = data?.Scheduled ?? 0;
  const completed = data?.Completed ?? 0;

  // Your 3 data entries — keep 0 for total, then 1 and 2 for appointments
  const dataInfo = [
    {
      name: "Total",
      count: total ?? pending + scheduled + completed,
      fill: "white",
    },
    {
      name: "Appointments",
      count: pending + scheduled,
      fill: "#000000",
    },
    {
      name: "Completed",
      count: completed,
      fill: "#2563eb",
    },
  ];

  // You specifically want these to dictate appointment counts
  const appointment = dataInfo[1].count;
  const consultation = dataInfo[2].count;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Summary</h1>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="font-normal text-xs"
        >
          <Link href="/record/appointments">See details</Link>
        </Button>
      </div>

      {/* Chart Section */}
      <div className="flex flex-col items-center justify-center w-full flex-1">
        <div className="relative w-full max-w-[220px] aspect-square">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="40%"
              outerRadius="100%"
              barSize={32}
              data={dataInfo}
            >
              <RadialBar background dataKey="count" />
            </RadialBarChart>
          </ResponsiveContainer>

          <Users
            size={30}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Legend Section */}
        <div className="flex flex-wrap justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded-sm" />
            <h2 className="text-sm font-medium">Appointments:</h2>
            <span className="font-bold text-sm">
              {formatNumber(appointment)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-sm" />
            <h2 className="text-sm font-medium">Completed:</h2>
            <span className="font-bold text-sm">
              {formatNumber(consultation)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
