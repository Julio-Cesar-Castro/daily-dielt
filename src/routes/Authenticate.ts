import { FastifyInstance } from 'fastify'
import { validationUserId } from '../middlewares/validationUserId'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { z } from 'zod'

export async function Authenticate(app: FastifyInstance) {
  app.post(
    '/lunchs/:userId',
    {
      preHandler: [validationUserId],
    },
    async (request, reply) => {
      const userIdParamsSchema = z.object({
        userId: z.string().uuid().nonempty(),
      })

      const { userId } = userIdParamsSchema.parse(request.params)

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
        userId,
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/lunchs/:userId',
    {
      preHandler: [validationUserId],
    },
    async (request) => {
      // const { tokenId } = request.cookies

      const userParamsSchema = z.object({
        userId: z.string().uuid().nonempty(),
      })

      const { userId } = userParamsSchema.parse(request.params)

      const lunchs = await knex('lunchs').where('userId', userId).select('*')

      return lunchs
    },
  )

  app.get('/lunchs/:userId/metrics', async (request) => {
    const userParamsSchema = z.object({
      userId: z.string().uuid().nonempty(),
    })

    const { userId } = userParamsSchema.parse(request.params)

    const userLunchs = (
      await knex('lunchs').where('userId', userId).select('*')
    ).length

    const userOnDiet = (
      await knex('lunchs')
        .where('onDietOrNot', true)
        .where('userId', userId)
        .select('*')
    ).length

    const userNotOnDiet = (
      await knex('lunchs')
        .where('onDietOrNot', false)
        .where('userId', userId)
        .select('*')
    ).length

    return {
      'User Lunchs': userLunchs,
      'On Diet': userOnDiet,
      'Off Diet': userNotOnDiet,
    }
  })

  app.put(
    '/lunchs/:userId/:id',
    {
      preHandler: [validationUserId],
    },
    async (request, reply) => {
      const editLunchsBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        onDietOrNot: z.boolean().optional(),
      })

      const idLunchSchema = z.object({
        id: z.string().uuid(),
      })

      const userIdParamsSchema = z.object({
        userId: z.string().uuid().nonempty(),
      })

      const { userId } = userIdParamsSchema.parse(request.params)

      if (!userId) {
        return reply
          .status(401)
          .send(
            'You are not logged to do this request, please log in and try again',
          )
      }

      const { id } = idLunchSchema.parse(request.params)

      const { name, description, onDietOrNot } = editLunchsBodySchema.parse(
        request.body,
      )

      await knex('lunchs').where({ id }).update({
        name,
        description,
        onDietOrNot,
      })

      return reply.status(200).send('Success to edit your message')
    },
  )

  app.delete('/lunchs/:userId/:id', async (request, reply) => {
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
