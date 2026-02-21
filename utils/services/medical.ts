import db from "@/lib/db";
import { format } from "date-fns";

export const getVitalSignsData = async (id: string) => {
  // Get date 7 days ago
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch data from DB
  const data = await db.vitalSigns.findMany({
    where: {
      patient_id: id,
      created_at: { gte: sevenDaysAgo },
    },
    select: {
      created_at: true,
      systolic: true,
      diastolic: true,
      heartRate: true,
    },
    orderBy: { created_at: "asc" },
  });

  // Format data for Blood Pressure chart
  const formatVitals = data.map((record) => ({
    label: format(new Date(record.created_at), "MMM d"),
    systolic: record.systolic || 0,
    diastolic: record.diastolic || 0,
  }));

  // Format data for Heart Rate chart
  const heartRateData = data.map((record) => {
    const heartRate = record.heartRate
      ? record.heartRate.split("-").map((r) => parseInt(r.trim()) || 0)
      : [0, 0];

    return {
      label: format(new Date(record.created_at), "MMM d"),
      value1: heartRate[0],
      value2: heartRate[1],
    };
  });

  const count = data.length || 1; // prevent division by zero

  // Calculate averages
  const averageSystolic = Math.round(
    formatVitals.reduce((sum, r) => sum + r.systolic, 0) / count
  );
  const averageDiastolic = Math.round(
    formatVitals.reduce((sum, r) => sum + r.diastolic, 0) / count
  );
  const averageValue1 = Math.round(
    heartRateData.reduce((sum, r) => sum + r.value1, 0) / count
  );
  const averageValue2 = Math.round(
    heartRateData.reduce((sum, r) => sum + r.value2, 0) / count
  );

  return {
    data: formatVitals, // for Blood Pressure chart
    average: `${averageSystolic}/${averageDiastolic} mg/dL`,
    heartRateData, // for Heart Rate chart
    averageHeartRate: `${averageValue1}-${averageValue2} bpm`,
  };
};