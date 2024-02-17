import Fastify from 'fastify';

export async function build () {
  const fastify = Fastify({ logger: true });

  fastify.get('/', async () => {
    return { hello: 'world' }
  })

  return fastify
}