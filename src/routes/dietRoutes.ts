import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { validationTokenId } from '../middlewares/validationTokenId'

export async function dietRoutes(app: FastifyInstance) {
  // User Creation

  // List User
  app.get('/user', async (request, reply) => {
    const users = await knex('user').select('*')

    if (!users) {
      return
    }

    return users
  })

  // List User ID
  // app.get('/user/:id', async () => {})

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

  // List Lunchs ID
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

  // Create a Diet Register
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
}
