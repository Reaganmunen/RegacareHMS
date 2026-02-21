

import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { EllipsisVertical, User } from "lucide-react";
import Link from "next/link";
import AppointmentActionDialog from "./appointment-action-dialog";







interface ActionProps{
    userId: string;
    patientId:string;
    doctorId:string;
    appointmentId: string | number;
    status: string;
}

export const AppointmentActionOptions = async ({

    userId,
    patientId,
    doctorId,
    appointmentId,
    status
}: ActionProps)=>{
    const user = await auth()
    const isAdmin = await checkRole("Admin");


    return(

        <Popover>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                className="flex items-center justify-center rounded-full p-1"
                >
                    <EllipsisVertical size={16} className="text-sm text-gray-500"/>
                    
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-56 p-3">
                <div className="space-y-3 flex flex-col items-start">
                    <span className="text-gray-400 text-xs">Perfom Actions</span>
                    <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                    >
                        <Link href={`appointments/${appointmentId}`}>
                        <User size={16} />View Full Details
                        
                        </Link>
                    </Button>

                    {status !== "Scheduled" && (
                        <AppointmentActionDialog
                        type="approve"
                        id={appointmentId}
                        disabled={isAdmin || user.userId ===doctorId}
                        />

                    )} 

                   <AppointmentActionDialog
                    type="cancel"
                    id={appointmentId}
                    disabled={status ==="Pending" &&
                        
                        (isAdmin || user.userId === doctorId|| user.userId === patientId)}
                    />
                </div>
                
            </PopoverContent>

        </Popover>
    )
         

         
}