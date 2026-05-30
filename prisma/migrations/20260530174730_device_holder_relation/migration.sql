-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_currentUserId_fkey" FOREIGN KEY ("currentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
