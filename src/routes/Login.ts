import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function Login(app: FastifyInstance) {
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
}
