import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validationUserId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userParamsSchema = z.object({
    userId: z.string().uuid().nonempty(),
  })

  const { userId } = userParamsSchema.parse(request.params)

  if (!userId) {
    return reply.status(403).send({
      error: 'Please log in with your account to do an request',
    })
  }
}
