import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { router ,publicProcedure,privateProcedure} from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '@/db';
import {z} from 'zod'

export const appRouter = router({
  // Get Request query
  authCallback: publicProcedure.query(async() => {
    const {getUser} = getKindeServerSession()
    const user = getUser()

    if(!user || !user.id || !user.email) throw new TRPCError({code:'UNAUTHORIZED'})

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    if(!dbUser){
      await db.user.create({
        data: {
          id: user.id,
          email: user.email
        }
      })
    }

    return {success: true}
  }),
  getUserFiles: privateProcedure.query(async ({ctx}) => {
    const {userId,user} = ctx
    return await db.file.findMany({
      where: {
        userId
      }
    })
  }),

  getFile: privateProcedure.input(z.object({key:z.string()})).mutation(async ({ctx,input}) => {
      const {userId} = ctx
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId
        }
      })

      if(!file) return new TRPCError({code: 'NOT_FOUND'})
      return file
  }),
  // Post request input
  deleteFile: privateProcedure.input(z.object({id: z.string()})).mutation(async ({ctx,input}) => {
      const {userId} = ctx
      const file = await db.file.findFirst({
        where: {
          id: input.id,
          userId
        }
      })

      if(!file) throw new TRPCError({code: 'NOT_FOUND'})
      await db.file.delete({
        where: {
          id: input.id
        }
      })

      return file
  })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;