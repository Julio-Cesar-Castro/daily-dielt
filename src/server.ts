import fastify from 'fastify'
import { dietRoutes } from './routes/dietRoutes'
import cookie from '@fastify/cookie'

export const app = fastify()

app.register(cookie)
app.register(dietRoutes, {
  prefix: 'diet',
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running! ✅')
  })
