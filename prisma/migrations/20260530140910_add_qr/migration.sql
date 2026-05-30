/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "qrCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Device_qrCode_key" ON "Device"("qrCode");
