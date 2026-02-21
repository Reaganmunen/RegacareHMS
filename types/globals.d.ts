import { Role } from "@prisma/client";

export {};
//creating a type for the roles
export type Roles = Role;
declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles;
        };
    }
}