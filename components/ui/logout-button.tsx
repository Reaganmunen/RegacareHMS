"use client"

import { Button } from "@/components/ui/button"
import { useClerk } from "@clerk/nextjs"
import { LogOut } from "lucide-react"
import React from 'react'



const LogoutButton = () => {
    const { signOut } = useClerk()
  return (
    <Button 
    variant={"outline"}
    className="w-fit bottom-0 gap-2 px-0 md:px-4"
    onClick={() => signOut({redirectUrl: "/sign-in" })}>
        <LogOut />
        <span className="hidden lg:block">Logout</span>
    </Button>
  )
}

export default LogoutButton