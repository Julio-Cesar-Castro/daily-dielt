import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function NotAuthenticate(app: FastifyInstance) {
  app.get('/lunchs', async () => {
    const lunchs = await knex('lunchs').select()

    return lunchs
  })

  // List One Lunch by Id
  app.get('/lunchs/list/:id', async (request) => {
    const idParamsSchema = z.object({
      id: z.string().uuid().nonempty(),
    })

    const { id } = idParamsSchema.parse(request.params)

    const lunchs = await knex('lunchs').where('id', id).select().first()

    return lunchs
  })

  // Create a Diet Register

  app.post('/lunchs', async (request, reply) => {
    const createLunchsBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      onDietOrNot: z.boolean(),
    })

    const { name, description, onDietOrNot } = createLunchsBodySchema.parse(
      request.body,
    )

    await knex('lunchs').insert({
      id: randomUUID(),
      name,
      description,
      onDietOrNot,
    })

    return reply.status(201).send()
  })

  // Edit Lunchs

  app.put('/lunchs/:id', async (request, reply) => {
    const editLunchsBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      onDietOrNot: z.boolean().optional(),
    })

    const idLunchSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = idLunchSchema.parse(request.params)

    if (!id) {
      return reply
        .status(401)
        .send('Unauthorized Route, please log in and continue your request')
    }

    const { name, description, onDietOrNot } = editLunchsBodySchema.parse(
      request.body,
    )

    await knex('lunchs').where({ id }).update({
      name,
      description,
      onDietOrNot,
    })

    return reply.status(200).send('Success to edit your message')
  })

  // Delete Lunchs

  app.delete('/lunchs/:id/delete', async (request, reply) => {
    const idBodySchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = idBodySchema.parse(request.params)

    await knex('lunchs')
      .where({
        id,
      })
      .del('*')

    return reply.status(201).send('Your Lunch was deleted as success ✅')
  })
}
