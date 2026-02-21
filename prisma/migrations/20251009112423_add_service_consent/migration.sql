/*
  Warnings:

  - The values [Male,Female] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `service_consent` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Gender_new" AS ENUM ('MALE', 'FEMALE');
ALTER TABLE "public"."Patient" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "public"."Patient" ALTER COLUMN "gender" TYPE "public"."Gender_new" USING ("gender"::text::"public"."Gender_new");
ALTER TYPE "public"."Gender" RENAME TO "Gender_old";
ALTER TYPE "public"."Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
ALTER TABLE "public"."Patient" ALTER COLUMN "gender" SET DEFAULT 'MALE';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "insurance_number" TEXT,
ADD COLUMN     "medical_conditions" TEXT,
ADD COLUMN     "medical_history" TEXT,
ADD COLUMN     "service_consent" BOOLEAN NOT NULL,
ALTER COLUMN "gender" SET DEFAULT 'MALE';
