import fastify from 'fastify'
import { NotAuthenticate } from './routes/NotAuthenticate'
import { Authenticate } from './routes/Authenticate'
import { Login } from './routes/Login'

export const app = fastify()

app.register(Authenticate, {
  prefix: 'diet',
})

app.register(Login, {
  prefix: 'diet',
})

app.register(NotAuthenticate, {
  prefix: 'diet',
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server running! ✅')
  })
