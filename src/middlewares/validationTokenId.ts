import { FastifyReply, FastifyRequest } from 'fastify'

export async function validationTokenId(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenId = request.cookies.tokenId

  if (!tokenId) {
    return reply.status(401).send({
      error:
        'Unauthorized acsess, log in with your account to keep using this application',
    })
  }
}
