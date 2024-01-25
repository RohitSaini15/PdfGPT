import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "@/db";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const {getUser} = getKindeServerSession()
      const user = getUser()

      if(!user || !user.id) throw new Error("Unauthorized")

      return {userId: user.id}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          uploadStatus: "PROCESSING",
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        }
      })
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;