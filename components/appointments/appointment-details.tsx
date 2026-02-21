import { format } from "date-fns";
import { SmallCard } from "../small-card";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface AppointmentDetailsProps {
    id:string  | number;
    patient_id:string;
    appointment_date:Date;
    time:string;
    note?:string;
}



export const AppointmentDetails =({id, patient_id, appointment_date, time, note}:AppointmentDetailsProps) => {
    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle>
                    Appointment Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex">

                    <SmallCard label="Appointment #" value={`#${id}`} />
                    <SmallCard label="Date" value={format(appointment_date, "MM/dd/yyyy")} />
                    <SmallCard label="Time" value={time} />

                </div>

                <div>
                    <span>
                        Additional Notes
                        <p className="text-sm text-gray-500">{note || "None"}</p>
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}