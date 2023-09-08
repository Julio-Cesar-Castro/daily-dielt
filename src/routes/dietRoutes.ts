import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function dietRoutes(app: FastifyInstance) {
  app.get('/lunchs', async () => {
    const lunchs = await knex('lunchs').select()

    return lunchs
  })

  app.post('/lunchs', async (request, reply) => {
    const createLunchsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      onDietOrNot: z.boolean(),
    })

    console.log(crypto.randomUUID())

    const { name, description, onDietOrNot } = createLunchsBodySchema.parse(
      request.body,
    )

    await knex('lunchs').insert({
      id: crypto.randomUUID(),
      name,
      description,
      onDietOrNot,
    })

    return reply.status(201).send()
  })
}
