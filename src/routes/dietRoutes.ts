import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { validationTokenId } from '../middlewares/validationTokenId'

export async function dietRoutes(app: FastifyInstance) {
  app.get(
    '/lunchs/:id',
    {
      preHandler: [validationTokenId],
    },
    async (request) => {
      const { tokenId } = request.cookies

      const lunchs = await knex('lunchs').where('token_id', tokenId).select()

      return lunchs
    },
  )

  app.post(
    '/lunchs',
    {
      preHandler: [validationTokenId],
    },
    async (request, reply) => {
      const createLunchsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        onDietOrNot: z.boolean(),
      })

      const { name, description, onDietOrNot } = createLunchsBodySchema.parse(
        request.body,
      )

      let tokenId = request.cookies.tokenId

      if (!tokenId) {
        tokenId = randomUUID()

        reply.cookie('tokenId', tokenId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      }

      await knex('lunchs').insert({
        id: randomUUID(),
        name,
        description,
        onDietOrNot,
        token_Id: tokenId,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/lunchs/:id',
    {
      preHandler: [validationTokenId],
    },
    async (request, reply) => {
      const editLunchsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        onDietOrNot: z.boolean(),
      })

      const { name, description, onDietOrNot } = editLunchsBodySchema.parse(
        request.body,
      )

      await knex('lunchs').update({
        where: {
          id, // find a way to rescue this id from Database, that is the error.
        },
        data: {
          name,
          description,
          onDietOrNot,
        },
      })

      return reply.status(200).send('Success to edit your message')
    },
  )
}
