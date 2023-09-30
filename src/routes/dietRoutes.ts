import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { validationTokenId } from '../middlewares/validationTokenId'
import { validationUserId } from '../middlewares/validationUserId'

export async function dietRoutes(app: FastifyInstance) {
  // User Creation
  // List User
  app.get('/user', async () => {
    const users = await knex('user').select('*')

    if (!users) {
      return
    }

    return users
  })

  // List User ID
  app.get('/user/:userId', async (request) => {
    const userParamsSchema = z.object({
      userId: z.string().uuid().nonempty(),
    })

    const { userId } = userParamsSchema.parse(request.params)

    const users = await knex('user').where('userId', userId).select('*')

    return users
  })

  // Create User
  app.post('/user', async (request, reply) => {
    const userBodySchema = z.object({
      username: z.string(),
      password: z.string(),
    })

    const { username, password } = userBodySchema.parse(request.body)

    await knex('user').insert({
      userId: randomUUID(),
      username,
      password,
    })

    return reply.status(201).send('User Creation with Success')
  })

  // DIET CRUD
  // List User
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

  // List All User Lunch
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

  // Create a Diet Register
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

      if (!userId) {
        return reply
          .status(401)
          .send(
            'It is not possible to create a diet register without being logged',
          )
      }

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

  // Edit Lunchs

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

      const idLunchSchema = z.object({
        id: z.string().uuid(),
      })

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

  // Delete Lunchs

  app.delete(
    '/lunchs/:id/delete',
    {
      preHandler: [validationTokenId],
    },
    async (request, reply) => {
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
    },
  )

  // user metrics

  app.get('/lunchs/:userId/metrics', async (request, reply) => {
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
}
